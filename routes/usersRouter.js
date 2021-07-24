const express = require('express');
const router = express.Router();

const { authGuard } = require('../middlewares/authMiddleware');

const {
  validateCreateUser,
  validateLoginUser,
} = require('../validation/validationMiddlewares');

const { asyncWrapper } = require('../helpers/apiHelpers');

const {
  signupUserController,
  loginUserController,
  logoutUserController,
} = require('../controllers/usersController');

router.post('/signup', validateCreateUser, asyncWrapper(signupUserController));
router.post('/login', validateLoginUser, asyncWrapper(loginUserController));
router.post('/logout', authGuard, asyncWrapper(logoutUserController));

module.exports = router;
