import { Users, Calendar, CheckCircle, Award, Plus } from "lucide-react";
import { useContext ,useState} from "react";
import { ResumeContext } from "../../Context/ResumeContext"; 
import UpcomingInterviews from "./UpcomingInterview";
import CreateRoom from "./CreateRoom"; 

const Dashboard = ({ interviews, formatTime, onEditInterview }) => {
  const { resumes, loading, error, fetchResumes } = useContext(ResumeContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  // Recalculate stats dynamically on every render
  const stats = [
    {
      label: 'Total Candidates',
      value: resumes.length,
      icon: Users,
      color: 'bg-blue-600',
      change: '+12%'
    },
    {
      label: 'Scheduled Interviews',
      value: interviews.filter(i => i.status === 'scheduled').length,
      icon: Calendar,
      color: 'bg-green-600',
      change: '+8%'
    },
    {
      label: 'Completed Today',
      value: interviews.filter(i => i.status === 'completed' && i.date === new Date().toISOString().split('T')[0]).length,
      icon: CheckCircle,
      color: 'bg-purple-600',
      change: '+15%'
    },
    {
      label: 'Success Rate',
      value: '87%',
      icon: Award,
      color: 'bg-yellow-500',
      change: '+3%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Dashboard Overview</h2>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={() => setShowCreateRoom(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-100 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-400 mt-1">{stat.change} from last week</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming / Ongoing Interviews */}
      <div>
        <h3 className="text-xl font-bold text-gray-100 mb-4">Upcoming Interviews</h3>
        <UpcomingInterviews interviews={interviews} onEditInterview={onEditInterview}/>
      </div>

      {/* CreateRoom Modal */}
      {showCreateRoom && (
        <CreateRoom
          resumes={resumes}
          loading={loading}
          error={error}
          fetchResumes={fetchResumes}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

