const express = require("express");
const multer = require("multer");
const PoetryPost  = require("../models/PoetryPost");
const authMiddleware= require("../middleware/authMiddleware");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await PoetryPost.find()
     .populate("user", "username") 
     .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch poetry posts" });
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
            { folder: "thinksync/poetry" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newPost = new PoetryPost({ title, userId, pin, image: imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Poetry post error:", err.message);
    res.status(500).json({ error: "Failed to create poetry post" });
  }
});

router.post("/auth", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, content, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/poetry" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new PoetryPost({
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
    console.error("Poetry post error:", err);
    res.status(500).json({ error: "Failed to create poetry posts" });
  }
});

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await PoetryPost.findById(req.params.id);

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
    const post = await PoetryPost.findById(req.params.id);

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
