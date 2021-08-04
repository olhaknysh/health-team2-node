/* eslint-disable no-useless-catch */
const { User } = require('../model/userModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const {
  getNotAllowedCategoriesProducts,
  calcDailyCalories,
} = require('../helpers/userHelper');

const getUserById = async userId => {
  return await User.findOne({ _id: userId });
};

const getUserByLogin = async login => {
  return await User.findOne({ login });
};

const createUser = async (
  name,
  login,
  password,
  userInfo,
  dailyCalories,
  notAllowedProducts,
) => {
  const user = new User({
    name,
    login,
    password,
    userInfo,
    dailyCalories,
    notAllowedProducts,
  });
  await user.save();
  return user;
};

const addUserInfo = async (userId, body) => {
  const { age, height, currentWeight, desireWeight, groupBlood } = body;
  const dailyCalories = calcDailyCalories(
    age,
    height,
    currentWeight,
    desireWeight,
  );
  const notAllowedProducts = await getNotAllowedCategoriesProducts(groupBlood);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { userInfo: { ...body }, dailyCalories, notAllowedProducts },
    { new: true },
  );
  return updatedUser;
};

const updateToken = async (userId, token) =>
  await User.findByIdAndUpdate(userId, { token }, { new: true });

const getDailyCalories = async userId => {
  const { dailyCalories } = await User.findById(
    { _id: userId },
    { dailyCalories: 1, _id: 0 },
  );
  if (!dailyCalories) {
    throw new CustomError(statusCode.FORBIDDEN, 'Please, count your daily rate first');
  }
  return dailyCalories;
};

module.exports = {
  getUserById,
  getUserByLogin,
  createUser,
  updateToken,
  addUserInfo,
  getDailyCalories,
};
