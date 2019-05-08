import { IGapiUser } from "../interfaces/gapi-user";

export class GoogleUser implements IGapiUser {
    public primaryEmail: string = "";
    public orgas = null;
    public emails = null;
    public id = null;
    public nonEditableAliases = [];
    public sendAs = null;
    public signature = null;
    public googleGroups = [];
    public password = null;

    // not needed in constructor
    public primaryEmailSuffix = null;
    public aliases;

    constructor(data?: any) {
        this.primaryEmail = data.primaryEmail || this.primaryEmail;
        this.orgas = data.orgas || this.orgas;
        this.emails = data.emails || this.emails;
        this.id = data.id || this.id;
        this.sendAs = data.sendAs || this.sendAs;
        this.signature = data.signature || this.signature;
        this.nonEditableAliases = data.nonEditableAliases || this.nonEditableAliases;
        this.primaryEmailSuffix = this.primaryEmail.includes("@") ?
            this.primaryEmail.split("@")[1] : this.primaryEmailSuffix;
    }
}
