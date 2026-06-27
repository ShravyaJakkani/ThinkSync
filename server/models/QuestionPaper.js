const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // content: { type: String, required: true },
  file: { type: String, required: true },
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

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);