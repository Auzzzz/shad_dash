import { boolean } from "zod";
import { auth, signOut } from "../auth";
import { Session } from "node:inspector/promises";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { sign } from "node:crypto";
import { fusionClient } from "../fusionClient";

// Check if the JWT is valid by checking with FA
//TODO: add TS to session
export async function isTokenValid() {
  try {
    const session = await auth();
    if (!session) {
      return false;
    }

    await fusionClient.validateJWT(session.accessToken).then((check) => {
      console.log("check", check);
      if (check.statusCode !== 200) {
        console.log("Token is not valid");
        return false;
      }
      return true
    });
    
    // If we reach here, the token is valid
    return true

  } catch (error) {
    console.error("Error validating token:", error);

    if(error.statusCode === 401) {
      // User is not signed in
      console.log("401")
      return false;
    }

    console.log("Session error", error);
    return false;
  }
}

export async function getCurrentUser()

// export default async function isLogged() {
//   try {
//     const session = await auth();

//     if (!session) {
//       return false;
//     }

//     if (session.jwt.accessTokenExpires * 1000 > Date.now()) {
//       console.log("Session expired");
//       redirect("/login");
//       return false;
//     }

//     if (session.jwt.accessTokenExpires * 1000 > Date.now()) {
//       return session.jwt.user.id;
//     }
//   } catch (error) {
//     console.error("Error retrieving session:", error);
//     return false;
//   }

//   return false;
// }

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session) {
      return { error: "No session found", bool: false };
    } else {
      return { bool: true, user: session.user.id };
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
    signOut({ redirectTo: "/login" });
    return { error: "Error retrieving user information", bool: false };
  }
}

export async function thisone() {
  // check the access token is not expired
  const session = await auth();
  if (!session) {
    return false;
  }
  if (session.jwt && session.jwt.accessTokenExpires) {
    const exp = new Date(session.jwt.accessTokenExpires * 1000);
    if (exp < new Date()) {
      console.log("Session expired");
      signOut({ redirectTo: "/login" });
      return false;
    }
  } else {
    console.log("No Session");
    return false;
  }
}

export async function temp() {
  const session = await auth();

  try {
    if (!session) {
      return { error: "No session found", bool: false };
    } else {
      return { bool: true, user: session };
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
    return { error: "Error retrieving user information", bool: false };
  }
}
