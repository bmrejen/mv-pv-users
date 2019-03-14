import { AfterViewInit, Component } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

declare var gapi: any  ;
declare var initClient: any;

@Component({
  selector: "mv-api-quickstart",
  templateUrl: "./api-quickstart.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class ApiQuickStartComponent implements AfterViewInit {
  constructor() {
    //
  }

  public ngAfterViewInit() {
    gapi.load("client:auth2", initClient);
  }
}
