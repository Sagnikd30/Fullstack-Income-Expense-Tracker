const Income = require("../models/Income");
const Expense = require("../models/Expense");
const {isValidObjectId, Types} = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try{
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        
        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("Total Income:", {totalIncome, userId: isValidObjectId(userId)});

        // Fetch total expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //get income transactions in last 60 days
        const today = new Date();
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(today.getDate() - 60);

        const last60daysIncometransactions = await Income.find({
            userId,
            date: { $gte: sixtyDaysAgo }
        }).sort({ date: -1 });

        //get total income for last 60 days
        const incomeLast60days = last60daysIncometransactions.reduce(
           (sum, txn) => sum + (txn.amount || 0), 0
        ); 

        //get expense transactions in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const last30daysExpensetransactions = await Expense.find({
           userId,
           date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

       //get total expenses for last 30 days
       const expensesLast30days = last30daysExpensetransactions.reduce(
           (sum, txn) => sum + (txn.amount || 0), 0
       );

         //fetch last 5 transactions(income and expense)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date).slice(0, 5);

        res.status(200).json({
           totalBalance:
            (totalIncome[0]?.total || 0) -(totalExpenses[0]?.total || 0),
           totalIncome: totalIncome[0]?.total || 0,
           totalExpense: totalExpenses[0]?.total || 0,
           last30DaysExpenses:{
            total: expensesLast30days,
            transactions: last30daysExpensetransactions,
           },
           last60DaysIncome:{
            total: incomeLast60days,
            transactions: last60daysIncometransactions, 
           },
           recentTransactions: lastTransactions,
        });

       

    }catch (error) {
        console.error("Get Dashboard Data Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}