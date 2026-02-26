import Link from "next/link";

import Button from "@/components/ui/Button";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-(--bg-app)">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
          PIDS Alarm Management System
        </h1>

        <p className="text-(--text-secondary) mb-8">
          Territory-mapped alarm dispatch and field investigation platform for
          pipeline intrusion detection operations.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
