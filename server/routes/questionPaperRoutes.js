const express = require("express");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const  QuestionPaper  = require("../models/QuestionPaper");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

const streamUpload = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "thinksync/questionpapers",
        resource_type: "raw", // required for PDFs
        public_id: filename.split(".")[0],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

router.get("/", async (req, res) => {
  try {
    const papers = await QuestionPaper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question papers" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { title, pin } = req.body;

  if (!title || !pin) {
    return res.status(400).json({ error: "Title and PIN are required" });
  }

  try {
    let fileUrl = "";

    if (req.file) {
      const result = await streamUpload(req.file.buffer, req.file.originalname);
      fileUrl = result.secure_url;
    }

    const newPaper = new QuestionPaper({
      title,
      image: fileUrl,
      pin,
    });

    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({ error: "Failed to upload question paper" });
  }
});

router.delete('/:id', async (req, res) => {
  const { pin } = req.body;

  if (!pin) return res.status(400).json({ error: 'PIN required for deletion' });

  try {
    const post = await QuestionPaper.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: 'Invalid PIN' });
    }

    await QuestionPaper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
