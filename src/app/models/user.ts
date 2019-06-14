import { GoogleUser } from "./google-user";
import { JamespotUser } from "./jamespot-user";
import { SugarUser } from "./sugar-user";

import { ICommonProperties, ISugarUserConfig } from "../interfaces/sugar-user";

export class User {

    // COMMON PROPERTIES
    public common: ICommonProperties = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        userName: "",
    };

    // SUGAR
    public sugarCurrentUser: SugarUser = new SugarUser(this.common, {} as ISugarUserConfig);

    // JAMESPOT
    public jamesCurrentUser: JamespotUser = new JamespotUser({});

    // GOOGLE
    public ggCurrentUser: GoogleUser = new GoogleUser({});

    constructor(data: any) {
        this.common.firstName = data.firstName || this.common.firstName;
        this.common.lastName = data.lastName || this.common.lastName;
        this.common.password = data.password || this.common.password;
        this.common.userName = data.username || this.common.userName;
        this.common.email = data.email || this.common.email;
    }
}
