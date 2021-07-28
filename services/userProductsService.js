const { UserProduct } = require('../model/userProductsModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');
const { getProductByTitle } = require('../services/productsService');

const calcUserProductCalories = async (weight, title) => {
  const product = await getProductByTitle(title);
  const productCalories = (product.calories / 100) * weight;
  return productCalories;
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
  const result = await UserProduct.findOneAndUpdate(
    { date, userId },
    {
      totalCalories,
      $addToSet: { products: [{ title, weight }] },
    },
    { new: true, upsert: true },
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

const removeUserProductById = async (userId, productId) => {
  let { title, weight, totalCalories } = await getUserProductByProductId(
    userId,
    productId,
  );

  const productCalories = await calcUserProductCalories(weight, title);

  totalCalories -= productCalories;

  const result = await UserProduct.findOneAndUpdate(
    {
      products: { $elemMatch: { _id: productId } },
      userId,
    },
    {
      totalCalories,
      $pull: { products: { _id: productId } },
    },
    { new: true },
  );
  if (!result) {
    throw new CustomError(statusCode.NOT_FOUND, 'Not found');
  }
  return result;
};

module.exports = {
  addUserProduct,
  removeUserProductById,
};
