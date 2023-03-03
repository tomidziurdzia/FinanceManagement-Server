import { Schema, model } from "mongoose";
import { TransactionProps } from "../interfaces/transaction.interface";

const transactionSchema = new Schema<TransactionProps>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense", "Transfer"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Transaction = model<TransactionProps>("Transaction", transactionSchema);
export default Transaction;
