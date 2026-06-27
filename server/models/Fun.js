const mongoose = require('mongoose');

const funSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false 
  }

}, { timestamps: true });

module.exports = mongoose.model('Fun', funSchema);