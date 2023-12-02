// Library imports
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Custom imports
import { LOGIN_URL } from "@/constants"

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'CodeBuddy Credentials',

            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: 'Email:',
                    type: 'text',
                    placeholder: 'Type your e-mail here'
                },
                password: {
                    label: 'Password:',
                    type: 'password',
                    placeholder: 'Type your password here'
                }
            },
            
            async authorize(credentials) {
                // Look up the user from the credentials supplied
                const res = await fetch(LOGIN_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password
                    }),
                })
                const user = await res.json();

                if (user) {
                    // The returned object will be saved in the `user` property
                    // of the JWT
                    return user;
                }
                else {
                    // Returning `null` will cause an error to be displayed
                    // advising the user to check their credentials
                    // You can also Reject this callback with an Error thus
                    // the user will be sent to the error page with the error
                    // message as a query parameter
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
    pages: {
        signIn: '/auth',
    //   signOut: '/api/auth/signout',
    //   error: '/api/auth/error', // Error code passed in query string as ?error=
    //   verifyRequest: '/api/auth/verify-request', // (used for check email message)
    //   newUser: '/api/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    // session: {

    // }
};