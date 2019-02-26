import { Model } from "./model";

export class Fields extends Model {

  // Json-related properties must have same name as their json file
  public accounts: any[];
  public civilites: any[];
  public departments: any[];
  public destinations: any[];
  public functions: any[];
  public managers: any[];
  public offices: any[];
  public orgas: any[];
  public others: any[];
  public roles: any[];
  public teams: any[];
  public userFields: any[];
  public userTemplates: any[];

  // Non-json properties are not added to class if not initialized
  public codeSON: string = "";
  public codeTourplan: string = "";
  public codevad: boolean = false;
  public groupes: string = "";
  public inactiveEmployee: boolean = false;
  public inactiveStatus: boolean = false;
  public inbound: boolean = false;
  public leadsMax: number = 45;
  public leadsMin: number = 15;
  public outbound: boolean = false;
  public phoneExtension: string = "";
  public phoneNumber: string = "";
  public selectedFunction: string = "";
  public selectedManager: string = "";
  public selectedOffice: string = "";
  public selectedOrganisation: string = "";
  public title: string = "";
  public userValue: string = "user_default";

  constructor(data?: any) {
    super(data);
  }
}
