// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axios";
// import toast from "react-hot-toast";

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         // Login flow
//         const { data } = await api.post("/api/auth/login", {
//           email: formData.email,
//           password: formData.password,
//         });

//         login(data.token, data.user);
//         toast.success("Welcome back!");

//         if (data.user.email === "admin@unimasmhwb.com") {
//           navigate("/admin");
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         // Registration flow
//         const { data } = await api.post("/api/auth/register", formData);

//         login(data.token, data.user);
//         toast.success("Account created successfully!");

//         if (data.user.email === "admin@unimasmhwb.com") {
//           navigate("/admin");
//         } else {
//           navigate("/dashboard");
//         }
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen w-full flex items-center justify-center overflow-hidden"
//       style={{
//         background: "linear-gradient(135deg, #1A3C5E 0%, #2980B9 100%)",
//       }}
//     >
//       <div
//         className="flex w-[960px] h-[640px] rounded-[20px] overflow-hidden"
//         style={{ boxShadow: "0 20px 60px 0 #00000055" }}
//       >
//         {/* Left Side */}
//         <div
//           className="flex-1 flex flex-col justify-center px-11 py-[52px]"
//           style={{
//             background: "linear-gradient(160deg, #1A3C5E, #27AE60 120%)",
//           }}
//         >
//           <div className="text-[40px] mb-[18px]">🧠</div>
//           <div className="text-[22px] font-bold leading-[1.3] text-white mb-[10px]">
//             UNIMAS Mental Health
//             <br />
//             &amp; Well-Being Platform
//           </div>
//           <div className="text-[11px] text-[#BDD5EA] leading-[1.7] mb-[28px]">
//             A safe, private space designed for UNIMAS students to nurture their
//             mental health every day.
//           </div>

//           <div className="flex items-center gap-[10px] text-[11px] text-[#D4EEF9] mb-[10px]">
//             <div className="w-[8px] h-[8px] bg-[#27AE60] rounded-full shrink-0"></div>
//             Daily mood tracking with personalised insights
//           </div>
//           <div className="flex items-center gap-[10px] text-[11px] text-[#D4EEF9] mb-[10px]">
//             <div className="w-[8px] h-[8px] bg-[#27AE60] rounded-full shrink-0"></div>
//             Wellness goals with streak tracking
//           </div>
//           <div className="flex items-center gap-[10px] text-[11px] text-[#D4EEF9] mb-[10px]">
//             <div className="w-[8px] h-[8px] bg-[#27AE60] rounded-full shrink-0"></div>
//             Guided journalling prompts
//           </div>
//           <div className="flex items-center gap-[10px] text-[11px] text-[#D4EEF9] mb-[10px]">
//             <div className="w-[8px] h-[8px] bg-[#27AE60] rounded-full shrink-0"></div>
//             Curated mental health resources
//           </div>
//           <div className="flex items-center gap-[10px] text-[11px] text-[#D4EEF9] mb-[10px]">
//             <div className="w-[8px] h-[8px] bg-[#27AE60] rounded-full shrink-0"></div>
//             Crisis helplines &amp; campus counselling
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="w-[400px] bg-white px-11 py-12 flex flex-col justify-center">
//           <div className="text-[20px] font-bold text-[#1A3C5E] mb-1">
//             Welcome Back
//           </div>
//           <div className="text-[10px] text-[#888] mb-4">
//             {isLogin
//               ? "Sign in to your UNIMAS MHW account"
//               : "Create your UNIMAS MHW account"}
//           </div>

//           <div className="flex rounded-lg overflow-hidden border border-[#E0E0E0] mb-[26px]">
//             <button
//               type="button"
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 p-[11px] text-center text-[12px] font-bold cursor-pointer border-none transition-colors ${
//                 isLogin ? "bg-[#1A3C5E] text-white" : "bg-[#F8F9FA] text-[#888]"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 p-[11px] text-center text-[12px] font-bold cursor-pointer border-none transition-colors ${
//                 !isLogin
//                   ? "bg-[#1A3C5E] text-white"
//                   : "bg-[#F8F9FA] text-[#888]"
//               }`}
//             >
//               Register
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col">
//             {!isLogin && (
//               <>
//                 <label className="text-[10px] font-bold text-[#555] mb-[5px] mt-4 block">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="w-full bg-[#F8F9FA] border border-[#DDD] rounded-lg px-[14px] py-[11px] text-[11px] font-[inherit] text-[#333] outline-none focus:border-[#2980B9]"
//                   placeholder="Ali Bin Abu"
//                 />
//               </>
//             )}

//             <label className="text-[10px] font-bold text-[#555] mb-[5px] mt-4 block">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               className="w-full bg-[#F8F9FA] border border-[#DDD] rounded-lg px-[14px] py-[11px] text-[11px] font-[inherit] text-[#333] outline-none focus:border-[#2980B9] box-border"
//               placeholder="your.name@siswa.unimas.my"
//             />

//             <label className="text-[10px] font-bold text-[#555] mb-[5px] mt-4 block">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               className="w-full bg-[#F8F9FA] border border-[#DDD] rounded-lg px-[14px] py-[11px] text-[11px] font-[inherit] text-[#333] outline-none focus:border-[#2980B9] box-border"
//               placeholder="Enter your password"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full p-[13px] bg-[#1A3C5E] text-white border-none rounded-lg text-[13px] font-bold cursor-pointer mt-6 transition-colors hover:bg-[#15304A] disabled:opacity-50"
//             >
//               {loading
//                 ? "Please wait..."
//                 : isLogin
//                   ? "Sign In →"
//                   : "Register →"}
//             </button>
//           </form>

//           {isLogin && (
//             <div className="text-[9px] text-[#2980B9] text-center mt-3 cursor-pointer hover:underline">
//               Forgot your password? Reset here
//             </div>
//           )}

//           <div className="flex items-center gap-[10px] my-4 text-[#CCC] text-[9px] before:flex-1 before:border-t before:border-[#EEE] after:flex-1 after:border-t after:border-[#EEE]">
//             or continue with
//           </div>

//           <div className="text-[9px] text-[#888] text-center">
//             {isLogin ? "New to UNIMAS MHW? " : "Already have an account? "}
//             <span
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setFormData({ name: "", email: "", password: "" });
//               }}
//               className="text-[#2980B9] cursor-pointer font-bold hover:underline"
//             >
//               {isLogin ? "Create a free account" : "Sign in here"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await api.post(endpoint, payload);

      // Pass token and user data to context
      login(res.data.token, res.data.user);
      toast.success(
        isLogin ? "Welcome back!" : "Account created successfully!",
      );
      navigate("/dashboard");
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-light p-4 font-sans">
      <div className="w-full max-w-[500px] bg-white rounded-[10px] shadow-card p-8 sm:p-12 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-theme-blue"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-[32px] font-bold text-theme-dark mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-[15px] text-theme-body">
            {isLogin
              ? "Sign in to access your UNIMAS mental health dashboard."
              : "Join the UNIMAS well-being platform today."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field (Register Only) */}
          {!isLogin && (
            <div>
              <label className="block text-[14px] font-semibold text-theme-dark mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="e.g. John Doe"
                  className="w-full h-[55px] bg-theme-input border border-transparent rounded-[4px] pl-11 pr-4 text-[15px] text-theme-dark focus:bg-white focus:border-theme-blue focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          )}

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
                {isLogin ? "Sign In" : "Register"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center">
          <p className="text-[15px] text-theme-body">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-theme-blue font-semibold hover:text-theme-red transition-colors border-none bg-transparent cursor-pointer ml-1"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
