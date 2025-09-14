import express from "express";
import upload from "../middleware/multer.js";
import { upsertResume, getMyResume, getAllResumes } from "../controllers/candidate/ResumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("profilePhoto"), upsertResume);

router.get("/my", protect, getMyResume);

router.get("/", protect, getAllResumes);

export default router;
