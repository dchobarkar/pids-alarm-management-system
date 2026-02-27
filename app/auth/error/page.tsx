"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "You must be signed in to view this page.",
  AccessDenied: "You do not have permission to view this page.",
  Configuration: "There is a problem with the server configuration.",
  Default: "An unexpected authentication error occurred. Please try again.",
};

const getErrorMessage = (code: string | null): string => {
  if (!code) return ERROR_MESSAGES.Default;
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default;
};

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const message = getErrorMessage(errorCode);

  return (
    <div className="max-w-md w-full">
      <Card title="Authentication error">
        <p className="text-(--text-secondary) text-center pt-10 mb-6">
          {message}
        </p>
        <div className="flex justify-between w-full">
          <Link href="/auth/signin">
            <Button>Back to sign in</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Go to home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-app)">
      <Suspense
        fallback={
          <div className="max-w-md w-full">
            <Card title="Authentication error">
              <p className="text-(--text-secondary) pt-10 mb-6 text-center">
                Loading…
              </p>
            </Card>
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
};

export default Page;
