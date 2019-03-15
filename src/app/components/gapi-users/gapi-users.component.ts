import { AfterViewInit, Component } from "@angular/core";

declare var gapi: any;
declare var initClient: any;

@Component({
  selector: "mv-gapi-users",
  templateUrl: "./gapi-users.component.html",
})

export class GapiUsersComponent implements AfterViewInit {
  constructor() {
    //
  }

  public ngAfterViewInit() {
    gapi.load("client:auth2", initClient);
  }
}
