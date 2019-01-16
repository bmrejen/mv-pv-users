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

  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {

    this.userService.getUsersFromSugar()
    .subscribe((users) => {
      this.usersFromSugar = users.data;
    });

    this.userService.getUserById("7ac24a6a-1eb1-db9e-e08d-549eec71bc8d")
    .subscribe((user) => console.log(user.data));

  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
