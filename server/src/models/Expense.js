import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify the type (income/expense)'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Bills', 'Travel', 'Shopping', 'Entertainment', 'Health', 'Salary', 'Other'],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please specify the payment method'],
    enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
