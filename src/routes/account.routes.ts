import express from "express";
import checkAuth from "../middleware/checkAuth";
import {
  getAccounts,
  createAccount,
  getAccount,
  editAccount,
  deleteAccount,
} from "../controllers/account.controller";

const router = express.Router();

router.route("/").get(checkAuth, getAccounts).post(checkAuth, createAccount);
router
  .route("/:id")
  .get(checkAuth, getAccount)
  .put(checkAuth, editAccount)
  .delete(checkAuth, deleteAccount);

export default router;
