import { Model } from "./model";

export class User extends Model {

  public type: string;
  public id: string;
  public userName: string;
  public salutation: string;
  public lastName: string;
  public firstName: string;
  public phoneMobile: string;
  public phoneWork: string;
  public phoneFax: string;
  public phoneAsterisk: string;
  public email: string;
  public status: string = "Active";
  public employeeStatus: string = "Active";
  public title: string;
  public managerId: string;
  public department: string;
  public officeId: string;
  public teamId: string;
  public tourplanID: string;
  public swClickToCall: boolean;
  public swCallNotification: boolean;
  public codeSonGalileo: string;

  public swPhoneNumber: string;
  public swExtension: string;
  public swTelephony: boolean;
  public inheritsPreferencesFrom: string;
  public roleId: string;
  public serviceId: string;
  public functionId: string;
  public destinations: string[];
  public ggOrganisationId: string;
  public ggGroups: string;
  public isAdmin: string = "0";
  public apiPortalUser: string = "0";
  public assignationNotification: string = "0";
  public userGroup: number;
  public defaultTeams: number;
  public leadsMin: number;
  public leadsMax: number;

  public constructor(data?: any) {
    super(data);

    // used for mapping with api object
    if (data != null) {
      super.defaultConstructor(data);
    }
  }
}
