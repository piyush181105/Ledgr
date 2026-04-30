import React from 'react'
import { modalStyles } from '../assets/dummyStyles'
import { X } from 'lucide-react';
import { ReceiptScanner } from './ReciptScanner';

const AddTransactionModal = ({
    showModal,
    setShowModal,
    newTransaction,
    setNewTransaction,
    handleAddTransaction,
    type = "both",
    title = "Add New Transaction",
    buttonText = "Add Transaction",
    categories = [
        "Food", "Housing", "Transport", "Shopping", "Entertainment",
        "Utilities", "Healthcare", "Salary", "Freelance",
        "Investments", "Bonus", "Other",
    ],
    color = "teal"
}) => {
    if (!showModal) return null;

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    const colorClass = modalStyles.colorClasses[color];

    const handleScanComplete = (aiData) => {
        // Find if the AI suggested category matches one of yours (case insensitive)
        const matchedCategory = categories.find(
            (cat) => cat.toLowerCase() === aiData.category?.toLowerCase()
        );

        setNewTransaction((prev) => ({
            ...prev,
            description: aiData.description || prev.description,
            amount: aiData.amount || prev.amount,
            // Fallback to "Other" or existing if no match found
            category: matchedCategory || prev.category || "Other", 
            date: aiData.date ? new Date(aiData.date).toISOString().split('T')[0] : prev.date
        }));
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modalContainer}>
                <div className={modalStyles.modalHeader}>
                    <h3 className={modalStyles.modalTitle}> {title} </h3>
                    <button onClick={() => setShowModal(false)} className={modalStyles.closeButton}>
                        <X size={24} />
                    </button>
                </div>
                
                {/* 1. Ensure the form wrapper is clean */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTransaction();
                }}>

                    <ReceiptScanner onScanComplete={handleScanComplete}/>

                    <div className={modalStyles.form}>
                        <div>
                            {/* Fixed Typo: lable -> label */}
                            <label className={modalStyles.label}>Description </label>
                            <input 
                                type="text" 
                                value={newTransaction.description || ""} 
                                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))} 
                                className={modalStyles.input(colorClass.ring)}
                                placeholder={type === "both" ? "Salary, Funds, etc." : "Groceries, Rent, etc"} 
                                required
                            />
                        </div>

                        <div>
                            <label className={modalStyles.label}>Amount </label>
                            <input 
                                type="number" 
                                step="0.01" // Allows decimals for receipts
                                value={newTransaction.amount || ""} 
                                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))} 
                                className={modalStyles.input(colorClass.ring)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {type === "both" && (
                            <div>
                                <label className={modalStyles.label}>Type</label>
                                <div className={modalStyles.typeButtonContainer}>
                                    <button
                                        type="button"
                                        className={modalStyles.typeButton(
                                            newTransaction.type === 'income',
                                            modalStyles.colorClasses.teal.typeButtonSelected
                                        )}
                                        onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                                    >Income</button>
                                    <button
                                        type="button"
                                        className={modalStyles.typeButton(
                                            newTransaction.type === 'expense',
                                            modalStyles.colorClasses.orange.typeButtonSelected
                                        )}
                                        onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                                    >Expense</button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={modalStyles.label}>Category</label>
                            <select 
                                value={newTransaction.category || "Other"}
                                onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                                className={modalStyles.input(colorClass.ring)}
                            >
                                {categories.map((cat) => (
                                    <option value={cat} key={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={modalStyles.label}>Date</label>
                            <input 
                                type="date" 
                                value={newTransaction.date || currentDate} 
                                onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))} 
                                className={modalStyles.input(colorClass.ring)} 
                                max={currentDate} 
                                required
                            />
                        </div>

                        <button type="submit" className={modalStyles.submitButton(colorClass.button)}>
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default AddTransactionModal;