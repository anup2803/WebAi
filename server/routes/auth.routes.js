import express from "express";
import { googleAuth, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

//collect the data from the user
authRouter.post("/google", googleAuth);

//logout
authRouter.get("/logout", logOut);

export default authRouter;
