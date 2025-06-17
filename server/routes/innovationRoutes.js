const express = require('express');
const multer = require('multer');
const router = express.Router();
const InnovationPost = require('../models/InnovationPost');

// Setup multer (no file uploads, only text data)

const path = require("path");

// Multer disk storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// GET all innovation posts
router.get('/', async (req, res) => {
  try {
    console.log("🧪 MongoDB posts count:", posts.length);

    const posts = await InnovationPost.find().sort({ createdAt: -1 });
    console.log("Sending posts:", posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});



// POST a new innovation post
router.post('/', upload.single("image"), async (req, res) => {
  const { title,userId, content, pin } = req.body;
  const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`: "";

  if (!title || !content || !pin) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newPost = new InnovationPost({ title,userId, content, pin, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Save error:", err);
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// Like or unlike a post
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

// DELETE a post with PIN
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
