import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-users",
  styleUrls: ["./users.component.css"],
  templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
  public usersFromSugar;
  public userModel: User;
  public userList: User[] = [];

  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {

    this.userService.getUsersFromSugar()
    .subscribe((users) => {
      this.usersFromSugar = users.data;
      users.data.forEach((user) => {
        this.userList.push(new User(
          user.type,
          user.id,
          user.attributes));
      });
      console.log("USERLIST", this.userList);
    });

    this.userService.getUserById("7ac24a6a-1eb1-db9e-e08d-549eec71bc8d")
    .subscribe((user) => {
      this.userModel = new User(
        user.data.type,
        user.data.id,
        user.data.attributes);
      console.log(this.userModel);
    });
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
