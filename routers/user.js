import express from "express";
import { register } from "../controllers/user.js";

const userRouter = express();

userRouter.post("/register", register);

export default userRouter;
