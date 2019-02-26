import { Injectable } from "@angular/core";
import { User } from "../models/user";

@Injectable()
export class FormValueMapperService {
  public user: User;

  constructor() {
    //
  }

  public parseFormForSugar(form) {
    console.log(form);

    const [
    firstName,
    lastName,
    userName,
    ] = [
    form.userInfo.credentials.firstname,
    form.userInfo.credentials.lastname,
    form.userInfo.credentials.username,
    ];

    this.user = new User({firstName, lastName, userName});
    console.log(this.user);
  }
}
