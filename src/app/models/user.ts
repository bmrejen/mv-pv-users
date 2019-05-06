import { JamespotUser } from "./jamespot-user";
import { SugarUser } from "./sugar-user";

export class User {

    public firstName: string = "";
    public lastName: string = "";

    // SUGAR
    public sugarCurrentUser: SugarUser = new SugarUser({});

    // OTHERS
    public password: string = "";

    // JAMESPOT
    public jamesCurrentUser: JamespotUser = new JamespotUser({});

    // GOOGLE
    public ggCurrentUser;

    public constructor(data: any) {
        //
    }
}
