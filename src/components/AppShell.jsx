import { useState, useEffect } from "react";
import Topnav from "./TopNav";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile nav when clicking outside the dropdown
  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("nav")) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileNavOpen]);

  return (
    <div className="flex flex-col h-screen bg-theme-light font-sans overflow-hidden">
      {/* TopNav handles ALL navigation — both desktop inline links and mobile dropdown */}
      <Topnav
        isMobile={isMobile}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Main Content Area — full width, no sidebar */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <Footer compact={true} />
    </div>
  );
}
