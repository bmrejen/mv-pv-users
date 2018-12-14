import { Component, OnInit } from "@angular/core";
import { FieldsService } from "../../services/fields.service";
import { SwitchVoxService } from "../../services/switchvox.service";

@Component({
  selector: "mv-app-create-user-form",
  styleUrls: ["./create-user-form.component.css"],
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields;
  constructor(
    private fieldsService: FieldsService,
    private switchvoxService: SwitchVoxService) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
    this.resetSugar();
    this.getSwitchvoxUsers();
  }

  public getSwitchvoxUsers() {
    this.switchvoxService.getData()
    .subscribe((data) => {
      console.log(data);
    });
  }

  public setPassword() {
    console.log(this);
    const first = this.fields.userFields.find((field) => field.name === "firstname");
    const last = this.fields.userFields.find((field) => field.name === "lastname");
    const pwd = this.fields.userFields.find((field) => field.name === "password");
    const rndStrg = Math.random()
    .toString()
    .substring(2, 7);
    if (!!first.value && !!last.value) {
      pwd.value = `${first.value[0]}${last.value[0]}${rndStrg}!`;
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
      case this.fields.autres:
      prefix = "autres";
      break;

      default:
      console.error("Wrong input");
      break;
    }
    arr.forEach((element) => {
      const myOther = where.find((autre) => autre.id === `${prefix}-${element}`);
      if (!!myOther) { myOther.checked = true; }
    });
  }

  public handleClick(e, type) {
    const roles = this.fields.roles;
    const services = this.fields.services;
    const autres = this.fields.autres;
    const orgas = this.fields.orgas;

    this.resetSugar();
    switch (type) {
      case "conseiller":
      {
        this.fields.userValue = "user_default";
        this.checkStuff(roles, ["Sales"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(autres, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
        break;
      }

      case "jm":
      {
        this.fields.userValue = "user_default_jm";
        this.fields.selectedFunction = "jm";

        this.checkStuff(roles, ["Sales"]);
        this.checkStuff(services, ["Ventes"]);
        this.checkStuff(autres,
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
        this.checkStuff(autres, [
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
        this.checkStuff(autres, [
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
        this.fields.selectedBureau = "Bureau - Billetterie & Qualité";
        this.fields.selectedManager = "Manager du service qualité (Aminata)";

        this.checkStuff(roles, ["Quality Control"]);
        this.checkStuff(services, ["Service Qualité"]);
        this.checkStuff(autres, ["BackOffice", "Global", "SAV"]);
        this.checkStuff(orgas, ["BackOffice"]);
        break;
      }
      case "compta":
      {
        this.fields.selectedBureau = "1377";

        this.checkStuff(roles, ["Accountant"]);
        this.checkStuff(services, ["Comptabilité"]);
        this.checkStuff(autres, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
        this.checkStuff(orgas, ["Compta"]);
        break;
      }
      case "inactif":
      {
        this.checkStuff(roles, ["Read-only"]);
        this.fields.inactiveStatus = true;
        this.fields.inactiveEmployee = true;
        // STATUS INACTIF (RADIO)
        // EMPLOYEE STATUS: INACTIF (RADIO)
        break;
      }

      default:
      // code...
      break;
    }
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

  public eraseFields(fields) {
    fields.forEach((field) => field = "");
  }

  public unCheck(array) {
    array.forEach((x) => x.checked = false);
  }

  private unCheckArrays(arrays) {
    arrays.forEach((array) => this.unCheck(array));
  }

  private resetSugar() {
    this.fields.inactiveStatus = false,
    this.fields.inactiveEmployee = false,
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
      this.fields.selectedBureau,
      this.fields.selectedFunction,
      this.fields.selectedOrganisation,
      this.fields.title,
      ]);
    this.unCheckArrays([
      this.fields.roles,
      this.fields.services,
      this.fields.autres,
      this.fields.teams,
      this.fields.destinations,
      this.fields.orgas,
      ]);
  }
}
