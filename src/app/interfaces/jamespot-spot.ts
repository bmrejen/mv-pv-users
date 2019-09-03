export interface IJamespotSpotConfig {
    id: string;
    isEnabled?: boolean;
    title: string;
    type?: string;
}

export interface IJamespotSpotListApiResponse {
    idSpot: string;
}

export interface IJamespotSpotApiResponse {
    idSpot: string;
    type: string;
    idUser: string;
    title: string;
    description: string;
    dateCreation: string;
    dateModified: string;
    privacy: string;
    category: string;
    language: string;
    image: string;
    edito: string;
    key: string;
    commentLevel: string;
    disable: string;
    useTeaser: string;
}
