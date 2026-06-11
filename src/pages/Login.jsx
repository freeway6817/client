import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      if (res.data.user.email === "admin@unimasmhwb.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-light p-4 font-sans">
      <div className="w-full max-w-[500px] bg-white rounded-[10px] shadow-card p-8 sm:p-12 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-theme-blue"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-[32px] font-bold text-theme-dark mb-2">
            Welcome Back
          </h2>
          <p className="text-[15px] text-theme-body">
            Sign in to access your UNIMAS mental health dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div>
            <label className="block text-[14px] font-semibold text-theme-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@siswa.unimas.my"
                className="w-full h-[55px] bg-theme-input border border-transparent rounded-[4px] pl-11 pr-4 text-[15px] text-theme-dark focus:bg-white focus:border-theme-blue focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[14px] font-semibold text-theme-dark mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full h-[55px] bg-theme-input border border-transparent rounded-[4px] pl-11 pr-4 text-[15px] text-theme-dark focus:bg-white focus:border-theme-blue focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[55px] mt-2 bg-theme-blue text-white rounded-[4px] font-heading font-semibold text-[18px] tracking-wide hover:bg-theme-red transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Link to Sign Up */}
        <div className="mt-8 text-center">
          <p className="text-[15px] text-theme-body">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-theme-blue font-semibold hover:text-theme-red transition-colors ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
