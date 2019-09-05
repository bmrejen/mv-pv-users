import { IJamespotUser, IJamespotUserConfig } from "../interfaces/jamespot-api-response";

export class JamespotUser implements IJamespotUser {
    public country: string = "fr";
    public language: string = "fr";
    public role: string = "User";
    public idUser: string = null;
    public image: string | File;
    public active: boolean = true;
    public phoneExtension: string = "";
    public timeZone: string = "Europe/Paris";
    public company: string = "MARCO VASCO";
    public destinations: string[] = [];
    public teams: string[] = [];
    public birthDate: string = "";  // Birth date
    public skypeUsername: string = "";  // Pseudo Skype
    public city = {}; // Ville de travail
    public service = {}; // Service
    public expertiseZone = {}; // Zone d'expertises
    public managerJamespotId: string = ""; // Jamespot id of manager, eg. user/258

    constructor(data: IJamespotUserConfig) {
        this.language = data.language || this.language;
        this.role = data.role || this.role;
        this.idUser = data.idUser || this.idUser;
        this.image = data.img || this.image;
        this.phoneExtension = data.phoneExtension || this.phoneExtension;
        this.timeZone = data.timeZone || this.timeZone;
        this.company = data.company || this.company;
        this.country = data.country || this.country;
        this.active = data.active != null ? data.active : this.active;
        this.destinations = data.destinations || this.destinations;
        this.teams = data.teams || this.teams;
        this.birthDate = data.birthDate || this.birthDate;
        this.skypeUsername = data.skypeUsername || this.skypeUsername;
        this.city = data.city || this.city;
        this.service = data.service || this.service;
        this.expertiseZone = data.expertiseZone || this.expertiseZone;
        this.managerJamespotId = data.managerJamespotId || this.managerJamespotId;
    }
}
