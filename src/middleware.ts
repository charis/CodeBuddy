// Library imports
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Custom imports
import { rateLimiter } from "@/app/lib/redis_rate-limiter";
import { getToken } from 'next-auth/jwt';

// Without a defined matcher, the following line applies next-auth
// to the entire project
//export { default } from 'next-auth/middleware';

// middleware is applied to all routes, use conditionals to select


// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: [
                            // Login / Signup: Must be logged out to view these
                            '/auth/:path*',
                            // Problem pages: Must be logged in to view these
                            '/problems/:path*',   
                            // Set limit to message API requests (i.e., Chat GPT requests)
                            '/api/message/:path*'
                        ]
                      };

// Regular expression pattern for authentication
const authMatcherPattern = new RegExp(`^/auth(/.*)?$`);
const problemsMatcherPattern = new RegExp(`^/problems/.*$`);
const messageApiMatcherPattern = new RegExp(`^/api/message(/.*)?$`);

export async function middleware(request: NextRequest) {
    const isAuthenticated = await getToken({ req: request }) !== null;

    const path = request.nextUrl.pathname;
    const isAuthPath = authMatcherPattern.test(path);
    const isMessageApiPath = messageApiMatcherPattern.test(path);
    const isProblemsPage = problemsMatcherPattern.test(path);

    // If the user tries to access the sign in or sign up page
    // and is authenticated, redirect them to home page.
    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // If the user tries to access a problem page but is
    // not authenticated, redirect them to the sign in page.
    if (isProblemsPage && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth', request.nextUrl));
    }
    
    // If the user send too often message API requests, block them
    // (i.e., limit the rate they send requests)
    if (isMessageApiPath) {
        const ip = request.ip ?? '127.0.0.1';

        try {
            const { success } = await rateLimiter.limit(ip);
          
            if (!success) {
                return new NextResponse('You are writing messages too fast. Please, slow down.');
            }
            return NextResponse.next();
        }
        catch (error) {
            return new NextResponse('Something with Upstash rate limit control went wrong');
        }
    }
};


