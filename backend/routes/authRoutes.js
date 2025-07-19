const user = require("../models/User");
const express = require("express");
const router = express.Router();


const {registerUser, loginUser, getUserProfile} = require("../controllers/authController");
const {protectRoute} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protectRoute, getUserProfile);
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({ imageUrl });
});

module.exports = router;
