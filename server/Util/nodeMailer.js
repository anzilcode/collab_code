import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInterviewInvite = async ({ to, candidateName, roomId, interviewTime }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Interview Invitation",
      html: `
        <div>
          <h2>Hello ${candidateName},</h2>
          <p>Your interview is scheduled at <strong>${interviewTime}</strong>.</p>
          <p>Join the room using this link:</p>
          <a href="http://localhost:3000/room/${roomId}" target="_blank">Join Interview</a>
          <p>Welcome and best of luck!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

