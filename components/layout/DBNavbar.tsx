import Link from "next/link";

const DBNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-30 bg-(--bg-surface) border-b border-(--border-default) flex items-center justify-between px-6">
      <Link
        href="/dashboard"
        className="text-lg font-semibold text-(--text-primary)"
      >
        PIDS Alarm Management
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-(--text-secondary)">Operator</span>
        <Link
          href="/"
          className="text-sm text-(--text-secondary) hover:text-(--text-primary)"
        >
          Sign out
        </Link>
      </div>
    </header>
  );
};

export default DBNavbar;
