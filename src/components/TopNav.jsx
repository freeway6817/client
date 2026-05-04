import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topnav({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const isAdmin = user?.email === "admin@unimasmhwb.com";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <nav className="w-full h-[60px] bg-[#1A3C5E] flex items-center justify-between px-6 flex-shrink-0 relative z-40">
      {/* Left: Brand / Menu */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-[#3498DB] bg-transparent border-none cursor-pointer sm:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <span className="text-[14px] font-bold text-white tracking-[0.3px] select-none hidden sm:block">
          UNIMAS Mental Health & Well-Being Platform
        </span>
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center gap-3">
        {/* Hide Notification Bell entirely if Admin */}
        {!isAdmin && (
          <button className="w-9 h-9 bg-[#2A5080] border border-[#4A7AA0] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#3A6090] transition-colors">
            <Bell size={15} className="text-white" />
          </button>
        )}

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#3A5070] border-2 border-[#4A7090] flex items-center justify-center text-white text-[11px] font-bold select-none">
              {initials}
            </div>

            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-[11px] text-[#BDD5EA] font-semibold">
                {isAdmin
                  ? "Administrator"
                  : `Hello, ${user?.name?.split(" ")[0]}`}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="text-[11px] font-bold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-[9px] text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate(isAdmin ? "/admin" : "/dashboard");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-[10px] text-gray-700 hover:bg-gray-50 hover:text-[#1976D2] border-none bg-transparent cursor-pointer transition-colors text-left"
              >
                <User size={14} />
                {isAdmin ? "Admin Console" : "My Dashboard"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 mt-1 text-[10px] text-[#D32F2F] hover:bg-[#FFEBEE] border-none bg-transparent cursor-pointer transition-colors text-left"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
