const express = require("express");
const { RegisterTeacher, LoginTeacher } = require("../controllers/teacher.controller");

const router = express.Router();

// Teacher signup
router.post("/register", RegisterTeacher);

// Teacher login
router.post("/login", LoginTeacher);

module.exports = router;
