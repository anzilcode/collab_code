import { Interview } from '../../../models/Interview.js'; 

export const cancelExpiredInterviews = async () => {
  try {

    const interviews = await Interview.find({ status: "scheduled" });
    const now = new Date();

    await Promise.all(
      interviews.map(async (interview) => {

        const start = new Date(`${interview.date}T${interview.time}`);

        const durationParts = interview.duration.match(/(\d+)\s*h|(\d+)\s*m/g) || [];
        let totalMinutes = 0;

        durationParts.forEach(part => {
          if (part.includes("h")) totalMinutes += parseInt(part) * 60;
          else if (part.includes("m")) totalMinutes += parseInt(part);
        });

        const end = new Date(start.getTime() + totalMinutes * 60000);

        if (now >= end) {
          interview.status = "cancelled";
          await interview.save();
          console.log(`Interview ${interview._id} cancelled due to expiry.`);
        }
      })
    );
  } catch (error) {
    console.error("Error cancelling expired interviews:", error);
  }
};

