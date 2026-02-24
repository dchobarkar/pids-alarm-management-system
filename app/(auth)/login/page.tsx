"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Placeholder: replace with real auth API
      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }
      // Simulate login success
      await new Promise((r) => setTimeout(r, 600));
      router.push("/dashboard");
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
          {error && <Alert variant="error">{error}</Alert>}
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
            <Link href="/register" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Create account
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
