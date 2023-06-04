const User = require('../models/user');
const Post = require('../models/post');

// Generate an id that does not have a user.
const nonExistingId = async () => {
  const user = new User({
    username: 'will remove',
    email: 'will remove',
    password: 'will remove',
    name: 'will remove',
  });
  await user.save();
  await user.deleteOne();

  return user._id.toString();
};

// Return all the users from the dB.
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

// Return all the posts from the dB.
const postsInDb = async () => {
  const posts = await Post.find({});
  return posts.map((post) => post.toJSON());
};

module.exports = {
  nonExistingId,
  usersInDb,
  postsInDb,
};
