const { Product } = require('../model/productModel');

const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

module.exports = {
  getAllProducts,
};
