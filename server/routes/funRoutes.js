const express = require("express");
const multer = require("multer");
const Fun = require("../models/Fun");
const { cloudinary } = require("../config/cloudinary");
require("dotenv").config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await Fun.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fun posts" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, userId, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "thinksync/fun" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newPost = new Fun({ title, userId, pin, image: imageUrl, likes: [] });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Fun post error:", err);
    res.status(500).json({ error: "Failed to create fun post" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { username } = req.body;
  try {
    const post = await Fun.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!username) return res.status(400).json({ error: "Username required" });

    const alreadyLiked = post.likes.includes(username);
    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json({ message: alreadyLiked ? "Unliked" : "Liked", likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Fun.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.pin !== req.body.pin && req.body.pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await Fun.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete fun post" });
  }
});

module.exports = router;

