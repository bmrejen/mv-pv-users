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
    }
}
