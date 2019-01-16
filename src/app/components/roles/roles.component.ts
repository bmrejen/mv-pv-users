import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-roles",
  templateUrl: "./roles.component.html",
})

export class RolesComponent implements OnInit {
  public rolesFromSugar;

  @ViewChild("disableForm") public form: any;
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    this.userService.getRolesFromSugar()
    .subscribe((roles) => {
      this.rolesFromSugar = roles.data;
    });

  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
