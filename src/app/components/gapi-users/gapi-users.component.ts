import { Component, OnInit } from "@angular/core";
import { GapiAuthenticatorService } from "../../services/gapi.service";

@Component({
  selector: "mv-gapi-users",
  styleUrls: ["./gapi-users.component.css"],
  templateUrl: "./gapi-users.component.html",
})

export class GapiUsersComponent implements OnInit {
  public apiLoaded: boolean = false;
  public apiReady: boolean = false;
  public apiFailed: boolean = false;
  public userLoggedIn: string;
  public users;

  constructor(private gapiService: GapiAuthenticatorService) {
    //
  }

  public ngOnInit(): void {
    this.gapiService.loadClient()
      .then(
        (result) => {
          this.apiLoaded = true;

          return this.gapiService.initClient();
        },
        (err) => {
          this.apiFailed = true;
        },
      )
      .then((res) => {
        this.apiReady = true;
        this.gapiService.initAuthClient()
          .then(
            (result: any) => {
              if (result.currentUser.get()
                .isSignedIn() === true) {
                this.userLoggedIn = result.currentUser.get().w3.ig;
              }
            },
            (err) => {
              console.log("init auth client error", err);
            },
          );
      }, (err) => {
        this.apiFailed = true;
      });
  }

  public listUsers(): void {
    this.gapiService.listUsers()
      .then((res) => {
        this.users = res.result.users;
        console.log(this.users);
      });
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
