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
    public userLoggedIn: string = "Logged out";
    public users;
    public userToGet: string;
    public currentUser = {
        emails: null,
        fullName: null,
        id: null,
        orgas: null,
    };
    public errorMessage: string = null;

    constructor(private gapiService: GapiAuthenticatorService) {
        //
    }

    public ngOnInit(): void {
        this.gapiService.loadClient()
            .then((result) => {
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
                            if (this.isSignedIn()) {
                                this.userLoggedIn = result.currentUser.get().w3.ig;
                            }
                        },
                        (err) => console.log("init auth client error", err),
                    );
            });
    }

    public listUsers(): void {
        this.gapiService.listUsers()
            .then((res) => this.users = res.result.users);
    }

    public signIn() {
        this.gapiService.signIn()
            .then(() => this.gapiService.initAuthClient()
                .then(
                    (result: any) => this.userLoggedIn = result.currentUser.get().w3.ig,
                    (err) => console.log("init auth client error", err),
                ));
    }

    public signOut() {
        this.gapiService.signOut()
            .then(() => this.gapiService.initAuthClient()
                .then(
                    (result: any) => {
                        if (!this.isSignedIn()) {
                            this.userLoggedIn = "Logged out";
                        }
                    },
                    (err) => console.log("init auth client error", err),
                ));
    }

    public isSignedIn(): boolean {
        return this.gapiService.isSignedIn();
    }

    public getUser(): void {
        this.currentUser = {
            emails: null,
            fullName: null,
            id: null,
            orgas: null,
        };
        this.errorMessage = null;
        this.gapiService.getUser(this.userToGet)
            .then((res) => {
                console.log(res);
                if (res["result"] != null && res["result"].name != null) {
                    this.currentUser.fullName = res["result"].name.fullName;
                    this.currentUser.emails = res["result"].emails;
                    this.currentUser.id = res["result"].customerId;
                    this.currentUser.orgas = res["result"].orgUnitPath;
                }
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    this.errorMessage = err["result"].error.message;
                }
            });
    }

    public trackByFn(index, item) {
        const self = this;

        return index; // or item.id
    }
}
