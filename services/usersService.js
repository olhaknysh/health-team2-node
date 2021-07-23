/* eslint-disable no-useless-catch */
const { User } = require('../model/userModel');

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

const updateToken = async (userId, token) =>
  await User.findByIdAndUpdate(userId, { token }, { new: true });

module.exports = {
  getUserById,
  getUserByLogin,
  createUser,
  updateToken,
};
