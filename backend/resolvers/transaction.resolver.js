import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try {
                if (!context.getUser()) {
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({ userId });
                return transactions;
            } catch (error) {
                console.error("Error in getting transactions:", err);
                throw new Error(err.message || "Error getting transactions")

            }
        },
        transaction: async (_, { transactionId },) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                console.error("Error getting transaction :", err);
                throw new Error("Error getting transaction");
            }
        },
        categoryStatistics: async (_, __, context) => {
            if (!context.getUser()) throw new Error("Unauthorized");

            const userId = context.getUser()._id;
            const transactions = await Transaction.find({ userId });
            const categoryMap = {};

            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            })

            return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }))
        }

    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.error("Error creating transaction :", err);
                throw new Error("Error creating transaction");
            }
        },
        updateTransaction: async (_, { input },) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true });
                return updatedTransaction;
            } catch (err) {
                console.error("Error updating transaction :", err);
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction: async (_, { transactionId }) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                console.error("Error deleting transaction :", err);
                throw new Error("Error deleting transaction");
            }
        }

    },
    Transaction: {
        user: async (parent) => {
            const userId = parent.userId;
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.error("Error in transaction.user resolver:", error);
                throw new Error(error.message || "Error getting user");
            }
        }
    }
};


export default transactionResolver;