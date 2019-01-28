import { Component, OnInit, ViewChild } from "@angular/core";
import { Team } from "../../models/team";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-teams",
  styleUrls: ["./teams.component.css"],
  templateUrl: "./teams.component.html",
})

export class TeamsComponent implements OnInit {
  public teamsFromSugar: Team[] = [];

  @ViewChild("disableForm") public form: any;
  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.teamsFromSugar = this.sugarService.getTeamsFromSugar();
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
