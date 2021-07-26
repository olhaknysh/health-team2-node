const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
const { errorHandler } = require('./helpers/apiHelpers');
const { statusCode } = require('./helpers/constants');
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const userRouter = require('./routes/usersRouter');
const productRouter = require('./routes/productsRouter');

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.use((req, res, next) => {
  res.status(statusCode.NOT_FOUND).json({
    message: 'Not found',
  });
});

app.use(errorHandler);

module.exports = app;
