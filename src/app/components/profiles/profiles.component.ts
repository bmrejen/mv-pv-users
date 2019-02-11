import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

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
  public fields: Fields;
  public displayVentesLeads = false;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getData()
    .then((res) => this.fields = new Fields(res[0]));
  }

  public handleClick(e, type) {
    const roles = this.fields.roles;
    const services = this.fields.services;
    const others = this.fields.others;
    const orgas = this.fields.orgas;

    this.resetSugar();
    switch (type) {
      case "conseiller":
      {
        this.fields.userValue = "user_default";
        this.checkStuff(roles, ["Sales"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
        break;
      }

      case "jm":
      {
        this.fields.userValue = "user_default_jm";
        this.fields.selectedFunction = "jm";

        this.checkStuff(roles, ["Sales"]);
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
        this.fields.selectedFunction = "mgr";

        this.checkStuff(roles, ["Team Manager"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(others, [
                        "Global",
                        "Devis Cotation",
                        "Devis V3",
                        "ROLE - BI Validation",
                        "Ventes",
                        ],
                        );
        break;
      }
      case "assistant":
      {
        this.fields.selectedFunction = "av";
        this.checkStuff(roles, ["Reservation"]);
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
        this.fields.selectedFunction = "aq";
        this.fields.selectedOffice = "Bureau - Billetterie & Qualité";
        this.fields.selectedManager = "Manager du service qualité (Aminata)";

        this.checkStuff(roles, ["Quality Control"]);
        this.checkStuff(services, ["Service Qualité"]);
        this.checkStuff(others, ["BackOffice", "Global", "SAV"]);
        this.checkStuff(orgas, ["BackOffice"]);
        break;
      }
      case "compta":
      {
        this.fields.selectedOffice = "1377";

        this.checkStuff(roles, ["Accountant"]);
        this.checkStuff(services, ["Comptabilité"]);
        this.checkStuff(others, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
        this.checkStuff(orgas, ["Compta"]);
        break;
      }
      case "inactif":
      {
        this.checkStuff(roles, ["Read-only"]);
        this.fields.inactiveStatus = true;
        this.fields.inactiveEmployee = true;
        break;
      }

      default:
      // code...
      break;
    }
  }

  public setVentesLeads() {
    this.fields.leadsMin = 15;
    this.fields.leadsMax = 45;
  }

  public eraseVentesLeads() {
    this.fields.leadsMin = null;
    this.fields.leadsMax = null;
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
      case this.fields.roles:
      prefix = "roles";
      break;
      case this.fields.orgas:
      prefix = "orgas";
      break;
      case this.fields.services:
      prefix = "services";
      break;
      case this.fields.others:
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
    this.fields.inactiveStatus = false,
    this.fields.inactiveEmployee = false,
    this.fields.leadsMin = null;
    this.fields.leadsMax = null;
    this.fields.userValue = "user_default_xx";
    this.fields.selectedManager = null,
    this.eraseFields([
                     this.fields.codeSON,
                     this.fields.codeTourplan,
                     this.fields.codevad,
                     this.fields.groupes,
                     this.fields.inbound,
                     this.fields.outbound,
                     this.fields.phoneExtension,
                     this.fields.phoneNumber,
                     this.fields.selectedOffice,
                     this.fields.selectedFunction,
                     this.fields.selectedOrganisation,
                     this.fields.title,
                     ]);
    this.unCheckArrays([
                       this.fields.roles,
                       this.fields.services,
                       this.fields.others,
                       this.fields.teams,
                       this.fields.destinations,
                       this.fields.orgas,
                       ]);
  }

}
