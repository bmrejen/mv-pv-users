import { Destination } from "./destination";
import { Model } from "./model";
import { Role } from "./role";
import { Team } from "./team";

export class User extends Model {

    public type: string = "users";

    // SUGAR
    public id: string = "";
    public userName: string = "";
    public salutation: string = "Mrs.";
    public lastName: string = "";
    public firstName: string = "";
    public phoneMobile: string = "";
    public phoneWork: string = "";
    public phoneFax: string = "";
    public phoneAsterisk: string = "";
    public email: string = "";
    public status: string = "Active";
    public employeeStatus: string = "Active";
    public title: string = "";
    public managerId: string = "";
    public department: string = "";
    public office: string = "";
    public teams: Team[] = [];
    public tourplanID: string = "";
    public swClickToCall: boolean = false;
    public swCallNotification: boolean = false;
    public codeSonGalileo: string = "";
    public userToCopyHPfrom: string = "";
    public selectedManager: string = "";

    // SWITCHVOX
    public swPhoneNumber: string = "";
    public swExtension: string = "";
    public swTelephony: boolean = false;

    // OTHERS
    public inheritsPreferencesFrom: string = "";
    public role: Role = null;
    public functionId: string = "";
    public destinations: Destination[] = [];
    public password: string = "";

    // GOOGLE
    public ggOrganisationId: string = "";
    public ggGroups: string = "";
    public isAdmin: boolean = false;
    public apiPortalUser: boolean = false;
    public assignationNotification: boolean = false;
    public userGroup: boolean = false;
    public defaultTeams: number = 1;
    public leadsMin: number = 15;
    public leadsMax: number = 45;

    public constructor(data?: any) {
        super(data);

        // used for mapping with api object
        if (data != null) {
            super.defaultConstructor(data);
        }
    }
}
