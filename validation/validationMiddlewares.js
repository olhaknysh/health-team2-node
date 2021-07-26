const Joi = require('joi');
const { statusCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/errors');

const schemaCreateUser = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  login: Joi.string().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
  dailyCalories: Joi.number().positive().required(),
  notAllowedProducts: Joi.array().items(Joi.string()).required(),
});

const schemaLoginUser = Joi.object({
  login: Joi.string().min(3).max(30).required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
});

const schemaGetUserInfo = Joi.object({
  age: Joi.number().positive().integer().max(99).required(),
  height: Joi.number().positive().integer().required(),
  currentWeight: Joi.number().positive().integer().required(),
  desireWeight: Joi.number().positive().integer().required(),
  groupBlood: Joi.number().min(1).max(4).integer().positive().required(),
});

const schemaQueryProduct = Joi.object({
  search: Joi.string().required(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  page: Joi.number().min(0).integer().optional(),
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

const validateGetUserInfo = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new CustomError(statusCode.BAD_REQUEST, ' missing fields'));
  }
  return validate(schemaGetUserInfo, req.body, next);
};

const validateQueryProduct = (req, res, next) => {
  return validate(schemaQueryProduct, req.query, next);
};

module.exports = {
  validateCreateUser,
  validateLoginUser,
  validateGetUserInfo,
  validateQueryProduct,
};
