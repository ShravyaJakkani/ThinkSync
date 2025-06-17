// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const path = require('path');
// const PoetryPost = require('../models/PoetryPost');

// // Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// // GET all poetry posts
// router.get('/', async (req, res) => {
//   try {
//     const posts = await PoetryPost.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch posts' });
//   }
// });

// // POST a new poetry post
// router.post('/', upload.single('image'), async (req, res) => {
//   const { title, userId, pin } = req.body;
//    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`: "";

//   if (!title || !pin) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const newPost = new PoetryPost({ title, userId, pin, image });
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to create post' });
//   }
// });

// router.post("/:id/like", async (req, res) => {
//   const { username } = req.body; 

//   try {
//     const post = await PoetryPost.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     if (!username) return res.status(400).json({ error: "Username required" });

    
//     const alreadyLiked = post.likes.includes(username);

//     if (alreadyLiked) {
     
//       post.likes = post.likes.filter((user) => user !== username);
//     } else {
      
//       post.likes.push(username);
//     }

//     await post.save();
//     res.json({ message: alreadyLiked ? "Unliked" : "Liked", likes: post.likes });
//   } catch (err) {
//     res.status(500).json({ error: "Could not like/unlike post" });
//   }
// });

// // DELETE poetry post
// router.delete('/:id', async (req, res) => {
//   const { pin } = req.body;

//   if (!pin) return res.status(400).json({ error: 'PIN required for deletion' });

//   try {
//     const post = await PoetryPost.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });

//     if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
//       return res.status(403).json({ error: 'Invalid PIN' });
//     }

//     await PoetryPost.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Post deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete post' });
//   }
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const PoetryPost = require('../models/PoetryPost');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

const router = express.Router();

// Setup multer for memory storage (Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all poetry posts
router.get('/', async (req, res) => {
  try {
    const posts = await PoetryPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Poetry fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch poetry posts' });
  }
});

// POST a new poetry post with image
router.post('/', upload.single('image'), async (req, res) => {
  const { title, content, userId, pin } = req.body;
  let image = '';

  try {
    if (req.file) {
      const b64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await uploadToCloudinary(dataURI, "ThinkSync/Poetry");
      image = uploadResult.secure_url;
    }

    const newPost = new PoetryPost({ title, content, userId, pin, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Poetry post error:", err);
    res.status(500).json({ error: 'Failed to create poetry post' });
  }
});

// DELETE poetry post with PIN
router.delete('/:id', async (req, res) => {
  const { pin } = req.body;

  try {
    const post = await PoetryPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.pin !== pin && pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: 'Invalid PIN' });
    }

    await PoetryPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poetry post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete poetry post' });
  }
});

module.exports = router;

