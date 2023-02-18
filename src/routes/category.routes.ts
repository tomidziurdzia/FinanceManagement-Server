import express from "express";
import checkAuth from "../middleware/checkAuth";
import {
  createCategory,
  getCategory,
  getCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categories.controller";

const router = express.Router();

router.route("/").get(checkAuth, getCategories).post(checkAuth, createCategory);
router
  .route("/:id")
  .get(checkAuth, getCategory)
  .put(checkAuth, editCategory)
  .delete(checkAuth, deleteCategory);

export default router;
