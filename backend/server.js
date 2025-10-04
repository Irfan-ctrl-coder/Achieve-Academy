require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { default: helmet } = require('helmet');
const cors = require("cors");
const ratelimit = require('express-rate-limit');
const xss = require('xss');
const path = require('path'); // added to serve frontend

//routes 
const StudentRoutes = require('./routes/student.routes');
const TeacherRoutes = require('./routes/teacher.routes');
const CourseRoutes = require('./routes/course.routes');
const UserRoutes =  require('./routes/auth.routes');

// middlewares and protectors
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500", // frontend during dev
  credentials: false
}));

// limiter
const limiter = ratelimit({
    windowMs: 15*60*1000,
    max:100,
    message:"Too many requests from this Ip, please try again after 15 minutes",
    standardheaders:true,
    legacyHeaders:false,
});
app.use(limiter);

// sanitize inputs
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

// mount routes
app.use('/api/Students', StudentRoutes);
app.use('/api/Teachers', TeacherRoutes);
app.use('/api/Course', CourseRoutes);
app.use('/api/Users', UserRoutes);

// ------------------------------
// Serve frontend
// ------------------------------
// frontend folder is at root, one level above backend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Send index.html for all unmatched routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// connect to database and start server
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("connected to database");
    app.listen(process.env.PORT, ()=> {
        console.log(`server is running on port ${process.env.PORT}`);
    });
})
.catch(()=> {
    console.log("connection failed");
});

mongoose.set("strictPopulate", false);
