import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for handling 301/302 redirects from WordPress URLs
 *
 * This middleware runs on every request and checks if the URL matches
 * any old WordPress URLs that need to be redirected to new Next.js routes.
 */

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    // Check database for redirect rule
    const redirectUrl = await checkDatabaseRedirect(pathname);

    if (redirectUrl) {
      // Preserve query parameters
      const url = new URL(redirectUrl, request.url);
      if (search) {
        url.search = search;
      }

      // Log redirect
      console.log(`Redirecting: ${pathname} → ${url.pathname}`);

      // Increment hit counter (fire and forget)
      incrementRedirectHit(pathname).catch(console.error);

      return NextResponse.redirect(url, 301);
    }

    // Common WordPress URL patterns to redirect
    // These handle common WordPress URL structures without hitting the database
    const quickRedirects = getQuickRedirects(pathname);
    if (quickRedirects) {
      const url = request.nextUrl.clone();
      url.pathname = quickRedirects;
      if (search) {
        url.search = search;
      }

      console.log(`Quick redirect: ${pathname} → ${url.pathname}`);
      return NextResponse.redirect(url, 301);
    }

    // Handle trailing slashes
    if (pathname !== '/' && pathname.endsWith('/')) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice(0, -1);
      return NextResponse.redirect(url, 301);
    }

  } catch (error) {
    console.error('Middleware redirect error:', error);
    // Continue normally on error
  }

  return NextResponse.next();
}

/**
 * Quick pattern-based redirects for common WordPress URL structures
 */
function getQuickRedirects(pathname: string): string | null {
  // /category/slug/ → /category/slug
  if (pathname.match(/^\/category\/[^\/]+\/$/)) {
    return pathname.slice(0, -1);
  }

  // /tag/slug/ → /tag/slug
  if (pathname.match(/^\/tag\/[^\/]+\/$/)) {
    return pathname.slice(0, -1);
  }

  // /author/slug/ → /author/slug
  if (pathname.match(/^\/author\/[^\/]+\/$/)) {
    return pathname.slice(0, -1);
  }

  // /YYYY/MM/DD/post-slug/ → /blog/post-slug
  const datePostMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/]+)\/?$/);
  if (datePostMatch) {
    return `/blog/${datePostMatch[4]}`;
  }

  // /blog/YYYY/MM/DD/post-slug/ → /blog/post-slug
  const blogDateMatch = pathname.match(/^\/blog\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/]+)\/?$/);
  if (blogDateMatch) {
    return `/blog/${blogDateMatch[4]}`;
  }

  // /page/2/ → /page/2
  if (pathname.match(/^\/page\/\d+\/$/)) {
    return pathname.slice(0, -1);
  }

  return null;
}

/**
 * Check database for custom redirect rules
 * This would query your URLRedirect table in production
 */
async function checkDatabaseRedirect(pathname: string): Promise<string | null> {
  // In a real implementation, this would query your database
  // For now, we return null to skip database lookups
  // You can enable this when you have URL redirects in your database

  /*
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/redirects/check?path=${encodeURIComponent(pathname)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return data.newUrl || null;
    }
  } catch (error) {
    console.error('Database redirect check failed:', error);
  }
  */

  return null;
}

/**
 * Increment hit counter for redirect (analytics)
 */
async function incrementRedirectHit(pathname: string): Promise<void> {
  // Fire and forget - don't block the redirect
  /*
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/redirects/hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldUrl: pathname })
    });
  } catch (error) {
    // Silent fail - don't block redirect
  }
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
