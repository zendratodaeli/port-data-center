import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { cookies } = req;
  const accessGranted = cookies.get('access_granted');

  if (!accessGranted) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', ], // Add more routes if needed
};