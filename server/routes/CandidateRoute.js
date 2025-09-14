import express from "express";
import { getPastInterviews,getUpcomingInterviews ,getDashboardStats  } from "../controllers/candidate/InterviewCaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: GET /api/interviews/past/:candidateId
router.get("/past/:candidateId", getPastInterviews);

// Stats for dashboard
router.get("/stats", protect, getDashboardStats);

// Upcoming interviews for dashboard
router.get("/upcoming", protect, getUpcomingInterviews);


export default router;
