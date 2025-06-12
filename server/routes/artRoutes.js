const express = require("express");
const multer = require("multer");
const path = require("path");
const Art = require("../models/Art");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all art posts
router.get("/", async (req, res) => {
  try {
    const art = await Art.find().sort({ createdAt: -1 });
    res.json(art);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch art posts" });
  }
});

// POST new art
router.post("/", upload.single("image"), async (req, res) => {
  const { title,userId, pin } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  if (!title || !pin || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const post = new Art({ title,userId, image, pin });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: "Upload failed" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { username } = req.body; 

  try {
    const post = await Art.findById(req.params.id);
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

// DELETE art
router.delete("/:id", async (req, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: "PIN required" });

  try {
    const post = await Art.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });

    if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await Art.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
