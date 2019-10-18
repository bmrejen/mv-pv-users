import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { GapiAuthenticatorService } from "./../../services/gapi.service";
import { NavbarService } from "./../../services/navbar.service";

@Component({
    providers: [
        BrowserModule,
        GapiAuthenticatorService,
        HttpClient],
    selector: "mv-navbar",
    styleUrls: ["./navbar.component.css"],
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
    public gapiStatus = {
        apiFailed: false,
        apiLoaded: false,
        apiReady: false,
        userLoggedIn: null,
    };

    constructor(private gapi: GapiAuthenticatorService, private navbar: NavbarService) {
        //
    }

    public ngOnInit() {
        this.initGapiServices();
    }

    public initGapiServices() {
        return this.gapi.loadClient()
            .then((result) => {
                this.gapiStatus.apiLoaded = true;

                return this.gapi.initClient();
            })
            .catch((err) => this.gapiStatus.apiFailed = true)
            .then((res) => {
                this.gapiStatus.apiReady = true;
                this.gapi.initAuthClient()
                    .then((result) => {
                        if (result.currentUser.get()
                            .isSignedIn() === true) {
                            this.gapiStatus.userLoggedIn = result.currentUser.get().w3.ig;

                            return this.gapiStatus.userLoggedIn;
                        } else {
                            return this.signIn();
                        }
                    })
                    .then(() => {
                        return this.gapi.getGroups()
                            .then((groups) => {
                                this.navbar.groupsSource.next(groups);
                            });

                    })
                    .catch((err) => {
                        console.error("initAuthClient error", err);
                        this.gapiStatus.userLoggedIn = "";
                    });
            })
            .catch((err) => this.gapiStatus.apiFailed = true);
    }

    public signIn() {
        return this.gapi.signIn()
            .then((res) => {
                window.location.reload();

                return this.gapi.initAuthClient()
                    .then((result: any) => {
                        this.gapiStatus.userLoggedIn = result.currentUser.get().w3.ig;

                        return this.gapiStatus.userLoggedIn;
                    })
                    .catch((err) => console.log("init auth client error", err));
            });
    }

    public signOut() {
        return this.gapi.signOut()
            .then(() => this.gapi.initAuthClient()
                .then((result: any) => {
                    if (!this.gapi.isSignedIn()) {
                        this.gapiStatus.userLoggedIn = "Logged out";
                    }
                })
                .catch((err) => console.error("init auth client error", err)));
    }

}
