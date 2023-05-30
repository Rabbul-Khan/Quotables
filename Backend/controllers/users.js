//A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.
const usersRouter = require('express').Router();

const User = require('../models/user');

// A route for fetching all the users
// Here we fetch the saved 'user' objects from the database. The parameter of the find method are the search conditions. Here we want to retrieve all the users and hence the parameter is left empty {}.
// Note that the route parameter here is just '/'. This is because if we see the index.js file, '/api/users' is already added as a parameter when calling the usersRouters.
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: 'No users' });
    }
    return res.json(users);
  } catch (error) {
    // We have impemented our own errorHandler middleware here. Look in middleware.js.
    // next function will be required as a parameter in addition to req and res
    //  If next was called without a parameter, then execution would move to next route or middleware. Since next has a parameter execution will continur to errorHandler middleware
    next(error);
  }
});

// A route for fetching a single user.
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

// Route for deleteing a user with a given id
usersRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(204).json({ message: 'No user found' });
    }
    return res.status(204).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// Route for posting a new user.
usersRouter.post('/', async (req, res, next) => {
  try {
    // For details on how the body property gets the data to be posted read about json parser part.
    const body = req.body;

    // Now we create a new user object using the imported User model(the model can also be said to be a constructor function).
    const user = new User({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    // Finally we save the user object to the database using the save method.
    await user.save();
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/:id/follow/:targetId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const targetUser = await User.findById(req.params.targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'No user found' });
    }

    user.following.concat(targetUser.id);
    targetUser.followers.concat(user.id);

    await user.save();
    await targetUser.save();

    return res.json({ message: 'User followed successfully' });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/:id/follow/:targetId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const targetUser = await User.findById(req.params.targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'No user found' });
    }

    user.following = user.following.filter((id) => {
      return id !== targetUser.id;
    });

    targetUser.followers = targetUser.followers.filter((id) => {
      return id !== user.id;
    });

    await user.save();
    await targetUser.save();

    return res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
});

// The module exports the router to be available for all consumers of the module.
module.exports = usersRouter;
