const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher.model");

// Protect middleware (checks token)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      // ✅ split(" ")[1] not split("")
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded contains { teacherId: teacher._id }
      req.user = await Teacher.findById(decoded.teacherId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization failed" });
  }
};

// Admin middleware (checks role)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
