import { GoogleUser } from "./google-user";
import { JamespotUser } from "./jamespot-user";
import { SugarUser } from "./sugar-user";

export class User {

    // COMMON PROPERTIES
    public firstName: string = "";
    public lastName: string = "";

    // SUGAR
    public sugarCurrentUser: SugarUser = new SugarUser({});

    // JAMESPOT
    public jamesCurrentUser: JamespotUser = new JamespotUser({});

    // GOOGLE
    public ggCurrentUser: GoogleUser = new GoogleUser({});

    constructor(data: any) {
        this.firstName = data.firstName || this.firstName;
        this.lastName = data.lastName || this.lastName;
    }
}
