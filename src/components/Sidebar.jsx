import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Smile,
  Target,
  BookOpen,
  Library,
  Bookmark,
  LogOut,
  Shield,
  Brain,
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name?.charAt(0).toUpperCase() || "?";

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/mood", icon: Smile, label: "Mood Tracker" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/journal", icon: BookOpen, label: "Journal" },
    { to: "/resources", icon: Library, label: "Resources" },
    { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { to: "/mindfulness", icon: Brain, label: "Mindfulness" },
    ...(user?.isadmin
      ? [{ to: "/admin", icon: Shield, label: "Admin Dashboard" }]
      : []),
  ];

  return (
    <aside className="w-[220px] bg-sidebar flex flex-col py-0 px-2 flex-shrink-0 h-full">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-[18px] border-b border-[#2A3A4E] mb-2">
        <div className="w-[60px] h-[60px] bg-[#3A5070] border-2 border-[#4A7090] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
          {initials}
        </div>
        <span className="text-[10px] font-bold text-[#BDD5EA]">
          {user?.name}
        </span>
        {user?.isadmin ? (
          <span className="text-[8px] bg-accent text-white px-2 py-0.5 rounded mt-1 font-bold tracking-wider">
            ADMIN
          </span>
        ) : (
          <span className="text-[9px] text-[#7A9AB8] mt-0.5">
            UNIMAS Student
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-1 mt-1">
        {navItems.map((item) => {
          const NavIcon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 h-[42px] px-3 rounded-lg mb-1 text-[11px] font-medium no-underline transition-colors ${
                  isActive
                    ? "bg-accent text-white font-bold"
                    : "text-[#A0BED8] hover:bg-sidebarHover"
                }`
              }
            >
              <NavIcon size={14} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 h-[42px] px-3 rounded-lg text-[11px] text-[#CC5555] border border-[#CC333344] hover:bg-[#2A1A1A] transition-colors mt-auto mb-1"
      >
        <LogOut size={14} />
        Logout
      </button>
    </aside>
  );
}
