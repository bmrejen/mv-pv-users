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
  public filteredUsers: User[] = [];
  public filter: string = "All";

  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.filteredUsers = this.usersFromSugar = this.sugarService.getUsersFromSugar();
  }

  public filterUsers(prop: string) {
    switch (prop) {

      case "inactive":
      this.filter = "Inactive";
      // tslint:disable-next-line:max-line-length
      this.filteredUsers = this.usersFromSugar.filter((user) => user.status !== "Active" || user.employeeStatus !== "Active");
      break;

      case "active":
      this.filter = "Active";
      // tslint:disable-next-line:max-line-length
      this.filteredUsers = this.usersFromSugar.filter((user) => user.status === "Active" && user.employeeStatus === "Active");
      break;

      case "all":
      this.filter = "All";
      this.filteredUsers = this.usersFromSugar;
      break;

      default:
      console.error("Users not filtered");
      break;
    }
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
