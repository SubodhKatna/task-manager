// backend/routes/authRoutes.js
const express = require("express");

const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("./../controllers/authControllers");
const { protect } = require("./../middlewares/authMiddleware");  
const upload = require("../middlewares/uploaddMiddleware");
// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update Profile

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
});


module.exports = router;