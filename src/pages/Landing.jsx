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
              to="/signup"
              className="inline-flex items-center gap-2 bg-theme-blue text-white px-8 py-4 rounded-[2px] font-heading font-semibold text-[18px] hover:bg-theme-red transition-all duration-300 no-underline shadow-card"
            >
              Start Your Journey <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
