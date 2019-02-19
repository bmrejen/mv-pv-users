import { Component, Input, OnInit } from "@angular/core";
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
  @Input() public civilites;
  @Input() public userFields;

  public passwordExists = false;
  public usersFromSugar: User[] = [];
  public usernameTaken;
  public usernameStatus;

  constructor(private fieldsService: FieldsService,
              private sugar: SugarService) {
    //
  }

  public ngOnInit(): void {
    this.sugar.getUsers()
    .then((users) => users.forEach((user) => this.usersFromSugar.push(new User(user))));
  }

  public credentialClick(e) {
    const [first, last, username ] = [ this.userFields[0], this.userFields[1], this.userFields[2] ];

    this.usernameTaken = this.isUsernameTaken(username);
    this.usernameStatus = this.usernameTaken ? "Username already taken. Choose another one" : "Username available :)";

    if (!!first.value && !!last.value && !username.value) {
      this.setUsername(first, last, username);
      this.setPassword(first, last);
      this.setEmail(username);
    }
  }

  public setEmail(username) {
    const email = this.userFields[3];
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
    const pwd = this.userFields.find((field) => field.name === "password");
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
