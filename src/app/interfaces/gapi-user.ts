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
