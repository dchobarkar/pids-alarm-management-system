"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok || data?.error) {
        setError(data?.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/auth/signin");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <Card title="Create account">
        <p className="text-(--text-secondary) mb-4">
          Register for access to the PIDS Alarm Management System.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
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
            autoComplete="new-password"
            helperText="At least 8 characters"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={loading}>
              Register
            </Button>
            <Link href="/auth/signin" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;

