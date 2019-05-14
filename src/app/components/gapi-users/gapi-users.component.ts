import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IGapiUser } from "../../interfaces/gapi-user";
import { GoogleUser } from "../../models/google-user";
import { User } from "../../models/user";
import { GapiAuthenticatorService } from "../../services/gapi.service";

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
    public users;
    public userToGet: string;
    public ggOldUser: User;
    public orgas;
    public userLoggedIn: "Logged out";

    public googleGroups;

    public domains = Object.keys(Domains)
        .map((dom) => Domains[dom]);

    @Input() public currentUser: User;
    @Input() public ggCurrentUser: GoogleUser;
    @Input() public gapiMessage: string;
    @Input() public gapiStatus;

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
                }
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
                    if (!this.gapiService.isSignedIn()) {
                        this.userLoggedIn = "Logged out";
                    }
                })
                .catch((err) => console.error("init auth client error", err)));
    }

    public pushGroupToUser(group) {
        if (this.ggCurrentUser.googleGroups.includes(group)) {
            const index = this.ggCurrentUser.googleGroups.indexOf(group);
            this.ggCurrentUser.googleGroups.splice(index, 1);

        } else {
            this.ggCurrentUser.googleGroups.push(group);
        }
    }

    public postUser() {
        this.gapiMessage = null;
        this.gapiService.postUser(this.currentUser)
            .then((res) => {
                if (res["result"] != null) {
                    this.resetForm();
                    this.userToGet = res["result"].id;
                    // this.getUser();
                    this.gapiMessage = "User created !";
                }
            })
            .catch((err) => this.gapiMessage = err["result"].error.gapiMessage);
    }

    public updateUser() {
        this.gapiMessage = null;
        this.gapiService.updateUser(this.currentUser, this.ggOldUser)
            .then((res) => {
                this.userToGet = res["result"].id;
                // this.getUser();
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
        const email = this.ggCurrentUser.primaryEmail;
        const emailPrefix = email.lastIndexOf("@") === -1 ? email : email.substring(0, email.lastIndexOf("@"));

        this.ggCurrentUser.primaryEmail =
            `${emailPrefix}@${this.ggCurrentUser.primaryEmailSuffix}`;
    }

    public resetForm(): void {
        this.gapiMessage = null;
        this.ggCurrentUser.emails = null;
        this.ggCurrentUser.id = null;
        this.ggCurrentUser.orgas = null;
        this.ggCurrentUser.password = null;
        this.ggCurrentUser.primaryEmail = null;
        this.ggCurrentUser.sendAs = null;
        this.ggCurrentUser.signature = null;

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
}
