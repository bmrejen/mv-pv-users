import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";

@Component({
  selector: "mv-app-teams",
  templateUrl: "./teams.component.html",
})

export class TeamsComponent implements OnInit {
  public teamsFromSugar;

  @ViewChild("disableForm") public form: any;
  constructor(private userService: UserService) {
    // constructor
  }

  public ngOnInit(): void {
    this.userService.getTeamsFromSugar()
    .subscribe((teams) => {
      this.teamsFromSugar = teams.data;
    });

  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
