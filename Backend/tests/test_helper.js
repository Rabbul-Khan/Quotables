const User = require('../models/user');

const initialUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password456',
    name: 'Jane Smith',
  },
];

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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
};
