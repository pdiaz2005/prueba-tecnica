'use strict';

const express = require('express');
const tareasRouter = require('./routes/tareas');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/tareas', tareasRouter);

// Centralized error handler must be registered last (4-argument middleware).
app.use(errorHandler);

module.exports = app;
