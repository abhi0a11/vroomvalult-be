import express from "express";
import { connectDB } from "./database.js";
import cookieParser from "cookie-parser";
import { Cron_keep_server_alive } from "./utilities/cron.js";
import cron from "node-cron";
import userRoutes from "./routes/user.route.js";
import carRoutes from "./routes/product.route.js";
import cors from "cors";
import { errorMiddleware } from "./utilities/error.js";
import { config } from "dotenv";

config({
  path: ".env",
});

const app = express();
connectDB;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Specific domain
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allowed HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
  next();
});
// api which does nothing
app.get("/", (req, res) => {
  res.status(201).json({ message: "Server is live!" });
});
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/cars", carRoutes);

//Keeps server alive by making request very 14 minutes because of free hosting server sleeps after 15 minutes of inactivity
cron.schedule("*/14 * * * *", Cron_keep_server_alive);

app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app is runnig on port ${port}`);
});
