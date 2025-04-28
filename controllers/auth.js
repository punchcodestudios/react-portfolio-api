const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const ms = require("ms");
const { User } = require("../models/user");
const errorHandler = require("../middleware/handleError.js");
const { WebToken } = require("../models/webtoken");

const {
  generateJWT,
  getAccessTokenTTL,
  getRefreshTokenTTL,
} = require("../utils/auth-utils");
const { getTimeZoneDate } = require("../utils/date-utils");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV } = process.env;

const dev = NODE_ENV === "development";

const generateAuthTokens = errorHandler(async (req, res, next) => {
  // console.log("Meta: ", req.meta);
  try {
    const user = req.data[0];
    // console.log("generateAuthTokens: User :: ", user);
    if (!user) {
      return next(
        createError(404, "Can not generate auth token: User not found")
      );
    }

    const refreshToken = generateJWT(
      user._id,
      REFRESH_TOKEN_SECRET,
      getRefreshTokenTTL()
    );

    const accessToken = generateJWT(
      user._id,
      ACCESS_TOKEN_SECRET,
      getAccessTokenTTL()
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !dev,
      signed: true,
      expires: getTimeZoneDate(new Date(Date.now() + getRefreshTokenTTL())),
    });

    await persistRefreshToken(refreshToken);

    const meta = {
      success: true,
      token: accessToken,
      expiresAt: getTimeZoneDate(new Date(Date.now() + getAccessTokenTTL())),
      timetolive: getAccessTokenTTL(),
      isAuthenticated: true,
    };

    req.data = [user];
    req.meta = meta;
    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

const isAuthenticated = errorHandler(async (req, res, next) => {
  try {
    const authToken = req.get("Authorization");
    const accessToken = authToken?.split("Bearer ")[1];
    // console.log("auth: ", accessToken);
    if (!accessToken) {
      return next(createError(401, `Invalid or no access token: ${authToken}`));
    }

    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
      return next(createError(401, `Invalid or no refresh token`));
    }

    // let refreshTokenInDB = tokens.find(
    //   (token) => token.refreshToken === refreshToken
    // );
    // if (!refreshTokenInDB) {
    //   const error = createError.Unauthorized();
    //   throw error;
    // }

    // refreshTokenInDB = refreshTokenInDB.refreshToken;

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (err) {
      return next(createError(401, `Decoded token failed validation`));
    }

    const { userId } = decodedToken;
    const user = User.find({ _id: userId });
    if (!user) {
      return next(createError(401, `Invalid user`));
    }

    // req.userId == user.id;
    return next();
  } catch (error) {
    return next(error);
  }
});

const clearUserTokens = errorHandler(async (req, res, next) => {
  try {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (refreshToken) {
      await WebToken.findOneAndDelete({ token: refreshToken });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: !dev,
      signed: true,
    });

    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

const refreshAccessToken = errorHandler(async (req, res, next) => {
  // console.log("auth refresh", req.signedCookies);
  const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } =
    process.env;
  const { signedCookies } = req;
  const { refreshToken } = signedCookies ?? null;

  if (!refreshToken) {
    return next(createError(401, "No refresh token found."));
  }

  try {
    // console.log("refreshAccessToken: refresh token :: ", refreshToken);
    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const { userId } = decodedToken;
    // console.log("decoded token: ", decodedToken);
    // console.log("refreshAccessToken: decoded token ::", decodedToken);
    // if (!refreshTokenInDB) {
    //   await clearTokens(req, res, next);
    //   const error = createError.Unauthorized();
    //   throw error;
    // }

    const user = await User.findById(userId).select([
      "-password",
      "-confirmCode",
      "-name",
    ]);
    // console.log("user from db: ", user);

    const accessToken = generateJWT(
      userId,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFE
    );

    const userAuth = {
      isAuthenticated: true,
      token: accessToken,
      expiresAt: getTimeZoneDate(new Date(Date.now() + ms(ACCESS_TOKEN_LIFE))),
      timetolive: getAccessTokenTTL(),
      total: 1,
      success: true,
    };

    req.data = [user];
    req.meta = userAuth;
    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

module.exports = {
  generateAuthTokens,
  isAuthenticated,
  refreshAccessToken,
  clearUserTokens,
};

const persistRefreshToken = async (token) => {
  const { userId, expiresAt } = jwt.verify(token, REFRESH_TOKEN_SECRET);
  // console.log("UserID in persist: ", userId);
  const persist = new WebToken({
    name: "refresh",
    userId: userId,
    token: token,
    expiresAt: expiresAt,
  });
  // console.log("persist: ", persist);
  await WebToken.findOneAndDelete({ userId: userId });
  return await persist.save();
};
