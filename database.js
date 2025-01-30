import mongoose from "mongoose";
import { config } from "dotenv";

config({
  path: ".env",
});

export const connectDB = mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "spyne",
  })
  .then(c => console.log(`db connectded at ${c.connection.name}`))
  .catch(e => {
    console.log(`Error on databse connection`, e);
  });
