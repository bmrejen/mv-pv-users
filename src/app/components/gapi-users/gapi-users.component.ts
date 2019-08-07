import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
    public orgas;
    public googleGroups;

    public domains = Object.keys(Domains)
        .map((dom) => Domains[dom]);

    @Input() public oldUser: User;
    @Input() public currentUser: User;
    @Input() public ggCurrentUser: GoogleUser;
    @Input() public gapiMessage: string;
    @Input() public gapiStatus;
    @Input() public credentials;

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
            .then((res) => {
                window.location.reload();
                this.gapiService.initAuthClient()
                    .then((result: any) => this.gapiStatus.userLoggedIn = result.currentUser.get().w3.ig)
                    .catch((err) => console.log("init auth client error", err));
            });
    }

    public signOut() {
        this.gapiService.signOut()
            .then(() => this.gapiService.initAuthClient()
                .then((result: any) => {
                    if (!this.gapiService.isSignedIn()) {
                        this.gapiStatus.userLoggedIn = "Logged out";
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

    public trackByFn(index) {
        return index;
    }

    public handleSendAsClick() {
        this.updateSignature();
        this.updateJamespotCompany();
        this.updateEmail();
    }

    public updateSignature() {
        // tslint:disable-next-line:max-line-length
        this.currentUser.ggCurrentUser.signature = `<div dir="ltr"><p style="font-size:1em;color:rgb(164,135,67);font-family:Lato,Calibri,Arial,Helvetica,sans-serif">--------------------------------</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif"><span style="font-weight:bold">${this.currentUser.common.firstName} ${this.currentUser.common.lastName}</span><br>${this.currentUser.sugarCurrentUser.title}</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif">${this.currentUser.sugarCurrentUser.phoneWork} (${this.currentUser.sugarCurrentUser.phoneAsterisk})<span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif"><br><a href="http://www.${this.ggCurrentUser.sendAs}/" target="_blank"><b><span lang="DE" style="color:#a48743">www.${this.ggCurrentUser.sendAs}</span></b></a></span><span style="font-family:&quot;Times New Roman&quot;;font-size:medium">&nbsp;</span></p></div>`;
    }

    public updateJamespotCompany() {
        this.currentUser.jamesCurrentUser.company = this.currentUser.ggCurrentUser.sendAs.split(".")[0]
            .toUpperCase();
    }

    public updateEmail() {
        if (this.currentUser.common.userName === "") {
            this.credentials.setUsername();
        }

        this.currentUser.common.email =
            `${this.currentUser.common.userName}@${this.currentUser.ggCurrentUser.sendAs}`;
    }
}