import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextApiRequest & NextRequest, ev: NextFetchEvent) {
    const token = await getToken({
        req,
        secret: process.env.JWT_SECRET,
    });

    const { page: { name: pathname } } = req;
    if (token === null) {
        //Protecting authenticated routes
        if (pathname === "/api/places"
            || pathname === "/api/submitBlog"
            || pathname === "/compose"
            || pathname == "/profile"
        ) {
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        else {
            return NextResponse.next()
        }
    }
    // if authenticated, trying to access login redirects to home
    if (token && pathname === `/login`) {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
    //All authenticated requests
    return NextResponse.next();
}