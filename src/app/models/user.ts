import { Model } from "./model";

export class User extends Model {
  // 2. Second one to run

  public type: string;
  public id: string;
  public userName: string;
  public salutation: string;
  public lastName: string;
  public firstName: string;
  public phoneHome: string;
  public phoneMobile: string = "default value";
  public phoneWork: string = "000-000-000";
  public phoneOther: string;
  public phoneFax: string;
  public phoneAsterisk: string;
  public email: string;
  public status: string;
  public employeeStatus: string;
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
  public ggGroups: string = "coin coin";
  public isAdmin: number;
  public apiPortalUser: number;
  public assignationNotification: number;
  public userGroup: number;
  public defaultTeams: number;
  public leadsMin: number;
  public leadsMax: number = 45;

  public constructor(data?: any) {
    // 3. Third one to run

    super(data);
    // used for mapping with api object
    if (data != null) {
      super.defaultConstructor(data);
    }
  }
}
