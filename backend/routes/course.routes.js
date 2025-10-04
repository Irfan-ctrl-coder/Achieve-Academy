const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} = require("../controllers/course.controller");

const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

// Public (students, teachers, admins can see courses)
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Protected (only logged in teachers/admins can create/update/delete)
router.post("/", protect, admin, createCourse);
router.put("/:id", protect, admin, updateCourseById);
router.delete("/:id", protect, admin, deleteCourseById);

module.exports = router;
