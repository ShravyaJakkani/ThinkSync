const express = require("express");
const multer = require("multer");
const authMiddleware= require("../middleware/authMiddleware");
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

// router.post("/", upload.single("image"), async (req, res) => {
//   const { title, pin } = req.body;

//   if (!title || !pin) {
//     return res.status(400).json({ error: "Title and PIN are required" });
//   }

//   try {
//     let fileUrl = "";

//     if (req.file) {
//       const result = await streamUpload(req.file.buffer, req.file.originalname);
//       fileUrl = result.secure_url;
//     }

//     const newPaper = new QuestionPaper({
//       title,
//       image: fileUrl,
//       pin,
//     });

//     await newPaper.save();
//     res.status(201).json(newPaper);
//   } catch (error) {
//     console.error("PDF Upload Error:", error);
//     res.status(500).json({ error: "Failed to upload question paper" });
//   }
// });


router.post("/auth", authMiddleware, upload.single("file"), async (req, res) => {
  const { title, content, pin } = req.body;
  let imageUrl = "";

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
  folder: "thinksync/questionpapers",
  resource_type: "raw"   // 🔥 REQUIRED FOR PDF
},
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new QuestionPaper({
          title,
          file: imageUrl,   
          user: req.user.id,
          likes: []
});

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
  console.error("FULL ERROR:", err); // 👈 ADD THIS
  res.status(500).json({ error: err.message }); // 👈 SHOW REAL ERROR
}
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await QuestionPaper.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // 🔥 handle old posts (no user)
    if (!post.user) {
      return res.status(403).json({ error: "Post has no owner (old data)" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err); // 🔥 ADD THIS
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
