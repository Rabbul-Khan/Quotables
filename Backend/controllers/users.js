// We do not want to store the password directly to the database. Hence we create a password hash from the actual password using the bcrypt library.
const bcrypt = require('bcrypt');

//A router object is an isolated instance of middleware and routes. We can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.
const usersRouter = require('express').Router();

const User = require('../models/user');
//const Post = require('../models/post');

// Route for fetching all the users
// Here we fetch all the saved 'user' objects from the database. The parameter of the find method are the search conditions. In this case, we want to retrieve all the users and hence the parameter is left empty {}.
// Note that the route parameter here is just '/'. This is because if we see the index.js file, the '/api/users' part is already added as a parameter when calling the usersRouters.
usersRouter.get('/', async (req, res) => {
  // The populate method of Mongoose acts as a join query.
  // In this case, 'posts' is the parameter given to populate. It will find all the post objects referenced by the ids existing in the posts array of the user.
  // The populate method takes an additional parameter here - { image: 1, caption: 1 }. With this parameter we have stated we want only the image, and caption fields to be returned.
  const users = await User.find({}).populate('posts', {
    content: 1,
  });
  if (!users.length) {
    return res.status(404).json({ message: 'No users exist' });
  }
  return res.json(users);
});

// Route for fetching a single user with a given id.
usersRouter.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('posts', {
    content: 1,
  });
  if (!user) {
    return res.status(404).json({ message: 'No user found' });
  }
  return res.json(user);
});

// Route for registering a new user.
usersRouter.post('/', async (req, res) => {
  // The body property gets the data to be posted by making use of json parser added in app.js.
  const { username, password } = req.body;

  if (username.length < 4) {
    res
      .status(403)
      .json({ error: 'Username should be longer than 3 characters' });
  }

  if (password.length < 7) {
    res
      .status(403)
      .json({ error: 'Password should be longer than 6 characters' });
  }

  if (!/\d/.test(password)) {
    res.status(403).json({ error: 'Password should have atleast one number' });
  }

  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialChars.test(password)) {
    res
      .status(403)
      .json({ error: 'Password should have atleast one special character' });
  }

  // We do not want to save the password directly to the database. Hence we use brypt library to create a hash of the password which is then stored to the dB
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Now we create a new user object using the imported User model(the model can also be said to be a constructor function).
  const user = new User({
    username: username,
    password: passwordHash,
  });

  // Finally we save the user object to the database using the save method.
  await user.save();
  return res.status(201).json(user);
});

// This does not work - might be an authentication issue.
// Route for deleteing a user with a given id.
// usersRouter.delete('/:userId', async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   console.log(user);
//   if (!user) {
//     return res.status(404).json({ message: 'No user found' });
//   }

//   if (user.posts.length !== 0) {
//     user.posts.forEach((post) => {
//       Post.findByIdAndDelete(post.id.toString());
//     });
//   }
//   await User.findByIdAndDelete(req.params.userId);
//   return res.status(204);
// });

// Will implement this functionality later.

// // Route to handle a user following an unfollowed user
// usersRouter.post('/:userId/follow/:targetId', async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   const targetUser = await User.findById(req.params.targetId);

//   if (!user || !targetUser) {
//     return res.status(404).json({ message: 'No user found' });
//   }

//   user.following = user.following.concat(targetUser.id);
//   targetUser.followers = targetUser.followers.concat(user.id);

//   await user.save();
//   await targetUser.save();

//   return res.json({ message: 'User followed successfully' });
// });

// // Route to handle a user unfollowing a followed user
// usersRouter.post('/:userId/unfollow/:targetId', async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   const targetUser = await User.findById(req.params.targetId);

//   if (!user || !targetUser) {
//     return res.status(404).json({ message: 'No user found' });
//   }

//   user.following = user.following.filter((id) => {
//     return id !== targetUser.id;
//   });

//   targetUser.followers = targetUser.followers.filter((id) => {
//     return id !== user.id;
//   });

//   await user.save();
//   await targetUser.save();

//   return res.json({ message: 'User unfollowed successfully' });
// });

// The module exports the router to be available for all consumers of the module.
module.exports = usersRouter;
