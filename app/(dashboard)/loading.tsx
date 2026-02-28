import { Loader2 } from "lucide-react";

const DashboardLoading = () => (
  <div
    className="p-4 sm:p-6 space-y-4"
    role="status"
    aria-label="Loading dashboard"
  >
    {/* Skeleton: page header */}
    <div className="page-header">
      <div className="space-y-2">
        <div className="h-4 w-32 rounded-md bg-(--bg-elevated) animate-pulse" />
        <div className="h-6 w-48 rounded-md bg-(--bg-elevated) animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 rounded-full bg-(--bg-elevated) animate-pulse" />
      </div>
    </div>

    {/* Skeleton: card grid */}
    <div className="card-grid">
      <div className="card h-24 animate-pulse" />
      <div className="card h-24 animate-pulse" />
    </div>

    {/* Content area with spinner */}
    <div className="card min-h-64 flex flex-col items-center justify-center gap-4 py-12">
      <Loader2
        className="h-8 w-8 text-(--brand-primary) animate-spin"
        strokeWidth={2}
        aria-hidden
      />
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium text-(--text-primary)">
          Loading dashboard
        </span>
        <span className="text-xs text-(--text-muted)">Fetching your data…</span>
      </div>
    </div>
  </div>
);

export default DashboardLoading;
