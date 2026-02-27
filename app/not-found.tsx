import Link from "next/link";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-app) px-6">
      <div className="w-full max-w-md">
        <Card title="Page not found">
          <p className="mb-4 text-(--text-secondary)">
            We couldn&apos;t find the page you were looking for.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button type="button">Go to home</Button>
            </Link>
            <Link href="/auth/signin">
              <Button type="button" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

