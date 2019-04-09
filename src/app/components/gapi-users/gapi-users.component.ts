import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GapiAuthenticatorService } from "../../services/gapi.service";

enum Domains {
    PL = "planetveo.com",
    MA = "marcovasco.fr",
    CH = "chinaveo.com",
    MR = "marcovasco.com",
    PR = "prestige-voyages.com",
}

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
        firstName: null,
        fullName: null,
        id: null,
        lastName: null,
        orgas: null,
        password: null,
        primaryEmail: null,
    };
    public errorMessage: string = null;

    // CREATE
    public newUser = {
        firstName: null,
        lastName: null,
        orgas: null,
        password: null,
        primaryEmail: null,
    };
    public domains = Object.keys(Domains)
        .map((dom) => Domains[dom]);

    constructor(
        private gapiService: GapiAuthenticatorService,
        private route: ActivatedRoute,
    ) {
        //
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => {
                if (data.fields != null) {
                    this.currentUser.orgas = data.fields.orgas;
                }
            });

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
                    .then((result: any) => {
                        if (this.isSignedIn()) {
                            this.userLoggedIn = result.currentUser.get().w3.ig;
                        }
                    })
                    .catch((err) => console.log("init auth client error", err));
            });
    }

    public listUsers(): void {
        this.gapiService.listUsers()
            .then((res) => this.users = res.result.users)
            .catch((err) => console.log("error", err));
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

    public postUser(user) {
        this.currentUser = null;
        this.errorMessage = null;
        this.gapiService.postUser(user)
            .then((res) => this.setUser(res))
            .catch((err) => this.errorMessage = err["result"].error.message);
    }

    public getUser(): void {
        this.currentUser = {
            emails: null,
            firstName: null,
            fullName: null,
            id: null,
            lastName: null,
            orgas: null,
            password: null,
            primaryEmail: null,
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

    private setUser(res): void {
        this.resetForm();
        if (res["result"] != null && res["result"].name != null) {
            this.currentUser.firstName = res["result"].name.givenName;
            this.currentUser.id = res["result"].id;
            this.currentUser.lastName = res["result"].name.familyName;
            this.currentUser.orgas = res["result"].orgUnitPath;
            this.currentUser.password = null;
            this.currentUser.primaryEmail = res["result"].primaryEmail;
        }
    }

    private resetForm(): void {
        this.newUser = {
            firstName: null,
            lastName: null,
            orgas: null,
            password: null,
            primaryEmail: null,
        };
    }
}
