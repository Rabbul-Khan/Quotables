const postsRouter = require('express').Router();

const Post = require('../models/post');
const User = require('../models/user');

// Get all the posts in the database.
postsRouter.get('/', async (req, res) => {
  const posts = await Post.find({}).populate('user', { username: 1 });
  if (!posts.length) {
    return res.status(404).json({ message: 'No posts' });
  }
  return res.json(posts);
});

// A route for fetching a single post.
postsRouter.get('/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: 'No post found' });
  }
  return res.json(post);
});

postsRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  const post = new Post({
    user: user.id,
    image: body.image,
    caption: body.caption,
    createdAt: body.createdAt,
  });

  const savedPost = await post.save();
  user.posts = user.posts.concat(savedPost._id);
  await user.save();
  return res.status(201).json(savedPost);
});

postsRouter.delete('/:postId', async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.postId);
  if (!post) {
    return res.status(204).json({ message: 'No post found' });
  }
  return res.status(204).json({ message: 'Post deleted' });
});

module.exports = postsRouter;
