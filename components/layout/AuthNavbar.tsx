import Link from "next/link";

const AuthNavbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm transition-colors hover:border-slate-300 hover:bg-white"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            PIDS
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            Alarm Management System
          </span>
        </Link>
      </div>
    </header>
  );
};

export default AuthNavbar;
