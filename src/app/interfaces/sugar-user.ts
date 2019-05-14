export interface ISugarUserFromApi {
    attributes: {
        codeSonGalileo: string;
        department: string;
        email: string;
        employeeStatus: string;
        firstName: string;
        id: string;
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
        teamId: string;
        title: string;
        tourplanID: string;
        userName: string;
    };
    id: string;
    type: string;
}

export interface ISugarUserConfig {
    id: string;
    userName: string;
    salutation: string;
    phoneHome: string;
    phoneMobile: string;
    phoneWork: string;
    phoneOther: string;
    phoneFax: string;
    phoneAsterisk: string;
    email: string;
    status: string;
    employeeStatus: string;
    title: string;
    managerId: string;
    department: string;
    officeId: string;
    teamId: string;
    tourplanID: string;
    swClickToCall: string;
    swCallNotification: string;
    swAllowRemoteCalls: string;
    codeSonGalileo: string;
    type: string;

    // Following properties are not returned by the API

    // userToCopyHPfrom: string;
    // inheritsPreferencesFrom: string;
    // role: Role;
    // functionId: string;
    // destinations: Destination[];
    // others: Other[];
    // roles: Role[];
    // ggOrganisationId: string;
    // ggGroups: string;
    // isAdmin: boolean;
    // apiPortalUser: boolean;
    // assignationNotification: boolean;
    // userGroup: boolean;
    // defaultTeams: number;
    // leadsMin: number;
    // leadsMax: number;
}

interface ICommonProperties {
    firstName: string;
    lastName: string;
}

// Firstname and lastname will come from Sugar
export interface ISugarConfigAndName {
    common: ICommonProperties;
    sugar: ISugarUserConfig;
}
