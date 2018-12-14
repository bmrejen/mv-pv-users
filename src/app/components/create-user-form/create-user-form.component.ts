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

    this.resetSugar();
    switch (type) {
      case "conseiller":
      {
        this.fields.userValue = "user_default";
        this.checkStuff(this.fields.roles, ["Sales"]);
        this.checkStuff(this.fields.services, ["Ventes"]);
        this.checkStuff(this.fields.autres, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
        break;
      }

      case "jm":
      {
        this.fields.userValue = "user_default_jm";
        this.fields.selectedFunction = "jm";

        this.checkStuff(this.fields.roles, ["Sales"]);
        this.checkStuff(this.fields.services, ["Ventes"]);
        this.checkStuff(this.fields.autres,
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

        this.checkStuff(this.fields.roles, ["Team Manager"]);
        this.checkStuff(this.fields.services, ["Ventes"]);
        this.checkStuff(this.fields.autres, [
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
        this.checkStuff(this.fields.roles, ["Reservation"]);
        this.checkStuff(this.fields.services, ["Ventes"]);
        this.checkStuff(this.fields.autres, [
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

        this.checkStuff(this.fields.roles, ["Quality Control"]);
        this.checkStuff(this.fields.services, ["Service Qualité"]);
        this.checkStuff(this.fields.autres, ["BackOffice", "Global", "SAV"]);
        this.checkStuff(this.fields.orgas, ["BackOffice"]);
        break;
      }
      case "compta":
      {
        this.fields.selectedBureau = "1377";

        this.checkStuff(this.fields.roles, ["Accountant"]);
        this.checkStuff(this.fields.services, ["Comptabilité"]);
        this.checkStuff(this.fields.autres, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
        this.checkStuff(this.fields.orgas, ["Compta"]);
        break;
      }
      case "inactif":
      {
        this.checkStuff(this.fields.roles, ["Read-only"]);
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
