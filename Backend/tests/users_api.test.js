const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supertest = require('supertest');
const helper = require('./test_helper');

// Import Express applications
const app = require('../app');

// Wrap the Express application with a supertest function into a superagent object. This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.
const api = supertest(app);
const User = require('../models/user');

// Before each test all existing users in the DB are deleted, and 2 dummy users are added to DB
beforeEach(async () => {
  await User.deleteMany({});

  const userOne = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
  };
  const passwordHashOne = await bcrypt.hash(userOne.password, 10);
  const userOneObject = new User({ ...userOne, password: passwordHashOne });
  await userOneObject.save();

  const userTwo = {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password456',
    name: 'Jane Smith',
  };
  const passwordHashTwo = await bcrypt.hash(userTwo.password, 10);
  const userTwoObject = new User({ ...userTwo, password: passwordHashTwo });
  await userTwoObject.save();

  // const userObjects = helper.initialUsers.map(async (user) => {
  //   const passwordHash = await bcrypt.hash(user.password, 10);
  //   return new User({ ...user, password: passwordHash });
  // });

  // const promiseArray = userObjects.map((user) => user.save());
  // await Promise.all(promiseArray);
});

// When trying to retrieve users and no existing users in the DB, receive 404 error
test('no users in database, receive error 404', async () => {
  await User.deleteMany({});
  await api.get('/api/users').expect(404);
});

// All the existing users are retrieved from the DB.
test('all existing users are returned', async () => {
  const usersAtStart = await helper.usersInDb();

  const users = await api.get('/api/users').expect(200);
  expect(users.body).toHaveLength(usersAtStart.length);
});

// A specific user can be retrieved from the DB given a valid id.
test('a specific user is within the returned users', async () => {
  const users = await helper.usersInDb();
  const userToRetrieve = users[0];

  const response = await api.get(`/api/users/${userToRetrieve.id}`).expect(200);

  // The next line of test does not work as the createdAt property types do not match.
  // expect(response.body).toBe(userToRetrieve);

  // Alternative that solves to the previous problem
  const usernames = users.map((user) => user.username);
  expect(usernames).toContain(response.body.username);
});

// A user cannot be retrieved if id is malformatted.
test('a user cannot be retrieved if id is malformatted', async () => {
  const malformattedId = 'malformatted';
  await api.get(`/api/users/${malformattedId}`).expect(404);
});

// A user can be added to the DB
test('a valid user can be added', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = new User({
    username: 'dGlover',
    email: 'danny@gmail.com',
    password: 'danny123',
  });
  // NOTE the toJSON method used
  await api.post('/api/users').send(newUser.toJSON()).expect(201);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).toContain(newUser.username);
});

test('a user without username cannot be added - throws user validation error', async () => {
  const usersAtStart = await helper.usersInDb();
  console.log(usersAtStart);

  const newUser = new User({
    email: 'danny@gmail.com',
    password: 'danny123',
    name: 'Danny Glover',
  });

  const response = await api.post('/api/users/').send(newUser.toJSON());

  expect(response.body.error).toContain('User validation failed');

  const usersAtEnd = await helper.usersInDb();

  expect(usersAtEnd).toHaveLength(usersAtStart.length);
  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).not.toContain(newUser.username);
});

// A specific user can be deleted from the DB.
test('a specific user is deleted', async () => {
  const usersAtStart = await helper.usersInDb();
  const userToDelete = usersAtStart[0];

  await api.delete(`/api/users/:${userToDelete.id}`);

  const usersAtEnd = await helper.usersInDb();

  expect(usersAtEnd).not.toContain(userToDelete);
});

test('A user can follow another user', async () => {
  const usersAtStart = await helper.usersInDb();

  const userId = usersAtStart[0].id;
  const targetId = usersAtStart[1].id;

  const response = await api.post(`/api/users/${userId}/follow/${targetId}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('User followed successfully');

  const usersAtEnd = await helper.usersInDb();

  // const userIdObject = new mongoose.Types.ObjectId(usersAtEnd[1].id);
  // expect(usersAtEnd[1].followers).toContain(usersAtEnd[0].id);

  // WORKS but I believe this part can be improved.
  // In the user schema, we used transform function on toJSON to change how we receive the user objects from MongoDb. The ObjectId is converted to a string when we receive it. BUT the followers list is an array of ObjectId's. Hence when we perform the test, we convert the ObjectId in the followers array to a string and then compare.
  // A better solution could be to use the transform function on toJSON to also change how we receive the followers array - instead of an array of ObjectId's we receive an array of strings.
  expect(usersAtEnd[0].following[0].toString()).toContain(usersAtEnd[1].id);
  expect(usersAtEnd[1].followers[0].toString()).toContain(usersAtEnd[0].id);
});

test('A user can unfollow another user', async () => {
  const usersAtStart = await helper.usersInDb();

  const userId = usersAtStart[0];
  const targetId = usersAtStart[1];

  userId.following = userId.following.concat(targetId.id);
  targetId.followers = targetId.followers.concat(userId.id);

  const response = await api.post(
    `/api/users/${userId.id}/unfollow/${targetId.id}`
  );

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('User unfollowed successfully');

  const usersAtEnd = await helper.usersInDb();

  expect(usersAtEnd[0].following.length).toEqual(0);
  expect(usersAtEnd[1].followers.length).toEqual(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// For newly created saved posted data the status code is 201 - CREATED
