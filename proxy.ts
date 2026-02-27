import { NextRequest, NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const ENGLISH = 'en'
const SPANISH = 'es'
const defaultLocale = ENGLISH
const locales = [ENGLISH, SPANISH]

const acceptLanguageHeader = 'accept-language'

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const languages = new Negotiator({
    headers: {
      [acceptLanguageHeader]: request.headers.get(acceptLanguageHeader) || ''
    }
  }).languages()

  return match(languages, locales, defaultLocale)
}

export function proxy(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!(?:_next|api|favicon\.ico|ads\.txt|\.well-known/appspecific/com\.chrome\.devtools\.json)).*)'
    // Optional: only run on root (/) URL
    // '/'
  ],
}