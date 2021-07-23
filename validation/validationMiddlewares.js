const Joi = require('joi');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const schemaCreateUser = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  login: Joi.string().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
});

const schemaLoginUser = Joi.object({
  login: Joi.string().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);
  if (error) {
    const [
      {
        message,
        type,
        context: { key },
      },
    ] = error.details;
    const errorMessage =
      type === 'any.required'
        ? `missing required ${key} field`
        : `${message.replace(/"/g, '')}`;
    return next(new CustomError(statusCode.BAD_REQUEST, `${errorMessage}`));
  }
  next();
};

const validateCreateUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new CustomError(statusCode.BAD_REQUEST, ' missing fields'));
  }
  return validate(schemaCreateUser, req.body, next);
};

const validateLoginUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new CustomError(statusCode.BAD_REQUEST, ' missing fields'));
  }
  return validate(schemaLoginUser, req.body, next);
};

module.exports = {
  validateCreateUser,
  validateLoginUser,
};
