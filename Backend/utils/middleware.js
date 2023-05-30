const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

//** how to use morgan **//
// const morgan = require('morgan');
// morgan.token('body', function (req, res) {
//   return JSON.stringify(req.body);
// });
// app.use(
//   morgan(':method :url :status :res[content-length] - :response-time ms :body')
// );

// This is a middleware for the handling of unknown endpoints. Responds to all requests with 404 unknown endpoint.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// This is our created errorHandler. Any middlware defined with four parameters will be defined as an errorHandler. Other type of middleware usually take 3 parameters.
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    // Note that putting the sendStatus method before the json method will cause the json method to not run as the sendStatus method will end the req-res cycle before reaching the json method.
    return res.json({ error: 'malformatted id' }).sendStatus(400);
  } else if (error.name === 'ValidationError') {
    return res.json({ error: error.message }).sendStatus;
  }

  //  If the error is not a CastError, then the errorHandler will pass the error to the default Express error handler.
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
