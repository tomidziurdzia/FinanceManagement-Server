import { TransactionProps } from "./transaction.interface";
import { UserProps } from "./user.interface";

export interface CategoryProps {
  _id?: string;
  name: string;
  type: "Income" | "Expenses";
  user: UserProps;
  transactions: TransactionProps[];
}
