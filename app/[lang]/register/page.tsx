"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/i18n/LanguageContext";

export default function RegisterPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t.auth.errorPasswordLength);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.errorPasswordMismatch);
      return;
    }

    setLoading(true);

    const { error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (authError) {
      setError(authError.message ?? t.auth.errorGeneric);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href={`/${locale}`}
          className="text-wood-400 hover:text-wood-200 text-sm font-source transition-colors inline-block mb-8"
        >
          {t.auth.backToHome}
        </Link>

        <h1 className="font-playfair text-3xl text-wood-50 mb-2">
          {t.auth.register}
        </h1>
        <p className="text-wood-500 text-sm font-source font-light mb-8">
          {t.header.tagline}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-[11px] tracking-[3px] text-wood-400 uppercase mb-2 font-source"
            >
              {t.auth.name}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-wood-900/60 border border-wood-800 rounded-lg px-4 py-3 text-wood-50 font-source placeholder:text-wood-600 focus:outline-none focus:border-wood-300 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[11px] tracking-[3px] text-wood-400 uppercase mb-2 font-source"
            >
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-wood-900/60 border border-wood-800 rounded-lg px-4 py-3 text-wood-50 font-source placeholder:text-wood-600 focus:outline-none focus:border-wood-300 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] tracking-[3px] text-wood-400 uppercase mb-2 font-source"
            >
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-wood-900/60 border border-wood-800 rounded-lg px-4 py-3 text-wood-50 font-source placeholder:text-wood-600 focus:outline-none focus:border-wood-300 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-[11px] tracking-[3px] text-wood-400 uppercase mb-2 font-source"
            >
              {t.auth.confirmPassword}
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-wood-900/60 border border-wood-800 rounded-lg px-4 py-3 text-wood-50 font-source placeholder:text-wood-600 focus:outline-none focus:border-wood-300 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-source animate-fade-up">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-wood-300 to-wood-200 text-wood-950 font-source font-medium py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.auth.registering : t.auth.registerButton}
          </button>
        </form>

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
