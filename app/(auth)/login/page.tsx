"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const displayError =
    error ||
    (urlError === "CredentialsSignin" ? "Invalid email or password." : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email || !password) {
        setError("Email and password are required.");
        setLoading(false);
        return;
      }
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/auth/redirect",
        redirect: true,
      });
      setError("Sign in failed. Please try again.");
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <Card title="Sign in">
        <p className="text-(--text-secondary) mb-4">
          Enter your credentials to access the PIDS Alarm Management System.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && <Alert variant="error">{displayError}</Alert>}
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={loading}>
              Sign in
            </Button>
            <Link href="/" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Back
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-12 text-(--text-muted)">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
