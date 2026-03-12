"use client";

import Link from "next/link";
import dynamic from 'next/dynamic';
import { useLanguage } from "@/i18n/LanguageContext";

const ResendForm = dynamic(() => import('@/components/ResendForm'), {
  ssr: false,
  loading: () => <p className="text-wood-400 text-sm font-source mb-6">Loading...</p>
});

export default function VerifyEmailPage() {
  const { t, locale } = useLanguage();

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

        <ResendForm />

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
