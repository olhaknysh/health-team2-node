const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');

const {
  validateCreateUser,
  validateLoginUser,
  validateGetUserInfo,
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
  validateGetUserInfo,
  asyncWrapper(dailyCaloriesPublicController),
);

router.post(
  '/:userId/calories',
  validateGetUserInfo,
  authGuard,
  asyncWrapper(dailyCaloriesPrivateController),
);

module.exports = router;
