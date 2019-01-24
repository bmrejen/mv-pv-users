export class Fields {
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

  constructor(
              accounts: any[],
              autres: any[],
              bureaux: any[],
              civilites: any[],
              codeSON: string,
              codeTourplan: string,
              codevad: string,
              destinations: any[],
              functions: any[],
              groupes: string,
              inactiveEmployee: boolean,
              inactiveStatus: boolean,
              inbound: string,
              leadsMax: number,
              leadsMin: number,
              managers: any[],
              orgas: any[],
              outbound: string,
              phoneExtension: string,
              phoneNumber: string,
              roles: any[],
              selectedBureau: string,
              selectedFunction: string,
              selectedManager: string,
              selectedOrganisation: string,
              services: any[],
              teams: any[],
              title: string,
              userFields: any[],
              userTemplates: any[],
              userValue: string) {
    this.accounts = accounts;
    this.autres = autres;
    this.bureaux = bureaux;
    this.civilites = civilites;
    this.codeSON = codeSON;
    this.codeTourplan = codeTourplan;
    this.codevad = codevad;
    this.destinations = destinations;
    this.functions = functions;
    this.groupes = groupes;
    this.inactiveEmployee = inactiveEmployee;
    this.inactiveStatus = inactiveStatus;
    this.inbound = inbound;
    this.leadsMax = leadsMax;
    this.leadsMin = leadsMin;
    this.managers = managers;
    this.orgas = orgas;
    this.outbound = outbound;
    this.phoneExtension = phoneExtension;
    this.phoneNumber = phoneNumber;
    this.roles = roles;
    this.selectedBureau = selectedBureau;
    this.selectedFunction = selectedFunction;
    this.selectedManager = selectedManager;
    this.selectedOrganisation = selectedOrganisation;
    this.services = services;
    this.teams = teams;
    this.title = title;
    this.userFields = userFields;
    this.userTemplates = userTemplates;
    this.userValue = userValue;

    console.log(`Created fields`);
  }
}
