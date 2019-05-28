import { IJamespotUser, IJamespotUserConfig } from "../interfaces/jamespot-api-response";

export class JamespotUser implements IJamespotUser {
    public country: string = "fr";
    public language: string = "fr";
    public mail: string = "";
    public username: string = "";
    public role: string = "User";
    public idUser: string = null;
    public image: string | File;
    public active: string = "1";
    public phoneExtension: string = "";
    public timeZone: string = "Europe/Paris";
    public company: string = "MARCO VASCO";

    constructor(data: any) {
        this.language = data.language || this.language;
        this.mail = data.mail || this.mail;
        this.username = data.username || this.username;
        this.role = data.role || this.role;
        this.idUser = data.idUser || this.idUser;
        this.image = data.img || this.image;
        this.active = data.active || this.active;
        this.phoneExtension = data.phoneExtension || this.phoneExtension;
        this.timeZone = data.timeZone || this.timeZone;
        this.company = data.company || this.company;
        this.country = data.country || this.country;
    }
}
