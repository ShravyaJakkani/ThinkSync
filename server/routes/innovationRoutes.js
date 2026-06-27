const express = require('express');
const router = express.Router();
const multer = require('multer');
const InnovationPost = require('../models/InnovationPost');
require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");
const { cloudinary } = require("../config/cloudinary");
const storage = multer.memoryStorage();
const upload = multer({ storage }); 

router.get('/', async (req, res) => {
  try {
   const posts = await InnovationPost.find()
  .populate("user", "username") 
  .sort({ createdAt: -1 });
    console.log("Fetched posts:", posts); 
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', upload.single("image"), async (req, res) => {
  const { title, userId, content, pin } = req.body;
  const image = req.file ? req.file.path : "";  

  if (!title || !content || !pin) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newPost = new InnovationPost({ title, userId, content, pin, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Save error:", err);
    res.status(400).json({ error: 'Failed to create post' });
  }
});


router.post("/auth", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, content, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/innovation" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new InnovationPost({
      title,
      content,
      pin,
      image: imageUrl,
      user: req.user.id, 
      likes: []
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
    console.error("Innovation post error:", err);
    res.status(500).json({ error: "Failed to create innovation posts" });
  }
});

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await InnovationPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE
      post.likes.push(userId);
    }

    await post.save();

    res.json({ likes: post.likes });

  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await InnovationPost.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.user) {
      return res.status(403).json({ error: "Post has no owner (old data)" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err); 
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
