import mongoose from 'mongoose';
import { Interview } from "../../models/Interview.js";
import FeedbackModel from '../../models/FeedbackModel.js';
import Resume from '../../models/candidate/Resume.js';
import User from '../../models/Auth.js'

export const getPastInterviews = async (req, res) => {
  try {
    const userId = req.params.candidateId; 
    console.log("Candidate User ID from params:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Candidate ID missing" });
    }

    const candidateObjectId = new mongoose.Types.ObjectId(userId);

    const resumes = await Resume.find({ user: candidateObjectId });
    console.log("Resumes found:", resumes);

    if (resumes.length === 0) return res.status(200).json([]);

    const resumeIds = resumes.map(r => r._id);
    console.log("Resume IDs:", resumeIds);

    const interviews = await Interview.find({ candidateId: { $in: resumeIds } })
      .populate("interviewerId", "name")
      .sort({ date: -1, time: -1 });
    console.log("Interviews found:", interviews);

    const feedbacks = await FeedbackModel.find({ candidateId: { $in: resumeIds } });
    console.log("Feedbacks found:", feedbacks);

    const mergedData = interviews.map(interview => {
      const feedback = feedbacks.find(
        fb => fb.interviewId.toString() === interview._id.toString()
      );

      return {
        _id: interview._id,
        role: interview.type,
        date: interview.date,
        time: interview.time,
        duration: interview.duration,
        company: interview.companyName,
        location: interview.location,
        status: interview.status,
        roomId: interview.roomId,
        notes: interview.notes,
        interviewer: interview.interviewerId ? { name: interview.interviewerId.name } : null,
        feedback: feedback
          ? {
              rating: feedback.rating,
              feedbackText: feedback.feedbackText,
              decision: feedback.decision,
            }
          : null,
      };
    });

    console.log("Merged Data:", mergedData);
    res.status(200).json(mergedData);

  } catch (error) {
    console.error("Error fetching past interviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.json({
        upcomingInterviews: 0,
        completedInterviews: 0,
        profileStrength: "0%",
      });
    }

    const scheduledInterviews = await Interview.find({
      candidateId: resume._id,
      status: "scheduled",
    });

    const now = new Date();
    const upcomingInterviews = scheduledInterviews.filter((interview) => {
      const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
      const durationMatch = interview.duration.match(/\d+/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 60;

      const interviewEnd = new Date(
        interviewDateTime.getTime() + durationMinutes * 60000
      );

      return interviewEnd > now;
    }).length;

    const completedInterviews = await Interview.countDocuments({
      candidateId: resume._id,
      status: "completed",
    });

    const resumeObj = resume.toObject();
    const systemFields = ["_id", "user", "createdAt", "updatedAt", "__v"];
    const realFields = Object.keys(resumeObj).filter(
      (key) => !systemFields.includes(key)
    );

    const filledFields = realFields.filter((field) => resumeObj[field]).length;
    const profileStrength =
      Math.round((filledFields / realFields.length) * 100) + "%";

    res.json({ upcomingInterviews, completedInterviews, profileStrength });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



//   try {
//     const userId = req.user._id;

//     // find resume for this user
//     const resume = await Resume.findOne({ user: userId });
//     if (!resume) {
//       return res.json([]); // no resume = no interviews
//     }

//     const interviews = await Interview.find({ candidateId: resume._id })
//       .populate("interviewerId", "name email")
//       .sort({ date: 1, time: 1 });

//     const response = interviews.map(interview => ({
//       role: interview.type,
//       date: interview.date,
//       time: interview.time,
//       duration: interview.duration,
//       status: interview.status,
//       companyName: interview.companyName,
//       location: interview.location,
//       interviewerName: interview.interviewerId?.name,
//       roomId: interview.roomId,
//       notes: interview.notes,
//     }));

//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const getUpcomingInterviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.json([]);
    }

    const interviews = await Interview.find({
      candidateId: resume._id,
      status: "scheduled",
    })
      .populate("interviewerId", "name email")
      .sort({ date: 1, time: 1 });

    const now = new Date();


    const response = interviews
      .filter((interview) => {
        const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
        const durationMatch = interview.duration.match(/\d+/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 60;

        const interviewEnd = new Date(
          interviewDateTime.getTime() + durationMinutes * 60000
        );

        return interviewEnd > now; 
      })
      .map((interview) => ({
        role: interview.type,
        date: interview.date,
        time: interview.time,
        duration: interview.duration,
        status: interview.status,
        companyName: interview.companyName,
        location: interview.location,
        interviewerName: interview.interviewerId?.name || "N/A",
        roomId: interview.roomId,
        notes: interview.notes,
        candidateId: interview.candidateId._id
      }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
