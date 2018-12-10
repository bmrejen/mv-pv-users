import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-users",
  templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
  public users: User;
  public usersFromSugar;

  @ViewChild("disableForm") public form: any;
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    this.userService.getUser()
    .subscribe((users) => {
      this.users = users.data;
    });

    this.userService.getUsersFromSugar()
    .subscribe((users) => {
      this.usersFromSugar = users.data;
    });
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
