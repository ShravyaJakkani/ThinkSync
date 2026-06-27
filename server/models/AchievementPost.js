const mongoose = require('mongoose');

const achievementPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  // pin: { type: String, required: true },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // allows old posts to still work
  }

}, { timestamps: true });

module.exports = mongoose.model('AchievementPost', achievementPostSchema);