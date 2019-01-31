import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";
import { ParserService } from "../../services/parser.service";
import { SugarService } from "../../services/sugar.service";
import { SwitchVoxService } from "../../services/switchvox.service";

import { Fields } from "../../models/fields";
import { User } from "../../models/user";

@Component({
  selector: "mv-app-create-user-form",
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
  public fields: Fields;
  public errorMsg;
  public passwordExists = false;
  public usersFromSugar: User[];
  public usernameTaken = false;

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
    this.usersFromSugar = this.sugarService.createUserList();
    this.route.paramMap.subscribe((params) => params.get("id"));
  }

  public onParentChange({e, id}) {
    const myField = this.fields.autres.find((field) => field.id === id);
    myField.checked = e;
  }

  public onSubmit(form) {
    this.sugarService.postDataToSugar(form)
    .subscribe(
               (data) => console.log("DATA- ", data),
               (error) => this.errorMsg = error.statusText);
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
