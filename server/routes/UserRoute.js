import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/authController.js"; 

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected/Admin routes
router.get("/", getUsers);         
router.get("/:id", getUserById);   
router.delete("/:id", deleteUser);  

export default router;
