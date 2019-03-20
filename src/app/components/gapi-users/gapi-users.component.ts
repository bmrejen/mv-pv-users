import { AfterViewInit, Component } from "@angular/core";
import { User } from "../../models/user";
import { GapiAuthenticatorService } from "../../services/gapi.service";

declare const gapi: any;
declare const initClient: any;

@Component({
  selector: "mv-gapi-users",
  templateUrl: "./gapi-users.component.html",
})

export class GapiUsersComponent implements AfterViewInit {
  public authIsLoaded: boolean = false;
  public isLoggedIn: boolean = false;
  public user: User;

  constructor(private gapiService: GapiAuthenticatorService) {
    //
  }

  public ngAfterViewInit() {
    // gapi.load("client:auth2", initClient);

    this.gapiService.isLoaded$.subscribe((value) => {
      this.authIsLoaded = value;
    });

    this.gapiService.isLoggedIn$.subscribe((value) => {
      this.isLoggedIn = value;
    });

    this.gapiService.user$.subscribe((value) => {
      this.user = value;
    });

    this.gapiService.loadAuth2();
  }

  public signIn(): void {
    this.gapiService.signIn();
  }

  public signOut(): void {
    this.gapiService.signOut();
  }
}
