// This file is for handling of environment variables.

// The dotenv library allows for environment variables to be defined. Make sure to gitignore the env file. The env variables is used by using the expression:
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
