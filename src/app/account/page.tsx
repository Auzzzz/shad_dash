
import AccountUserInformation from "~/components/account/userInfomation";
import { auth } from "~/server/auth";
import isLogged, { getCurrentUser, isTokenValid } from "~/server/server_lib/isLogged";
import { fusionClient } from "~/server/fusionClient";

async function getUserInformation(email: string) {
  try {
  const user = await fusionClient.retrieveUserByEmail(email);
  if(user.statusCode === 200) {
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
};


export default async function Page() {
  // come back to this
  // isLogged()
  const yes = await isTokenValid()
  console.log("yes", yes)

  
  const currentUser = await getCurrentUser();


  const session = await auth();
  console.log("currentUser", currentUser);


  const userInfo = await getUserInformation("BuildM8@test.com");

  const userData = {
    id: userInfo!.id,
    first_name: userInfo!.firstName,
    last_name: userInfo!.lastName,
    email: userInfo!.email,
  }
  
  return <AccountUserInformation userData={userData}/>;
}