// routes/teacher.routes.js
const express = require("express");
const { RegisterTeacher, LoginTeacher } = require("../controllers/teacher.controller");
const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

// Auth routes
router.post("/register", RegisterTeacher);
router.post("/login", LoginTeacher);

// Admin-only test route
router.get("/admin", protect, admin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
