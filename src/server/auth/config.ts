import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  providers: [
    FusionAuthProvider({
      clientId: process.env.FUSIONAUTH_CLIENT_ID,
      clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
      tenantId: process.env.FUSIONAUTH_TENANT_ID,
      issuer: process.env.FUSIONAUTH_ISSUER,
      userinfo: `${process.env.FUSIONAUTH_ISSUER}/oauth2/userinfo`,
      authorization: {
        url: `${process.env.FUSIONAUTH_ISSUER}/oauth2/authorize`,
        params: {
          scope: "openid offline_access ",
        },
      },
      token: {
        url: `${process.env.FUSIONAUTH_ISSUER}/oauth2/token`,
        conform: async (response: Response) => {
          if (response.status === 401) return response;

          const newHeaders = Array.from(response.headers.entries())
            .filter(([key]) => key.toLowerCase() !== "www-authenticate")
            .reduce((headers, [key, value]) => (headers.append(key, value), headers), new Headers());

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        },
      },
    }),
  ],

  // Use JWT for session management
  session: {
    strategy: "jwt",
  },
  //TODO: add correct TS types to auth callbacks
  //TODO: add more checks
  //TODO: check if FA session for site already exists
  // Customize JWT and session callbacks
  callbacks: {
    
    async jwt({ token, user, account }: { token: any, user?: any, account?: any }) {
      // console.log("aatoken", account );
      // Add user information to the token on sign-in
      if (account && user) {
        // console.log("account refresh token", account.refresh_token);
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at,
          user,
          idToken: account.id_token, // Include the id_token in the JWT
        };
      }

      // Check if the token has expired
      if (Date.now() < (token.accessTokenExpires * 1000)) {
        // console.log("token is still valid");
        // console.log("token", token);
        return token; // Token is still valid
      }

      // Token is expired
      return refreshAccessToken(token);
      // return token;
    },

    async session({ session, token }) {

      // Add token information to the session
      // session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.id = token.id_token as string;
      session.user = parseJwt(token.idToken);
      session.error = token.error;
      session.jwt = token;
      
      return session;
    },
     
      
     
  },

  // Optional: Customize pages
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },

  // Optional: Enable debug logging
  debug: process.env.NODE_ENV === "development",

} satisfies NextAuthConfig;


//TODO: add correct TS types to auth refreshAccessToken
async function refreshAccessToken(token: any) {
  try {
    // console.log("refreshing token");
    // console.log("refresh T", token.refreshToken);
    const url = `${process.env.FUSIONAUTH_ISSUER}/oauth2/token`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.FUSIONAUTH_CLIENT_ID || "",
        client_secret: process.env.FUSIONAUTH_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || "",
      }),
    });

    const refreshedToken = await response.json();
    // console.log("refreshed token", refreshedToken);
    if (!response.ok) {
      throw refreshedToken;
    }

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      id_token: refreshedToken.id_token, // Include the refreshed id_token
    };
  } catch (error) {
    // console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
    
  }

  export { authConfig as GET, authConfig as POST };

  //TODO: add correct TS types to auth parseJwt
  //Take ID token from FusionAuth and parse it to get user information / cut to just user details no JWT
  function parseJwt(token: any) {
    try {
      if (!token) {
        return ;
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(atob(base64))).user;
    }
    catch (error) {
      // console.log("error parseJWT", error);
      return;
    }
  }


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
}

interface Profile {
  sub: string;
  name?: string;
  preferred_username?: string;
  email: string;
  picture?: string;
}

