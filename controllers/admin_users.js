const createError = require("http-errors");
// const { users } = require("../data/data");

const getUserList = async (req, res, next) => {
  const usersListWithoutPassword = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword };
  });
  return res.status(200).json({
    data: usersListWithoutPassword,
  });
};

const getAuthenticatedUser = async (req, res, next) => {
  try {
    const userId = req;
    const authenticatedUser = users.find((user) => user.id == userId);
    if (authenticatedUser) {
      return res.status(200).json({
        data: authenticatedUser,
      });
    }

    const error = createError.NotFound();
    throw error;
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = users.find((user) => user.id == id);

    if (user) {
      return res.status(200).json({
        data: user,
      });
    }

    const error = createError.NotFound();
    throw error;
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserList,
  getAuthenticatedUser,
  getUserById,
};
