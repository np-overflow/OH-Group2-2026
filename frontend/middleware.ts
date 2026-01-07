import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only restrict access to /adminpanel
    if (request.nextUrl.pathname.startsWith('/adminpanel')) {
        // Get the original client IP from Cloudflare header
        const ip = request.headers.get('x-forwarded-for') // x-forwarded-for
        console.log(ip)

        // If no IP header is present (not behind Cloudflare) or IP doesn't match
        // we block access. 
        // WARN: If you are testing locally without Cloudflare, this will block you.
        // You might want to allow '::1' or '127.0.0.1' for local dev if needed,
        // but the user specifically asked for this IP.
        if (ip === '153.20.116.45') {
            return NextResponse.next()
        }
    }
    return new NextResponse('Forbidden', { status: 403 })
}

export const config = {
    matcher: '/adminpanel/:path*',
}
