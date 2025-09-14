import express from "express";
import {
  getQuestions,
  createQuestion,
  deleteQuestion,
} from "../controllers/Interviewer/Question.js";
import { protect} from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.use(protect);  

router.get("/",  getQuestions);

router.post("/",  createQuestion);

router.delete("/:id", deleteQuestion);

export default router;
