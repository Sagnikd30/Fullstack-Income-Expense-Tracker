const XLSX = require("xlsx");
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try{
        const { icon, category, amount, date } = req.body;
        if(!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newExpense = await Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Get All Expenses Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });
    }catch (error) {
        console.error("Delete Expense Error:", error);
        res.status(500).json({ message: "Internal server error" });
   }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date.toISOString().split('T')[0],
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "Expenses.xlsx");
        res.download("Expenses.xlsx", (err) => {
            if (err) {
                console.error("Download Error:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    }catch (error) {
        console.error("Download Expense Excel Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}