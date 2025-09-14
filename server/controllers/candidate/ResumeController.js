import Resume from "../../models/candidate/Resume.js";
import cloudinary from "../../config/cloudinary.js";

export const upsertResume = async (req, res) => {
  try {

    console.log("req.file:", req.file);

    const {
      name, email, phone, location,
      jobRole, profileSummary, education,
      experience, skills, certifications
    } = req.body;

    let profilePhoto;

    // If a new photo is uploaded, push it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "resumes/profile_photos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePhoto = result.secure_url;
    }

    let resume = await Resume.findOne({ user: req.user._id });

    if (resume) {
      // Update existing resume
      resume.name = name || resume.name;
      resume.email = email || resume.email;
      resume.phone = phone || resume.phone;
      resume.location = location || resume.location;
      resume.jobRole = jobRole || resume.jobRole;
      resume.profileSummary = profileSummary || resume.profileSummary;
      resume.education = education || resume.education;
      resume.experience = experience || resume.experience;
      resume.skills = skills || resume.skills;
      resume.certifications = certifications || resume.certifications;
      if (profilePhoto) resume.profilePhoto = profilePhoto;

      await resume.save();
      return res.status(200).json({ message: "Resume updated successfully", resume });
    } else {
      const newResume = new Resume({
        user: req.user._id,
        name,
        email,
        phone,
        location,
        jobRole,
        profileSummary,
        education,
        experience,
        skills,
        certifications,
        profilePhoto,
      });

      await newResume.save();
      return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    }
  } catch (error) {
    console.error("Error in upsertResume:", error);
    res.status(500).json({ error: "Server error while saving resume" });
  }
};


// Get My Resume
export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "No resume found for this user" });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error in getMyResume:", error);
    res.status(500).json({ error: "Server error while fetching resume" });
  }
};

// Get All Resumes (Admin or recruiter use case)
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate("user", "name email");
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error in getAllResumes:", error);
    res.status(500).json({ error: "Server error while fetching resumes" });
  }
};
