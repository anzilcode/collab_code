import { Interview } from "../models/Interview.js";
import Resume from "../models/candidate/Resume.js";


export const scheduleInterview = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { candidateId, date, time, type, companyName, location, roomId, notes } = req.body;

    const interviewerId = req.body.interviewerId || req.user?._id;

    if (!candidateId || !interviewerId) {
      return res.status(400).json({ error: "Candidate and interviewer are required" });
    }

    const interview = new Interview({
      candidateId,
      interviewerId,
      date,
      time,
      type,
      companyName,
      location,
      roomId,
      notes: notes || "",
    });

    await interview.save();

  const populatedInterview = await Interview.findById(interview._id)
  .populate({
    path: "candidateId",
    model: "Resume",
    select: "name email phone location jobRole profileSummary education experience skills certifications profilePhoto createdAt updatedAt"
  });


    res.status(201).json({ interview: populatedInterview });
  } catch (err) {
    console.error("Schedule interview error:", err);
    res.status(400).json({ error: err.message });
  }
};


// Get only the logged-in interviewers interviews
export const getMyInterviews = async (req, res) => {
  try {
    const interviewerId = req.user._id; 
    const interviews = await Interview.find({ interviewerId })
      .populate("candidateId");
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get all interviews (Admin)
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidateId"); // fetch only needed fields
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get interviews by candidate
export const getInterviewsByCandidate = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidateId: req.params.id })
      .populate("candidateId"); 

    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get interviews by interviewer
export const getInterviewsByInterviewer = async (req, res) => {
  try {
    const interviews = await Interview.find({ interviewer: req.params.name });
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update interview (status, feedback, rating, etc.)
export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (
      req.user.role === "interviewer" &&
      interview.interviewerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You are not allowed to update this interview" });
    }

    // Update interview
    await Interview.findByIdAndUpdate(id, req.body, { new: true });

    const updatedPopulated = await Interview.findById(id).populate({
      path: "candidateId",
      select: "name profilePhoto jobRole email phone location profileSummary education experience skills certifications createdAt updatedAt"
    });

    res.status(200).json({ message: "Interview updated successfully", interview: updatedPopulated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};




// Delete interview
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for ID:", id);

    // Find the interview first
    const interview = await Interview.findById(id);
    if (!interview) {
      console.log("Interview not found in DB");
      return res.status(404).json({ message: "Interview not found" });
    }

    console.log("Interview found:", interview);

    // Check ownership
    console.log("Requester role:", req.user.role, "InterviewerId:", interview.interviewerId.toString(), "Req.user._id:", req.user._id.toString());
    if (
      req.user.role === "interviewer" &&
      interview.interviewerId.toString() !== req.user._id.toString()
    ) {
      console.log("Ownership check failed");
      return res.status(403).json({ message: "You are not allowed to delete this interview" });
    }

    // Delete it
    await Interview.findByIdAndDelete(id);
    console.log("Interview deleted successfully");
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.error("Delete interview error:", err);
    res.status(500).json({ error: err.message });
  }
};




