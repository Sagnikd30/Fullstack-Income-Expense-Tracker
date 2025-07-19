const XLSX = require("xlsx");
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        const { icon, source, amount, date } = req.body;
        if(!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newIncome = await Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Get All Incomes Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income deleted successfully" });
    }catch (error) {
        console.error("Delete Income Error:", error);
        res.status(500).json({ message: "Internal server error" });
   }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        
        const data = incomes.map(income => ({
            Source: income.source,
            Amount: income.amount,
            Date: income.date.toISOString().split('T')[0],
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Incomes");
        XLSX.writeFile(wb, "Incomes.xlsx");
        res.download("Incomes.xlsx", (err) => {
            if (err) {
                console.error("Download Error:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    }catch (error) {
        console.error("Download Income Excel Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}