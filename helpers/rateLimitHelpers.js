const rateLimit = require('express-rate-limit');
const { statusCode } = require('./constants');
const { CustomError } = require('./errors');

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 2, // start blocking after 5 requests
  handler: (req, res, next) => {
    next(
      new CustomError(
        statusCode.TOO_MANY_REQUESTS,
        'Too many accounts created from this IP, please try again after an hour',
      ),
    );
  },
});

module.exports = { createAccountLimiter };
