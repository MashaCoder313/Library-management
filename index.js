import express from "express";
const app = express();
import "./configs/db.js";
import dotenv from "dotenv";
import userRouter from "./routers/user.js";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;
app.use("/users/", userRouter);

app.listen(PORT, () => {
  console.log(`Server Runing on http://localhost:${PORT}`);
});
