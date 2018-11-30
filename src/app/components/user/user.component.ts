import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-users",
  templateUrl: "./user.component.html",
})

export class UserComponent implements OnInit {
  public fakeUser: User;
  public realUser: User;

  @ViewChild("disableForm") public form: any;
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    this.userService.getFakeUser()
    .subscribe((user) => {
      this.fakeUser = user;
    });

    this.userService.getUser()
    .subscribe((realUser) => {
      this.realUser = realUser.data;
    });
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
