const { UserProduct } = require('../model/userProductsModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');
const { getProductByTitle } = require('../services/productsService');
const { getDailyCalories } = require('../services/usersService');

const calcUserProductCalories = async (weight, title) => {
  const product = await getProductByTitle(title);
  const productCalories = Math.round((product.calories / 100) * weight);
  return productCalories;
};

const calcDailyRateParameters = async (userId, totalCalories) => {
  const dailyCalories = await getDailyCalories(userId);
  const leftCalories = Math.round(dailyCalories - totalCalories);
  const dailyNormalProcent = Math.round((totalCalories / dailyCalories) * 100);
  return { leftCalories, dailyNormalProcent };
};

const getUserProductByProductId = async (userId, productId) => {
  const [
    {
      products: [{ title, weight }],
      totalCalories,
    },
  ] = await UserProduct.find(
    {
      products: { $elemMatch: { _id: productId } },
      userId,
    },
    {
      products: { $elemMatch: { _id: productId } },
      _id: 0,
      totalCalories: 1,
    },
  );
  return { title, weight, totalCalories };
};

const getUserProductByDate = async (userId, date) => {
  const userProduct = await UserProduct.findOne({ date, userId });
  return userProduct;
};

const addUserProduct = async (userId, body) => {
  const { title, date, weight } = body;
  const userProduct = await getUserProductByDate(userId, date);
  let totalCalories = userProduct ? userProduct.totalCalories : 0;
  const productCalories = await calcUserProductCalories(weight, title);
  totalCalories += productCalories;
  const { leftCalories, dailyNormalProcent } = await calcDailyRateParameters(
    userId,
    totalCalories,
  );
  const result = await UserProduct.findOneAndUpdate(
    { date, userId },
    {
      totalCalories,
      leftCalories,
      dailyNormalProcent,
      $addToSet: { products: [{ title, weight, calories: productCalories }] },
    },
    { new: true, upsert: true },
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  const { products } = result;
  const product = products.find(({ title }) => title === body.title);
  return {
    product,
    totalCalories,
    leftCalories,
    dailyNormalProcent,
  };
};

const removeUserProductById = async (userId, productId) => {
  let { title, weight, totalCalories } = await getUserProductByProductId(
    userId,
    productId,
  );
  const productCalories = await calcUserProductCalories(weight, title);
  totalCalories -= productCalories;
  const { leftCalories, dailyNormalProcent } = await calcDailyRateParameters(
    userId,
    totalCalories,
  );

  const result = await UserProduct.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: productId } },
      userId,
    },
    {
      totalCalories,
      leftCalories,
      dailyNormalProcent,
      $pull: { products: { _id: productId } },
    },
    { new: true },
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const getUserProductsDailyInfo = async (userId, date) => {
  const result = await await UserProduct.findOne({ date, userId }).populate({
    path: 'userId',
    select: ' name dailyCalories notAllowedProducts -_id',
  });
  if (!result) {
    throw new CustomError(
      statusCode.BAD_REQUEST,
      'No allowed information for this date',
    );
  }
  return result;
};

module.exports = {
  addUserProduct,
  removeUserProductById,
  getUserProductsDailyInfo,
};
