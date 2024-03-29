import { ICommonProperties, ISugarUserConfig } from "../interfaces/sugar-user";

export class SugarUser implements ISugarUserConfig {
    public codeSonGalileo: string = "";
    public department: string = "";
    public employeeStatus: string = "";
    public id: string = "";
    public managerId: string = "";
    public officeId: string = "";
    public phoneAsterisk: string = "";
    public phoneFax: string = "";
    public phoneHome: string = "";
    public phoneMobile: string = "";
    public phoneOther: string = "";
    public phoneWork: string = "";
    public salutation: string = "Mr.";
    public status: string = "";
    public swAllowRemoteCalls: boolean = true;
    public swCallNotification: boolean = true;
    public swClickToCall: boolean = true;
    public title: string = "";
    public tourplanID: string;
    public type: string = "users";
    public userToCopyHPfrom: string = "";
    public inheritsPreferencesFrom: string = "";
    public roleId: string = "";
    public functionId: string = "";
    public destinations: string[] = [];
    public others: string[] = [];
    public isAdmin: boolean = false;
    public apiPortalUser: boolean = false;
    public assignationNotification: boolean = false;
    public userGroup: boolean = false;
    public defaultTeams: number = 1;
    public leadsMin: number = 15;
    public leadsMax: number = 45;
    public teams: string[] = [];
    public common: ICommonProperties;
    public jamespotId: string = "";

    constructor(common: ICommonProperties, data: ISugarUserConfig) {
        this.common = common;

        this.codeSonGalileo = data.codeSonGalileo || this.codeSonGalileo;
        this.department = data.department || this.department;
        this.employeeStatus = data.employeeStatus || this.employeeStatus;
        this.id = data.id;
        this.managerId = data.managerId || this.managerId;
        this.officeId = data.officeId || this.officeId;
        this.phoneAsterisk = data.phoneAsterisk || this.phoneAsterisk;
        this.phoneFax = data.phoneFax || this.phoneFax;
        this.phoneHome = data.phoneHome || this.phoneHome;
        this.phoneMobile = data.phoneMobile || this.phoneMobile;
        this.phoneOther = data.phoneOther || this.phoneOther;
        this.phoneWork = data.phoneWork || this.phoneWork;
        this.salutation = data.salutation || this.salutation;
        this.status = data.status || this.status;
        this.title = data.title || this.title;
        this.type = data.type || this.type;
        this.jamespotId = data.jamespotId || this.jamespotId;
        this.tourplanID = data.tourplanID || this.common.userName.substr(0, 6)
            .toUpperCase();
        this.leadsMin = data.leadsMin || this.leadsMin;
        this.leadsMax = data.leadsMax || this.leadsMax;
        this.teams = data.teams || this.teams;

        // Do not give default values to booleans
        // They could be intentionally set to false
        this.isAdmin = data.isAdmin;
        this.apiPortalUser = data.apiPortalUser;
        this.assignationNotification = data.assignationNotification;
        this.swAllowRemoteCalls = data.swAllowRemoteCalls;
        this.swCallNotification = data.swCallNotification;
        this.swClickToCall = data.swClickToCall;
    }
}
