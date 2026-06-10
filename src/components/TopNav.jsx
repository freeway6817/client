// client/src/components/TopNav.jsx
import { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  Menu,
  X,
  Home,
  Smile,
  Target,
  BookOpen,
  Library,
  Bookmark,
  Shield,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

export default function Topnav({ isMobile, mobileNavOpen, setMobileNavOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const isAdmin = user?.email === "admin@unimasmhwb.com";

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/mood", icon: Smile, label: "Mood Tracker" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/journal", icon: BookOpen, label: "Journal" },
    { to: "/resources", icon: Library, label: "Resources" },
    { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    ...(user?.isadmin ? [{ to: "/admin", icon: Shield, label: "Admin" }] : []),
  ];

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
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <nav className="w-full h-[60px] bg-[#1A3C5E] flex items-center flex-shrink-0 relative z-40">
        {/* Inner wrapper — matches AppShell max-w so everything aligns */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between h-full">
          {/* Left: Brand + Desktop Nav Links */}
          <div className="flex items-center gap-6">
            {/* Mobile: Hamburger */}
            {isMobile && (
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="text-white hover:text-[#3498DB] bg-transparent border-none cursor-pointer"
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Brand */}
            <span className="text-[13px] font-bold text-white tracking-[0.3px] select-none whitespace-nowrap">
              UNIMAS MHW
            </span>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const NavIcon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-3 h-[36px] rounded-lg text-[11px] font-medium no-underline transition-colors whitespace-nowrap ${
                          isActive
                            ? "bg-[#1976D2] text-white font-bold"
                            : "text-[#A0BED8] hover:bg-[#2A4A6E] hover:text-white"
                        }`
                      }
                    >
                      <NavIcon size={13} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: My Progress + Profile */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/progress");
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-white
                  hover:bg-[#2A4A6E] border-none bg-transparent
                  cursor-pointer transition-colors rounded-lg whitespace-nowrap"
              >
                <Trophy size={14} className="text-yellow-400" />
                My Progress
              </button>
            )}

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfile((v) => !v)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
              >
                <div className="w-8 h-8 rounded-full bg-[#3A5070] border-2 border-[#4A7090] flex items-center justify-center text-white text-[11px] font-bold select-none">
                  {initials}
                </div>
                {!isMobile && (
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] text-[#BDD5EA] font-semibold">
                      {isAdmin
                        ? "Administrator"
                        : `Hello, ${user?.name?.split(" ")[0]}`}
                    </span>
                  </div>
                )}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
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
        </div>
      </nav>

      {/* ── Mobile Dropdown Nav Menu ─────────────────────────────────── */}
      {isMobile && mobileNavOpen && (
        <div className="w-full bg-[#152E48] border-b border-[#2A4A6E] z-30 shadow-lg">
          <nav className="flex flex-col py-2 px-3">
            {navItems.map((item) => {
              const NavIcon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-[44px] px-3 rounded-lg mb-1 text-[12px] font-medium no-underline transition-colors ${
                      isActive
                        ? "bg-[#1976D2] text-white font-bold"
                        : "text-[#A0BED8] hover:bg-[#1E3A5A] hover:text-white"
                    }`
                  }
                >
                  <NavIcon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
