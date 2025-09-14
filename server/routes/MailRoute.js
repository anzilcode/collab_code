import express from "express";
import { sendInterviewInvite } from "../Util/nodeMailer.js"; 
import {Interview} from "../models/Interview.js"

const router = express.Router();

router.post("/invite/:interviewId", async (req, res) => {
  try {
    const { interviewId } = req.params;


    const interview = await Interview.findById(interviewId).populate("candidateId", "name email");
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const candidateEmail = interview.candidateId.email;
    const candidateName = interview.candidateId.name;
    const roomId = interview.roomId;
    const interviewTime = `${interview.date} ${interview.time}`;

    await sendInterviewInvite({ to: candidateEmail, candidateName, roomId, interviewTime });

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending invitation", error: err.message });
  }
});

export default router;
