import { Model } from "./model";

export class User extends Model {
  public type: string = null;
  public id: string = null;
  public userName: string = null;
  public salutation: string = "Mrs.";
  public lastName: string = null;
  public firstName: string = null;
  public phoneHome: string = null;
  public phoneMobile: string = null;
  public phoneWork: string = null;
  public phoneOther: string = null;
  public phoneFax: string = null;
  public phoneAsterisk: string = null;
  public email: string = null;
  public status: string = "Active";
  public employeeStatus: string = "Active";
  public title: string = null;
  public managerId: string = null;
  public department: string = null;
  public officeId: string = null;
  public teamId: string = null;
  public tourplanID: string = null;
  public swClickToCall: boolean = false;
  public swCallNotification: boolean = false;
  public codeSonGalileo: string = null;

  public swPhoneNumber: string = null;
  public swExtension: string = null;
  public swTelephony: boolean = false;
  public inheritsPreferencesFrom: string = "user_default";
  public roleId: string = null;
  public serviceId: string = null;
  public functionId: string = null;
  public destinations: string[] = [];
  public ggOrganisationId: string = null;
  public ggGroups: string = null;
  public isAdmin: number = 0;
  public apiPortalUser: number = 0;
  public assignationNotification: number = 0;
  public userGroup: number = 0;
  public defaultTeams: number = 1;
  public leadsMin: number = 15;
  public leadsMax: number = 45;

  public constructor(data?: any) {

    super(data);
    console.log("data passed to super, ", data);
  }
}
