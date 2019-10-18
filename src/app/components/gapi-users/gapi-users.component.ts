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
        this.gapiService.getGroups()
            .then((groups) => this.googleGroups = groups)
            .catch((err) => console.error(err));
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
        this.updateSignature(this.currentUser);
        this.updateJamespotCompany();
        this.updateEmail();
    }

    public updateSignature(user: User) {
        // tslint:disable-next-line:max-line-length
        user.ggCurrentUser.signature = `<div dir="ltr"><p style="font-size:1em;color:rgb(164,135,67);font-family:Lato,Calibri,Arial,Helvetica,sans-serif">--------------------------------</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif"><span style="font-weight:bold">${user.common.firstName} ${user.common.lastName}</span><br>${user.sugarCurrentUser.title}</p><p style="color:rgb(0,0,0);font-size:1em;font-family:Lato,Calibri,Arial,Helvetica,sans-serif">${user.sugarCurrentUser.phoneWork} (${user.sugarCurrentUser.phoneAsterisk})<span style="font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif"><br><a href="http://www.${user.ggCurrentUser.sendAs}/" target="_blank"><b><span lang="DE" style="color:#a48743">www.${user.ggCurrentUser.sendAs}</span></b></a></span><span style="font-family:&quot;Times New Roman&quot;;font-size:medium">&nbsp;</span></p></div>`;
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
