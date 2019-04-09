export interface IGapiUser {
    emails: IGapiEmails[];
    familyName: string;
    fullName: string;
    givenName: string;
    id: string;
    orgas: string;
    password: string;
    primaryEmail: string;
    primaryEmailSuffix: string;
}

export interface IGapiEmails {
    address: string;
}

export interface IGapiRequest {
    userKey: string;
    resource: {
        name?: {
            familyName?: string,
            fullName?: string,
            givenName?: string,
        },
        orgUnitPath?: string,
        password?: string,
        primaryEmail?: string,
    };
}
