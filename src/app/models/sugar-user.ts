import { ISugarUserConfig } from "../interfaces/sugar-user";

export class SugarUser implements ISugarUserConfig {
    public codeSonGalileo: string = "";
    public department: string = "";
    public email: string = "";
    public employeeStatus: string = "";
    public firstName: string = "";
    public id: string = "";
    public lastName: string = "";
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
    public swAllowRemoteCalls: string = "";
    public swCallNotification: string = "";
    public swClickToCall: string = "";
    public teamId: string = "";
    public title: string = "";
    public tourplanID: string = "";
    public userName: string = "";

    constructor(data: any) {
        this.codeSonGalileo = data.codeSonGalileo || this.codeSonGalileo;
        this.department = data.department || this.department;
        this.email = data.email || this.email;
        this.employeeStatus = data.employeeStatus || this.employeeStatus;
        this.firstName = data.firstName || this.firstName;
        this.id = data.id || this.id;
        this.lastName = data.lastName || this.lastName;
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
        this.swAllowRemoteCalls = data.swAllowRemoteCalls || this.swAllowRemoteCalls;
        this.swCallNotification = data.swCallNotification || this.swCallNotification;
        this.swClickToCall = data.swClickToCall || this.swClickToCall;
        this.teamId = data.teamId || this.teamId;
        this.title = data.title || this.title;
        this.tourplanID = data.tourplanID || this.tourplanID;
        this.userName = data.userName || this.userName;
    }
}
