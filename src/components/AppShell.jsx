import { useState, useEffect } from "react";
import Topnav from "./TopNav";
import Footer from "./Footer";
import CrisisButton from "./CrisisButton";

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

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("nav")) setMobileNavOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileNavOpen]);

  return (
    <div className="flex flex-col h-screen bg-theme-light font-sans overflow-hidden">
      <Topnav
        isMobile={isMobile}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Main Content Area — fills remaining height, inner pages scroll independently */}
      <main className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-3 sm:py-4 lg:py-5">
          {children}
        </div>
      </main>

      <Footer compact={true} />

      {/* Persistent crisis help button — visible on every authenticated page */}
      <CrisisButton />
    </div>
  );
}
