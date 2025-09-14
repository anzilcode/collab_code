import { Interview } from "../models/Interview.js";

import InterviewFeedback from "../models/FeedbackModel.js";

export const addOrUpdateFeedback = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { rating, decision, feedbackText } = req.body;

    console.log("Received interviewId param:", interviewId);

    // Find interview
    const interview = await Interview.findById(interviewId);

    console.log("Interview found:", interview);

    if (!interview) return res.status(404).json({ message: "Interview not found" });

    // Only the interviewer who scheduled AND completed can add/update feedback
    if (
      req.user.role !== "interviewer" ||
      interview.interviewerId.toString() !== req.user._id.toString() ||
      interview.status !== "completed"
    ) {
      return res.status(403).json({ message: "You cannot give feedback for this interview" });
    }

    // Check if feedback already exists
    let feedback = await InterviewFeedback.findOne({ interviewId: interviewId });
    if (feedback) {
      // Update existing
      feedback.rating = rating;
      feedback.decision = decision;
      feedback.feedbackText = feedbackText;
      await feedback.save();
    } else {
      // Create new
      feedback = await InterviewFeedback.create({
        interviewId: interviewId,
        candidateId: interview.candidateId,
        interviewerId: req.user._id,
        rating,
        decision,
        feedbackText,
      });
    }

    res.status(200).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const getFeedbackByInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const feedback = await InterviewFeedback.findOne({ interviewId: interviewId })
      .populate("interviewerId", "name email")
      .populate("candidateId", "name email");

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    res.status(200).json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
