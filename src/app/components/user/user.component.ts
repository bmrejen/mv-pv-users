import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-user",
  templateUrl: "./user.component.html",
})

export class UserComponent implements OnInit {
  public user: User;

  @ViewChild("disableForm") public form: any;
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    this.userService.getUserById("cbc425e0-40bc-b51d-f6d2-57d618ec23cf")
    .subscribe((user) => {
      this.user = user.data;
    });
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
