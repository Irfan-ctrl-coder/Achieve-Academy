require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { default: helmet } = require('helmet');
const cors = require("cors");
const ratelimit = require('express-rate-limit');
const xss = require('xss');
const path = require('path');

// Routes
const StudentRoutes = require('./routes/student.routes');
const TeacherRoutes = require('./routes/teacher.routes');
const CourseRoutes = require('./routes/course.routes');
const UserRoutes = require('./routes/auth.routes');

// Middlewares and protectors
const app = express();
app.use(express.json());

// CORS - temporarily allowing all origins for dev
app.use(cors({
  origin: "*",
  credentials: false
}));

// Rate limiter
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Sanitize inputs
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// Mount API routes
app.use('/api/Students', StudentRoutes);
app.use('/api/Teachers', TeacherRoutes);
app.use('/api/Course', CourseRoutes);
app.use('/api/Users', UserRoutes);

// Serve frontend (static files)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// SPA fallback for all non-API routes (fix for Node 22+ / Render)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Optional mongoose config
mongoose.set("strictPopulate", false);
