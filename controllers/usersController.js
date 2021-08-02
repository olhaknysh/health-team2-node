const { statusCode } = require('../helpers/constants');

const { signup, loginUser } = require('../services/authService');

const { updateToken, addUserInfo } = require('../services/usersService');

const {
  calcDailyCalories,
  getNotAllowedCategoriesProducts,
} = require('../helpers/userHelper');

const signupUserController = async (req, res) => {
  const createdUser = await signup(req.body);
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
      id: loggedInUser._id,
      name: loggedInUser.name,
      login: loggedInUser.login,
      userInfo: loggedInUser.userInfo,
      dailyCalories: loggedInUser.dailyCalories,
      notAllowedProducts: loggedInUser.notAllowedProducts,
    },
  });
};

const logoutUserController = async (req, res) => {
  const id = req.user._id;
  await updateToken(id, null);
  res.status(statusCode.NO_CONTENT).json({});
};

const dailyCaloriesPublicController = async (req, res) => {
  const { age, height, currentWeight, desireWeight, groupBlood } = req.body;
  const dailyCalories = calcDailyCalories(
    age,
    height,
    currentWeight,
    desireWeight,
  );
  const notAllowedCategoriesProducts = await getNotAllowedCategoriesProducts(
    groupBlood,
  );
  res.status(statusCode.OK).json({
    dailyCalories,
    notAllowedProducts: notAllowedCategoriesProducts,
  });
};

const getCurrentUserController = async (req, res) => {
  const currentUser = req.user;
  res.status(statusCode.OK).json({
    id: currentUser._id,
    name: currentUser.name,
    login: currentUser.login,
    userInfo: currentUser.userInfo,
    dailyCalories: currentUser.dailyCalories,
    notAllowedProducts: currentUser.notAllowedProducts,
  });
};

const dailyCaloriesPrivateController = async (req, res) => {
  const userId = req.user._id;
  const updatedUser = await addUserInfo(userId, req.body);
  res.status(statusCode.OK).json({
    userName: updatedUser.name,
    userInfo: updatedUser.userInfo,
    dailyCalories: updatedUser.dailyCalories,
    notAllowedProducts: updatedUser.notAllowedProducts,
  });
};

module.exports = {
  signupUserController,
  loginUserController,
  logoutUserController,
  dailyCaloriesPublicController,
  dailyCaloriesPrivateController,
  getCurrentUserController,
};
