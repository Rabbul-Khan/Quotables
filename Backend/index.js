// Import the actual Express app
const app = require('./app');

const config = require('./utils/config');
const logger = require('./utils/logger');

// Bind the server to the app variable. Now app listens to HTTP requests made to port ****.
// We used the dotenv library to hide the port number. All such sensitive information such as port number are stored in a separate .env file. They are then imported to the config.js file in utils directory. Finally the config file is imported wherever necessary.
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

module.exports = app;
