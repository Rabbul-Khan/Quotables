const postsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { userExtractor } = require('../utils/middleware');

const Post = require('../models/post');
const User = require('../models/user');

// Route for fetching all the posts.
postsRouter.get('/', async (req, res) => {
  const posts = await Post.find({}).populate('user', { username: 1 });
  if (!posts.length) {
    return res.status(404).json({ message: 'No posts' });
  }
  return res.json(posts);
});

// Route for fetching a single post with given id.
postsRouter.get('/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId).populate('user', {
    username: 1,
  });
  if (!post) {
    return res.status(404).json({ message: 'No post found' });
  }
  return res.json(post);
});

// Route for saving a post.
postsRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body;

  // Here we use the verify method to ensure that a valid user is attempting to make a post. If the verification is successful, it returns the username and id of the user.
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decodedToken.id);

  const post = new Post({
    user: user.id,
    content: body.content,
  });

  const savedPost = await post.save();
  console.log(savedPost);

  const dataToSend = {
    content: body.content,
    id: savedPost.id,
    username: user.username,
    date: savedPost.createdAt,
  };

  user.posts = user.posts.concat(savedPost._id);
  await user.save();
  console.log('saved Post', savedPost);
  return res.status(201).send(dataToSend);
});

// Route for deleteing a post with a given id.
postsRouter.delete('/:postId', userExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, config.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(204).json({ message: 'No post found' });
  }

  // We check whether the user that is attempting to delete a specific post is the creator of the specific post or not.
  // The toString() methods are used to convert the ObjectId type stored in the database.
  if (post.user.toString() !== req.userId.toString()) {
    return res
      .status(403)
      .json({ message: 'User is not creator of this post' });
  }

  // NEED TO TEST THIS FUNCTIONALITY WORKS OR NOT. COULD HAVE BUGs.
  const user = await User.findById(post.user.toString());
  console.log(user.posts);
  user.posts = user.posts.filter((post) => {
    return post.toString() !== req.params.postId;
  });

  await Post.deleteOne({ _id: req.params.postId });
  await user.save();
  return res.status(204).json({ message: 'Post deleted' });
});

module.exports = postsRouter;
