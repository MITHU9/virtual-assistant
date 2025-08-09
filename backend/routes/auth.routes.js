import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
