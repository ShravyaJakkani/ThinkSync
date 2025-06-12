const mongoose = require('mongoose');

const announcementPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  pin: { type: String, required: true },
  likes: [String],
}, { timestamps: true });

module.exports = mongoose.model('AnnouncementPost', announcementPostSchema);
