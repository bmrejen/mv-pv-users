import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";
import { SugarService } from "../../services/sugar.service";

import { Fields } from "../../models/fields";
import { User } from "../../models/user";

@Component({
  selector: "mv-app-disable-user-form",
  styleUrls: ["./disable-user-form.css"],
  templateUrl: "./disable-user-form.component.html",
})

export class DisableUserFormComponent implements OnInit {

  public fields: Fields;
  public users: User[] = [];
  public enableAdd: boolean = true;
  public password: string;
  public disableGoogle: boolean = false;
  public changePassword: boolean = false;
  public disableSugarAccount: boolean = false;

  constructor(
              private fieldsService: FieldsService,
              private route: ActivatedRoute,
              private sugar: SugarService) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getData()
    .then((res) => this.fields = new Fields(res[0]))
    .then((res) => console.log(this.fields));

    this.sugar.getUsers()
    .then((users) => users.forEach((user) => {
      user["checked"] = false;
      this.users.push(new User(user));
    }))

    .then((res) => console.log("this.users", this.users));

    this.route.paramMap.subscribe((params) => (params));

  }

  public trackByFn(index, item) {
    return item.id;
  }

}
