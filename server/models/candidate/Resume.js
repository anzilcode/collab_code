import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    jobRole: { type: String, required: true, trim: true },
    profileSummary: { type: String, trim: true },
    education: { type: String, trim: true },
    experience: { type: String, trim: true },
    skills: { type: String, trim: true },
    certifications: { type: String, trim: true },
    profilePhoto: { type: String }, 
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
