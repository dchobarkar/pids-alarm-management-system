import Link from "next/link";

const AuthFooter = () => {
  return (
    <footer className="mt-auto border-t border-(--border-default) bg-(--bg-surface)">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-(--text-muted)">
        <span>© PIDS Alarm Management System. Internal use only.</span>
        <nav className="flex items-center gap-6">
          <Link href="/login" className="hover:text-(--text-secondary)">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-(--text-secondary)">
            Register
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default AuthFooter;
