import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";
import { ParserService } from "../../services/parser.service";
import { SugarService } from "../../services/sugar.service";
import { SwitchVoxService } from "../../services/switchvox.service";

@Component({
  selector: "mv-app-create-user-form",
  styleUrls: ["./create-user-form.component.css"],
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields;
  public errorMsg;
  public displayVentesLeads = false;
  public passwordExists = false;
  public usersFromSugar;
  public usernameTaken = false;
  // CODE TOURPLAN SERA LEFT(user_name, 6)
  constructor(
              private fieldsService: FieldsService,
              private switchvoxService: SwitchVoxService,
              private sugarService: SugarService,
              private parserService: ParserService,
              private route: ActivatedRoute,
              ) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
    this.resetSugar();
    this.getSwitchvoxUsers();
    this.sugarService.getUsersFromSugar()
    .subscribe((users) => this.usersFromSugar = users.data);
    this.route.paramMap.subscribe((params) => params.get("id"));
  }

  public getSwitchvoxUsers() {
    this.switchvoxService.getData()
    .subscribe((data) => {
      console.log(data);
    });
  }

  public credentialClick(e) {
    console.log(e);
    const first = this.fields.userFields.find((field) => field.name === "firstname");
    const last = this.fields.userFields.find((field) => field.name === "lastname");
    const username = this.fields.userFields.find((field) => field.name === "username");
    this.usernameTaken = this.isUsernameTaken(username);
    if (!!first.value && !!last.value && !username.value) {
      this.setUsername(first, last, username);
      this.setPassword(first, last);
      this.setEmail(username);

    }
  }

  public setUsername(first, last, username) {
    username.value = `${first.value[0].toLowerCase()}${last.value.toLowerCase()}`;
  }

  public isUsernameTaken(username) {
    const res = this.usersFromSugar
    .find((user) => user.attributes.userName === username.value);

    return(res);
  }

  public setPassword(first, last) {
    if (this.passwordExists) { return ; }
    const pwd = this.fields.userFields.find((field) => field.name === "password");
    const rndStrg = Math.random()
    .toString()
    .substring(2, 7);
    pwd.value = `${first.value[0].toLowerCase()}${last.value[0].toLowerCase()}${rndStrg}!`;
    this.passwordExists = true;
  }

  public setVentesLeads() {
    console.log("leadsmin", this.fields.leadsMin);
    console.log("leadsmax", this.fields.leadsMax);
    this.fields.leadsMin = 15;
    this.fields.leadsMax = 45;
    console.log("leadsmin", this.fields.leadsMin);
    console.log("leadsmax", this.fields.leadsMax);
  }

  public eraseVentesLeads() {
    this.fields.leadsMin = null;
    this.fields.leadsMax = null;
    console.log("erased Ventes");
  }

  public onServiceChecked(service, e) {
    console.log(e);
    if (service.id === "services-Ventes") {
      if (!service.checked) {
        this.eraseVentesLeads();
        this.displayVentesLeads = e;
      } else {
        this.setVentesLeads();
        // this.displayVentesLeads = false;
      }
      console.log(service);
    }
  }

  public setEmail(username) {
    const email = this.fields.userFields.find((field) => field.name === "email");
    email.value = `${username.value}@marcovasco.fr`;
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

  public onSubmit(form) {
    this.sugarService.postDataToSugar(form)
    .subscribe(
               (data) => console.log("DATA- ", data),
               (error) => this.errorMsg = error.statusText);
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
