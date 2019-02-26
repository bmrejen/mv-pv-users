import { Model } from "./model";

export class User extends Model {

  public type: string = "users";
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
  public officeId: string = "";
  public teamId: string = "";
  public tourplanID: string = "";
  public swClickToCall: boolean = false;
  public swCallNotification: boolean = false;
  public codeSonGalileo: string = "";

  public swPhoneNumber: string = "";
  public swExtension: string = "";
  public swTelephony: boolean = false;
  public inheritsPreferencesFrom: string = "";
  public roleId: string = "";
  public functionId: string = "";
  public destinations: string[] = [""];
  public ggOrganisationId: string = "";
  public ggGroups: string = "";
  public isAdmin: number = 0;
  public apiPortalUser: number = 0;
  public assignationNotification: number = 0;
  public userGroup: number = 0;
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
