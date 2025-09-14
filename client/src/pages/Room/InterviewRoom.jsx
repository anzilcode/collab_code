import { Navigate, useParams } from "react-router-dom";
import InterviewRoomCandidate from "./InterviewRoomCandidate .jsx";
import InterviewRoomInterviewer from "./InterviewRoomInterviewer .jsx";

function InterviewRoom() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 
  const { id } = useParams();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {role === "interviewer" ? (
        <InterviewRoomInterviewer roomId={id} />
      ) : (
        <InterviewRoomCandidate roomId={id} />
      )}
    </div>
  );
}

export default InterviewRoom;
