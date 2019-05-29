import { ICommonProperties, ISugarUserConfig } from "../interfaces/sugar-user";

export class SugarUser implements ISugarUserConfig {
    public codeSonGalileo: string = "";
    public department: string = "";
    public email: string = "";
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
    public salutation: string = "";
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

    constructor(common: ICommonProperties, data: any) {
        this.common = common;

        this.codeSonGalileo = data.codeSonGalileo || this.codeSonGalileo;
        this.department = data.department || this.department;
        this.email = data.email || this.email;
        this.employeeStatus = data.employeeStatus || this.employeeStatus;
        this.id = data.id || this.id;
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

        this.swAllowRemoteCalls = data.swAllowRemoteCalls === "0" ? false : this.swAllowRemoteCalls;
        this.swCallNotification = data.swCallNotification === "0" ? false : this.swCallNotification;
        this.swClickToCall = data.swClickToCall === "0" ? false : this.swClickToCall;
        this.tourplanID = data.tourplanID || this.common.userName.substr(0, 6)
            .toUpperCase();
        // Following properties are not returned by the API

        // this.userToCopyHPfrom = data.userToCopyHPfrom || this.userToCopyHPfrom;
        // this.inheritsPreferencesFrom = data.inheritsPreferencesFrom || this.inheritsPreferencesFrom;
        this.roleId = data.roleId || this.roleId;
        // this.functionId = data.functionId || this.functionId;
        this.destinations = data.destinations || this.destinations;
        this.teams = data.teams || this.teams;
        this.others = data.others || this.others;
        // this.roles = data.roles || this.roles;
        // this.isAdmin = data.isAdmin || this.isAdmin;
        // this.apiPortalUser = data.apiPortalUser || this.apiPortalUser;
        // this.assignationNotification = data.assignationNotification || this.assignationNotification;
        // this.userGroup = data.userGroup || this.userGroup;
        // this.defaultTeams = data.defaultTeams || this.defaultTeams;
        // this.leadsMin = data.leadsMin || this.leadsMin;
        // this.leadsMax = data.leadsMax || this.leadsMax;

    }
}
