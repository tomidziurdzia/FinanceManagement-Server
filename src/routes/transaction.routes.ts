import express from "express";
import checkAuth from "../middleware/checkAuth";
import {
  getTransactions,
  createTransaction,
  getTransaction,
  editTransactions,
  deleteTransactions,
} from "../controllers/transaction.controller";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, getTransactions)
  .post(checkAuth, createTransaction);
router
  .route("/:id")
  .get(checkAuth, getTransaction)
  .put(checkAuth, editTransactions)
  .delete(checkAuth, deleteTransactions);

export default router;
