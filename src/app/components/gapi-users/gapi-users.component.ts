import { AfterViewInit, Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { GapiAuthenticatorService } from "../../services/gapi.service";

// declare const gapi: any;
// declare const initClient: any;

@Component({
  selector: "mv-gapi-users",
  templateUrl: "./gapi-users.component.html",
})

export class GapiUsersComponent implements AfterViewInit, OnInit {
  public authIsLoaded: boolean = false;
  public isLoggedIn: boolean = false;
  public user: User;

  public apiLoaded: boolean = false;
  public apiReady: boolean = false;
  public apiFailed: boolean = false;

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
                //
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

  public ngAfterViewInit(): void {
    // gapi.load("client:auth2", initClient);

    // this.gapiService.isLoaded$.subscribe((value) => {
    //   this.authIsLoaded = value;
    // });

    // this.gapiService.isLoggedIn$.subscribe((value) => {
    //   this.isLoggedIn = value;
    // });

    // this.gapiService.user$.subscribe((value) => {
    //   this.user = value;
    // });

    // this.gapiService.loadAuth2();
  }

  public signIn(): void {
    // this.gapiService.signIn();
  }

  public signOut(): void {
    // this.gapiService.signOut();
  }
}
