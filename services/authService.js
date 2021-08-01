/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const { getUserByLogin, createUser, updateToken } = require('./usersService');

const signup = async body => {
  const { name, login, password, userInfo, dailyCalories, notAllowedProducts } =
    body;
  const user = await getUserByLogin(login);
  if (user) {
    throw new CustomError(statusCode.CONFLICT, 'Login in use');
  }
  const newUser = await createUser(
    name,
    login,
    password,
    userInfo,
    dailyCalories,
    notAllowedProducts,
  );
  return newUser;
};

const loginUser = async (login, password) => {
  const user = await getUserByLogin(login);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword) {
    throw new CustomError(
      statusCode.UNAUTHORIZED,
      'Login or password is wrong',
    );
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
  const result = await updateToken(user._id, token);
  return result;
};

module.exports = {
  signup,
  loginUser,
};
