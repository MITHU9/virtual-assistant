import express from "express";
import dotenv from "dotenv";
dotenv.config({
  quiet: true,
});
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// app.get("/", async (req, res) => {
//   let prompt = req.query.prompt || "who are you?";
//   let data = await geminiResponse(prompt);
//   res.json(data);
// });

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
