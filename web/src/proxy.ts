import {NextRequest, NextResponse} from 'next/server';
import {resolveLocale} from './lib/locale';
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') return NextResponse.next();
  const locale = resolveLocale(request.headers.get('accept-language') ?? '', request.cookies.get('simhae_locale')?.value);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Vary', 'Accept-Language, Cookie');
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = {matcher: ['/']};
