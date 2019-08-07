import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-user",
  styleUrls: ["./user.component.css"],
  templateUrl: "./user.component.html",
})

export class UserComponent implements OnInit {
  public user: User;

  // @ViewChild("disableForm") public form: any;
  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {

    const id = "4fd88823-0f55-2688-0f84-5bee19677712";

    this.sugarService.getUserById(id)
    .then((user) => this.user = new User(user));
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
