import AccountUserInformation from "~/components/account/userInfomation";
import { auth } from "~/server/auth";
import { getCurrentUser, isTokenValid } from "~/server/server_lib/isLogged";
import { fusionClient } from "~/server/fusionClient";
import type { UserRequest } from "@fusionauth/typescript-client";

async function getUserInformation(id: string) {
  try {
    const user = await fusionClient.retrieveUser(id);
    if (user.statusCode === 200) {
      return user.response.user;
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
  }
}

async function updateUser(id: string, updatedUserData: UserData) {
  try {
    const user = await fusionClient.updateUser(id, {
      user: {
        firstName: updatedUserData.first_name,
        lastName: updatedUserData.first_name,
        mobilePhone: updatedUserData.first_name,
        username: updatedUserData.first_name,
        imageUrl: updatedUserData.first_name,
      },
    });
    if (user.statusCode === 200) {
      console.log("raw response", user);
      return user.response.user;
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
  }
}

export type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  verified: boolean;
  last_login: number;
  active: boolean;
  mobile_number: string;
  username: string;
  imageUrl: string;
};

export type AccountFunctions = {
  updateUser: () => void;
}

export default async function Page() {
  // come back to this
  // isLogged()

  const yes = await isTokenValid();
  console.log("yes", yes);

  const session = await auth();
  const userInfo = await getUserInformation(session?.user?.id || "");

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
    console.log("Session user ID:", session?.user);
    console.log("User info ID:", userInfo?.id);
    // TODO: create error page
    return false;
  }
}
