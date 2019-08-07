export interface ISugarUserFromApi {
    data: {
        attributes: {
            codeSonGalileo: string;
            department: string;
            email: string;
            employeeStatus: string;
            firstName: string;
            id?: string;
            jamespotId: string;
            lastName: string;
            managerId: string;
            officeId: string;
            phoneAsterisk: string;
            phoneFax: string;
            phoneHome: string;
            phoneMobile: string;
            phoneOther: string;
            phoneWork: string;
            roleId: string;
            salutation: string;
            status: string;
            swAllowRemoteCalls: string;
            swCallNotification: string;
            swClickToCall: string;
            teamId: string;
            title: string;
            tourplanID: string;
            userName: string;
        };
        id?: string;
        type: string;
    };
}

export interface ISugarUserToApi {
    data: {
        attributes: {
            codeSonGalileo: string;
            department: string;
            email: string;
            employeeStatus: string;
            firstName: string;
            id?: string;
            jamespotId?: string;
            lastName: string;
            managerId: string;
            officeId: string;
            phoneAsterisk: string;
            phoneFax: string;
            phoneHome: string;
            phoneMobile: string;
            phoneOther: string;
            phoneWork: string;
            salutation: string;
            status: string;
            swAllowRemoteCalls: string;
            swCallNotification: string;
            swClickToCall: string;
            title: string;
            tourplanID: string;
            userName: string;
        };
        id?: string;
        destinations: string[];
        roles: string[];
        teams: string[];
        type: string;
    };
}

export interface ISugarUserConfig {
    id?: string;
    jamespotId?: string;
    salutation: string;
    phoneHome: string;
    phoneMobile: string;
    phoneWork: string;
    phoneOther: string;
    phoneFax: string;
    phoneAsterisk: string;
    status: string;
    employeeStatus: string;
    title: string;
    managerId: string;
    department: string;
    officeId: string;
    tourplanID: string;
    swClickToCall: boolean;
    swCallNotification: boolean;
    swAllowRemoteCalls: boolean;
    codeSonGalileo: string;
    teams: string[];
    type: string;

    // Following properties are not returned by the API

    // teams: string[];
    // userToCopyHPfrom: string;
    // inheritsPreferencesFrom: string;
    // role: Role;
    // functionId: string;
    // destinations: Destination[];
    // others: Other[];
    // roles: Role[];
    // ggOrganisationId: string;
    // isAdmin: boolean;
    // apiPortalUser: boolean;
    // assignationNotification: boolean;
    // userGroup: boolean;
    // defaultTeams: number;
    // leadsMin: number;
    // leadsMax: number;
}

export interface ICommonProperties {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    password?: string;
}

// Firstname and lastname will come from Sugar
export interface ISugarConfigAndName {
    common: ICommonProperties;
    sugar: ISugarUserConfig;
}
