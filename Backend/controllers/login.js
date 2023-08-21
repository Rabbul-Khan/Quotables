// This library allows to generate JSON web tokens for authentication.
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const config = require('../utils/config');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    // compare method checks if password is correct
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!(passwordCorrect && user)) {
    return res.status(401).json({
      message: 'Invalid username or password',
    });
  }

  // If the password is correct, a token is created with the method jwt.sign. The token contains the username and the user id in a digitally signed form.
  // The token is digitally signed using a string from the environment variable SECRET as the secret.
  // The token expires in one hour. This is a safety measure. After one hour, user needs to login again.
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: user.username });
});

module.exports = loginRouter;
