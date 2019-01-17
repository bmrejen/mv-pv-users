import { Component, OnInit, ViewChild } from "@angular/core";
import { Role } from "../../models/role";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-roles",
  styleUrls: ["./roles.component.css"],
  templateUrl: "./roles.component.html",
})

export class RolesComponent implements OnInit {
  public rolesFromSugar: Role[] = [];

  // @ViewChild("disableForm") public form: any;
  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.rolesFromSugar = this.sugarService.getRolesFromSugar();
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
