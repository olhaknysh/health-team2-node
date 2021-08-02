const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');

const {
  validateCreateUser,
  validateLoginUser,
  validateGetUserInfo,
} = require('../validation/validationMiddlewares');

const { createAccountLimiter } = require('../helpers/rateLimitHelpers');

const { asyncWrapper } = require('../helpers/apiHelpers');

const {
  signupUserController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  dailyCaloriesPublicController,
  dailyCaloriesPrivateController,
} = require('../controllers/usersController');

router.get('/current', authGuard, asyncWrapper(getCurrentUserController));

router.post(
  '/signup',
  validateCreateUser,
  createAccountLimiter,
  asyncWrapper(signupUserController),
);
router.post('/login', validateLoginUser, asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));

router.post(
  '/calories',
  validateGetUserInfo,
  asyncWrapper(dailyCaloriesPublicController),
);

router.post(
  '/:userId/calories',
  validateGetUserInfo,
  authGuard,
  asyncWrapper(dailyCaloriesPrivateController),
);

router.patch(
  '/:userId/calories',
  validateGetUserInfo,
  authGuard,
  asyncWrapper(dailyCaloriesPrivateController),
);

module.exports = router;
