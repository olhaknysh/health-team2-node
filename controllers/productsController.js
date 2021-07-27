const { statusCode } = require('../helpers/constants');

const { getProductsByQuery } = require('../services/productsService');

const { addUserProduct } = require('../services/userProductsService');

const getProductsByQueryContorller = async (req, res) => {
  const { query } = req;
  const products = await getProductsByQuery(query);

  res.status(statusCode.OK).json({ ...products });
};

const addUserProductController = async (req, res) => {
  const userId = req.user._id;
  const { body } = req;
  const result = await addUserProduct(userId, body);
  res.json({
    result,
  });
};
module.exports = { getProductsByQueryContorller, addUserProductController };
