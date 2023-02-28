import { Schema, model } from "mongoose";
import { TransactionProps } from "../interfaces/transaction.interface";

const transactionSchema = new Schema<TransactionProps>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
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
