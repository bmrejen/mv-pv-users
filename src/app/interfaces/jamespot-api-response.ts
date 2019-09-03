import { Spot } from "./../models/jamespot-spot";

export interface IJamespotUserFromApi {
    idUser: string;
    Mail: string;
    Pseudo: string;
    Firstname: string;
    Lastname: string;
    Language: string;
    Country: string;
    Role: string;
    img: string | File;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    field5?: string;
    properties: {
        active: string,
        company?: string,
        timeZone?: string,
        type: string,
        description: string,
        function?: string,
        department: string,
        phoneNumber: string,
        tag_2: {},
        tag_5: {},
        tag_8: {},
        mobileNumber: string,
        businessManagementManager: string,
    };
}

export interface IJamespotUserList {
    idUser: string;
}

export interface IJamespotApiResponse<T> {
    RC: {
        CODE: number,
        MSG: string,
    };
    VAL: T;
}

export interface IJamespotUserConfig {
    function?: string;
    country?: string;
    language?: string;
    role?: string;
    active?: boolean;
    timeZone?: string;
    phoneExtension?: string;
    idUser?: string;
    img?: string | File;
    company?: string;
    destinations?: string[];
    teams?: string[];
    birthDate?: string;
    skypeUsername?: string;
    city?: {};
    service?: {};
    expertiseZone?: {};
    managerJamespotId?: string;
    spots?: Spot[];
}

export interface IJamespotUser {
    active: boolean;
    company?: string;
    country: string;
    idUser?: string;
    img?: string | File;
    language: string;
    phoneExtension?: string;
    role: string;
    timeZone?: string;
}
