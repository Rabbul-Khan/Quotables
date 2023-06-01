const postsRouter = require('express').Router();

const Post = require('../models/post');

// Get all the posts in the database.
postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find({});
    if (!posts.length) {
      return res.status(404).json({ message: 'No posts' });
    }
    return res.json(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    const post = new Post({
      user: body.user,
      image: body.image,
      capiton: body.caption,
      createdAt: body.createdAt,
    });

    await post.save();
    return res.json(post);
  } catch (error) {
    next(error);
  }
});

postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(204).json({ message: 'No post found' });
    }
    return res.status(204).json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = postsRouter;
