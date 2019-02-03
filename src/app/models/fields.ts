import { Model } from "./model";

export class Fields extends Model {

  // Json-related properties must have same name as their json file
  public accounts: any[];
  public autres: any[];
  public bureaux: any[];
  public civilites: any[];
  public destinations: any[];
  public functions: any[];
  public managers: any[];
  public orgas: any[];
  public roles: any[];
  public services: any[];
  public teams: any[];
  public userFields: any[];
  public userTemplates: any[];

  // Non-json fields
  public codeSON: string;
  public codeTourplan: string;
  public codevad: string;
  public groupes: string;
  public inactiveEmployee: boolean;
  public inactiveStatus: boolean;
  public inbound: string;
  public leadsMax: number = 45;
  public leadsMin: number = 15;
  public outbound: string;
  public phoneExtension: string;
  public phoneNumber: string;
  public selectedBureau: string;
  public selectedFunction: string;
  public selectedManager: string;
  public selectedOrganisation: string;
  public title: string;
  public userValue: string;

  constructor(data?: any) {
    super(data);
  }
}
