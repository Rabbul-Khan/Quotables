const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supertest = require('supertest');
const helper = require('./test_helper');

const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const Post = require('../models/post');

beforeEach(async () => {
  await Post.deleteMany({});
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

  const user = await User.find({ username: 'john_doe' });

  const postOne = new Post({
    userId: user[0]._id,
    image: 'www.someImage.com',
    caption: 'Beautiful picture',
  });
  await postOne.save();
});

// When trying to retrieve posts and no existing posts in the DB, receive 404 error
test('no posts in database, receive error 404', async () => {
  await Post.deleteMany({});
  await api.get('/api/posts').expect(404);
});

// All the existing posts are retrieved from the DB.
test('all existing posts are returned', async () => {
  const postsAtStart = await helper.postsInDb();

  const posts = await api.get('/api/posts').expect(200);
  expect(posts.body).toHaveLength(postsAtStart.length);
});

// A specific post can be retrieved from the DB given a valid id.
test('a specific post is within the returned posts', async () => {
  const posts = await helper.postsInDb();
  const postToRetrieve = posts[0];

  const response = await api.get(`/api/posts/${postToRetrieve.id}`).expect(200);

  //const postCaptions = posts.map((post) => post.caption);
  expect(postToRetrieve.caption).toContain(response.body.caption);
});

test('a new post can be posted', async () => {
  const postsAtStart = await helper.postsInDb();

  const user = await User.find({ username: 'john_doe' });

  const newPost = new Post({
    userId: user[0]._id,
    image: 'www.anotherImage.com',
    caption: 'New picture',
  });

  await api.post('/api/posts').send(newPost.toJSON()).expect(201);

  const postsAtEnd = await helper.postsInDb();
  expect(postsAtEnd).toHaveLength(postsAtStart.length + 1);
  const captions = postsAtEnd.map((post) => post.caption);
  expect(captions[1]).toContain(newPost.caption);
});

test('a specific post can be deleted', async () => {
  const postsAtStart = await helper.postsInDb();
  const postToDelete = postsAtStart[0];

  await api.delete(`/api/posts/${postToDelete.id}`).expect(204);

  const postsAtEnd = await helper.postsInDb();
  expect(postsAtEnd.length).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
