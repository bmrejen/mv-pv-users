export interface IJamespotUser {
    properties: {
        active: string,
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
