import { Schema, model } from "mongoose";
import { AccountProps } from "../interfaces/account.interface";

const accountSchema = new Schema<AccountProps>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    total: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = model<AccountProps>("Account", accountSchema);

export default Category;
