const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');
const { asyncWrapper } = require('../helpers/apiHelpers');

const {
  validateQueryProduct,
  validateCreateUserProduct,
  validateObjectId,
} = require('../validation/validationMiddlewares');

const {
  getProductsByQueryContorller,
  addUserProductController,
  removeUserProductController,
} = require('../controllers/productsController');
router.get(
  '/',
  authGuard,
  validateQueryProduct,
  asyncWrapper(getProductsByQueryContorller),
);
router.post(
  '/',
  authGuard,
  validateCreateUserProduct,
  asyncWrapper(addUserProductController),
);

router.delete(
  '/:productId',
  authGuard,
  validateObjectId,
  asyncWrapper(removeUserProductController),
);

module.exports = router;
