export interface IJamespotUserFromApi {
    properties: {
        active: string,
        company?: string,
        timeZone?: string,
    };
    Country: string;
    Firstname: string;
    idUser: string;
    img: string | File;
    Language: string;
    Lastname: string;
    Mail: string;
    Pseudo: string;
    Role: string;
    field1?: string;
    field2?: string;
    field3?: string;
    field4?: string;
    field5?: string;
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
    country: string;
    firstname: string;
    language: string;
    lastname: string;
    mail: string;
    username: string;
    role: string;
    active: string;
    timeZone?: string;
    phoneExtension?: string;
    idUser?: string;
    img?: string | File;
    password?: string;
    company?: string;
}

export interface IJamespotUser {
    country: string;
    firstname: string;
    language: string;
    lastname: string;
    mail: string;
    username: string;
    role: string;
    active: string;
    timeZone?: string;
    phoneExtension?: string;
    idUser?: string;
    img?: string | File;
    password?: string;
    company?: string;
}
