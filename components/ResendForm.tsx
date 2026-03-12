"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResendForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const email = typeof emailParam === "string" ? emailParam : null;

  const { t, locale } = useLanguage();
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
    <>
      <p className="text-wood-200 text-sm font-source font-medium mb-8">
        {email}
      </p>

      <p className="text-wood-500 text-xs font-source mb-6">
        {t.auth.verifyEmailNotReceived}
      </p>

      <button
        onClick={handleResend}
        disabled={resending}
        className="w-full bg-gradient-to-r from-wood-300 to-wood-200 text-wood-950 font-source font-medium py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resending ? t.auth.verifyEmailResending : t.auth.verifyEmailResend}
      </button>

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
    </>
  )
}