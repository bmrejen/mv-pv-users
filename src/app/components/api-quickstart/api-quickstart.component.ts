import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: "mv-api-quickstart",
  templateUrl: "./api-quickstart.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

// declare var gapi: any  ;

export class ApiQuickStartComponent implements OnInit {
  public credentials;
  // Client ID and API key from the Developer Console
  public CLIENT_ID = "194265459541-u110u0hgudfv4k5irkoc6c83m5ph93q1.apps.googleusercontent.com";
  public API_KEY = "AIzaSyBfeKvEwqrrFTpWA79_cLEGgJZYnRF1Dug";

  // Array of API discovery doc URLs for APIs used by the quickstart
  public DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  public SCOPES = "https://www.googleapis.com/auth/admin.directory.user.readonly";

  public authorizeButton = document.getElementById("authorize_button");
  public signoutButton = document.getElementById("signout_button");

  constructor(private http: HttpClient) {
    //
  }

  public ngOnInit() {
    gapi.load("client:auth2", this.initClient);
  }

  // Initializes the API client library and sets up sign-in state listeners.
  public initClient() {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES,
    })
    .then(function() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn
      .listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn
                              .get());
      this.authorizeButton.onclick = this.handleAuthClick;
      this.signoutButton.onclick = this.handleSignoutClick;
    }, function(error) {
      this.appendPre(JSON.stringify(error, null, 2));
    });
  }

  // Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
  public updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.authorizeButton.style.display = "none";
      this.signoutButton.style.display = "block";
      this.listUsers();
    } else {
      this.authorizeButton.style.display = "block";
      this.signoutButton.style.display = "none";
    }
  }

  // Sign in the user upon button click.
  public handleAuthClick(event) {
    gapi.auth2.getAuthInstance()
    .signIn();
  }

  // Sign out the user upon button click.
  public handleSignoutClick(event) {
    gapi.auth2.getAuthInstance()
    .signOut();
  }

  // Display the results of the API call.
  public appendPre(message) {
    const pre = document.getElementById("content");
    const textContent = document.createTextNode(message + "\n");
    pre.appendChild(textContent);
  }

  // Print the first 10 users in the domain.
  public listUsers() {
    gapi.client.directory.users.list({
      customer: "my_customer",
      maxResults: 500,
      orderBy: "email",
    })
    .then(function(response) {
      const users = response.result.users;
      this.appendPre("Users:");

      if (users && users.length > 0) {
        for (i = 0; i < users.length; i++) {
          const user = users[i];
          this.appendPre(`- ${user.primaryEmail} (${user.name.fullName})`);
        }
      } else {
        this.appendPre("No users found.");
      }
    });
  }
}
