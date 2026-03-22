import dotenv from "dotenv";
dotenv.config(); // <-- must run first
import express from "express";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import router from "./routes/billing.routes.js";
import billingRouter from "./routes/billing.routes.js";
import { stripWebhook } from "./controllers/stripWebhook.controller.js";

const app = express();

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripWebhook,
);
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://webaifrontend.onrender.com",
    credentials: true,
  }),
);


// --- DEBUG COOKIE ---
// app.get("/api/debug-cookie", (req, res) => {
//   console.log("Cookies received:", req.cookies); // should show { token: "..." }
//   res.json(req.cookies);
// });

//middleware  for http:localhost:8000/api/auth/google
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);
app.listen(port, () => {
  console.log("Server is started");
  connectDb();
});
