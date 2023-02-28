import { CategoryProps } from "../interfaces/category.interface";
import { Schema, model } from "mongoose";

const categorySchema = new Schema<CategoryProps>(
  {
    name: {
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
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    color: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = model<CategoryProps>("Category", categorySchema);
export default Category;
