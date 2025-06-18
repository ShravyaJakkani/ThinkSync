const express = require("express");
const multer = require("multer");
const QuestionPaperPost = require("../models/QuestionPaperPost");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await QuestionPaperPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question papers" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const fileType = req.file.mimetype.startsWith("application/pdf") ? "raw" : "image";
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/questionpapers", resource_type: fileType },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newPost = new QuestionPaperPost({ title, pin, image: imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Question paper upload error:", err);
    res.status(500).json({ error: "Failed to create question paper" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await QuestionPaperPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const inputPin = req.body.pin;
    const adminPin = process.env.ADMIN_PIN;

    if (post.pin !== inputPin && inputPin !== adminPin) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await QuestionPaperPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Question paper deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete question paper" });
  }
});

module.exports = router;
