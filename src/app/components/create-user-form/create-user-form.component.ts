import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { FieldsService } from "../../services/fields.service";
import { ParserService } from "../../services/parser.service";
import { SwitchVoxService } from "../../services/switchvox.service";

import { Destination } from "../../models/destination";
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
  public destinations: Destination[] = [];
  public managers: User[] = [];

  constructor(
              private fieldsService: FieldsService,
              private switchvoxService: SwitchVoxService,
              private parserService: ParserService,
              private route: ActivatedRoute,
              ) {
    //
  }

  public ngOnInit(): void {
    this.route.data
    .subscribe((data) => {
      this.currentUser = data.user != null ? new User(data.user) : new User({firstName: ""});

      this.managers = data.managers;
      data.users.forEach((user) => this.usersFromSugar.push(new User(user)));
      data.teams.forEach((team) => this.teams.push(new Team(team)));
      data.destinations.forEach((dest) => this.destinations.push(new Destination(dest)));
      this.fields = new Fields(data.fields);
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
