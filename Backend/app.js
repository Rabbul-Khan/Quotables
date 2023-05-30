//The file takes different middleware into use, and one of these is the notesRouter that is attached to the /api/users route.

const config = require('./utils/config');

// Import express as a function to create express application stored in app variable
const express = require('express');
const app = express();

const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// StrictQuery controls how Mongoose handles keys that are not in the schema. Setting it to false means Mongoose will allow Model.find({ foo: 'bar' }) even if foo is not in the schema
mongoose.set('strictQuery', false);

logger.info('Connecting to ', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('There was an error connecting to MongoDB', error.message);
  });

// For the POST request, the data to be posted is sent in the body of the request in JSON format. If we do not use the parser, the body property would remain undefined. The parser takes the JSON data of a request, transforms it into a JS object and then assigns it to the request object as a new property body before the route handler is called.
app.use(express.json());
app.use(middleware.requestLogger);

// The Router middleware defines related routes in a single place. The route here is '/api/users'. Whenever route matching 'api/users' will be called, it will be handled in the users.js of controllers file.
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
