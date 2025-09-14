import mongoose from "mongoose";

const interviewFeedbackSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    feedbackText: {
      type: String,
      maxlength: 2000,
    },
    decision: {
      type: String,
      enum: ["selected", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewFeedback", interviewFeedbackSchema);
