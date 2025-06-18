const express = require("express");
const multer = require("multer");
const OpportunityPost = require("../models/OpportunityPost");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await OpportunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch opportunities" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, content, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/opportunities" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new OpportunityPost({ title, content, pin, image: imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Opportunity post error:", err);
    res.status(500).json({ error: "Failed to create opportunity" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await OpportunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const inputPin = req.body.pin;
    const adminPin = process.env.ADMIN_PIN;

    if (post.pin !== inputPin && inputPin !== adminPin) {
      return res.status(403).json({ error: "Invalid PIN" });
    }

    await OpportunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Opportunity deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete opportunity" });
  }
});

module.exports = router;
