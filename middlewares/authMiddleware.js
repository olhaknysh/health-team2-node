const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');
const { getUserById } = require('../services/usersService');

const authGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(
        new CustomError(statusCode.UNAUTHORIZED, 'Please, provide a token'),
      );
    }
    const user = jwt.decode(token, SECRET_KEY);
    const userInDb = await getUserById(user.id);
    if (!userInDb || userInDb.token !== token) {
      return next(
        new CustomError(
          statusCode.UNAUTHORIZED,
          'No user with such token found',
        ),
      );
    }
    req.user = userInDb;
    next();
  } catch (error) {
    next(new CustomError(statusCode.UNAUTHORIZED, 'Invalid token'));
  }
};

module.exports = { authGuard };
