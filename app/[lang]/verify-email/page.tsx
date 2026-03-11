"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/i18n/LanguageContext";

export default function VerifyEmailPage() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setResent(false);
    setError("");

    const { error: resendError } = await authClient.sendVerificationEmail({
      email,
      callbackURL: `/${locale}`,
    });

    if (resendError) {
      setError(resendError.message ?? t.auth.errorGeneric);
    } else {
      setResent(true);
    }
    setResending(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link
          href={`/${locale}`}
          className="text-wood-400 hover:text-wood-200 text-sm font-source transition-colors inline-block mb-8"
        >
          {t.auth.backToHome}
        </Link>

        <div className="mb-6 text-5xl">✉️</div>

        <h1 className="font-playfair text-3xl text-wood-50 mb-4">
          {t.auth.verifyEmailTitle}
        </h1>

        <p className="text-wood-400 text-sm font-source font-light mb-2">
          {t.auth.verifyEmailMessage}
        </p>

        {email && (
          <p className="text-wood-200 text-sm font-source font-medium mb-8">
            {email}
          </p>
        )}

        <p className="text-wood-500 text-xs font-source mb-6">
          {t.auth.verifyEmailNotReceived}
        </p>

        {email && (
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-gradient-to-r from-wood-300 to-wood-200 text-wood-950 font-source font-medium py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? t.auth.verifyEmailResending : t.auth.verifyEmailResend}
          </button>
        )}

        {resent && (
          <p className="text-green-400 text-sm font-source mt-4 animate-fade-up">
            {t.auth.verifyEmailResent}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm font-source mt-4 animate-fade-up">
            {error}
          </p>
        )}

        <p className="text-wood-500 text-sm font-source text-center mt-8">
          {t.auth.haveAccount}{" "}
          <Link
            href={`/${locale}/login`}
            className="text-wood-200 hover:text-wood-300 transition-colors underline underline-offset-2"
          >
            {t.auth.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
