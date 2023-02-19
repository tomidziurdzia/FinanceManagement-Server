import { Request, Response } from "express";
import Category from "../models/Category";

import { JwtPayload } from "jsonwebtoken";
import { CategoryProps } from "../interfaces/category.interface";

export interface RequestExt extends Request {
  user?: JwtPayload | { _id: string };
}

const getCategories = async (req: RequestExt, res: Response) => {
  const categories = await Category.find().where("user").equals(req.user);
  console.log(req.user);
  res.json(categories);
};

const createCategory = async (req: RequestExt, res: Response) => {
  const { name } = req.body;
  const categoryExist = await Category.findOne({ name })
    .where("user")
    .equals(req.user);

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
const getCategory = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const category = await Category.findById(id);
    //Verifico que la categoria sea del usuario logueado
    if (category!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Category does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    res.json(category);
  } catch (error: any) {
    error = new Error("Category has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

const editCategory = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const category = await Category.findById(id);
    //Verifico que la categoria sea del usuario logueado
    if (category!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Category does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    category!.name = req.body.name || category!.name;
    category!.type = req.body.type || category!.type;

    await category!.save();
    res.json(category);
  } catch (error: any) {
    error = new Error("Category has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

const deleteCategory = async (req: RequestExt, res: Response) => {
  const { id } = req.params;

  //Verifico que el id tenga la longitud correcta
  if (id.length !== 24) {
    const error = new Error("Invalid Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const category = await Category.findById(id);
    //Verifico que la categoria sea del usuario logueado
    if (category!.user?.toString() !== req.user?._id.toString()) {
      const error = new Error("Category does not belong to user");
      return res.status(400).json({ msg: error.message });
    }

    // Verifico que la caregoria no tenga ninguna transaccion
    if (category?.transactions.length !== 0) {
      const error = new Error(
        "You cannot delete this category. It has transactions done."
      );
      return res.status(400).json({ msg: error.message });
    }

    await category.deleteOne();
    res.json({ msg: "Category successfully eliminated" });
  } catch (error: any) {
    error = new Error("Category has not been found");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  createCategory,
  getCategory,
  getCategories,
  editCategory,
  deleteCategory,
};
