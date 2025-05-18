import { FusionAuthClient } from "@fusionauth/typescript-client";

export const fusionClient = new FusionAuthClient(
  process.env.FUSIONAUTH_API || "",
  process.env.FUSIONAUTH_ISSUER || "",
);



