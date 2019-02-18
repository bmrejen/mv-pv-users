import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";
import { SugarService } from "../../services/sugar.service";

import { Fields } from "../../models/fields";
import { User } from "../../models/user";

@Component({
  selector: "mv-credentials",
  styleUrls: ["./credentials.component.css"],
  templateUrl: "./credentials.component.html",
  viewProviders: [
  {
    provide: ControlContainer,
    useExisting: NgForm,
  },
  ],
})

export class CredentialsComponent implements OnInit {
  public fields: Fields;
  public passwordExists = false;
  public usersFromSugar: User[] = [];
  public usernameTaken;
  public usernameStatus;

  constructor(private fieldsService: FieldsService,
              private sugar: SugarService) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getSingleField("civilites")
    .then((res) => this.fields = new Fields(res));

    this.sugar.getUsersFromSugar()
    .then((users) => users.forEach((user) => this.usersFromSugar.push(new User(user))));
  }

  public credentialClick(e) {
    const first = this.fields.userFields.find((field) => field.name === "firstname");
    const last = this.fields.userFields.find((field) => field.name === "lastname");
    const username = this.fields.userFields.find((field) => field.name === "username");

    this.usernameTaken = this.isUsernameTaken(username);
    this.usernameStatus = this.usernameTaken ? "Username already taken. Choose another one" : "Username available :)";

    if (!!first.value && !!last.value && !username.value) {
      this.setUsername(first, last, username);
      this.setPassword(first, last);
      this.setEmail(username);
    }
  }

  public setEmail(username) {
    const email = this.fields.userFields.find((field) => field.name === "email");
    email.value = `${username.value}@marcovasco.fr`;
  }

  public setUsername(first, last, username) {
    username.value = `${first.value[0].toLowerCase()}${last.value.toLowerCase()}`;
  }

  public isUsernameTaken(username) {

    return (this.usersFromSugar
            .find((user) => user.userName === username.value) !== undefined);
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

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
