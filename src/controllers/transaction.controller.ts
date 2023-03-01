import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Transaction from "../models/Transaction";
import Account from "../models/Account";
import Category from "../models/Category";

export interface RequestExt extends Request {
  user?: JwtPayload | { _id: string };
}

const getTransactions = async (req: RequestExt, res: Response) => {
  const transactions = await Transaction.find()
    .populate({ path: "category", select: "name" })
    .populate({ path: "account", select: "name" })
    .where("user")
    .equals(req.user);

  res.json(transactions);
};

const createTransaction = async (req: RequestExt, res: Response) => {
  const { description, type, amount, account, category } = req.body;

  const accountExist = await Account.findById(account);
  const categoryExist = await Category.findById(category);

  if (!accountExist) {
    const error = new Error("The account does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!categoryExist) {
    const error = new Error("The category does not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (!description) {
    const error = new Error("Description is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!type) {
    const error = new Error("Type is required");
    return res.status(404).json({ msg: error.message });
  }
  if (!amount) {
    const error = new Error("Amount is required");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const newTransaction = new Transaction(req.body);
    console.log(newTransaction);
    newTransaction.user = req.user?._id;
    accountExist!.transactions.push(newTransaction._id as any);
    await accountExist!.save();

    categoryExist!.transactions.push(newTransaction._id as any);
    await categoryExist!.save();

    await newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    console.log(error);
  }
};

const getTransaction = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const transaction = await Transaction.findById(id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "account", select: "name" });
    //Verifico que la categoria sea del usuario logueado
    if (transaction!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Transaction does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    res.json(transaction);
  } catch (error: any) {
    error = new Error("Transaction has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

const editTransactions = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const transaction = await Transaction.findById(id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "account", select: "name" });

    //Verifico que la categoria sea del usuario logueado
    if (transaction!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Transaction does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    if (!transaction) {
      const error = new Error("The transaction does not exist");
      return res.status(400).json({ msg: error.message });
    }

    transaction.description = req.body.description || transaction.description;
    transaction.type = req.body.type || transaction.type;
    transaction.category = req.body.category || transaction.category;
    transaction.account = req.body.account || transaction.account;
    transaction.amount = req.body.amount || transaction.amount;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.log(error);
  }
};

const deleteTransactions = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const transaction = await Transaction.findById(id);
    //Verifico que la categoria sea del usuario logueado
    if (transaction!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Transaction does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    await transaction!.deleteOne();
    res.json({ msg: "Transaction successfully eliminated" });
  } catch (error: any) {
    error = new Error("Transaction has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  getTransactions,
  createTransaction,
  getTransaction,
  editTransactions,
  deleteTransactions,
};
