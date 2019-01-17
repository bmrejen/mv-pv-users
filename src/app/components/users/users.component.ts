import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-users",
  styleUrls: ["./users.component.css"],
  templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
  public usersFromSugar: User[] = [];

  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.usersFromSugar = this.sugarService.createUserList();
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
