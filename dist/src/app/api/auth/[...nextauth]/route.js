"use strict";
// src/app/api/auth/[...nextauth]/route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = exports.authOptions = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const auth_1 = require("@/lib/auth"); 

exports.authOptions = {
    pages: {
        signIn: '/login',
    },
    // 👇 NEW: Configure Session and Cookie Settings for Robustness
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                // CRITICAL: Only set 'secure: true' if deploying to HTTPS and NEXTAUTH_URL starts with https
                secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https'),
            }
        },
    },
    // 👆 END NEW CONFIGURATION
    providers: [
        (0, credentials_1.default)({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                    return null;
                }
                // Use your custom login logic to verify the user
                const user = await (0, auth_1.login)(credentials.email, credentials.password);
                if (user) {
                    // Return the user object if login is successful
                    return user;
                }
                // Return null if login fails
                return null;
            },
        }),
    ],
    callbacks: {
        // This callback includes the user's ID and role in the session token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        // This callback makes the user's ID and role available in the session object
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
};
const handler = (0, next_auth_1.default)(exports.authOptions);
exports.GET = handler;
exports.POST = handler;
