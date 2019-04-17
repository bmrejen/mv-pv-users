import { IJamespotUser, IJamespotUserConfig } from "../interfaces/jamespot-api-response";

export class JamespotUser implements IJamespotUser {
    public jamesCountry: string = "fr";
    public jamesFirstname: string;
    public jamesLanguage: string = "fr";
    public jamesLastname: string;
    public jamesMail: string;
    public jamesUsername: string;
    public jamesRole: string = "User";
    public jamesIdUser: string;
    public jamesImg: string | File;
    public jamesActive: string = "1";
    public jamesPassword: string;
    public jamesPhoneExtension: string;
    public jamesTimeZone: string = "Europe/Paris";
    public jamesCompany: string = "MARCO VASCO";

    constructor(user: IJamespotUserConfig) {
        this.jamesCountry = user.country || this.jamesCountry;
        this.jamesFirstname = user.firstname || this.jamesFirstname;
        this.jamesLanguage = user.language || this.jamesLanguage;
        this.jamesLastname = user.lastname || this.jamesLastname;
        this.jamesMail = user.mail || this.jamesMail;
        this.jamesUsername = user.username || this.jamesUsername;
        this.jamesRole = user.role || this.jamesRole;
        this.jamesIdUser = user.idUser || this.jamesIdUser;
        this.jamesImg = user.img || this.jamesImg;
        this.jamesActive = user.active || this.jamesActive;
        this.jamesPassword = user.password || this.jamesPassword;
        this.jamesPhoneExtension = user.phoneExtension || this.jamesPhoneExtension;
        this.jamesTimeZone = user.timeZone || this.jamesTimeZone;
        this.jamesCompany = user.company || this.jamesCompany;
    }
}
