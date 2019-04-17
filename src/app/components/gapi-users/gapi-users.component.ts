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
    public currentUser;
    public oldUser;
    public orgas;
    public message = null;

    // CREATE
    public newUser = {
        familyName: null,
        givenName: null,
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
        this.resetForm();
        this.route.data
            .subscribe((data) => {
                if (data.fields != null) {
                    this.orgas = data.fields.orgas;
                    console.log(this.currentUser);
                }
            });

        this.gapiService.loadClient()
            .then((result) => {
                this.apiLoaded = true;

                return this.gapiService.initClient();
            })
            .catch((err) => this.apiFailed = true)
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
                .then((result: any) => this.userLoggedIn = result.currentUser.get().w3.ig)
                .catch((err) => console.log("init auth client error", err)),
            );
    }

    public signOut() {
        this.gapiService.signOut()
            .then(() => this.gapiService.initAuthClient()
                .then((result: any) => {
                    if (!this.isSignedIn()) {
                        this.userLoggedIn = "Logged out";
                    }
                })
                .catch((err) => console.log("init auth client error", err)));
    }

    public isSignedIn(): boolean {
        return this.gapiService.isSignedIn();
    }

    public getUser(): void {
        this.resetForm();
        this.gapiService.getUser(this.userToGet)
            .then((res) => {
                console.log(res);
                if (res["result"] != null && res["result"].name != null) {
                    const email = res["result"].primaryEmail;

                    this.currentUser.givenName = res["result"].name.givenName;
                    this.currentUser.familyName = res["result"].name.familyName;
                    this.currentUser.emails = res["result"].emails;
                    this.currentUser.id = res["result"].id;
                    this.currentUser.orgas = res["result"].orgUnitPath;
                    this.currentUser.primaryEmail = email;
                    this.currentUser.primaryEmailSuffix = email.substring(email.lastIndexOf("@") + 1);
                    this.oldUser = { ...this.currentUser };
                }
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    this.message = err["result"].error.message;
                }
            });
        this.getImap(this.userToGet);
    }

    public postUser() {
        this.message = null;
        this.gapiService.postUser(this.newUser)
            .then((res) => {
                if (res["result"] != null) {
                    this.resetForm();
                    this.userToGet = res["result"].id;
                    this.getUser();
                    this.setUser(res);
                    this.message = "User created !";
                    console.log("res ", res);
                }
            })
            .catch((err) => this.message = err["result"].error.message);
    }

    public updateUser() {
        this.message = null;
        this.gapiService.updateUser(this.currentUser, this.oldUser)
            .then((res) => {
                this.userToGet = res["result"].id;
                this.getUser();
            })
            .catch((err) => console.error(err));
    }

    public trackByFn(index) {
        return index;
    }

    public refreshEmail() {
        const email = this.currentUser.primaryEmail;
        const emailPrefix = email.lastIndexOf("@") === -1 ? email : email.substring(0, email.lastIndexOf("@"));

        this.currentUser.primaryEmail = `${emailPrefix}@${this.currentUser.primaryEmailSuffix}`;
    }

    public resetForm(): void {
        this.message = null;
        this.currentUser = {
            emails: null,
            familyName: null,
            givenName: null,
            id: null,
            orgas: null,
            password: null,
            primaryEmail: "",
            primaryEmailSuffix: "planetveo.com",
        };

        this.newUser = {
            familyName: null,
            givenName: null,
            orgas: null,
            password: null,
            primaryEmail: null,
        };
    }

    public activateImap(id: string) {
        return this.gapiService.activateImap(id)
            .then((res) => console.log("IMAP Activated", res))
            .catch((err) => console.error("IMAP Activation error", err));
    }

    public getImap(id: string) {
        return this.gapiService.getImap(id)
            .then((res) => console.log("IMAP settings", res))
            .catch((err) => console.error("Error when getting IMAP", err));
    }

    public deactivateImap(id: string) {
        return this.gapiService.deactivateImap(id)
            .then((res) => console.log("IMAP settings", res))
            .catch((err) => console.error("Error when getting IMAP", err));
    }

    private setUser(res): void {
        console.log(res);
        this.resetForm();
        if (res["result"] != null && res["result"].name != null) {
            this.currentUser.givenName = res["result"].name.givenName;
            this.currentUser.id = res["result"].id;
            this.currentUser.familyName = res["result"].name.familyName;
            this.currentUser.orgas = res["result"].orgUnitPath;
            this.currentUser.password = null;
            this.currentUser.primaryEmail = res["result"].primaryEmail;
        }
    }
}
