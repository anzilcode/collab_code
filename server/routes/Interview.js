import express from "express";
import { 
  scheduleInterview, 
  getAllInterviews, 
  getInterviewsByCandidate, 
  getInterviewsByInterviewer ,
  updateInterview,
  deleteInterview,
  getMyInterviews
} from "../controllers/InterviewController.js";
import { protect as authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/schedule", scheduleInterview);
router.get("/all", getAllInterviews);
router.get("/candidate/:id", getInterviewsByCandidate);
router.get("/interviewer/:name", getInterviewsByInterviewer);
router.put("/update/:id",authMiddleware, updateInterview);
router.delete("/delete/:id",authMiddleware, deleteInterview);
router.get("/my", authMiddleware, getMyInterviews);


export default router;
