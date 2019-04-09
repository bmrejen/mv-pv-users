export class JamespotUser {
    public Country: string = "fr";
    public Firstname: string;
    public Language: string = "fr";
    public Lastname: string;
    public Mail: string;
    public Pseudo: string;
    public Role: string = "User";
    public idUser: string;
    public img: string | File;
    public active: string = "1";
    public password: string;
    public phoneExtension: string;
    public timeZone: string = "Europe/Paris";
    public company: string = "MARCO VASCO";

    constructor(
        Country,
        Firstname,
        Language,
        Lastname,
        Mail,
        Pseudo,
        Role,
        active,
        timeZone?,
        phoneExtension?,
        idUser?,
        img?,
        password?,
        company?) {
        this.Country = Country;
        this.Firstname = Firstname;
        this.Language = Language;
        this.Lastname = Lastname;
        this.Mail = Mail;
        this.Pseudo = Pseudo;
        this.Role = Role;
        this.idUser = idUser;
        this.img = img;
        this.active = active;
        this.password = password;
        this.phoneExtension = phoneExtension;
        this.timeZone = timeZone;
        this.company = company;
    }
}
