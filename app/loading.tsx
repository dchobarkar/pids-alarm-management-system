import { Loader2 } from "lucide-react";

const Loading = () => (
  <div
    className="flex min-h-screen flex-col items-center justify-center gap-6 bg-(--bg-app) px-6"
    role="status"
    aria-label="Loading"
  >
    <Loader2
      className="h-10 w-10 text-(--brand-primary) animate-spin"
      strokeWidth={2}
      aria-hidden
    />
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-sm font-medium text-(--text-primary)">
        PIDS Alarm Management System
      </span>
      <span className="text-xs text-(--text-muted)">Loading…</span>
    </div>
  </div>
);

export default Loading;
