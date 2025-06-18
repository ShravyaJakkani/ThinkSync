const express = require("express");
const multer = require("multer");
const Art = require("../models/Art");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all art posts
router.get("/", async (req, res) => {
  try {
    const posts = await Art.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch art posts" });
  }
});

// Upload art post with optional image
router.post("/", upload.single("image"), async (req, res) => {
  const { title, userId, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/art" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new Art({ title, userId, pin, image: imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to create art post" });
  }
});

// Like/Unlike an art post
router.post("/:id/like", async (req, res) => {
  const { username } = req.body;

  try {
    const post = await Art.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(username);
    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json({ message: alreadyLiked ? "Unliked" : "Liked", likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: "Could not like/unlike post" });
  }
});

// Delete art post with user/admin PIN
router.delete("/:id", async (req, res) => {
  try {
    const post = await Art.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const inputPin = req.body.pin;
    const adminPin = process.env.ADMIN_PIN;

    if (post.pin !== inputPin && inputPin !== adminPin) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await Art.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete art post" });
  }
});

module.exports = router;
