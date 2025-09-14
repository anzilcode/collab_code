import express from "express";
import { getCandidateDetails } from "../controllers/Room/CandidateController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.get("/:resumeId", protect, getCandidateDetails);

export default router;
