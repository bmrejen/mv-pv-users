import { Component, OnInit, ViewChild } from "@angular/core";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-teams",
  templateUrl: "./teams.component.html",
})

export class TeamsComponent implements OnInit {
  public teamsFromSugar;

  @ViewChild("disableForm") public form: any;
  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.sugarService.getTeamsFromSugar()
    .subscribe((teams) => {
      this.teamsFromSugar = teams.data;
    });

  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
