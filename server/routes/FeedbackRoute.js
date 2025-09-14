import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addOrUpdateFeedback, getFeedbackByInterview } from "../controllers/FeedbackController.js";

const router = express.Router();


router.post("/interview/:interviewId", protect, addOrUpdateFeedback);

router.get("/interview/:interviewId", protect, getFeedbackByInterview);

export default router;
