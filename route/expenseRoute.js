import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addexpense, deleteExpense, downloadExpenseExcel, getAllExpenses, getExpenseOverview, updateExpense, scanReceipt } from "../controllers/expenseController.js";


const expenseRouter = express.Router();
expenseRouter.post("/add",authMiddleware, addexpense);
expenseRouter.get("/get",authMiddleware, getAllExpenses);

expenseRouter.put("/update/:id",authMiddleware, updateExpense);
expenseRouter.get("/downloadexcel",authMiddleware, downloadExpenseExcel);

expenseRouter.delete("/delete/:id",authMiddleware, deleteExpense);
expenseRouter.get("/overview",authMiddleware,getExpenseOverview);

expenseRouter.post("/scan", authMiddleware, scanReceipt);

export default expenseRouter;