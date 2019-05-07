export interface IGapiUser {
    // aliases: IGapiAlias[];
    emails: IGapiEmails[];
    id: string;
    nonEditableAliases: IGapiAlias[];
    orgas: string;
    // password: string;
    primaryEmail: string;
    // sendAs: string;
    // signature: string;
}

export interface IGapiEmails {
    address: string;
}

export interface IGapiAlias {
    displayName: string;
    isDefault: boolean;
    isPrimary: boolean;
    replyToAddress: string;
    sendAsEmail: string;
    signature: string;
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
