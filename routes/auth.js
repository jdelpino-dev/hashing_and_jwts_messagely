import { default as Router } from "express";
import { loginUser, registerNewUser } from "../middleware/auth.js";

const router = new Router();

router.post("/login", loginUser);

router.post("/register", registerNewUser);

export default router;
