import { IGapiUser } from "../interfaces/gapi-user";

export class GoogleUser implements IGapiUser {
    public primaryEmail;
    public orgas;
    public emails;
    public id;
    public sendAs;
    public signature;

    // not needed in constructor
    public primaryEmailSuffix;
    public aliases;

    constructor(
        primaryEmail,
        orgas,
        emails?,
        id?,
        sendAs?,
        signature?,
    ) {
        this.primaryEmail = primaryEmail;
        this.orgas = orgas;
        this.emails = emails;
        this.id = id;
        this.sendAs = sendAs;
        this.signature = signature;
    }
}
