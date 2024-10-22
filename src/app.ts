import dotenv from "dotenv";
import express from "express";
import _globals from "./config/_globals";
import validateJSON from "./middleware/app/validateJSON";
import appRouter from "./routers/_appRouter";

// Load environment variables
dotenv.config({ path: ".env" });

// Create an Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateJSON);

// App Router
app.use("/", appRouter);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
