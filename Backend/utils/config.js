// This file is for the handling of environment variables.

// The dotenv library allows for environment variables to be defined. Make sure to gitignore the env file. The env variables is used by using the expression:
require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
};
