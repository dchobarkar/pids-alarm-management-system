"use client";

import { Loader2 } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="page-header">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-md bg-(--bg-elevated) animate-pulse" />
          <div className="h-6 w-48 rounded-md bg-(--bg-elevated) animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-full bg-(--bg-elevated) animate-pulse" />
        </div>
      </div>

      <div className="card-grid">
        <div className="card h-24 animate-pulse" />
        <div className="card h-24 animate-pulse" />
      </div>

      <div className="card h-60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-(--text-muted)">
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
          <span className="text-xs sm:text-sm">Loading dashboard data…</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;

