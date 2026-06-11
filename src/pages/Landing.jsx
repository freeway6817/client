import { Link } from "react-router-dom";
import {
  ArrowRight,
  HeartPulse,
  Target,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Public Navbar */}
      <nav className="w-full h-[80px] bg-white shadow-sm flex items-center justify-between px-8 absolute top-0 z-50">
        <span className="font-heading text-2xl font-bold text-theme-dark tracking-wide">
          UNIMAS{" "}
          <span className="text-theme-blue">Mental Health and Well-being</span>
        </span>
        <Link
          to="/login"
          className="bg-theme-blue text-white px-6 py-2.5 rounded-[2px] font-semibold hover:bg-theme-red transition-all duration-300 no-underline"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[150px] px-8 bg-theme-light overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="font-heading text-[48px] sm:text-[64px] font-bold text-theme-dark leading-[1.1] mb-6">
              Prioritize Your <br />
              <span className="text-theme-blue">Mental Well-being</span>
            </h1>
            <p className="text-[18px] text-theme-body mb-8 max-w-md leading-relaxed">
              A dedicated platform for UNIMAS students to track moods, set
              goals, journal, and access professional mental health resources.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-theme-blue text-white px-8 py-4 rounded-[2px] font-heading font-semibold text-[18px] hover:bg-theme-red transition-all duration-300 no-underline shadow-card"
            >
              Start Your Journey <ArrowRight size={20} />
            </Link>
          </div>
          {/* Optional: Add a hero image here if you have one, or keep it text focused */}
          {/* <div className="hidden lg:flex justify-center">
            <div className="w-[450px] h-[450px] bg-white rounded-full shadow-card flex items-center justify-center border-[10px] border-theme-input relative">
              <HeartPulse size={150} className="text-theme-blue opacity-20" />
              <div className="absolute bg-white p-4 rounded-[10px] shadow-card top-10 right-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ECEDFF] flex items-center justify-center text-theme-blue font-bold">
                  1
                </div>
                <div>
                  <p className="font-bold text-theme-dark text-[14px]">
                    Mood Tracked
                  </p>
                  <p className="text-[12px] text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Counters Section (Overlapping the hero) */}
      {/* <section className="relative z-20 -mt-[60px] pb-[100px] px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[20px] border border-theme-border shadow-card-soft flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FFEFEE] flex items-center justify-center text-theme-red flex-shrink-0">
              <HeartPulse size={28} />
            </div>
            <div>
              <h2 className="font-heading text-[28px] font-bold text-theme-dark leading-none mb-1">
                5,000+
              </h2>
              <p className="text-[14px] text-theme-body font-medium">
                Moods Logged
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-theme-border shadow-card-soft flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[60px] h-[60px] rounded-full bg-[#ECEDFF] flex items-center justify-center text-theme-blue flex-shrink-0">
              <Target size={28} />
            </div>
            <div>
              <h2 className="font-heading text-[28px] font-bold text-theme-dark leading-none mb-1">
                12,000
              </h2>
              <p className="text-[14px] text-theme-body font-medium">
                Goals Reached
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-theme-border shadow-card-soft flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FDF3FA] flex items-center justify-center text-[#57216C] flex-shrink-0">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="font-heading text-[28px] font-bold text-theme-dark leading-none mb-1">
                150+
              </h2>
              <p className="text-[14px] text-theme-body font-medium">
                Resources
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] border border-theme-border shadow-card-soft flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-[60px] h-[60px] rounded-full bg-[#EAFEFF] flex items-center justify-center text-[#448BB7] flex-shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="font-heading text-[28px] font-bold text-theme-dark leading-none mb-1">
                24/7
              </h2>
              <p className="text-[14px] text-theme-body font-medium">
                Crisis Support
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
