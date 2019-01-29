import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";
import { User } from "../../models/user";

@Component({
  selector: "mv-credentials",
  templateUrl: "./credentials.component.html",
  viewProviders: [
  {
    provide: ControlContainer,
    useExisting: NgForm,
  },
  ],
})

export class CredentialsComponent implements OnInit {
  public fields;
  public passwordExists = false;
  public usersFromSugar: User[];
  public usernameTaken = false;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
  }

  public credentialClick(e) {
    const first = this.fields.userFields.find((field) => field.name === "firstname");
    const last = this.fields.userFields.find((field) => field.name === "lastname");
    const username = this.fields.userFields.find((field) => field.name === "username");
    // this.usernameTaken = this.isUsernameTaken(username);
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

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
