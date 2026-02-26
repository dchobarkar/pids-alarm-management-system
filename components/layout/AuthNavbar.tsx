import Link from "next/link";

const AuthNavbar = () => {
  return (
    <header className="border-b border-(--border-default) bg-(--bg-surface)">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-(--text-primary)">
          PIDS Alarm Management
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-(--text-secondary) hover:text-(--text-primary)"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-(--brand-primary) hover:underline"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AuthNavbar;
