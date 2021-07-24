const { statusCode } = require('../helpers/constants');

const { signup, loginUser } = require('../services/authService');

const { updateToken } = require('../services/usersService');

const signupUserController = async (req, res) => {
  const { name, login, password } = req.body;
  const createdUser = await signup(name, login, password);
  res.status(statusCode.CREATED).json({
    user: {
      name: createdUser.name,
      login: createdUser.login,
    },
  });
};

const loginUserController = async (req, res) => {
  const { login, password } = req.body;
  const loggedInUser = await loginUser(login, password);
  res.status(statusCode.OK).json({
    token: loggedInUser.token,
    user: {
      name: loggedInUser.name,
      login: loggedInUser.login,
    },
  });
};

const logoutUserController = async (req, res) => {
  const id = req.user._id;
  await updateToken(id, null);
  res.status(statusCode.NO_CONTENT).json({});
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
};
