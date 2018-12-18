import { Component, OnInit } from "@angular/core";
import { FieldsService } from "../../services/fields.service";
import { ParserService } from "../../services/parser.service";
import { SwitchVoxService } from "../../services/switchvox.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-create-user-form",
  styleUrls: ["./create-user-form.component.css"],
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields;
  public errorMsg;
  public csv;
  constructor(
    private fieldsService: FieldsService,
    private switchvoxService: SwitchVoxService,
    private userService: UserService,
    private parserService: ParserService,
    ) {
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

  public credentialClick(e) {
    const first = this.fields.userFields.find((field) => field.name === "firstname");
    const last = this.fields.userFields.find((field) => field.name === "lastname");
    const username = this.fields.userFields.find((field) => field.name === "username");
    if (!!first.value && !!last.value) {
      this.setUsername(first, last, username);
      this.setPassword(first, last);
      this.setEmail(username);
    }
  }

  public parse(d) {
    // const numberOfFields = 22;
    // const res = this.parserService.getData(d);
    // console.table(res);

    // if (res.length % numberOfFields !== 0) {
      //   alert("csv has wrong number of fields");
      // } else {
        //   this.fields.userInfo.credentials.firstname = res[0];
        //   this.fields.userInfo.credentials.lastname = res[1];
        // }
      }

      public setUsername(first, last, username) {
        username.value = `${first.value[0].toLowerCase()}${last.value.toLowerCase()}`;
      }

      public setPassword(first, last) {
        const pwd = this.fields.userFields.find((field) => field.name === "password");
        const rndStrg = Math.random()
        .toString()
        .substring(2, 7);
        pwd.value = `${first.value[0].toLowerCase()}${last.value[0].toLowerCase()}${rndStrg}!`;
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

      public onSubmit() {
        this.userService.postDataToSugar(this.fields)
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
