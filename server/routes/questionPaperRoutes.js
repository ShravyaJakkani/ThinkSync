const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const QuestionPaper = require("../models/QuestionPaper");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all question papers
router.get("/", async (req, res) => {
  try {
    const papers = await QuestionPaper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question papers" });
  }
});

// POST a new question paper image
router.post("/", upload.single("image"), async (req, res) => {
  const {title, pin } = req.body;
  const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`: "";

  if (!pin || !image|| !title) {
    return res.status(400).json({ error: "all are required" });
  }

  try {
    const paper = new QuestionPaper({title, image, pin });
    await paper.save();
    res.status(201).json(paper);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ error: "Failed to upload question paper" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { username } = req.body; 

  try {
    const post = await QuestionPaper.findById(req.params.id);
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

// DELETE a question paper
router.delete("/:id", async (req, res) => {
  const { pin } = req.body;

  if (!pin) return res.status(400).json({ error: "PIN required" });

  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: "Not found" });

    if (paper.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await QuestionPaper.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
