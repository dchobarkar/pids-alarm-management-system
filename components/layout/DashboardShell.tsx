"use client";

import { useState, useEffect } from "react";

import { MD_BREAKPOINT_PX } from "@/constants/ui";
import DBNavbar from "@/components/layout/DBNavbar";
import DBSidebar from "@/components/layout/DBSidebar";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const isMobile = () =>
      typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT_PX;
    if (isMobile()) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-(--bg-app)">
      <DBNavbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((o) => !o)}
      />
      <DBSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => setSidebarOpen(false)}
      />
      <main className="min-h-screen pt-14 transition-[padding] duration-200 ease-out md:pl-64">
        {children}
      </main>
    </div>
  );
};

export default DashboardShell;
