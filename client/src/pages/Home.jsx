import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/FeatureCard";
import About from "../components/Home/About";
import Testimonials from "../components/Home/Testimonial";
import Footer from "../components/Home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-slate-50">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
