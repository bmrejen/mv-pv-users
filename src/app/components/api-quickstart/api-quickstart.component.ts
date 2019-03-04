import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: "mv-api-quickstart",
  templateUrl: "./api-quickstart.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class ApiQuickStartComponent implements OnInit {
  public credentials;

  constructor(private http: HttpClient) {
    //
  }

  public ngOnInit() {
    const Modal = function() {

      // Client ID and API key from the Developer Console
      const CLIENT_ID = "194265459541-u110u0hgudfv4k5irkoc6c83m5ph93q1.apps.googleusercontent.com";
      const API_KEY = "AIzaSyBfeKvEwqrrFTpWA79_cLEGgJZYnRF1Dug";

      // Array of API discovery doc URLs for APIs used by the quickstart
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = "https://www.googleapis.com/auth/admin.directory.user.readonly";
      const obj = { CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES };

    };

    const myModal = new Modal();
    console.log("myModal", myModal);
  }
}
