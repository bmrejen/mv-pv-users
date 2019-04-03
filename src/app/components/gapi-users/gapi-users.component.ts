import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
    public orgas;
    public currentUser;
    public errorMessage: string;
    public selectedMail = "planetveo.com";

    // CREATE
    public newUser = {
        firstName: null,
        lastName: null,
        orgas: null,
        password: null,
        primaryEmail: null,
    };

    constructor(
        private gapiService: GapiAuthenticatorService,
        private route: ActivatedRoute,
    ) {
        //
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => this.orgas = data.fields.orgas);

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

    public isSignedIn() {
        return this.gapiService.isSignedIn();
    }

    public postUser(user) {
        this.currentUser = null;
        this.errorMessage = null;
        this.gapiService.postUser(user)
            .then((res) => this.setUser(res),
                (err) => this.errorMessage = err["result"].error.message,
            );
    }

    public trackByFn(index, item) {
        const self = this;

        return index; // or item.id
    }

    private setUser(res) {
        this.resetForm();
        this.currentUser = {
            firstName: res["result"].name.givenName,
            id: res["result"].id,
            lastName: res["result"].name.familyName,
            orgas: res["result"].orgUnitPath,
            password: null,
            primaryEmail: res["result"].primaryEmail,
        };
    }

    private resetForm() {
        this.newUser = {
            firstName: null,
            lastName: null,
            orgas: null,
            password: null,
            primaryEmail: null,
        };
    }
}
