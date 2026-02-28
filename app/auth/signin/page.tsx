"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { APP_NAME, EMAIL_REGEX, HOME_PATH } from "@/constants/auth";

type FieldErrors = {
  email?: string;
  password?: string;
};

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
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
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        callbackUrl: HOME_PATH,
        redirect: false,
      });

      if (result?.error) {
        setSubmitError("Invalid email or password.");
        return;
      }

      if (result?.url) {
        router.push(result.url);
      } else {
        router.push(HOME_PATH);
      }
    } catch {
      setSubmitError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Sign in">
      <p className="text-(--text-secondary) mb-4">
        Enter your credentials to access {APP_NAME}.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && <Alert variant="error">{submitError}</Alert>}
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email)
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
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
            if (fieldErrors.password)
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          autoComplete="current-password"
          error={fieldErrors.password}
          required
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href={HOME_PATH} className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Back
            </Button>
          </Link>

          <Button type="submit" className="flex-1" loading={loading}>
            Sign in
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Page;
