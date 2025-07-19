const express = require("express");
const {protectRoute} = require("../middleware/authMiddleware");
const {getDashboardData} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", protectRoute, getDashboardData);

module.exports = router;
