import express from "express";
import { connectDB } from "./database.js";
import cookieParser from "cookie-parser";
import { Cron_keep_server_alive } from "./utilities/cron.js";
import cron from "node-cron";
import userRoutes from "./routes/user.route.js";
import carRoutes from "./routes/product.route.js";
import cors from "cors";
import { errorMiddleware } from "./utilities/error.js";

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
