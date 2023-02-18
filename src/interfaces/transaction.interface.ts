import { UserProps } from "./user.interface";
import { CategoryProps } from "./category.interface";

export interface TransactionProps {
  _id?: string;
  name: string;
  type: "Income" | "Expenses";
  user: UserProps;
  category: CategoryProps;
  amount: number;
  description?: string;
}