const { statusCode } = require('../helpers/constants');

const { getProductsByQuery } = require('../services/productsService');

const getProductsByQueryContorller = async (req, res) => {
  const { query } = req;
  const products = await getProductsByQuery(query);

  res.status(statusCode.OK).json({ ...products });
};

module.exports = { getProductsByQueryContorller };
