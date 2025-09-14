import { useState,useEffect } from "react";
import Sidebar from "../components/candidate/Sidebar";
import DashboardHome from "../components/candidate/Dashboard";
import PastInterviews from "../components/candidate/PastInterview";
import AddResumeForm from "../components/candidate/Resume";
import AccountSettings from "../components/candidate/Settings";
import JoinRoomModal from "../components/candidate/JoinRoom";

function CandidateDashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [showJoinModal, setShowJoinModal] = useState(false);

  
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome />;
      case "past":
        return <PastInterviews />;
      case "resume":
        return <AddResumeForm />;
      case "settings":
        return <AccountSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-6 overflow-y-auto">{renderSection()}</main>
      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} />}
    </div>
  );
}

export default CandidateDashboard;

