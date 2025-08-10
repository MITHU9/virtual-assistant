import express from "express";
import {
  askToAssistant,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRoutes = express.Router();

userRoutes.get("/current", isAuth, getCurrentUser);
userRoutes.put("/update", isAuth, upload.single("assistantImage"), updateUser);
userRoutes.post("/ask", isAuth, askToAssistant);

export default userRoutes;
