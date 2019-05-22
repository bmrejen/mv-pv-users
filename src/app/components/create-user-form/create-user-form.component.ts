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
    public oldUser: User = new User({});
    public teams: Team[] = [];
    public roles: Role[] = [];
    public destinations: Destination[] = [];
    public managers: SugarUser[] = [];
    public mailToGet: string;
    public googleGroups = [];
    public isAlias: boolean = null;
    public gapiMessage: string = null;
    public jamesMessage: string = null;
    public sugarMessage: string = null;
    public gapiStatus = {
        apiFailed: false,
        apiLoaded: false,
        apiReady: false,
        userLoggedIn: null,
    };
    public temporaryData = {
        sendAs: null,
        signature: null,
    };

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

                // remove following lines after testing
                this.fields.accounts[1]["checked"] = false;
                this.fields.accounts[2]["checked"] = false;
                this.fields.accounts[3]["checked"] = false;

                // get others
                data.others.forEach((other) => this.fields.others.push(new Team(other)));
            });
        this.initGapiServices();
        this.oldUser = new User({});
    }

    public initGapiServices() {
        this.gapi.loadClient()
            .then((result) => {
                this.gapiStatus.apiLoaded = true;

                return this.gapi.initClient();
            })
            .catch((err) => this.gapiStatus.apiFailed = true)
            .then((res) => {
                this.gapiStatus.apiReady = true;
                this.gapi.initAuthClient()
                    .then((result) => {
                        if (result.currentUser.get()
                            .isSignedIn() === true) {
                            this.gapiStatus.userLoggedIn = result.currentUser.get().w3.ig;
                        } else {
                            this.gapi.signIn();
                        }
                    })
                    .then(() => this.gapi.getGroups()
                        .then((groups) => this.googleGroups = groups))
                    .catch((err) => console.error("initAuthClient error", err));
            })
            .catch((err) => this.gapiStatus.apiFailed = true);
    }

    public getUser() {
        if (this.mailToGet === "" || this.mailToGet == null) {
            alert("Please specify user to get");
        }
        this.resetForm();
        if (!this.mailToGet.includes("@")) {
            this.mailToGet = `${this.mailToGet}@planetveo.com`;
        }
        const username = this.mailToGet.substring(0, this.mailToGet.lastIndexOf("@"));

        const promises = [
            this.getJamespotUser(`${username}@planetveo.com`),
            this.getGapiUser(this.mailToGet),
            this.getSugarUser(username),
        ];
        Promise.all(promises)
            .then((res) => {
                console.log(res);
                // this.currentUser = new User({});

            })
            .catch((err) => console.error(err));
    }

    public resetForm() {
        this.isAlias = null;
        this.gapiMessage = null;
        this.jamesMessage = null;
        this.sugarMessage = null;
        this.currentUser = new User({});
    }

    // -------- GET USER METHODS -------------
    public getJamespotUser(mail): Promise<any> {
        return this.james.getByField("mail", mail)
            .then((res: IJamespotUserConfig) => {
                this.currentUser.jamesCurrentUser = this.oldJamespotUser = new JamespotUser(res);

                return res;
            })
            .catch((err) => this.jamesMessage = err);
    }

    public getSugarUser(username): Promise<any> {
        return this.sugar.getUserByUsername(username)
            .then((res) => {
                this.currentUser.firstName = res.common.firstName;
                this.currentUser.lastName = res.common.lastName;
                this.currentUser.sugarCurrentUser = new SugarUser(res.sugar);

                return res;
            })
            .catch((err) => this.sugarMessage = "User not found");
    }

    public getGapiUser(mail): Promise<any> {
        return this.gapi.getUser(mail)
            .then((res) => {
                this.currentUser.ggCurrentUser = new GoogleUser(res);
                const primaryEmail = res.primaryEmail;

                // Google API
                this.getGoogleGroupsOfUser(primaryEmail);

                // Local boolean
                this.isAlias = this.gapi.isAlias(primaryEmail, mail, this.currentUser.ggCurrentUser);

                // GMail API
                return this.getUserAliases(primaryEmail);

            })
            .catch((err) => {
                console.error("Error getting Gapi User", err);
                this.gapiMessage = err.result["error"].message;
            });
    }

    public lowerCasify() {
        this.currentUser.sugarCurrentUser.email = this.currentUser.sugarCurrentUser.email.toLowerCase();
        this.currentUser.sugarCurrentUser.userName = this.currentUser.sugarCurrentUser.userName.toLowerCase();
        this.currentUser.jamesCurrentUser.mail = this.currentUser.jamesCurrentUser.mail.toLowerCase();
        this.currentUser.jamesCurrentUser.username = this.currentUser.jamesCurrentUser.username.toLowerCase();
        this.currentUser.jamesCurrentUser.mail = this.currentUser.jamesCurrentUser.mail.toLowerCase();
        this.currentUser.ggCurrentUser.primaryEmail = this.currentUser.ggCurrentUser.primaryEmail.toLowerCase();
    }

    // --------- POST USER -------------
    public onSubmit() {
        this.lowerCasify();

        this.mailToGet = this.currentUser.ggCurrentUser.primaryEmail;

        const promises: Array<Promise<any>> = [];

        this.fields.accounts.forEach((account) => {
            if (account.checked) {
                switch (account.id) {
                    case "gapps":
                        promises.push(this.postGapiUser());
                        break;
                    case "sugar":
                        promises.push(this.postSugarUser());
                        break;
                    case "jamespot":
                        promises.push(this.postJamespotUser());
                        break;
                    case "switchvox":
                        break;

                    default:
                        alert("This promise is not defined");
                        break;
                }
            }
        });

        Promise.all(promises)
            .then((res) => {
                console.log(res);

                return res;
            })
            .catch((err) => console.error(err));
    }

    public postJamespotUser(): Promise<any> {
        return this.james.postUsers(this.currentUser)
            .then((res: IJamespotUserConfig) => res)
            .catch((err: string) => {
                console.error("Jamespot Problem :", err);
                this.jamesMessage = err.substr(31, err.length - 34);
            });
    }

    public postGapiUser(): Promise<any> {
        this.gapiMessage = null;
        this.temporaryData.sendAs = this.currentUser.ggCurrentUser.sendAs;
        this.temporaryData.signature = this.currentUser.ggCurrentUser.signature;

        return this.gapi.postUser(this.currentUser)
            .then((res) => {

                console.log("POST GAPI response", res);

                return new Promise((resolve) => setTimeout(resolve, 10000))
                    .then(() => {

                        this.getGapiUser(res["result"].primaryEmail)
                            .then((response) => {

                                return new Promise((resolve, reject) => {
                                    setTimeout(() => {

                                        this.currentUser.ggCurrentUser.sendAs = this.temporaryData.sendAs;
                                        this.currentUser.ggCurrentUser.signature = this.temporaryData.signature;

                                        this.gapiMessage = "User created !";

                                        return this.gapi.updateGmailSendAs(this.currentUser, this.oldUser)
                                            .then((rep) => console.log("response from updateGmailSendAs", rep))
                                            .catch((err) => console.error("ERROR in UpdateGMailAlias", err));
                                    }, 3000);

                                });

                            });
                    });

            })

            .catch((err) => console.error(err));
        // .catch((err) => this.gapiMessage = err["result"].error);
    }

    public postSugarUser(): Promise<any> {
        return this.sugar.postDataToSugar(this.currentUser)
            .then((res) => res)
            .catch((err) => err);
    }

    public prefillForm() {
        this.currentUser = new User({
            firstName: "Xrayxray",
        });
        this.currentUser.lastName = this.currentUser.firstName;
        this.currentUser.password = Math.random()
            .toString(36)
            .substring(2);
        this.currentUser.ggCurrentUser = new GoogleUser({
            orgas: "/IT",
            primaryEmail: `${this.currentUser.firstName[0]}${this.currentUser.lastName}@planetveo.com`,
            sendAs: "marcovasco.fr",
            signature: "Pouet pouet",
        });
        this.currentUser.sugarCurrentUser = new SugarUser({
            codeSonGalileo: "123456",
            department: "Backoffice Carnet",
            destinations: ["4e12eefb-5dbb-f913-d80b-4c2ab8202809",
                "6f9aedb6-6d68-b4f3-0270-4cc10e363077"],
            email: `${this.currentUser.firstName[0]}${this.currentUser.lastName}@marcovasco.fr`,
            employeeStatus: "Active",
            managerId: "4a15f7bb-09ec-32f7-4da8-5a560982cd06",
            officeId: "1006",
            others: ["013335f9-80ad-11e7-9c8e-64006a75b5cd",
                "0d5a7e81-d409-11e7-875a-64006a75b5cd"],
            phoneAsterisk: "1211",
            phoneFax: "01 76 64 72 00",
            phoneHome: "01 76 64 72 01",
            phoneMobile: "01 76 64 72 02",
            phoneOther: "01 76 64 72 03",
            phoneWork: "01 76 64 72 04",
            roleId: "25218251-3011-b347-5d4f-4bfced4de2cc",
            salutation: "Mr.",
            status: "Active",
            swAllowRemoteCalls: "0",
            swCallNotification: "1",
            swClickToCall: "1",
            teams: ["0ec63f44-aa38-11e7-924f-005056911f09",
                "1046f88d-3d37-10d5-7760-506023561b57"],
            title: "Assistant Ventes",
            tourplanID: this.currentUser.firstName.slice(0, 6)
                .toUpperCase(),
            userName: `${this.currentUser.firstName[0]}${this.currentUser.lastName}`,
        });
        this.currentUser.jamesCurrentUser = new JamespotUser({
            active: "1",
            company: "MARCO VASCO",
            country: "fr",
            language: "fr",
            mail: this.currentUser.ggCurrentUser.primaryEmail,
            phoneExtension: "",
            role: "User",
            timeZone: "Europe/Paris",
            username: `${this.currentUser.firstName[0]}${this.currentUser.lastName}`,
        });
    }

    public trackByFn(item) {
        return item.id;
    }

    // ------- PRIVATE METHODS --------
    private getGoogleGroupsOfUser(primaryMail) {
        this.gapi.getGroups(primaryMail)
            .then((response) => {
                this.googleGroups.forEach((gp) => gp["isEnabled"] = false);
                response.forEach((group) => {
                    const myGroup = this.googleGroups.find((grp) => grp.id === group.id);
                    myGroup["isEnabled"] = true;
                    this.currentUser.ggCurrentUser.googleGroups.push(myGroup);
                });
            })
            .catch((err) => alert(err.result.error.message));
    }

    private getUserAliases(primaryEmail): Promise<any> {
        console.log("getting the GMAIL aliases of", primaryEmail);

        return this.gapi.getUserAliases(primaryEmail)
            .then((response) => {
                console.log("aliases for ", primaryEmail, response);
                this.currentUser.ggCurrentUser.aliases = response;

                const defaultAlias = response.find((alias) => alias.isDefault === true);
                this.currentUser.ggCurrentUser.signature = defaultAlias.signature;
                this.currentUser.ggCurrentUser.sendAs = defaultAlias.sendAsEmail.split("@")[1];

                return response;
            })
            .catch((err) => console.error(err));
    }

}
