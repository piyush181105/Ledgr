import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import * as XLSX from 'xlsx';
import { model } from "mongoose";
import Groq from "groq-sdk";




const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
//add expense
export async function addexpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newExpense.save()
        res.json({
            success: true,
            message: 'Expense added successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

// all expense
export async function getAllExpenses(req, res) {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json(expense);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

//update expense
export async function updateExpense(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount } = req.body;

    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.json({
            success: true,
            message: 'Expense updated successfully',
            data: updatedExpense
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }
}


//delete expense
export async function deleteExpense(req, res) {
    try {
        const expense = await expenseModel.findOneAndDelete({ _id: req.params.id });
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        return res.json({
            success: true,
            message: 'Expense deleted successfully',
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }

}

//download excel for expense

export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;
    try {
        const expense = (await expenseModel.find({ userId })).toSorted({ date: -1 });
        const plainData = expense.map(exp => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'expenseModel');
        XLSX.writeFile(workbook, "expense_details.xlsx");
        res.download("expense_details.xlsx");

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }


}

//to get owerview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = 'monthly' } = req.query;
        const { start, end } = getDateRange(range);
        const expense = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
        const numberOfTransactions = expense.length;
        const recentTransactions = expense.slice(0, 5);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }

}

export async function scanReceipt(req, res) {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Current working stable model as of April 30, 2026
    const modelId = "meta-llama/llama-4-scout-17b-16e-instruct"; 

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Extract receipt data into JSON: { \"amount\": number, \"date\": \"YYYY-MM-DD\", \"description\": \"string\", \"merchantName\": \"string\", \"category\": \"string\" }. Return ONLY valid JSON." 
            },
            { 
              type: "image_url", 
              image_url: { url: image } 
            }
          ],
        },
      ],
      model: modelId,
      // Ensures the output is strictly structured for JSON.parse
      response_format: { type: "json_object" } 
    });

    const content = chatCompletion.choices[0].message.content;
    const aiData = JSON.parse(content);

    res.status(200).json({ 
      success: true, 
      data: {
        amount: Number(aiData.amount) || 0,
        date: aiData.date || new Date().toISOString().split('T')[0],
        description: aiData.description || "Receipt Scan",
        merchantName: aiData.merchantName || "Unknown",
        category: aiData.category || "Other"
      }
    });

  } catch (error) {
    console.error("Scanner Error:", error.message);
    res.status(500).json({ success: false, message: "AI Error: " + error.message });
  }
}