const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/user");
const { Password } = require("../models/password");
const { WebToken } = require("../models/webtoken");
const errorHandler = require("../middleware/handleError.js");
const ms = require("ms");

const {
  encodePassword,
  validatePassword,
  generateConfirmCode,
} = require("../utils/auth-utils.js");

const { UserStatus, UserRoles } = require("../utils/constants.js");

const { getTimeZoneDate } = require("../utils/date-utils");

const me = errorHandler(async (req, res, next) => {
  // console.log("req: ", req.get("Authorization"));
  try {
    const authToken = req.get("Authorization");
    const accessToken = authToken?.split("Bearer ")[1];
    if (!accessToken) {
      return next(createError(418, error));
    }
  } catch (error) {
    return next(createError("error in me"));
  }
});

const signUp = errorHandler(async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    console.log("user.js signUp ERROR: ", error);
    next(createError(401, "Invalid Data"));
  }

  const emailExists = await User.findOne({ email: req.body.email });
  const userNameExists = await User.findOne({ username: req.body.username });
  if (emailExists || userNameExists) {
    return next(
      createError(422, "an account with those identifiers already exists.")
    );
  }

  // const encoded = await encodePassword(req.body.password);
  const confirmCode = await generateConfirmCode(6);
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    roles: [UserRoles.USER],
    confirmCode: confirmCode,
    status: UserStatus.INITIAL,
  });

  const response = await user.save();
  req.data = response;
  req.meta = {};
  return next();
});

const createPassword = errorHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    next(createError(404, "User not found"));
  }

  let password = new Password({
    userId: user._id,
    password: req.body.password,
  });

  try {
    password.save();
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }

  req.data = [user];
  req.meta = {};
  return next();
});

const login = errorHandler(async (req, res, next) => {
  console.log("login data: ", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return next(createError(422, "Missing information."));
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    return next(createError(401, "Invalid username or password"));
  }

  // password is now stored in separate table
  const hash = await Password.findOne({ userId: user._id });
  console.log("hash: ", hash);
  const passwordsMatch = await validatePassword(password, hash.password);
  if (!passwordsMatch) {
    return next(createError(401, "Invalid username or password"));
  }

  req.data = [
    {
      _id: user._id,
      email: user.email,
      roles: user.roles,
      status: user.status,
      username: user.username,
    },
  ];
  return next();
});

const logout = errorHandler(async (req, res, next) => {
  try {
    const data = req.data;
    const meta = {
      success: true,
      token: "",
      expiresAt: "",
      timetolive: "",
      isAuthenticated: false,
    };
    req.data = [data];
    req.meta = meta;
    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

const confirm = errorHandler(async (req, res, next) => {
  // console.log(
  //   `confirm.request: ${req.body.username} | ${req.body.confirmationCode}`
  // );
  const { username, confirmationCode } = req.body;

  const user = await User.findOneAndUpdate(
    { username: username, confirmCode: confirmationCode },
    { status: UserStatus.CONFIRMED, confirmCode: "" }
  ).select(["-name", "-confirmCode"]);

  if (!user) {
    return next(createError(401, "Invalid credentials."));
  }
  req.data = [user];
  return next();
});

const findUser = errorHandler(async (req, res, next) => {
  console.log("user.js params: ", req.params);
  const { id } = req.params;
  // console.log("user.js username: ", id);
  const user = await User.findOne({ username: id });
  // console.log("user.js user: ", user);
  req.data = [user];
  req.meta = { total: +(user !== null), success: true };
  // console.log("user.js meta: ", req.meta);
  return next();
});

const getById = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  // console.log("user.js user: ", user);
  req.data = [user];
  req.meta = { total: +(user !== null), success: true };
  // console.log("user.js meta: ", req.meta);
  return next();
});

const resetPassword = errorHandler(async (req, res, next) => {});

module.exports = {
  me,
  signUp,
  login,
  logout,
  confirm,
  createPassword,
  resetPassword,
  findUser,
  getById,
};
