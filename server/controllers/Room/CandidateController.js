import Resume from "../../models/candidate/Resume.js";

export const getCandidateDetails = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const candidate = await Resume.findById(resumeId)
      .populate("user", "name email") 
      .select("user name email phone location jobRole profileSummary education experience skills certifications profilePhoto")

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
