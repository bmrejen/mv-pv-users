export class JamespotUser {
    public Country = "fr";
    public Firstname;
    public Language = "fr";
    public Lastname;
    public Mail;
    public Pseudo;
    public Role = "User";
    public idUser;
    public img;
    public active = "1";
    public password;
    public phoneExtension;
    public timeZone = "Europe/Paris";
    public company = "MARCO VASCO";

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
