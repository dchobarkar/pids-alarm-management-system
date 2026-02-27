const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-app) px-6">
      <div className="flex items-center gap-3 text-(--text-secondary)">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--border-strong) border-t-(--brand-primary)" />
        <span className="text-sm">Loading PIDS Alarm Management System…</span>
      </div>
    </div>
  );
};

export default Loading;

