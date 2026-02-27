import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { defaultLocale, Locale, locales } from "./i18n";

const localesArray = locales.map(locale => locale.code)
const acceptLanguageHeader = 'accept-language';

const localeCookieName = 'NEXT_LOCALE';

function getLocale(request: NextRequest) {
  const languages = new Negotiator({
    headers: {
      [acceptLanguageHeader]: request.headers.get(acceptLanguageHeader) || ''
    }
  }).languages()

  return match(languages, localesArray, defaultLocale) as Locale;
}

const isLocaleCookieValid = (cookie: string | undefined): cookie is Locale => {
  return cookie !== undefined && localesArray.includes(cookie as Locale);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = localesArray.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, pathname.split('/')[1], {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return response;
  };

  const localeCookie = request.cookies.get(localeCookieName)?.value;

  const locale = isLocaleCookieValid(localeCookie) ?
    localeCookie :
    getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(request.nextUrl)
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
  return response;
}

export const config: ProxyConfig = {
  matcher: [
    '/((?!(?:_next|api|favicon\.ico|ads\.txt|\.well-known/appspecific/com\.chrome\.devtools\.json)).*)'
  ],
}
