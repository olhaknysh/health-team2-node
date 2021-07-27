const { Product } = require('../model/productModel');
const { UserProduct } = require('../model/userProductsModel');

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
  return result;
};

module.exports = {
  addUserProduct,
};
