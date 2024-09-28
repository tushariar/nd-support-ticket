import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import _globals from "./config/_globals";
import validateJSON from "./middleware/app/validateJSON";
import appRouter from "./routers/_appRouter";

// Load environment variables
dotenv.config(
  process.env.NODE_ENV === "production"
    ? { path: ".env.production" }
    : { path: ".env.development" }
);

// Create an Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(validateJSON);

// App Router
app.use("/", appRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
  console.log(`MODE: ${process.env.MODE} ✨`);

  _globals?.FOLDERS?.forEach((DIR) => {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR);
    }
  });
});
