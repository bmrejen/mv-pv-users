import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

declare var gapi: any  ;
declare var initClient: any;

@Component({
  selector: "mv-api-quickstart",
  templateUrl: "./api-quickstart.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class ApiQuickStartComponent implements AfterViewInit, OnInit {
  constructor() {
    //
  }

  public ngOnInit() {
    // gapi.load("client:auth2", initClient);
  }

  public ngAfterViewInit() {
    console.log("init gapi");
    gapi.load("client:auth2", initClient);
  }
}
