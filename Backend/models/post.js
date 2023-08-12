const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Is userId a better name for this prop?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    maxLength: 1000,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString(undefined, { timeZone: 'Asia/Dhaka' }),
  },

  // These features will be added later.

  // image: {
  //   type: String,
  //   required: true,
  // },
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Likes',
  //   },
  // ],
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment',
  //   },
  // ],
});

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Post', postSchema);
