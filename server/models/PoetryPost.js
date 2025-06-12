const mongoose = require('mongoose');

const PoetryPostSchema = new mongoose.Schema({
  title: String,
  userId: String,
  pin: String,
  image: String,
  likes: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PoetryPost', PoetryPostSchema);
