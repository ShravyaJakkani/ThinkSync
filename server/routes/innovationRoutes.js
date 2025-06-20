const express = require('express');
const router = express.Router();
const multer = require('multer');
const InnovationPost = require('../models/InnovationPost');

const { storage } = require('../config/cloudinary');
const upload = multer({ storage }); // Multer using Cloudinary

router.get('/', async (req, res) => {
  try {
    const posts = await InnovationPost.find().sort({ createdAt: -1 });
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

router.post("/:id/like", async (req, res) => {
  const { username } = req.body;

  try {
    const post = await InnovationPost.findById(req.params.id);
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

router.delete('/:id', async (req, res) => {
  const { pin } = req.body;

  if (!pin) return res.status(400).json({ error: 'PIN required for deletion' });

  try {
    const post = await InnovationPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: 'Invalid PIN' });
    }

    await InnovationPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
