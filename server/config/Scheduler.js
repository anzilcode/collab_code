import cron from "node-cron";
import { Interview } from "../models/Interview.js";

// Function to start the auto-cancellation scheduler
export function startInterviewScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const interviews = await Interview.find({ status: "scheduled" });

      for (const interview of interviews) {
        const startTime = new Date(`${interview.date} ${interview.time}`);

        // Parse duration ("60 min" -> 60)
        const durationMinutes = parseInt(interview.duration);
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        // If interview time passed and still scheduled → cancel it
        if (now > endTime) {
          interview.status = "cancelled";
          await interview.save();
          console.log(`Interview ${interview._id} auto-cancelled`);
        }
      }
    } catch (err) {
      console.error("Error in interview auto-cancellation:", err);
    }
  });

  console.log("✅ Interview auto-cancellation scheduler started");
}
