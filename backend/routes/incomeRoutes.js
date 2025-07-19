const express = require("express");
const {
    addIncome,
    getAllIncomes,
    deleteIncome,
    downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protectRoute, addIncome);
router.get("/get", protectRoute, getAllIncomes);
router.delete("/:id", protectRoute, deleteIncome);
router.get("/downloadexcel", protectRoute, downloadIncomeExcel);

module.exports = router;
