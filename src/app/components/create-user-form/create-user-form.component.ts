import { Component, OnInit } from "@angular/core";
import { FieldsService } from "../../services/fields.service";

@Component({
  selector: "mv-app-create-user-form",
  styleUrls: ["./create-user-form.component.css"],
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields;
  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
    this.resetSugar();
  }

  public sugarRole(num) {
    return `sugar_role[${num}]`;
  }

  public sugarDepartment(ser) {
    return `sugar_department[${ser}]`;
  }

  public resetSugar() {
    const ventes = this.fields.services[8];

    console.log("---RESET SUGAR---");
    console.log(ventes);
    this.fields.userValue = "user_default_xx";
    this.fields.roles.forEach((role) => role.checked = false);
    this.fields.services.forEach((service) => service.checked = false);
    this.fields.selectedBureau = "";
    this.fields.selectedFunction = "";
    this.fields.autres.forEach((autre) => autre.checked = false);
    console.log(ventes);

  }

  public checkOthers(arr) {
    arr.forEach((element) => {
      const myOther = this.fields.autres.find((autre) => autre.id === `autres-${element}`);
      if (!!myOther) { myOther.checked = true; }
    });
  }

  public checkRole(roleToCheck: string) {
    const myRole = this.fields.roles.find((role) =>
      role.id === `roles-${roleToCheck}`);
    if (!!myRole) { myRole.checked = true; }
  }

  public checkService(serviceToCheck: string) {
    const myService = this.fields.services.find((service) =>
      service.id === `services-${serviceToCheck}`);
    console.log("---MYSERVICE---");
    console.log(myService);
    if (myService != null) { myService.checked = true; }
    console.log(myService);
  }

  public checkOrga(orgaToCheck: string) {
    const myOrga = this.fields.orgas.find((orga) => orga.id === `orgas-${orga.orgaToCheck}`);
    myOrga.checked = true;
  }

  public handleClick(e, type) {

    this.resetSugar();
    switch (type) {
      case "conseiller":
      {
        // this.checkRole("Sales");
        this.checkService("Ventes");
        // this.fields.userValue = "user_default";
        // this.checkOthers(["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
        break;
      }
      case "jm":
      {
        // this.checkRole("Sales");
        this.checkService("Ventes");

        this.fields.userValue = "user_default_jm";
        this.fields.selectedFunction = "jm";
        // this.checkOthers(
        //   [
        //   "Global",
        //   "Ventes",
        //   "Devis Cotation",
        //   "ROLE - BI Validation",
        //   "ROLE - ViewRCM",
        //   "ROLE - View RM",
        //   "Ventes",
        //   ],
        //   );
        break;
      }
      case "manager":
      {
        // console.log("---TEAM MANAGER---");
        // console.log(this.fields.services[8]);
        // this.checkRole("Team Manager");
        this.checkService("Ventes");

        this.fields.selectedFunction = "jm";
        // this.checkOthers(
        //   [
        //   "Global",
        //   "Devis Cotation",
        //   "Devis V3",
        //   "ROLE - BI Validation",
        //   "Ventes",
        //   ],
        //   );
        // console.log(this.fields.services[8]);
        break;
      }
      case "assistant":
      {
        const ventes = this.fields.services[8];
        console.log("---ASSISTANT VENTES START---");
        console.log(ventes);

        // this.checkRole("Reservation");
        this.checkService("Ventes");

        console.log("---JUST CHECKED---");
        console.log(ventes);

        // this.fields.selectedFunction = "av";
        // this.checkOthers(
        //   [
        //   "Devis V3",
        //   "Devis Cotation",
        //   "Global",
        //   "Reservation",
        //   "ROLE - Reservation",
        //   ]);

        console.log("---END OF FUNCTION---");
        console.log(ventes);
        break;
      }
      case "qualite":
      {
        //   this.checkRole("Quality Control");
        //   this.checkService("Service Qualité");
        //   this.fields.selectedFunction = "aq";
        this.checkOthers(["Backoffice", "Global", "SAV"]);
        break;
      }
      case "compta":
      {
        //   this.checkRole("Accountant");
        //   this.checkService("Comptabilité");

        //   this.fields.selectedBureau = "1377";
        // this.checkOthers(["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
        // this.checkOrga("Compta");
        break;
      }
      case "inactif":
      {
        //   this.checkRole("Read-only");
        // STATUS INACTIF (RADIO)
        // EMPLOYEE STATUS: INACTIF (RADIO)
        break;
      }

      default:
      // code...
      break;
    }
  }

  public selectTmp($event, user) {
    console.log(user);
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
