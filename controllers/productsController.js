const { statusCode } = require('../helpers/constants');
const { getProductsByQuery } = require('../services/productsService');

const {
  addUserProduct,
  removeUserProductById,
  getUserProductsDailyInfo,
} = require('../services/userProductsService');

const getProductsByQueryContorller = async (req, res) => {
  const { query } = req;
  const products = await getProductsByQuery(query);

  res.status(statusCode.OK).json(products);
};

const addUserProductController = async (req, res) => {
  const userId = req.user._id;
  const { body } = req;
  const result = await addUserProduct(userId, body);
  res.status(statusCode.CREATED).json(result);
};

const removeUserProductController = async (req, res) => {

    const userId = req.user._id;
    const { productId } = req.params;
    const result = await removeUserProductById(userId, productId);
    const { dailyNormalProcent, leftCalories, totalCalories } = result;
    res
        .status(statusCode.OK)
        .json({ dailyNormalProcent, leftCalories, totalCalories });
};

const getUserProductsDailyInfoController = async (req, res) => {
  const userId = req.user._id;
  const { date } = req.params;
  const result = await getUserProductsDailyInfo(userId, date);
  res.status(statusCode.OK).json(result);
};

module.exports = {
  getProductsByQueryContorller,
  addUserProductController,
  removeUserProductController,
  getUserProductsDailyInfoController,
};
