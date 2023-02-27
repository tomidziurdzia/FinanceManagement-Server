import { Request, Response } from "express";
import Account from "../models/Account";
import { JwtPayload } from "jsonwebtoken";

export interface RequestExt extends Request {
  user?: JwtPayload | { _id: string };
}

const getAccounts = async (req: RequestExt, res: Response) => {
  const accounts = await Account.find().where("user").equals(req.user);
  res.json(accounts);
};

const createAccount = async (req: RequestExt, res: Response) => {
  const { name } = req.body;
  const accountExist = await Account.findOne({ name })
    .where("user")
    .equals(req.user);

  // Compruebo que ya no exista otra cuenta con ese nombre
  if (accountExist) {
    const error = new Error("Account already created");
    return res.status(400).json({ msg: error.message });
  }

  // Guardo la nueva Cuenta
  try {
    const newAccount = new Account(req.body);
    newAccount.user = req.user?._id;
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    console.log(error);
  }
};

const getAccount = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const account = await Account.findById(id);
    //Verifico que la cuenta sea del usuario logueado
    if (account!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Account does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    res.json(account);
  } catch (error: any) {
    error = new Error("Account has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

const editAccount = async (req: RequestExt, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const accountExist = await Account.findOne({ name })
    .where("user")
    .equals(req.user);

  // Compruebo que ya no exista otra cuenta con ese nombre
  if (accountExist) {
    const error = new Error("Account already created");
    return res.status(400).json({ msg: error.message });
  }

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const account = await Account.findById(id);
    //Verifico que la cuenta sea del usuario logueado
    if (account!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Account does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    account!.name = req.body.name || account!.name;

    await account!.save();
    res.json(account);
  } catch (error: any) {
    error = new Error("Account has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

const deleteAccount = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const account = await Account.findById(id);
    //Verifico que la cuenta sea del usuario logueado
    if (account!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Account does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    // Verifico que la cuenta no tenga ninguna transaccion
    if (account?.transactions.length !== 0) {
      const error = new Error(
        "You cannot delete this account. It has transactions done."
      );
      return res.status(400).json({ msg: error.message });
    }

    await account.deleteOne();
    res.json({ msg: "Account successfully eliminated" });
  } catch (error: any) {
    error = new Error("Account has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

export { getAccounts, createAccount, getAccount, editAccount, deleteAccount };
