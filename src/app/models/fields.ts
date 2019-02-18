import { Model } from "./model";

export class Fields extends Model {

  // Json-related properties must have same name as their json file
  public accounts: any[];
  public civilites: any[];
  public destinations: any[];
  public functions: any[];
  public managers: any[];
  public offices: any[];
  public orgas: any[];
  public others: any[];
  public roles: any[];
  public services: any[];
  public teams: any[];
  public userFields: any[];
  public userTemplates: any[];

  // Non-json properties are not added to class if not initialized
  public codeSON: string = "";
  public codeTourplan: string = "";
  public codevad: string = "";
  public groupes: string = "";
  public inactiveEmployee: boolean = false;
  public inactiveStatus: boolean = false;
  public inbound: string = "";
  public leadsMax: number = 45;
  public leadsMin: number = 15;
  public outbound: string = "";
  public phoneExtension: string = "";
  public phoneNumber: string = "";
  public selectedFunction: string = "";
  public selectedManager: string = "";
  public selectedOffice: string = "";
  public selectedOrganisation: string = "";
  public title: string = "";
  public userValue: string = "";

  constructor(data?: any) {
    super(data);
  }
}
