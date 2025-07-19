const express = require("express");
const {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel,
} = require("../controllers/expenseController");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protectRoute, addExpense);
router.get("/get", protectRoute, getAllExpenses);
router.delete("/:id", protectRoute, deleteExpense);
router.get("/downloadexcel", protectRoute, downloadExpenseExcel);

module.exports = router;
