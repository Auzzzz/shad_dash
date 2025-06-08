import type { JWT } from "@fusionauth/typescript-client";

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

// Returned from FA in getUserInformation()
export type FusionAuthUser = {
  user: {
    active: boolean;
    connectorId: string;
    data: object;
    email: string;
    encryptionScheme: string;
    factor: number;
    firstName: string;
    id: string;
    imageUrl?: string;
    insertInstant: number;
    lastLoginInstant: number;
    lastName: string;
    lastUpdateInstant: number;
    memberships: string[];
    mobilePhone?: string;
    passwordChangeRequired: boolean;
    passwordLastUpdateInstant: number;
    preferredLanguages: string[];
    registration: [
      {
        applicationId: string;
        data: object;
        id: string;
        insertInstant: number;
        lastUpdateInstant: number;
        roles: string[];
      },
    ];
    tenantId: string;
    timezone?: string;
    twoFactor: {
      methods: [];
      recoveryCodes: [];
    };
    uniqueUsername: string;
    username: string;
    usernameStatus: string;
    verified: boolean;
    verifiedInstant: number;
  };
};

export type configJWT = JWT & {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  user: {
    id: string;
  };
  iat: number;
  exp: number;
  jti: string;
};

export type configAccount = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type configSession = {
  user: { id: string},
  expires: string;
  accessToken: string;
  accessTokenExpires: number;
  error: string;
}

// New

export type jwtToken = {
  name?: string;
    email?: string;
    picture?: string;
    sub?: string;
}

export type jwtUser = {
    id?: string;
    email?: string;
    name?: string;
}

export type jwtAccount = {
  access_token: string;
    expires_in: number
    id_token: string;
    refresh_token: string;
    refresh_token_id: string;
    scope: string;
    token_type: string;
    userId: string;
    expires_at: number;
    provider: string;
    type: string;
    providerAccountId: string;
}

export type jwtProfile = {
  sub: string;
  tid: string;
}

export type jwtReturn = {
  token: jwtToken;
  account: jwtAccount
}
