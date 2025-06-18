const express = require("express");
const multer = require("multer");
const AchievementPost = require("../models/AchievementPost");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await AchievementPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, content, userId, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/achievements" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new AchievementPost({ title, content, userId, pin, image: imageUrl, likes: [] });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Achievement post error:", err);
    res.status(500).json({ error: "Failed to create achievement" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { username } = req.body;

  try {
    const post = await AchievementPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!username) return res.status(400).json({ error: "Username required" });

    const alreadyLiked = post.likes.includes(username);
    if (alreadyLiked) {
      post.likes = post.likes.filter((user) => user !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json({ message: alreadyLiked ? "Unliked" : "Liked", likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: "Could not like/unlike post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await AchievementPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const inputPin = req.body.pin;
    const adminPin = process.env.ADMIN_PIN;

    if (post.pin !== inputPin && inputPin !== adminPin) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await AchievementPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Achievement deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete achievement" });
  }
});

module.exports = router;
