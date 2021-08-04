const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const { errorHandler } = require('./helpers/apiHelpers');
const { statusCode } = require('./helpers/constants');
const { CustomError } = require('./helpers/errors');
const { apiLimit, jsonLimit } = require('./config/rate-limit.json');

const userRouter = require('./routes/usersRouter');
const productRouter = require('./routes/productsRouter');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: apiLimit.windowMs,
  max: apiLimit.max,
  handler: (req, res, next) => {
    next(
      new CustomError(
        statusCode.TOO_MANY_REQUESTS,
        'Too many requests, please try again later.',
      ),
    );
  },
});

app.use(logger(formatsLogger));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: jsonLimit }));

app.use(limiter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.status(statusCode.NOT_FOUND).json({
    message: 'Not found',
  });
});

app.use(errorHandler);

module.exports = app;
