import { Users, Target, Zap, Shield } from "lucide-react";

const AboutCollege = () => {
  const stats = [
    { number: "50+", label: "Interviews Conducted" },
    { number: "2+", label: "Companies Participated" },
    { number: "99%", label: "Platform Reliability" },
    { number: "5+", label: "Programming Languages Supported" }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Mission-Driven",
      description: "Providing a smooth and efficient interview experience with collaborative coding tools."
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Innovation First",
      description: "Integrates real-time coding, chat, and video features to enhance collaboration."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure & Private",
      description: "Ensures all code and conversations remain confidential during interviews."
    }
  ];

  return (
    <section className="py-20 bg-slate-800 text-white" id="about">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About CodeCollab
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              CodeCollab is a collaborative interview platform combining real-time coding, video communication, and messaging — all in one seamless environment.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              It allows interviewers and candidates to interact efficiently while practicing, assessing, and solving coding challenges in a professional setting.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Our Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold mb-4">{value.title}</h4>
                <p className="text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-8 md:p-12 rounded-2xl border border-slate-600">
          <div className="flex justify-center mb-6">
            <Users className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Streamlined Interview Experience
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            CodeCollab integrates collaborative code editing, live video, and messaging to simulate real-world technical interviews efficiently and professionally.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Designed for seamless interaction between interviewers and candidates, it enables smooth communication, coding, and evaluation in one platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutCollege;
