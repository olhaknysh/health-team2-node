const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');
const { asyncWrapper } = require('../helpers/apiHelpers');

const { validateQueryProduct } = require('../validation/validationMiddlewares');

const {
  getProductsByQueryContorller,
} = require('../controllers/productsController');
router.get(
  '/',
  authGuard,
  validateQueryProduct,
  asyncWrapper(getProductsByQueryContorller),
);

module.exports = router;
