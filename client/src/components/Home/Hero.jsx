import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Users, Clock, Shield } from "lucide-react";
import { useAuth } from "../../Context/AuthContext"; 

const HeroCollege = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth(); // get auth info from context

  const keyFeatures = [
    { icon: <Users className="w-5 h-5" />, text: "Collaborative coding sessions" },
    { icon: <Clock className="w-5 h-5" />, text: "Real-time communication" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure environment" }
  ];

  const roleRoutes = {
  admin: "/admin-dashboard",
  candidate: "/candidate-dashboard",
  interviewer: "/interviewer-dashboard",
};

  const handleStartNow = () => {
    if (!token) {
      navigate("/auth?mode=register");
    } else {
      navigate(roleRoutes[role] || "/");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white overflow-hidden">
      {/* Dynamic floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-bounce-slow"></div>
        
        {/* Floating code symbols */}
        <div className="absolute top-1/4 left-1/3 text-blue-400/20 text-6xl font-mono animate-float-code">{'<>'}</div>
        <div className="absolute bottom-1/3 right-1/4 text-purple-400/20 text-5xl font-mono animate-float-code-reverse">{'{}'}</div>
        <div className="absolute top-2/3 left-1/4 text-cyan-400/20 text-4xl font-mono animate-bounce-code">[]</div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Explosive headline animation */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-zoom-in">
              Collaborate.
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-slide-up">
              Code. Interview.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
          Conduct technical interviews with a platform that combines 
          <span className="text-white font-semibold"> real-time collaborative coding</span>, 
          <span className="text-white font-semibold"> live video chat</span>, and 
          <span className="text-white font-semibold"> messaging tools</span> in one place.
        </p>

        {/* Feature cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {keyFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="group flex items-center gap-3 text-slate-300 bg-slate-800/40 backdrop-blur-sm rounded-full px-5 py-3 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 animate-bounce-in cursor-pointer hover:scale-110 hover:rotate-1 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300 flex-shrink-0 group-hover:animate-spin">
                {feature.icon}
              </div>
              <span className="text-sm md:text-base font-medium group-hover:text-white transition-colors duration-300">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={handleStartNow}
            className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg hover:shadow-blue-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">{token ? "Go to Dashboard" : "Start Now"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300 relative z-10" />
          </button>
          
          <button className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-lg font-semibold border-2 border-slate-500/70 hover:border-slate-400/70 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-rotate-1">
            <div className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center group-hover:animate-spin-slow">
              <Play className="w-3 h-3 text-white fill-current ml-0.5" />
            </div>
            <span className="relative z-10">Watch Demo</span>
          </button>
        </div>
      </div>

      {/* Advanced animations */}
      <style jsx>{`
        @keyframes float {0%,100%{transform:translateY(0px) rotate(0deg);}33%{transform:translateY(-20px) rotate(1deg);}66%{transform:translateY(-10px) rotate(-1deg);}}
        @keyframes float-reverse {0%,100%{transform:translateY(0px) rotate(0deg);}33%{transform:translateY(15px) rotate(-1deg);}66%{transform:translateY(8px) rotate(1deg);}}
        @keyframes float-code {0%,100%{transform:translateY(0px) rotate(0deg) scale(1);}50%{transform:translateY(-30px) rotate(5deg) scale(1.1);}}
        @keyframes float-code-reverse {0%,100%{transform:translateY(0px) rotate(0deg) scale(1);}50%{transform:translateY(25px) rotate(-3deg) scale(0.9);}}
        @keyframes bounce-code {0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.2) rotate(10deg);}}
        @keyframes bounce-slow {0%,100%{transform:translate(-50%, -50%) scale(1);}50%{transform:translate(-50%, -50%) scale(1.1);}}
        @keyframes particle {0%{transform:translateY(100vh) scale(0);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100vh) scale(1);opacity:0;}}
        @keyframes zoom-in {0%{transform:scale(0) rotate(180deg);opacity:0;}100%{transform:scale(1) rotate(0deg);opacity:1;}}
        @keyframes slide-up {0%{transform:translateY(100px) skewY(-10deg);opacity:0;}100%{transform:translateY(0) skewY(0deg);opacity:1;}}
        @keyframes bounce-in {0%{transform:scale(0) rotate(-180deg);opacity:0;}50%{transform:scale(1.2) rotate(-90deg);}100%{transform:scale(1) rotate(0deg);opacity:1;}}
        @keyframes spin-slow {from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        .animate-float{animation:float 6s ease-in-out infinite;}
        .animate-float-reverse{animation:float-reverse 8s ease-in-out infinite;}
        .animate-float-code{animation:float-code 4s ease-in-out infinite;}
        .animate-float-code-reverse{animation:float-code-reverse 5s ease-in-out infinite;}
        .animate-bounce-code{animation:bounce-code 3s ease-in-out infinite;}
        .animate-bounce-slow{animation:bounce-slow 4s ease-in-out infinite;}
        .animate-particle{animation:particle linear infinite;}
        .animate-zoom-in{animation:zoom-in 0.8s ease-out;}
        .animate-slide-up{animation:slide-up 0.8s ease-out 0.3s both;}
        .animate-bounce-in{animation:bounce-in 0.6s ease-out both;}
        .animate-spin-slow{animation:spin-slow 3s linear infinite;}
      `}</style>
    </section>
  );
};

export default HeroCollege;
