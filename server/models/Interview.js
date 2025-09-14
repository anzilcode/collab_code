import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume", 
    required: true,
  },
  interviewerId: {                    
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",                       
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Technical", "Behavioral", "Cultural Fit", "Final Round", "Phone Screen"],
    default: "Technical",
  },
  duration: {
    type: String,
    default: "60 min",
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Interview = mongoose.model("Interview", interviewSchema);
