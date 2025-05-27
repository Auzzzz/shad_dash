import { boolean } from "zod";
import { auth, signOut } from "../auth";
import { Session } from "node:inspector/promises";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { sign } from "node:crypto";
import { fusionClient } from "../fusionClient";
import LoggedOut from "~/components/account/loggedout";

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
      return true;
    });

    // If we reach here, the token is valid
    return true;
  } catch (error) {
    console.log("Error validating token:", error);

    if (error.statusCode === 401) {
      // User is not signed in
      console.log("401");
      return false;
    }

    console.log("Session error", error);
    return false;
  }
}

export async function getUserInformation(id: string) {
  try {
    const user = await fusionClient.retrieveUser(id);

    if (user.statusCode === 200) {
      return { user: user.response.user };
    } else {
      console.error("Error retrieving user information:", user.statusCode);
      return false;
    }
  } catch (error) {

    console.error("Error retrieving user information:", error);
  }
}
