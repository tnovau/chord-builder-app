import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { defaultLocale, Locale, locales } from "./i18n";
import { cookies } from "next/headers";

const localesArray = locales.map(locale => locale.code)
const acceptLanguageHeader = 'accept-language';

const localeCookieName = 'NEXT_LOCALE';

function getLocale(request: NextRequest) {
  const languages = new Negotiator({
    headers: {
      [acceptLanguageHeader]: request.headers.get(acceptLanguageHeader) || ''
    }
  }).languages()

  return match(languages, localesArray, defaultLocale)
}

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const { pathname } = request.nextUrl
  const pathnameHasLocale = localesArray.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    cookieStore.set(localeCookieName, pathname.split('/')[1], {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return NextResponse.next();
  };

  const localeCookie = cookieStore.get(localeCookieName)?.value;

  const locale = localeCookie && localesArray.includes(localeCookie as Locale) ?
    localeCookie as Locale :
    getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  cookieStore.set(localeCookieName, locale, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return NextResponse.redirect(request.nextUrl)
}

export const config: ProxyConfig = {
  matcher: [
    '/((?!(?:_next|api|favicon\.ico|ads\.txt|\.well-known/appspecific/com\.chrome\.devtools\.json)).*)'
  ],
}
