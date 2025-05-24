import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import FusionAuthProvider from "next-auth/providers/fusionauth";
import NextAuth, { NextAuthOptions } from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth";

import { db } from "~/server/db";

//TODO: Type safety

interface FusionAuthJWT extends Record<string, unknown> {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
  error?: "RefreshAccessTokenError";
}

interface FusionAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
  accessToken?: string;
  error?: "RefreshAccessTokenError";
}

export const authConfig: NextAuthOptions = {
  providers: [
    FusionAuthProvider({
      clientId: process.env.FUSIONAUTH_CLIENT_ID!,
      clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET!,
      issuer: process.env.FUSIONAUTH_ISSUER!,
      authorization: {
        url: `${process.env.FUSIONAUTH_ISSUER}/oauth2/authorize`,
        params: {
          scope: "openid offline_access",
        },
      },
      token: {
        url: `${process.env.FUSIONAUTH_ISSUER}/oauth2/token`,
      },
      userinfo: `${process.env.FUSIONAUTH_ISSUER}/oauth2/userinfo`,
    }),
  ],

  session: {
    strategy: "jwt", // Use JWT for session management
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // If signing in, add user and account info to the token
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at!,
          user,
        };
      }
      // If the token is still valid, return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      console.log("Token expired, refreshing...");

      // If the token has expired, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Add token and user info to the session
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },

  debug: process.env.NODE_ENV === "development", // Enable debug logging in development
};

// Function to refresh the access token
async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.FUSIONAUTH_ISSUER}/oauth2/token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.FUSIONAUTH_CLIENT_ID!,
        client_secret: process.env.FUSIONAUTH_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Use new refresh token if provided
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth(authConfig);


// Define types for JWT, Session, and Profile
interface JWT {
  id?: string;
  email?: string;
}

interface Session {
  user: {
    id?: string;
    email?: string;
  };
  expires: string; // Add the required 'expires' property
}

interface Profile {
  sub: string;
  name?: string;
  preferred_username?: string;
  email: string;
  picture?: string;
}

