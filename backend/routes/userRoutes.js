const express = require("express");
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { deleteUser, getUserById, getUsers } = require("../controllers/userControllers");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.delete("/:id", protect, adminOnly); // Delete a user (Admin only)

module.exports = router;