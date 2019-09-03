import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Destination } from "../../models/destination";
import { Fields } from "../../models/fields";
import { Other } from "../../models/other";
import { Role } from "../../models/role";
import { SugarUser } from "../../models/sugar-user";
import { Team } from "../../models/team";
import { User } from "../../models/user";

import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";
import { GoogleUser } from "../../models/google-user";
import { Spot } from "../../models/jamespot-spot";
import { JamespotUser } from "../../models/jamespot-user";
import { GapiAuthenticatorService } from "../../services/gapi.service";
import { JamespotService } from "../../services/jamespot.service";
import { SugarService } from "../../services/sugar.service";
import { IJamespotUser } from "./../../interfaces/jamespot-api-response";

@Component({
    selector: "mv-app-create-user-form",
    styleUrls: ["./create-user-form.component.css"],
    templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
    @ViewChild("gapps") public gapps;

    public fields: Fields;
    public passwordExists = false;
    public usersFromSugar: User[] = [];
    public usernameTaken;
    public currentUser: User;
    public oldUser: User = new User({});
    public teams: Team[] = [];
    public roles: Role[] = [];
    public destinations: Destination[] = [];
    public managers: User[] = [];
    public mailToGet: string;
    public googleGroups = [];
    public isRealUser: boolean = null;
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
        googleGroups: null,
        sendAs: null,
        signature: null,
    };
    public spots: Spot[] = [];
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
                this.currentUser.sugarCurrentUser = new SugarUser(this.currentUser.common, data.sugarUser || {});

                // get manager list
                this.managers = data.managers;

                // get user list
                data.users.forEach((user) => {
                    const myUser = new User({});
                    myUser.common = this.sugar.mapUserFromApi(user).common;
                    myUser.sugarCurrentUser =
                        new SugarUser(this.sugar.mapUserFromApi(user).common, this.sugar.mapUserFromApi(user).sugar);
                    this.usersFromSugar.push(myUser);
                });

                // get team list
                data.teams.forEach((team) => this.teams.push(new Team(team)));

                // get role list
                data.roles.forEach((role) => this.roles.push(new Role(role)));

                // get destinations list
                data.destinations.forEach((dest) => this.destinations.push(new Destination(dest)));

                // get fields list
                this.fields = new Fields(data.fields);

                // get others
                data.others.forEach((other) => this.fields.others.push(new Other(other)));

                // get jamespot spots
                data.spots.forEach((spot) => this.spots.push(new Spot(spot)));
                this.spots.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

            });
        this.initGapiServices();
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
                            this.gapps.signIn();
                        }
                    })
                    .then(() => this.gapi.getGroups()
                        .then((groups) => this.googleGroups = groups))
                    .catch((err) => console.error("initAuthClient error", err));
            })
            .catch((err) => this.gapiStatus.apiFailed = true);
    }

    public getUser(): Promise<any> {
        if (this.mailToGet === "" || this.mailToGet == null) {
            alert("Please specify user to get");
        }
        this.resetForm();
        if (!this.mailToGet.includes("@")) {
            this.mailToGet = `${this.mailToGet}@planetveo.com`;
        }
        const username = this.mailToGet.substring(0, this.mailToGet.lastIndexOf("@"));

        const jamespotSearchTerms = {
            searchTerm: `${username}@marcovasco.fr`,
            type: "mail",
        };

        return this.getSugarUser(username)
            .then((res) => {
                jamespotSearchTerms.searchTerm = this.currentUser.sugarCurrentUser.jamespotId;
                jamespotSearchTerms.type = "id";

                return Promise.all([
                    this.getJamespotUser(jamespotSearchTerms.searchTerm, jamespotSearchTerms.type),
                    this.getGapiUser(this.mailToGet),
                    res,
                ]);
            })
            .then((resp) => {
                console.log("current and oldUser", this.currentUser, this.oldUser);

                return resp;
            })
            .catch((err) => console.error(err));
    }

    public resetForm() {
        this.isRealUser = null;
        this.gapiMessage = null;
        this.jamesMessage = null;
        this.sugarMessage = null;
        this.currentUser = new User({});
        this.oldUser = new User({});
    }

    // -------- GET USER METHODS -------------
    public getJamespotUser(searchTerm, type): Promise<any> {
        if (type === "mail") {
            return this.james.getByField("mail", searchTerm)
                .then((res) => this.mapJamespotResponseToUser(res))
                .catch((err) => this.jamesMessage = err);
        } else if (type === "id") {
            return this.james.getUser(searchTerm)
                .then((res) => this.mapJamespotResponseToUser(res));
        } else {
            alert("getjamespot error");
        }
    }

    public mapJamespotResponseToUser(res: IJamespotUserConfig): IJamespotUserConfig {
        this.currentUser.jamesCurrentUser = new JamespotUser(res);
        this.oldUser.jamesCurrentUser = new JamespotUser(res);

        return res;
    }

    public getSugarUser(username): Promise<any> {
        return this.sugar.getUserByUsername(username)
            .then((res) => {
                this.currentUser.common.email = res.common.email;
                this.currentUser.common.firstName = res.common.firstName;
                this.currentUser.common.lastName = res.common.lastName;
                this.currentUser.common.userName = res.common.userName;
                this.currentUser.sugarCurrentUser = new SugarUser(this.currentUser.common, res.sugar);

                this.oldUser.common.email = res.common.email;
                this.oldUser.common.firstName = res.common.firstName;
                this.oldUser.common.lastName = res.common.lastName;
                this.oldUser.common.userName = res.common.userName;
                this.oldUser.sugarCurrentUser = new SugarUser(this.currentUser.common, res.sugar);

                return res;
            })
            .catch((err) => this.sugarMessage = "User not found");
    }

    public getGapiUser(mail): Promise<any> {
        return this.gapi.getUser(mail)
            .then((res) => {
                this.currentUser.ggCurrentUser = new GoogleUser(res);
                this.oldUser.ggCurrentUser = new GoogleUser(res);

                const primaryEmail = res.primaryEmail;

                // Local boolean
                this.isRealUser = this.gapi.isRealUser(primaryEmail, mail);

                const promises = [
                    res,
                    // Google API
                    this.getGoogleGroupsOfUser(primaryEmail),
                    // GMail API
                    this.getUserAliases(primaryEmail),
                    // Get POP settings
                    this.getPopSettings(primaryEmail),
                ];

                return Promise.all(promises)
                    .then((response) => response)
                    .catch((err) => console.error(err));
            })
            .catch((err) => {
                console.error("Error getting Gapi User", err);
                this.gapiMessage = err.result["error"].message;
            });
    }

    public lowerCasify() {
        this.currentUser.common.email = this.currentUser.sugarCurrentUser.common.email.toLowerCase();
        this.currentUser.common.email = this.currentUser.common.email.toLowerCase()
            .replace(/"'"/g, "");
        this.currentUser.common.userName = this.currentUser.common.userName.toLowerCase();
        this.currentUser.ggCurrentUser.primaryEmail = this.currentUser.ggCurrentUser.primaryEmail.toLowerCase();
    }

    // --------- POST USER -------------
    public postUser() {
        this.validateForm();
        this.lowerCasify();

        this.mailToGet = this.currentUser.ggCurrentUser.primaryEmail;

        const promises: Array<Promise<any>> = [];
        let firstPromise: Promise<any>;

        if (this.fields.accounts.find((account) => account.id === "jamespot").checked) {
            firstPromise = Promise.resolve(this.postJamespotUser())
                .then((res: IJamespotUser) => this.mapJamespotIdToUser(res));
        } else {
            firstPromise = Promise.resolve();
        }

        firstPromise.then(() => {
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
                            break;
                        default:
                            alert("This promise is not defined");
                            break;
                    }
                }
            });

            Promise.all(promises);
        });

    }

    public updateUser() {
        if (!this.fields.accounts
            .every((account) => account.checked)
            && (
                this.currentUser.common.firstName !== this.oldUser.common.firstName
                || this.currentUser.common.lastName !== this.oldUser.common.lastName
            )
        ) {
            alert("Please select all platforms if changing name");
        } else {

            const promises = [];
            this.fields.accounts.forEach((account) => {
                if (account.checked) {
                    switch (account.id) {
                        case "gapps":
                            promises.push(this.updateGapiUser());
                            break;
                        case "jamespot":
                            promises.push(this.updateJamesUser());
                            break;
                        default:
                            break;
                    }
                }
            });
            this.validateForm();

            // Sugar is updated last (to have jamespot id)
            return Promise.all(promises)
                .then((res) => {
                    if (this.fields.accounts
                        .find((account) => account.id === "sugar")
                        .checked) {
                        this.updateSugarUser();
                    }
                })
                .then(() => {
                    this.mailToGet = this.currentUser.common.userName;

                    return this.getUser();
                });
        }

    }

    public updateGapiUser(): Promise<any> {
        this.gapiMessage = null;

        const updateUserPromise = this.gapi.updateUser(this.currentUser, this.oldUser)
            .then((res) => {
                console.log("response from gapi update user", res);

                // Update Gmail settings (sendAs and signature)
                return this.updateGmailSendAs();
            });

        // Update Googlegroups
        const updateGoogleGroupsPromise = this.gapi.updateGoogleGroups(this.currentUser, this.oldUser)
            .then((res) => res)
            .catch((err) => console.error(err));

        return Promise.all([updateUserPromise, updateGoogleGroupsPromise])
            .then((res) => console.log("MON RESPONSE", res))
            .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
            .catch((err) => console.error(err));
    }

    public updateSugarUser(): Promise<any> {
        return this.sugar.postDataToSugar(this.currentUser);
    }

    public updateJamesUser(): Promise<any> {
        return this.james.updateUser(this.currentUser, this.oldUser)
            .then((res: IJamespotUserConfig) => {
                this.jamesMessage = "Data updated!";

                return res;
            })
            .catch((err: string) => {
                console.error("Jamespot update error: ", err);
                this.jamesMessage = err;

                return err;
            });
    }

    public postJamespotUser(): Promise<any> {
        return this.james.postUsers(this.currentUser)
            .then((res) => {
                this.jamesMessage = `User ${res.user.idUser} created`;

                return res;
            })
            .catch((err: string) => {
                console.error("Jamespot Problem :", err);
                this.jamesMessage = err.substr(31, err.length - 34);
            });
    }

    public postGapiUser(): Promise<any> {
        this.gapiMessage = null;
        this.temporaryData.sendAs = this.currentUser.ggCurrentUser.sendAs;
        this.temporaryData.signature = this.currentUser.ggCurrentUser.signature;
        this.temporaryData.googleGroups = this.currentUser.ggCurrentUser.googleGroups;

        return this.gapi.postUser(this.currentUser)
            .then((res) => {

                console.log("POST GAPI response", res);
                const primaryEmail = res["result"].primaryEmail;

                this.getGapiUser(primaryEmail)
                    .then((response) => {
                        console.log("response du nouveau GET", response);
                        this.currentUser.ggCurrentUser.sendAs = this.temporaryData.sendAs;
                        this.currentUser.ggCurrentUser.signature = this.temporaryData.signature;
                        this.currentUser.ggCurrentUser.googleGroups = this.temporaryData.googleGroups;

                        this.gapiMessage = "User created !";

                        this.postGoogleGroups();

                        this.activatePopSettings(primaryEmail);
                        this.updateGapiUser();

                    })
                    .catch((err) => console.error(err));

            })

            .catch((err) => this.gapiMessage = err["result"].error);
    }

    public getPopSettings(primaryEmail) {
        return this.gapi.getPopSettings(primaryEmail)
            .then((res) => res)
            .catch((err) => console.error(err));
    }

    public activatePopSettings(primaryEmail) {
        return this.gapi.activatePopSettings(primaryEmail)
            .then((res) => console.log("pop settings activation", res))
            .catch((err) => console.error(err));
    }

    public postGoogleGroups() {
        return this.gapi.postGoogleGroups(this.currentUser.ggCurrentUser)
            .then((res) => console.log("postGoogleGroups response", res))
            .catch((err) => console.error(err));
    }

    public postSugarUser(): Promise<any> {
        return this.sugar.postDataToSugar(this.currentUser)
            .then((res) => res)
            .catch((err) => err);
    }

    public prefillForm() {
        this.currentUser = new User({
            firstName: "Cocoooo",
        });
        this.currentUser.common.lastName = this.currentUser.common.firstName;
        this.currentUser.common.password = Math.random()
            .toString(36)
            .substring(2);
        this.currentUser.common.email =
            `${this.currentUser.common.firstName[0]}${this.currentUser.common.lastName}@marcovasco.fr`;
        this.currentUser.common.userName = `${this.currentUser.common.firstName[0]}${this.currentUser.common.lastName}`;

        this.currentUser.ggCurrentUser = new GoogleUser({
            orgas: "/IT",
            primaryEmail: `${this.currentUser.common.firstName[0]}${this.currentUser.common.lastName}@planetveo.com`,
            sendAs: "marcovasco.fr",
            signature: "will be modified when sendAs is clicked",
        });
        this.currentUser.sugarCurrentUser = new SugarUser(this.currentUser.common, {
            codeSonGalileo: "123456",
            department: "Backoffice Carnet",
            employeeStatus: "Active",
            managerId: "4a15f7bb-09ec-32f7-4da8-5a560982cd06",
            officeId: "1006",
            phoneAsterisk: "1211",
            phoneFax: "01 76 64 72 00",
            phoneHome: "01 76 64 72 01",
            phoneMobile: "01 76 64 72 02",
            phoneOther: "01 76 64 72 03",
            phoneWork: "01 76 64 72 04",
            salutation: "Mr.",
            status: "Active",
            swAllowRemoteCalls: false,
            swCallNotification: true,
            swClickToCall: true,
            teams: ["0ec63f44-aa38-11e7-924f-005056911f09",
                "1046f88d-3d37-10d5-7760-506023561b57"],
            title: "Assistant Ventes",
            tourplanID: this.currentUser.common.firstName.slice(0, 6)
                .toUpperCase(),
            type: "user",
        });
        this.currentUser.jamesCurrentUser = new JamespotUser({
            active: true,
            company: "MARCO VASCO",
            country: "fr",
            language: "fr",
            phoneExtension: "",
            role: "User",
            timeZone: "Europe/Paris",
        });

        console.log("form prefilled", this.temporaryData);
    }

    public trackByFn(item) {
        return item.id;
    }

    // ------- PRIVATE METHODS --------
    private getGoogleGroupsOfUser(primaryMail) {
        this.gapi.getGroups(primaryMail)
            .then((response) => {
                console.log("response from getGoogleGroupsOfUser", response);
                this.googleGroups.forEach((gp) => gp["isEnabled"] = false);
                response.forEach((group) => {
                    const myGroup = this.googleGroups.find((grp) => grp.id === group.id);
                    myGroup["isEnabled"] = true;
                    this.currentUser.ggCurrentUser.googleGroups.push(myGroup);
                    this.oldUser.ggCurrentUser.googleGroups.push(myGroup);
                });

                return { response };
            })
            .catch((err) => alert(err.result.error.message));
    }

    private getUserAliases(primaryEmail): Promise<any> {
        console.log("getting the GMAIL aliases and signature of", primaryEmail);

        return this.gapi.getUserAliases(primaryEmail)
            .then((response) => {
                console.log("aliases for ", primaryEmail, response);
                this.currentUser.ggCurrentUser.aliases = response;
                this.oldUser.ggCurrentUser.aliases = response;

                const defaultAlias = response.find((alias) => alias.isDefault === true);

                this.currentUser.ggCurrentUser.signature = defaultAlias.signature;
                this.oldUser.ggCurrentUser.signature = defaultAlias.signature;

                this.currentUser.ggCurrentUser.sendAs = defaultAlias.sendAsEmail.split("@")[1];
                this.oldUser.ggCurrentUser.sendAs = defaultAlias.sendAsEmail.split("@")[1];

                return {
                    aliases: this.currentUser.ggCurrentUser.aliases,
                    sendAs: this.currentUser.ggCurrentUser.sendAs,
                    signature: this.currentUser.ggCurrentUser.signature,
                };
            })
            .catch((err) => console.error(err));
    }

    private updateGmailSendAs() {
        return this.gapi.updateGmailSendAs(this.currentUser, this.oldUser)
            .then((resp) => console.log("update GMail SendAs and Signature", resp))
            .catch((err) => console.error(err));
    }

    private validateForm() {
        if ([
            this.currentUser.common.firstName,
            this.currentUser.common.lastName,
            this.currentUser.common.email,
            this.currentUser.common.userName,
        ].includes("")) {
            alert("First and last name can't be empty");

            return;
        }
    }

    private mapJamespotIdToUser(res: IJamespotUser) {
        this.currentUser.sugarCurrentUser.jamespotId = res.idUser;
    }
}
