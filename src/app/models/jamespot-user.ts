export class JamespotUser {
    public Country;
    public Firstname;
    public Language;
    public Lastname;
    public Mail;
    public Pseudo;
    public Role;
    public idUser;
    public img;
    public active;
    public password;

    constructor(
        Country,
        Firstname,
        Language,
        Lastname,
        Mail,
        Pseudo,
        Role,
        active,
        idUser?,
        img?,
        password?) {
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
    }
}
