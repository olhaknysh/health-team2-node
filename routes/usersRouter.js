const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');

const {
  validateCreateUser,
  validateLoginUser,
  validateGetDailyCaloriesParams,
} = require('../validation/validationMiddlewares');

const { asyncWrapper } = require('../helpers/apiHelpers');

const {
  signupUserController,
  loginUserController,
  logoutUserController,
  dailyCaloriesPublicController,
  dailyCaloriesPrivateController,
} = require('../controllers/usersController');

router.post('/signup', validateCreateUser, asyncWrapper(signupUserController));
router.post('/login', validateLoginUser, asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));

router.post(
  '/calories',
  validateGetDailyCaloriesParams,
  asyncWrapper(dailyCaloriesPublicController),
);

router.post(
  '/:userId/calories',
  validateGetDailyCaloriesParams,
  authGuard,
  asyncWrapper(dailyCaloriesPrivateController),
);

module.exports = router;
