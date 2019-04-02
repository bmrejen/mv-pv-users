export interface IJamespotUser {
    properties: {
        active: string,
        company?: string,
        timeZone?: string,
    };
    Country: string;
    Firstname: string;
    idUser: string;
    img: string;
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
