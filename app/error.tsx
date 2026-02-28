"use client";

import { useEffect } from "react";
import Link from "next/link";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-app) px-6">
      <div className="w-full max-w-md">
        <Card title="Something went wrong">
          <p className="mb-4 text-(--text-secondary)">
            An unexpected error occurred while loading the PIDS Alarm Management
            System.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
            <Link href="/">
              <Button type="button" variant="secondary">
                Go to home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlobalError;
