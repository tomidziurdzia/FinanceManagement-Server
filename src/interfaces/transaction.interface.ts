import { UserProps } from "./user.interface";
import { CategoryProps } from "./category.interface";
import { AccountProps } from "./account.interface";

export interface TransactionProps {
  _id?: string;
  date: Date;
  description?: string;
  type: "Income" | "Expense";
  user: UserProps;
  category: CategoryProps;
  account: AccountProps;
  amount: number;
}
