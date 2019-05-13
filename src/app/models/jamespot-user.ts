import { IJamespotUser, IJamespotUserConfig } from "../interfaces/jamespot-api-response";

export class JamespotUser implements IJamespotUser {
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
    public phoneExtension: string;
    public timeZone: string = "Europe/Paris";
    public company: string = "MARCO VASCO";

    constructor(data: any) {
        this.firstname = data.firstname || this.firstname;
        this.language = data.language || this.language;
        this.lastname = data.lastname || this.lastname;
        this.mail = data.mail || this.mail;
        this.username = data.username || this.username;
        this.role = data.role || this.role;
        this.idUser = data.idUser || this.idUser;
        this.img = data.img || this.img;
        this.active = data.active || this.active;
        this.phoneExtension = data.phoneExtension || this.phoneExtension;
        this.timeZone = data.timeZone || this.timeZone;
        this.company = data.company || this.company;
        this.country = data.country || this.country;
    }
}
