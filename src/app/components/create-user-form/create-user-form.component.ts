import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";
import { ParserService } from "../../services/parser.service";
import { SugarService } from "../../services/sugar.service";
import { SwitchVoxService } from "../../services/switchvox.service";

import { Fields } from "../../models/fields";
import { Team } from "../../models/team";
import { User } from "../../models/user";

@Component({
  selector: "mv-app-create-user-form",
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields: Fields;
  public errorMsg;
  public passwordExists = false;
  public usersFromSugar: User[] = [];
  public usernameTaken;
  public currentUser: User;
  public teams: Team[] = [];

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
    this.fieldsService.getData()
    .then((res) => this.fields = new Fields(res[0]));

    this.route.data
    .subscribe((data) => {
      const [ usr, users, teams ] = [ data.userData[0], data.userData[1], data.userData[2] ];
      this.currentUser = new User(usr);
      users.forEach((user) => this.usersFromSugar.push(new User(user)));
      teams.forEach((team) => this.teams.push(new Team(team)));
    });
  }

  public onParentChange({e, id}) {
    // const myField = this.fields.others.find((field) => field.id === id);
    // myField.checked = e;
  }

  public onSubmit(form) {
    // this.sugarService.postDataToSugar(form)
    // .subscribe(
    //            (data) => console.log("DATA- ", data),
    //            (error) => this.errorMsg = error.statusText);
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
    this.fields.leadsMin = 15;
    this.fields.leadsMax = 45;
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
                     this.fields.selectedFunction,
                     this.fields.selectedOffice,
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
