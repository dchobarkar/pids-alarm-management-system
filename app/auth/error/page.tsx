"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

const Page = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const message = getErrorMessage(errorCode);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-(--bg-app)">
      <div className="max-w-md w-full">
        <Card title="Authentication error">
          <p className="text-(--text-secondary) mb-6">{message}</p>
          <div className="flex gap-3">
            <Link href="/auth/signin">
              <Button>Back to sign in</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Go to home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
