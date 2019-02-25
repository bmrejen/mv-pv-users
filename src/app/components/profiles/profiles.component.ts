import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { FieldsService } from "../../services/fields.service";
import { SugarService } from "../../services/sugar.service";

import { Fields } from "../../models/fields";
import { Role } from "../../models/role";
import { User } from "../../models/user";

@Component({
  selector: "mv-profiles",
  templateUrl: "./profiles.component.html",
  viewProviders: [
  {
    provide: ControlContainer,
    useExisting: NgForm,
  },
  ],
})

export class ProfilesComponent implements OnInit {
  @Input() public services;
  @Input() public userTemplates;
  @Input() public userValue;
  @Input() public selectedFunction;
  @Input() public selectedManager;
  @Input() public selectedOffice;
  @Input() public orgas;
  @Input() public others;
  @Input() public inactiveEmployee;
  @Input() public inactiveStatus;
  @Input() public leadsMin;
  @Input() public leadsMax;
  @Input() public destinations;
  @Input() public teams;
  @Input() public codeSON;
  @Input() public codeTourplan;
  @Input() public codevad;
  @Input() public groupes;
  @Input() public inbound;
  @Input() public outbound;
  @Input() public phoneExtension;
  @Input() public phoneNumber;
  @Input() public selectedOrganisation;
  @Input() public title;

  public fields: Fields;
  public displayVentesLeads = false;
  public allUsersFromSugar: User[] = [];
  public activeUsersFromSugar: User[];
  public roles: Role[] = [];

  constructor(private fieldsService: FieldsService,
              private sugarService: SugarService) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getData()
    .then((res) => this.fields = new Fields(res[0]));

    this.populateUserInheritance();
    this.populateRoles();

  }

  public populateRoles() {
    this.sugarService.getRoles()
    .then((roles) => roles.forEach((role) => this.roles.push(new Role(role))));
  }

  public populateUserInheritance() {
    this.sugarService.getUsers()

    // populate usersFromSugar array
    .then((users) => users.forEach((user) => this.allUsersFromSugar.push(new User(user))))

    // filter active users
    .then((users) => this.activeUsersFromSugar = this.allUsersFromSugar.filter((user) => user.status === "Active"))

    // create userTemplates from userlist
    .then((data) => {
      return this.activeUsersFromSugar.map((user) => {
        return {
          label: user.userName,
          selected: false,
          value: user.userName};
        });
    })

    // push them into fields
    .then((templates) => {
      if (templates !== undefined && templates !== null) {
        this.userTemplates.push(...templates);
      }
    })
    .catch((err) => console.log(err));
  }

  public handleClick(e, type) {
    const services = this.services;
    const others = this.others;
    const orgas = this.orgas;

    this.resetSugar();
    switch (type) {
      case "conseiller":
      {
        this.userValue = "user_default";
        this.checkRoles(["Sales"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
        break;
      }

      case "jm":
      {
        this.userValue = "user_default_jm";
        this.selectedFunction = "jm";

        this.checkRoles(["Sales"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others,
                        [
                        "Global",
                        "Ventes",
                        "Devis Cotation",
                        "ROLE - BI Validation",
                        "ROLE - ViewRCM",
                        "ROLE - View RM",
                        "Ventes",
                        ],
                        );
        break;
      }
      case "manager":
      {
        this.selectedFunction = "mgr";

        this.checkRoles(["Team Manager"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others, [
                        "Global",
                        "Devis Cotation",                        "Devis V3",
                        "ROLE - BI Validation",
                        "Ventes",
                        ],
                        );
        break;
      }
      case "assistant":
      {
        this.selectedFunction = "av";
        this.checkRoles(["Reservation"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others, [
                        "Devis V3",
                        "Devis Cotation",
                        "Global",
                        "Reservation",
                        "ROLE - Reservation",
                        ]);
        break;
      }
      case "qualite":
      {
        this.selectedFunction = "aq";
        this.selectedOffice = "Bureau - Billetterie & Qualité";
        this.selectedManager = "Manager du service qualité (Aminata)";

        this.checkRoles(["Quality Control"]);
        this.checkStuff(services, ["Service Qualité"]);
        this.checkStuff(others, ["BackOffice", "Global", "SAV"]);
        this.checkStuff(orgas, ["BackOffice"]);
        break;
      }
      case "compta":
      {
        this.selectedOffice = "1377";

        this.checkRoles(["Accountant"]);
        this.checkStuff(services, ["Comptabilité"]);
        this.checkStuff(others, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
        this.checkStuff(orgas, ["Compta"]);
        break;
      }
      case "inactif":
      {
        this.checkRoles(["ReadOnly"]);
        this.inactiveStatus = true;
        this.inactiveEmployee = true;
        break;
      }

      default:
      // code...
      break;
    }
  }

  public setVentesLeads() {
    this.leadsMin = 15;
    this.leadsMax = 45;
  }

  public eraseVentesLeads() {
    this.leadsMin = null;
    this.leadsMax = null;
  }

  public onServiceChecked(service, e) {
    if (service.id === "services-Ventes") {
      if (!service.checked) {
        this.eraseVentesLeads();
        this.displayVentesLeads = e;
      } else {
        this.setVentesLeads();
        // this.displayVentesLeads = false;
      }
    }
  }

  public checkStuff(where, arr) {
    let prefix;
    switch (where) {
      case this.orgas:
      prefix = "orgas";
      break;
      case this.services:
      prefix = "services";
      break;
      case this.others:
      prefix = "others";
      break;

      default:
      console.error("Wrong input");
      break;
    }
    arr.forEach((element) => {
      const myOther = where.find((other) => other.id === `${prefix}-${element}`);
      if (!!myOther) { myOther.checked = true; }
    });
  }

  public eraseFields(fields) {
    fields.forEach((field) => field = "");
  }

  public unCheck(array) {
    array.forEach((x) => x.checked = false);
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

  private unCheckArrays(arrays) {
    arrays.forEach((array) => this.unCheck(array));
  }

  private resetSugar() {
    this.inactiveStatus = false,
    this.inactiveEmployee = false,
    this.leadsMin = null;
    this.leadsMax = null;
    this.userValue = "user_default_xx";
    this.selectedManager = null,
    this.eraseFields([
                     this.codeSON,
                     this.codeTourplan,
                     this.codevad,
                     this.groupes,
                     this.inbound,
                     this.outbound,
                     this.phoneExtension,
                     this.phoneNumber,
                     this.selectedOffice,
                     this.selectedFunction,
                     this.selectedOrganisation,
                     this.title,
                     ]);
    this.unCheckArrays([
                       this.roles,
                       this.services,
                       this.others,
                       this.teams,
                       this.destinations,
                       this.orgas,
                       ]);
  }

  private checkRoles(rolesToCheck) {
    rolesToCheck.forEach((roleToCheck) => {
      this.roles.find((role) => role.name === roleToCheck).checked = true;
    });
  }

}
