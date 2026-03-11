"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/i18n/LanguageContext";

export default function HeaderAuth() {
  const { data: session, isPending } = authClient.useSession();
  const { t, locale } = useLanguage();

  if (isPending) {
    return <div className="h-5 w-20 bg-wood-800/50 rounded animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-wood-400 text-xs font-source truncate max-w-[120px]">
          {session.user.name}
        </span>
        <button
          onClick={() => authClient.signOut()}
          className="text-[11px] tracking-[2px] uppercase text-wood-500 hover:text-wood-200 font-source transition-colors"
        >
          {t.auth.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/${locale}/login`}
        className="text-[11px] tracking-[2px] uppercase text-wood-400 hover:text-wood-200 font-source transition-colors"
      >
        {t.auth.login}
      </Link>
      <span className="text-wood-700">|</span>
      <Link
        href={`/${locale}/register`}
        className="text-[11px] tracking-[2px] uppercase text-wood-300 hover:text-wood-200 font-source transition-colors"
      >
        {t.auth.register}
      </Link>
    </div>
  );
}
