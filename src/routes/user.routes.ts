import express from "express";
import {
  authenticateUser,
  createUser,
  confirmToken,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
  loginWithGoogle,
} from "../controllers/user.controller";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.post("/", createUser);
router.get("/confirm/:token", confirmToken);
router.post("/login", authenticateUser);
router.post("/google", loginWithGoogle);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);
router.get("/perfil", checkAuth, getUser);

export default router;
