"use server";
import AccountUserInformation from "~/components/account/userInfomation";
import { auth } from "~/server/auth";
import { isTokenValid } from "~/server/server_lib/isLogged";
import { fusionClient } from "~/server/fusionClient";
import type { UserData } from "~/lib/types/fusionAuth";
import LoggedOut from "~/components/account/loggedout";
import { Sign } from "crypto";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

async function getUserInformation(id: string) {
  try {
    const user = await fusionClient.retrieveUser(id);
    console.log("user1", user);
    if (user.statusCode === 200) {
      return user.response.user;
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
    return false;
  }
}

async function updateUser(updatedUserData: UserData) {
  "use server";
  try {
    // call FA to update user
    const user = await fusionClient.updateUser(updatedUserData.id, {
      user: {
        email: updatedUserData.email,
        firstName: updatedUserData.first_name,
        lastName: updatedUserData.last_name,
        mobilePhone: updatedUserData.mobile_number,
        username: updatedUserData.username,
        imageUrl: updatedUserData.imageUrl,
      },
    });
    if (user.statusCode === 200) {
      return user.response;
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
  }
}

export default async function Page() {
  const valid = await isTokenValid();
  const session = await auth();
  const userInfo = await getUserInformation(session?.user?.id || "");

  if (!valid) {
    console.log("Token is not valid, redirecting to login");
    redirect("/login");
  }
  if( userInfo === false) { redirect("/")}

  if (session?.user?.id === userInfo?.id) {
    const userData = {
      id: userInfo!.id,
      first_name: userInfo!.firstName,
      last_name: userInfo!.lastName,
      email: userInfo!.email,
      verified: userInfo!.verified,
      last_login: userInfo!.lastLoginInstant,
      active: true,
      mobile_number: userInfo!.mobilePhone,
      username: userInfo!.username,
      imageUrl: userInfo!.imageUrl,
    } as UserData;


    return (
      <AccountUserInformation userData={userData} updateUser={updateUser} />

    );
  } else {
    console.log("User info not matching");
    // TODO: create error page
    return <LoggedOut />;
  }
}
