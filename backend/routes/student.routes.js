const express = require('express');
const { registerStudent, loginStudent } = require('../controllers/student.controller');

const router = express.Router();

// Register route
router.post('/register', registerStudent);

// Login route
router.post('/login', loginStudent);

module.exports = router;
