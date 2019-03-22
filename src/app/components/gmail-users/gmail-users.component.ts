import { AfterViewInit, Component } from "@angular/core";

declare const gapi;
declare const initClient;

@Component({
    selector: "mv-gmail-users",
    templateUrl: "./gmail-users.component.html",
})

export class GmailUsersComponent implements AfterViewInit {
    // Client ID and API key from the Developer Console
    public CLIENT_ID = "370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com";
    public API_KEY = "AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ";

    // Array of API discovery doc URLs for APIs used by the quickstart
    public DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    public SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

    public authorizeButton = document.getElementById("authorize_button");
    public signoutButton = document.getElementById("signout_button");

    public constructor() {
        //
    }

    public ngAfterViewInit() {
        gapi.load("client:auth2", initClient);
    }
}
