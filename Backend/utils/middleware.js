const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
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
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// This is our created errorHandler. Any middlware defined with four parameters will be defined as an errorHandler. Other type of middleware take 3 parameters.
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    // Note that putting the sendStatus method before the json method will cause the json method to not run as the sendStatus method will end the req-res cycle before reaching the json method.
    return res.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(403).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }
  //  If the error is not any of the above errors, then the errorHandler will pass the error to the default Express error handler.
  //  If next was called without a parameter, then execution would move to next route or middleware. Since next has a parameter execution will continue to the Express error handler middleware.
  next(error);
};

// If the request has an authorization header, this middleware removes the 'Bearer ' part of the authorization header, and sets the rest of the string to the token property of the request.
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    const token = authorization.replace('bearer ', '');
    req.token = token;
  }
  next();
};

// If the request has a token property, we check if it is verified through jwt. Once it passes verification, we set the userId property of the header to the id of the user the token belongs to.
const userExtractor = (req, res, next) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);
  const userId = decodedToken.id;
  req.userId = userId;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
