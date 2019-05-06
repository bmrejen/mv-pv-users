import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GapiAuthenticatorService } from "../../services/gapi.service";
import { GoogleUser } from "./../../models/google-user";
import { User } from "./../../models/user";

enum Domains {
    PL = "planetveo.com",
    MA = "marcovasco.fr",
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
    public ggOldUser: User;
    public orgas;
    public message = null;
    public isAlias: boolean = null;
    public googleGroups;
    @Input() public currentUser: User;
    @Output() public readonly notifyParent: EventEmitter<any> = new EventEmitter();

    public domains = Object.keys(Domains)
        .map((dom) => Domains[dom]);

    constructor(
        private gapiService: GapiAuthenticatorService,
        private route: ActivatedRoute,
    ) {
        //
    }

    public ngOnInit(): void {
        this.currentUser["ggCurrentUser"] = new GoogleUser(null, null, null, null, null);

        this.resetForm();
        this.route.data
            .subscribe((data) => {
                if (data.fields != null) {
                    this.orgas = data.fields.orgas;
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
                            this.gapiService.getGroups()
                                .then((response) => {
                                    this.googleGroups = response;
                                });
                        }
                    })
                    .catch((err) => console.error("init auth client error", err));
            });
    }

    public listUsers(): void {
        this.gapiService.listUsers()
            .then((res) => this.users = res.result.users)
            .catch((err) => console.error("error", err));
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
                .catch((err) => console.error("init auth client error", err)));
    }

    public isSignedIn(): boolean {
        return this.gapiService.isSignedIn();
    }

    public getUser(user?): void {
        if (user.constructor.name === "JamespotUser") {
            this.userToGet = user.jamesMail;
        }
        if (user.constructor.name === "CredentialsComponent") {
            this.userToGet =
                `${user.firstName[0]}${user.lastName}@planetveo.com`;
        }
        this.isAlias = null;
        this.resetForm();

        this.gapiService.getUser(this.userToGet)
            .then((res) => {
                if (res["result"] != null && res["result"].name != null) {
                    const email = res["result"].primaryEmail;

                    this.currentUser.firstName = res["result"].name.givenName;
                    this.currentUser.lastName = res["result"].name.familyName;
                    this.currentUser.ggCurrentUser.emails = res["result"].emails;
                    this.currentUser.ggCurrentUser.id = res["result"].id;
                    this.currentUser.ggCurrentUser.orgas = res["result"].orgUnitPath;
                    this.currentUser.ggCurrentUser.primaryEmail = email;
                    this.currentUser.ggCurrentUser.primaryEmailSuffix = email.substring(email.lastIndexOf("@") + 1);

                    this.notifyParent.emit(this.currentUser.ggCurrentUser);

                    this.isAlias = this.gapiService.isAlias(email, this.userToGet, res);

                    this.gapiService.getGroups(email)
                        .then((response) => {
                            this.googleGroups.forEach((gp) => gp["isEnabled"] = false);
                            response.forEach((group) => {
                                const myGroup = this.googleGroups.find((grp) => grp.id === group.id);
                                myGroup["isEnabled"] = true;
                                this.pushGroupToUser(myGroup);
                            });
                        });

                    this.gapiService.getUserAliases(email)
                        .then((response) => {
                            this.currentUser.ggCurrentUser.aliases = response;

                            const defaultAlias = response.find((alias) => alias.isDefault === true);
                            this.currentUser.ggCurrentUser.signature = defaultAlias.signature;
                            this.currentUser.ggCurrentUser.sendAs = defaultAlias.sendAsEmail.split("@")[1];

                            this.ggOldUser = { ...this.currentUser };
                        });
                    this.isAlias =
                        this.gapiService.isAlias(this.currentUser.ggCurrentUser.primaryEmail, this.userToGet, res);
                }
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    this.message = err["result"].error.message;
                }
            });
    }

    public pushGroupToUser(group) {

        if (this.currentUser.ggCurrentUser.googleGroups.includes(group)) {
            const index = this.currentUser.ggCurrentUser.googleGroups.indexOf(group);
            this.currentUser.ggCurrentUser.googleGroups.splice(index, 1);

        } else {
            this.currentUser.ggCurrentUser.googleGroups.push(group);
        }
    }

    public postUser() {
        this.message = null;
        this.gapiService.postUser(this.currentUser)
            .then((res) => {
                if (res["result"] != null) {
                    this.resetForm();
                    this.userToGet = res["result"].id;
                    this.getUser();
                    this.message = "User created !";
                }
            })
            .catch((err) => this.message = err["result"].error.message);
    }

    public updateUser() {
        this.message = null;
        this.gapiService.updateUser(this.currentUser, this.ggOldUser)
            .then((res) => {
                this.userToGet = res["result"].id;
                this.getUser();
            })
            .catch((err) => console.error(err));

        // Update Gmail settings (sendAs and signature)
        this.gapiService.updateGmailSendAs(this.currentUser, this.ggOldUser)
            .then((res) => console.log("Alias updated !", res))
            .catch((err) => console.error(err));
    }

    public trackByFn(index) {
        return index;
    }

    public refreshEmail() {
        const email = this.currentUser.ggCurrentUser.primaryEmail;
        const emailPrefix = email.lastIndexOf("@") === -1 ? email : email.substring(0, email.lastIndexOf("@"));

        this.currentUser.ggCurrentUser.primaryEmail =
            `${emailPrefix}@${this.currentUser.ggCurrentUser.primaryEmailSuffix}`;
    }

    public resetForm(): void {
        this.message = null;

        this.currentUser["ggCurrentUser"]["emails"] = null;
        this.currentUser["ggCurrentUser"]["familyName"] = null;
        this.currentUser["ggCurrentUser"]["givenName"] = null;
        this.currentUser["ggCurrentUser"]["id"] = null;
        this.currentUser["ggCurrentUser"]["orgas"] = null;
        this.currentUser["ggCurrentUser"]["password"] = null;
        this.currentUser["ggCurrentUser"]["primaryEmail"] = null;
        this.currentUser["ggCurrentUser"]["sendAs"] = null;
        this.currentUser["ggCurrentUser"]["signature"] = null;
    }

    public activateImap(id: string) {
        // return this.gapiService.activateImap(id)
        //     .then((res) => console.log("IMAP Activated", res))
        //     .catch((err) => console.error("IMAP Activation error", err));
    }

    public getImap(id: string) {
        // return this.gapiService.getImap(id)
        //     .then((res) => console.log("IMAP settings", res))
        //     .catch((err) => console.error("Error when getting IMAP", err));
    }

    public deactivateImap(id: string) {
        // return this.gapiService.deactivateImap(id)
        //     .then((res) => console.log("IMAP settings", res))
        //     .catch((err) => console.error("Error when getting IMAP", err));
    }

    private setUser(res): void {
        console.log(res);
        this.resetForm();
        if (res["result"] != null && res["result"].name != null) {
            this.currentUser.ggCurrentUser.givenName = res["result"].name.givenName;
            this.currentUser.ggCurrentUser.id = res["result"].id;
            this.currentUser.ggCurrentUser.familyName = res["result"].name.familyName;
            this.currentUser.ggCurrentUser.orgas = res["result"].orgUnitPath;
            this.currentUser.ggCurrentUser.password = null;
            this.currentUser.ggCurrentUser.primaryEmail = res["result"].primaryEmail;
        }
    }
}
