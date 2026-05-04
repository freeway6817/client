import { useState } from "react";
import Topnav from "./TopNav";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-theme-light font-sans overflow-hidden">
      {/* Mobile Sidebar with toggle ability */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <Topnav toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        {/* Global Footer */}
        <Footer compact={true} />
      </div>
    </div>
  );
}
