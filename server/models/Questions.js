import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
  category: {
    type: String,
    trim: true,
  },
  timeEstimate: {
    type: String,
    trim: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;

