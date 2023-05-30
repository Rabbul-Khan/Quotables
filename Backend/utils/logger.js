// This utility separates printing to the console from other code.

// For printing normal log messages
const info = (...params) => {
  console.log(...params);
};

// For printing error log messages
const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
