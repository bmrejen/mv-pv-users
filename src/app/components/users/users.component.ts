import { Component, OnInit } from "@angular/core";
import { IUser } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-users",
  templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
  public users: IUser[];
  public realUsers: IUser[];
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    console.log("Users component launched");
    this.userService.getUsers()
    .subscribe((users) => {
      this.users = users;
    });
    this.userService.getRealUsers()
    .subscribe((realUsers) => {
      this.realUsers = realUsers;
    });
    console.table(this.users);
    console.table(this.realUsers);
  }
  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
