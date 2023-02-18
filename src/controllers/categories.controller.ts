import { Request, Response } from "express";
import Category from "../models/Category";

import { JwtPayload } from "jsonwebtoken";

export interface RequestExt extends Request {
  user?: JwtPayload | { _id: string };
}

const createCategory = async (req: RequestExt, res: Response) => {
  const { name } = req.body;
  const categoryExist = await Category.findOne({ name });

  // Compruebo que ya no exista otra categoria con ese nombre
  if (categoryExist) {
    const error = new Error("Category already created");
    return res.status(400).json({ msg: error.message });
  }

  // Guardo la nueva categoria
  try {
    const newCategory = new Category(req.body);
    newCategory.user = req.user?._id;
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.log(error);
  }
};
const getCategory = async (req: Request, res: Response) => {};
const getCategories = async (req: Request, res: Response) => {};
const editCategory = async (req: Request, res: Response) => {};
const deleteCategory = async (req: Request, res: Response) => {};

export {
  createCategory,
  getCategory,
  getCategories,
  editCategory,
  deleteCategory,
};
