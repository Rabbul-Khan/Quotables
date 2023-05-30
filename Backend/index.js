// Import the actual Express app
const app = require('./app');

const config = require('./utils/config');
const logger = require('./utils/logger');

// Bind the server to the app variable. Now app listens to HTTP requests made to port ****. We used the dotenv library to hide the port number.
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

module.exports = app;

// // A route defined to handle HTTP requests made to root of the application '/'
// app.get('/', (req, res) => {
//   res.send('<h1>Instagram Clone</h1>');
// });
