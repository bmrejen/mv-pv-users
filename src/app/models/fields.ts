import { Model } from "./model";

export class Fields extends Model {
  public accounts: any[];
  public autres: any[];
  public bureaux: any[];
  public civilites: any[];
  public codeSON: string;
  public codeTourplan: string;
  public codevad: string;
  public destinations: any[];
  public functions: any[];
  public groupes: string;
  public inactiveEmployee: boolean;
  public inactiveStatus: boolean;
  public inbound: string;
  public leadsMax: number;
  public leadsMin: number;
  public managers: any[];
  public orgas: any[];
  public outbound: string;
  public phoneExtension: string;
  public phoneNumber: string;
  public roles: any[];
  public selectedBureau: string;
  public selectedFunction: string;
  public selectedManager: string;
  public selectedOrganisation: string;
  public services: any[];
  public teams: any[];
  public title: string;
  public userFields: any[];
  public userTemplates: any[];
  public userValue: string;

  constructor(data?: any) {
    super(data);
  }
}
