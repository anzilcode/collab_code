import { Code, Video, Users, Shield, Zap, Monitor, BarChart, Lock } from "lucide-react";

const features = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Collaborative Code Editor",
    description: "Real-time collaborative coding environment with syntax highlighting for 5+ programming languages and instant code execution.",
    highlight: "5+ Languages"
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "High Quality Video Interviews",
    description: "Crystal-clear video conferencing with screen sharing, recording capabilities, and seamless chat integration.",
    highlight: "HD Quality"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Smart Session Management",
    description: "Schedule, manage, and track interviews with simple analytics and team collaboration tools.",
    highlight: "Easy Tracking"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security",
    description: "Role-based access control, end-to-end encryption, and audit logs for safe interview sessions.",
    highlight: "Secure"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Code Execution",
    description: "Run and test code in real-time with support for multiple environments and debugging tools.",
    highlight: "Real-time Execution"
  },
  {
    icon: <Monitor className="w-8 h-8" />,
    title: "Multi-Screen Support",
    description: "Optimized interface for multiple monitors with flexible layouts.",
    highlight: "Flexible Layout"
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: "Basic Analytics",
    description: "Simple insights on candidate performance and session activity.",
    highlight: "Insights"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Private Rooms",
    description: "Secure, isolated coding sessions for interviews or practice.",
    highlight: "Private"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Key Features
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Features that help you practice coding and conduct interviews efficiently in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                    {feature.icon}
                  </div>
                </div>

                {/* Highlight */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <span className="text-xs font-semibold text-blue-400">
                    {feature.highlight}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-100 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
