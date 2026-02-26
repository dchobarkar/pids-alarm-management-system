import Link from "next/link";

import Button from "@/components/ui/Button";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-(--bg-app)">
      <h1 className="text-xl font-semibold text-(--text-primary) mb-2">
        Access denied
      </h1>
      <p className="text-(--text-secondary) mb-6">
        You do not have permission to view this page.
      </p>
      <Link href="/login">
        <Button>Back to sign in</Button>
      </Link>
    </div>
  );
};

export default Page;
