const { Product } = require('../model/productModel');
const { UserProduct } = require('../model/userProductsModel');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

let totalCalories = 0;

const addUserProduct = async (userId, body) => {
  const { title, date, weight } = body;
  const ProductsWithSameTitle = await Product.findOne({ 'title.ru': title });

  totalCalories += ProductsWithSameTitle.calories;
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

const removeUserProductById = async (userId, productId, title) => {
  const ProductsWithSameTitle = await Product.findOne({ 'title.ru': title });
  let { totalCalories } = await UserProduct.findOne(
    { products: { $elemMatch: { title } } },
    { totalCalories: 1, _id: 0 },
  );

  totalCalories -= ProductsWithSameTitle.calories;
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
