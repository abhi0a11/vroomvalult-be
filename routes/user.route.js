import express from "express";
import {
  getAuthStatus,
  loginUserViaEmail,
  logout,
  registerUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserViaEmail);
router.get("/authorize", getAuthStatus);
router.get("/logout", logout);

export default router;
