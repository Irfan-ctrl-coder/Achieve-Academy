const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,   // Example: "Engineering", "Medical", "Foundation"
    required: true
  },
  duration: {
    type: String,   // Example: "6 months", "1 year"
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  syllabus: [
    {
      topic: { type: String, required: true },
      content: { type: String }
    }
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"   // linked teacher
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Course", courseSchema);
