"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from "@/constants/auth";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setFieldErrors({});

    if (!validate()) return;

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

      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok || data?.error) {
        setSubmitError(data?.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/auth/signin");
    } catch {
      setSubmitError("Registration failed. Please try again.");
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
          {submitError && <Alert variant="error">{submitError}</Alert>}
          <Input
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
            autoComplete="name"
            error={fieldErrors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            autoComplete="email"
            error={fieldErrors.email}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              if (fieldErrors.confirmPassword && e.target.value === confirmPassword)
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            autoComplete="new-password"
            helperText="At least 8 characters"
            error={fieldErrors.password}
            required
          />
          <PasswordInput
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword)
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
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

export default Page;
