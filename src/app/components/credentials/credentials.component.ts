import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { ActivatedRoute } from "@angular/router";

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
  @Input() public currentUser: User;
  @Input() public usersFromSugar: User[];

  public passwordExists = false;
  public usernameTaken;
  public usernameStatus;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.prefillForm();
  }

  public prefillForm(): any {
    this.userFields[0].value = this.currentUser.firstName;
    this.userFields[1].value = this.currentUser.lastName;
    this.userFields[2].value = this.currentUser.userName;
    this.userFields[3].value = this.currentUser.email;
  }

  public credentialClick(e) {
    const [ first, last, username ] = [ this.userFields[0], this.userFields[1], this.userFields[2] ];

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
