const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  image: { type: String, required: true },
  pin: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [String],
});

module.exports = mongoose.model("Art", artSchema);
