const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Fun = require("../models/Fun");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all fun posts
router.get("/", async (req, res) => {
  try {
    const posts = await Fun.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// POST fun content
router.post("/", upload.single("image"), async (req, res) => {
  const { title, pin } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  if (!title || !image || !pin) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const post = new Fun({ title, image, pin });
    await post.save();
    res.status(201).json(post);
  } catch {
    res.status(400).json({ error: "Upload failed" });
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

// DELETE fun post
router.delete("/:id", async (req, res) => {
  const { pin } = req.body;

  try {
    const post = await Fun.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });

    if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await Fun.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
