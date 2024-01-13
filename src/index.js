const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const AppError = require('./utils/appError.util');
const errorHandler = require('./utils/errorHandler.util');

const app = express();

/* MIDDLEWARE */

app.use(helmet()); // Set security HTTP headers
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Development logging
}

app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body

/* ROUTES */
app.use('/api/v1/users', require('./users'));
app.use('/api/v1/auth', require('./auth'));
app.use('/api/v1/characters', require('./characters'));
app.use('/api/v1/regions', require('./regions'));
app.use('/api/v1/zones', require('./zones'));
app.use('/api/v1/stages', require('./stages'));
app.use('/api/v1/badges', require('./badges'));
app.use('/api/v1/quests', require('./quests'));
app.use('/api/v1/codelab', require('./codelab'));
app.use('/api/v1/events', require('./events'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
