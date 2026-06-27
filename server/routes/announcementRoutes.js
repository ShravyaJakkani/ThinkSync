const express = require("express");
const multer = require("multer");
const AnnouncementPost = require("../models/AnnouncementPost");
const authMiddleware = require("../middleware/authMiddleware");
const { cloudinary } = require("../config/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await AnnouncementPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

router.post("/auth", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, content, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "thinksync/announcements" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new AnnouncementPost({
      title,
      content,
      // pin,
      image: imageUrl,
      user: req.user.id, 
      likes: []
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
    console.error("Announcement post error:", err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await AnnouncementPost.findById(req.params.id);

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
