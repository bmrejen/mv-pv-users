import { Component, OnInit } from "@angular/core";
import { GapiAuthenticatorService } from "./../../services/gapi.service";

@Component({
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

    constructor(private gapi: GapiAuthenticatorService) {
        //
    }

    public ngOnInit() {
        this.initGapiServices();
    }

    public initGapiServices() {
        this.gapi.loadClient()
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
                        } else {
                            this.signIn();
                        }
                    })
                    .catch((err) => console.error("initAuthClient error", err));
            })
            .catch((err) => this.gapiStatus.apiFailed = true);
    }

    public signIn() {
        this.gapi.signIn()
            .then((res) => {
                window.location.reload();
                this.gapi.initAuthClient()
                    .then((result: any) => this.gapiStatus.userLoggedIn = result.currentUser.get().w3.ig)
                    .catch((err) => console.log("init auth client error", err));
            });
    }

    public signOut() {
        this.gapi.signOut()
            .then(() => this.gapi.initAuthClient()
                .then((result: any) => {
                    if (!this.gapi.isSignedIn()) {
                        this.gapiStatus.userLoggedIn = "Logged out";
                    }
                })
                .catch((err) => console.error("init auth client error", err)));
    }

}
