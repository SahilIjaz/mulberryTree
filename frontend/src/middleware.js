import { NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/profile/edit', '/recipes/create', '/courses/create', '/events/create'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/edit', '/recipes/create', '/courses/create', '/events/create'],
};
