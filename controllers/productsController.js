const { statusCode } = require('../helpers/constants');
const { getProductsByQuery } = require('../services/productsService');

const {
  addUserProduct,
  removeUserProductById,
} = require('../services/userProductsService');

const getProductsByQueryContorller = async (req, res) => {
  const { query } = req;
  const products = await getProductsByQuery(query);

  res.status(statusCode.OK).json({ ...products });
};

const addUserProductController = async (req, res) => {
  const userId = req.user._id;
  const { body } = req;
  const result = await addUserProduct(userId, body);
  res.status(statusCode.CREATED).json({
    result,
  });
};

const removeUserProductController = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { title } = req.body;
  const result = await removeUserProductById(userId, productId, title);
  res.status(statusCode.OK).json({
    message: 'product deleted',
    totalCalories: result.totalCalories,
  });
};

module.exports = {
  getProductsByQueryContorller,
  addUserProductController,
  removeUserProductController,
};
