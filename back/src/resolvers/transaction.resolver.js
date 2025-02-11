import {transactions} from '../data/data.js'
import {Transaction} from "../models/transaction.model.js";

export const transactionResolver =  {
    Query: {
        transactions: async (_, __, context) => {

            try {
                if(!context.getUser()) throw new Error("Unautorised")

                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({userId})

                return transactions;
            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error getting transaction")
            }

        },
        transaction: async (_, {transactionId}, context) => {
            try {
                if(!context.getUser()) throw new Error("Unautorised")

                const transaction = await Transaction.findById(transactionId);

                if(!transaction) throw new Error("Transaction not found")

                return transaction;
            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error getting transaction")
            }
        }
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try {

                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id,
                })
                await newTransaction.save()
                return newTransaction

            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error creating transaction")
            }
        },
        updateTransaction: async(_, {input}, context) => {
            try {
                if(!context.getUser()) throw new Error("Unautorised")

                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    input.id,
                    input,
                    {new: true}
                )

                if(!updatedTransaction) throw new Error("Transaction not found")

                return updatedTransaction

            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error updating transaction")
            }
        },
        deleteTransaction: async(_, {transactionId}, context) => {
            try {
                if(!context.getUser()) throw new Error("Unautorised")

                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)

                return deletedTransaction

            } catch (error) {
                console.log('Error: ', error)
                throw new Error(error.message || "internal server error deleting transaction")
            }
        },
    }
}