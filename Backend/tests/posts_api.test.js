const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const supertest = require('supertest');
const helper = require('./test_helper');

const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const Post = require('../models/post');

let token = '';

beforeEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});

  const userOne = {
    username: 'john_doe',
    password: 'pass123@',
  };
  const passwordHashOne = await bcrypt.hash(userOne.password, 10);
  const userOneObject = new User({ ...userOne, password: passwordHashOne });
  await userOneObject.save();

  const user = await User.find({ username: 'john_doe' });

  const userForToken = {
    username: user[0].username,
    id: user[0]._id,
  };

  token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60,
  });

  const postOne = new Post({
    user: user[0]._id,
    title: 'Remorse',
    author: 'Mark Twain',
    content: 'Remorse is a strong emotion',
  });
  await postOne.save();
  user[0].posts = user[0].posts.concat(postOne._id);
  await user[0].save();
});

// When trying to retrieve posts and no existing posts in the DB, receive 404 error
test('no posts in database, receive error 404', async () => {
  await Post.deleteMany({});
  const response = await api.get('/api/posts');
  expect(response.status).toBe(404);
  expect(response.body.message).toContain('No posts');
});

// All the existing posts are retrieved from the DB.
test('all existing posts are returned', async () => {
  const postsAtStart = await helper.postsInDb();

  const posts = await api.get('/api/posts');
  expect(posts.status).toBe(200);
  expect(posts.body).toHaveLength(postsAtStart.length);
});

// A specific post can be retrieved from the DB given a valid id.
test('a specific post is within the returned posts', async () => {
  const posts = await helper.postsInDb();
  const postToRetrieve = posts[0];

  const response = await api.get(`/api/posts/${postToRetrieve.id}`).expect(200);

  //const postCaptions = posts.map((post) => post.caption);
  expect(postToRetrieve.title).toContain(response.body.title);
});

test('a new post can be posted', async () => {
  const postsAtStart = await helper.postsInDb();

  const user = await User.find({ username: 'john_doe' });

  const newPost = {
    userId: user[0]._id,
    title: 'Beauty',
    author: 'Shakespeare',
    content: 'Beauty is only skin deep',
  };

  await api
    .post('/api/posts')
    .set('authorization', `bearer ${token}`)
    .send(newPost)
    .expect(201);

  const postsAtEnd = await helper.postsInDb();
  expect(postsAtEnd).toHaveLength(postsAtStart.length + 1);
  const titles = postsAtEnd.map((post) => post.title);
  expect(titles[1]).toContain(newPost.title);
});

// Deleteing a specific post.
test('a specific post can be deleted', async () => {
  const postsAtStart = await helper.postsInDb();
  const postToDelete = postsAtStart[0];

  await await api
    .delete(`/api/posts/${postToDelete.id}`)
    .set('authorization', `bearer ${token}`)
    .expect(204);

  const postsAtEnd = await helper.postsInDb();
  expect(postsAtEnd.length).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
