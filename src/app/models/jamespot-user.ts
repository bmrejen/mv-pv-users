import { IJamespotUserConfig } from "../interfaces/jamespot-api-response";

export class JamespotUser implements IJamespotUserConfig {
    public country: string = "fr";
    public firstname: string;
    public language: string = "fr";
    public lastname: string;
    public mail: string;
    public username: string;
    public role: string = "User";
    public idUser: string;
    public img: string | File;
    public active: string = "1";
    public password: string;
    public phoneExtension: string;
    public timeZone: string = "Europe/Paris";
    public company: string = "MARCO VASCO";

    constructor(user: IJamespotUserConfig) {
        this.country = user.country || this.country;
        this.firstname = user.firstname || this.firstname;
        this.language = user.language || this.language;
        this.lastname = user.lastname || this.lastname;
        this.mail = user.mail || this.mail;
        this.username = user.username || this.username;
        this.role = user.role || this.role;
        this.idUser = user.idUser || this.idUser;
        this.img = user.img || this.img;
        this.active = user.active || this.active;
        this.password = user.password || this.password;
        this.phoneExtension = user.phoneExtension || this.phoneExtension;
        this.timeZone = user.timeZone || this.timeZone;
        this.company = user.company || this.company;
    }
}
