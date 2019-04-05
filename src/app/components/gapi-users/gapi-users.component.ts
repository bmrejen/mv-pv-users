import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IGapiUser } from "../../interfaces/gapi-user";
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
    public currentUser: IGapiUser;
    public oldUser: IGapiUser;
    public orgas;
    public message = null;

    constructor(
        private gapiService: GapiAuthenticatorService,
        private route: ActivatedRoute,
    ) {
        //
    }

    public ngOnInit(): void {
        this.resetForm();
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
                    this.currentUser.id = res["result"].customerId;
                    this.currentUser.orgas = res["result"].orgUnitPath;
                    this.currentUser.primaryEmail = email;
                    this.currentUser.primaryEmailSuffix = email.substring(email.lastIndexOf("@") + 1);
                    this.oldUser = { ...this.currentUser };
                    console.log(this.currentUser);
                }
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    this.message = err["result"].error.message;
                }
            });
    }

    public postUser(user) {
        this.message = null;
        this.gapiService.postUser(user)
            .then((res) => {
                if (res["result"] != null) {
                    this.currentUser = null;
                    this.userToGet = res["result"].id;
                    this.getUser();
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
                this.currentUser = null;
                this.userToGet = res["result"].id;
                this.getUser();
                this.message = "User updated!";
                console.log(this.message);
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

    public resetForm() {
        this.currentUser = {
            emails: null,
            familyName: null,
            fullName: null,
            givenName: null,
            id: null,
            orgas: null,
            password: null,
            primaryEmail: "",
            primaryEmailSuffix: "planetveo.com",
        };
        this.message = null;
    }
}
