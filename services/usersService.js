/* eslint-disable no-useless-catch */
const { User } = require('../model/userModel');
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

const createUser = async (name, login, password) => {
  const user = new User({ name, login, password });
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
    {
      userInfo: { ...body },
      dailyCalories,
      notAllowedProducts,
    },
    { new: true },
  );
  return updatedUser;
};

const updateToken = async (userId, token) =>
  await User.findByIdAndUpdate(userId, { token }, { new: true });

module.exports = {
  getUserById,
  getUserByLogin,
  createUser,
  updateToken,
  addUserInfo,
};
