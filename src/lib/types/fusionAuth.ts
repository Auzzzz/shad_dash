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
    data: {};
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
        data: {};
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
