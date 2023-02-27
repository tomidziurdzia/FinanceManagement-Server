import { UserProps } from "./user.interface";
import { TransactionProps } from "./transaction.interface";
export interface AccountProps {
  _id?: string;
  name: string;
  total: number;
  user: UserProps;
  transactions: TransactionProps[];
}
