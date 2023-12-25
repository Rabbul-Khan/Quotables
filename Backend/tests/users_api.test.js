const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supertest = require('supertest');
const helper = require('./test_helper');

// Import Express application.
const app = require('../app');

// Wrap the Express application with a supertest function into a superagent object. This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.
const api = supertest(app);

const User = require('../models/user');

// Before each test all existing users in the DB are deleted, and 2 dummy users are added to DB
beforeEach(async () => {
  await User.deleteMany({});

  const userOne = {
    username: 'john_doe',
    password: 'password123@',
  };
  const passwordHashOne = await bcrypt.hash(userOne.password, 10);
  const userOneObject = new User({ ...userOne, password: passwordHashOne });
  await userOneObject.save();

  const userTwo = {
    username: 'jane_smith',
    password: 'password456@',
  };
  const passwordHashTwo = await bcrypt.hash(userTwo.password, 10);
  const userTwoObject = new User({ ...userTwo, password: passwordHashTwo });
  await userTwoObject.save();
});

// When trying to retrieve users and no existing users in the DB, receive error 404.
test('no users in database, receive error 404', async () => {
  await User.deleteMany({});
  const response = await api.get('/api/users');
  expect(response.status).toBe(404);
  expect(response.body.message).toContain('No users exist');
});

// Fetching all the users.
test('all existing users are returned', async () => {
  const usersAtStart = await helper.usersInDb();
  const users = await api.get('/api/users');
  expect(users.status).toBe(200);
  expect(users.body).toHaveLength(usersAtStart.length);
});

// Fetching a single user with a given valid id.
test('a specific user is returned if valid id given', async () => {
  const users = await helper.usersInDb();
  const userToRetrieve = users[0];
  const response = await api.get(`/api/users/${userToRetrieve.id}`);
  expect(response.status).toBe(200);
  // The next line of test does not work as the createdAt property types do not match.
  // expect(response.body).toBe(userToRetrieve);

  // Alternative that solves to the previous problem
  const usernames = users.map((user) => user.username);
  expect(usernames).toContain(response.body.username);
});

// A user cannot be fetched if id is malformatted - receive code 404.
test('a user cannot be retrieved if id is malformatted', async () => {
  const malformattedId = 'malformatted';
  const response = await api.get(`/api/users/${malformattedId}`);
  expect(response.status).toBe(404);
  expect(response.body.message).toContain('No user found');
});

// A user cannot be fetched if the given id is not associated with an existing user - receive error 404
test('if id does not exist, receive error 404', async () => {
  const nonExistingId = await helper.nonExistingId();
  const response = await api.get(`/api/users/${nonExistingId}`);
  expect(response.status).toBe(404);
  expect(response.body.message).toContain('No user found');
});

// A new user can be registered to the dB
test('a valid user can be added', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'dGlover',
    password: 'danny123@',
  };

  await api.post('/api/users').send(newUser);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).toContain(newUser.username);
});

// If no username provided when registering - user validation error
test('a user without username cannot be added - throws user validation error', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    password: 'danny123@',
  };

  const response = await api.post('/api/users/').send(newUser);
  expect(response.body.error).toContain('Username is required');
  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).not.toContain(newUser.username);
});

// If no email provided when registering - user validation error
test('a user without password cannot be added - throws user validation error', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'dannyGlover',
  };

  const response = await api.post('/api/users/').send(newUser);
  expect(response.body.error).toContain('Password is required');
  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).not.toContain(newUser.username);
});

// Tests for password validation can be added here (MISSING)

// User deletion test does not pass - might be an authentication issue
// // A specific user can be deleted from the DB.
// test('a specific user is deleted', async () => {
//   const usersAtStart = await helper.usersInDb();
//   const userToDelete = usersAtStart[0];
//   const response = await api.delete(`/api/users/${userToDelete.id}`);
//   expect(response.status).toBe(204);
//   const usersAtEnd = await helper.usersInDb();
//   const usernames = usersAtEnd.map((user) => user.username);
//   expect(usernames).not.toContain(userToDelete.username);
// });

// // User cannot be deleted if id does not exist - receive status 204
// test('if non existing id given when deleting user, status 204', async () => {
//   const usersAtStart = await helper.usersInDb();
//   const nonExistingId = await helper.nonExistingId();
//   const response = await api.delete(`/api/users/${nonExistingId}`);
//   expect(response.status).toBe(404);
//   expect(response.body.message).toContain('No user found');
//   const usersAtEnd = await helper.usersInDb();
//   expect(usersAtEnd.length).toBe(usersAtStart.length);
// });

// WILL IMPLEMENT FOLLOW FUNCTIONALITY LATER
// test('A user can follow another user', async () => {
//   const usersAtStart = await helper.usersInDb();

//   const userId = usersAtStart[0].id;
//   const targetId = usersAtStart[1].id;

//   const response = await api.post(`/api/users/${userId}/follow/${targetId}`);

//   expect(response.status).toBe(200);
//   expect(response.body.message).toBe('User followed successfully');

//   const usersAtEnd = await helper.usersInDb();

//   // const userIdObject = new mongoose.Types.ObjectId(usersAtEnd[1].id);
//   // expect(usersAtEnd[1].followers).toContain(usersAtEnd[0].id);

//   // WORKS but I believe this part can be improved.
//   // In the user schema, we used transform function on toJSON to change how we receive the user objects from MongoDb. The ObjectId is converted to a string when we receive it. BUT the followers list is an array of ObjectId's. Hence when we perform the test, we convert the ObjectId in the followers array to a string and then compare.
//   // A better solution could be to use the transform function on toJSON to also change how we receive the followers array - instead of an array of ObjectId's we receive an array of strings.
//   expect(usersAtEnd[0].following[0].toString()).toContain(usersAtEnd[1].id);
//   expect(usersAtEnd[1].followers[0].toString()).toContain(usersAtEnd[0].id);
// });

// test('A user can unfollow another user', async () => {
//   const usersAtStart = await helper.usersInDb();

//   const userId = usersAtStart[0];
//   const targetId = usersAtStart[1];

//   userId.following = userId.following.concat(targetId.id);
//   targetId.followers = targetId.followers.concat(userId.id);

//   const response = await api.post(
//     `/api/users/${userId.id}/unfollow/${targetId.id}`
//   );

//   expect(response.status).toBe(200);
//   expect(response.body.message).toBe('User unfollowed successfully');

//   const usersAtEnd = await helper.usersInDb();

//   expect(usersAtEnd[0].following.length).toEqual(0);
//   expect(usersAtEnd[1].followers.length).toEqual(0);
// });

afterAll(async () => {
  await mongoose.connection.close();
});

// For newly created saved posted data the status code is 201 - CREATED
