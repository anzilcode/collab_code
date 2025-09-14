import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron"
import connectDb from "./db/User.js";
import userRoutes from "./routes/UserRoute.js"; 
import resumeRoute from "./routes/ResumeRoute.js";
import questtionRoute from './routes/QuestionRoute.js'
import settingsRoutes from './routes/Settings.js'
import Interview from './routes/Interview.js'
import {cancelExpiredInterviews}  from "./controllers/Interviewer/Util/InterviewUtil.js";
import MailRoute from "./routes/MailRoute.js";
import feedbackRoutes from "./routes/FeedbackRoute.js"
import interviewRoutes from './routes/CandidateRoute.js';
import RoomToute from './routes/RoomRoute.js'
import { socketHandler } from './sockets/socketHandler.js'


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDb();


app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoute);
app.use("/api/questions",questtionRoute)
app.use('/api/settings', settingsRoutes);
app.use('/api/interviews', Interview);
app.use("/api/interviews", MailRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", RoomToute);

cron.schedule("* * * * *", () => {
  cancelExpiredInterviews().catch(console.error);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
