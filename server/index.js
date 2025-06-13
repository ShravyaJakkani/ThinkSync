const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://thinksync-frontend.onrender.com'  
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Backend running!");
});


// Routes
const innovationRoutes = require('./routes/innovationRoutes');
app.use('/api/innovation', innovationRoutes);

const poetryRoutes = require('./routes/poetryRoutes');
app.use('/api/poetry', poetryRoutes);

const questionPaperRoutes = require("./routes/questionPaperRoutes");
app.use("/api/questionpapers", questionPaperRoutes);

const funRoutes = require('./routes/funRoutes');
app.use("/api/fun", funRoutes);

const artRoutes = require('./routes/artRoutes');
app.use("/api/art", artRoutes);

const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcement", announcementRoutes);

const achievementRoutes = require("./routes/achievementRoutes");
app.use("/api/achievement", achievementRoutes);

const opportunityRoutes = require("./routes/opportunityRoutes");
app.use("/api/opportunity", opportunityRoutes);



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
