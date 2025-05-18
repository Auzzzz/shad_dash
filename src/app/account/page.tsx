
import AccountUserInformation from "~/components/account/userInfomation";

import  getServerSession  from "next-auth";
import { authConfig } from "~/server/auth/config";
import { auth } from "~/server/auth";

async function getUserInfomation() {}


export default async function Page() {

  const session = await auth()

  console.log("Session: ", session);
  console.log(JSON.stringify(session, null, 2));



  return <AccountUserInformation />;
}