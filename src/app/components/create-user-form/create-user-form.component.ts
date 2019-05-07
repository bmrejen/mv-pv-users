import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Destination } from "../../models/destination";
import { Fields } from "../../models/fields";
import { Role } from "../../models/role";
import { SugarUser } from "../../models/sugar-user";
import { Team } from "../../models/team";
import { User } from "../../models/user";

import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";
import { GoogleUser } from "../../models/google-user";
import { JamespotUser } from "../../models/jamespot-user";
import { GapiAuthenticatorService } from "../../services/gapi.service";
import { JamespotService } from "../../services/jamespot.service";
import { SugarService } from "../../services/sugar.service";

@Component({
    selector: "mv-app-create-user-form",
    styleUrls: ["./create-user-form.component.css"],
    templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
    public fields: Fields;
    public errorMsg;
    public passwordExists = false;
    public usersFromSugar: User[] = [];
    public usernameTaken;
    public currentUser: User;
    public teams: Team[] = [];
    public roles: Role[] = [];
    public destinations: Destination[] = [];
    public managers: SugarUser[] = [];
    public mailToGet: string;
    public googleGroups = [];
    public isAlias: boolean = null;

    public oldJamespotUser: JamespotUser;

    // tslint:disable-next-line:max-line-length
    public body = `{"data":[{"codeSonGalileo":"","departments":["departments-Backoffice","departments-Backoffice Billet"],"destinations":["4e12eefb-5dbb-f913-d80b-4c2ab8202809","6f9aedb6-6d68-b4f3-0270-4cc10e363077"],"email":"mfeuillet@marcovasco.fr","employeeStatus":true,"firstName":"Mathilde","functionId":"","inheritsPreferencesFrom":"user_default","isAdmin":false,"lastName":"Feuillet","leadsMax":45,"leadsMin":15,"managerId":"","officeId":"","phoneAsterisk":"phoneAsterisk","phoneFax":"phoneFax","phoneMobile":"phoneMobile","phoneWork":"phoneWork","roles":["128e2eae-322a-8a0d-e9f0-4cf35b5bfe5b","25218251-3011-b347-5d4f-4bfced4de2cc"],"salutation":"Mrs.","status":true,"teams":["0ec63f44-aa38-11e7-924f-005056911f09","1046f88d-3d37-10d5-7760-506023561b57"],"title":"","tourplanID":"MFEUIL","userName":"mfeuillet"}]}`;

    public userObject;

    constructor(
        private route: ActivatedRoute,
        private james: JamespotService,
        private sugar: SugarService,
        private gapi: GapiAuthenticatorService) {
        //
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => {
                // set current user if any
                this.currentUser = new User({});
                this.currentUser.sugarCurrentUser = new SugarUser(data.sugarUser || {});

                // get manager list
                this.managers = data.managers;

                // get user list
                data.users.forEach((user) => this.usersFromSugar.push(new User(user)));

                // get team list
                data.teams.forEach((team) => this.teams.push(new Team(team)));

                // get role list
                data.roles.forEach((role) => this.roles.push(new Role(role)));

                // get destinations list
                data.destinations.forEach((dest) => this.destinations.push(new Destination(dest)));

                // get fields list
                this.fields = new Fields(data.fields);
            });
    }

    public onSubmit(form) {
        // console.log("submitted", form);
    }

    public getUser() {
        this.resetForm();
        if (!this.mailToGet.includes("@")) {
            this.mailToGet = `${this.mailToGet}@planetveo.com`;
        }
        const username = this.mailToGet.substring(0, this.mailToGet.lastIndexOf("@"));

        this.getJamespotUser(`${username}@planetveo.com`);
        this.getGapiUser(this.mailToGet);
        this.getSugarUser(username);
    }

    public resetForm() {
        this.isAlias = null;
        this.currentUser = new User({});
    }

    public getJamespotUser(mail) {
        this.james.getByField("mail", mail)
            .then((res: IJamespotUserConfig) => {
                this.currentUser.jamesCurrentUser = this.oldJamespotUser = new JamespotUser(res);
            })
            .catch((err) => {
                console.error(err);
                alert(`Jamespot User ${mail} doesn't exist`);
            });
    }

    public getSugarUser(username) {
        this.sugar.getUserByUsername(username)
            .then((res) => this.currentUser.sugarCurrentUser = new SugarUser(res))
            .catch((err) => console.error(err));
    }

    public getGapiUser(mail) {
        this.gapi.getUser(mail)
            .then((res) => this.currentUser.ggCurrentUser = new GoogleUser(res))
            .then((resp) => {
                const primaryEmail = this.currentUser.ggCurrentUser.primaryEmail;
                this.getGoogleGroupsOfUser(primaryEmail);
                this.getUserAliases(primaryEmail);
                this.isAlias = this.gapi.isAlias(primaryEmail, mail, this.currentUser.ggCurrentUser);
            })
            .catch((err) => console.error(err));
    }

    public trackByFn(item) {
        return item.id;
    }

    private getGoogleGroupsOfUser(primaryMail) {
        this.gapi.getGroups(primaryMail)
            .then((response) => {
                this.googleGroups = response;
                this.googleGroups.forEach((gp) => gp["isEnabled"] = false);
                response.forEach((group) => {
                    const myGroup = this.googleGroups.find((grp) => grp.id === group.id);
                    myGroup["isEnabled"] = true;
                    this.currentUser.ggCurrentUser.googleGroups.push(group);
                });
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    alert(err["result"].error.message);
                }
            });
    }

    private getUserAliases(primaryEmail) {
        this.gapi.getUserAliases(primaryEmail)
            .then((response) => {
                this.currentUser.ggCurrentUser.aliases = response;

                const defaultAlias = response.find((alias) => alias.isDefault === true);
                this.currentUser.ggCurrentUser.signature = defaultAlias.signature;
                this.currentUser.ggCurrentUser.sendAs = defaultAlias.sendAsEmail.split("@")[1];
            })
            .catch((err) => console.error(err));
    }
}
