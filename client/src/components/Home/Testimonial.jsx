import { Star, Quote, Users, TrendingUp, Clock, Award } from "lucide-react";

const testimonials = [
  {
    name: "Anil Sharma",
    role: "Student Developer",
    feedback: "CodeCollab makes coding interviews and collaborative practice really smooth. The live code editor with video chat is a great combo.",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    rating: 5,
  },
  {
    name: "Riya Mehta",
    role: "Aspiring Developer",
    feedback: "I loved practicing coding problems with friends in real-time. It feels like a mini hackathon every time!",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
  },
  {
    name: "Karan Patel",
    role: "Junior Developer",
    feedback: "The collaborative editor is super responsive, and video chat makes discussing solutions easy and natural.",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    rating: 5,
  }
];

const stats = [
  { icon: <Users className="w-6 h-6" />, number: "20+", label: "Users" },
  { icon: <TrendingUp className="w-6 h-6" />, number: "50+", label: "Practice Sessions" },
  { icon: <Clock className="w-6 h-6" />, number: "30%", label: "Time Saved" },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Feedback from users trying out the collaborative coding and interview platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-400">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm"
            >
              <Quote className="w-8 h-8 text-blue-400/30 mb-4 transform rotate-180" />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm md:text-base">
                "{testimonial.feedback}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-600"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
