import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

// Models
import { Fields } from "../../models/fields";
import { GoogleUser } from "../../models/google-user";
import { Office } from "../../models/office";
import { SugarUser } from "../../models/sugar-user";
import { User } from "../../models/user";
import { PostStatus } from "./../../models/post-status";

// Services
import { GapiAuthenticatorService } from "../../services/gapi.service";
import { JamespotService } from "../../services/jamespot.service";
import { NavbarService } from "../../services/navbar.service";
import { ParserService } from "../../services/parser.service";
import { SugarService } from "../../services/sugar.service";
import { UserPopulaterService } from "../../services/user-populater.service";
import { ValidateUserService } from "../../services/validate-user.service";

// Interfaces
import { ICommonProperties, ISugarUserConfig } from "./../../interfaces/sugar-user";

@Component({
    selector: "mv-import",
    styleUrls: ["./import.component.css"],
    templateUrl: "./import.component.html",
})

export class ImportComponent implements OnInit {
    public numberOfFields = 23;
    public users: User[] = [];
    public usersData;
    public managers: User[] = [];
    public message: string = "";
    public offices: Office[] = [];
    public showParseButton: boolean = true;
    public googleGroups = [];

    // tslint:disable:max-line-length
    public csv = '"Mme","Cindy","Guerineau","","New","Ventes","","Golden Dragons","","cguerineau@marcovasco.fr","01 76 64 72 87","1287","cg11215!","4193eb55-9bc2-08c8-5f3c-582cec03d96f","cguerineau","0","0","Active","0","Active","15","45","iroquois;usa;canada","Mlle","Coralie","Viarnes","","New","Ventes","","Golden Dragons","","cviarnes@marcovasco.fr","01 56 67 01 00","2100","cv19833!","4193eb55-9bc2-08c8-5f3c-582cec03d96f","cviarnes","0","0","Active","0","Active","15","45","iroquois;usa;canada"';
    // tslint:enable:max-line-length

    constructor(
        private navbar: NavbarService,
        private parserService: ParserService,
        private populater: UserPopulaterService,
        private route: ActivatedRoute,
        private validator: ValidateUserService,
        private sugar: SugarService,
        private james: JamespotService,
        private gapi: GapiAuthenticatorService,
    ) {
        //
    }

    public ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.managers = data.managers;

            const fields = new Fields(data.fields);
            fields.offices.forEach((office) => this.offices.push(new Office(office)));
        });
        this.navbar.currentGroups
            .subscribe((res) => this.googleGroups = res);
    }

    public parse(d) {
        this.users = [];
        this.message = "";
        this.showParseButton = false;
        const raw = this.parserService.getData(d);
        if (raw.length % this.numberOfFields !== 0) {
            this.message = `Wrong number of values. Each user should have ${this.numberOfFields} values`;

            return;
        }

        this.usersData = this.chunkArray(raw, this.numberOfFields);

        this.usersData.forEach((user) => {
            const myObj = {} as ISugarUserConfig;
            const [
                salutation,
                firstName,
                lastName,
                id,
                title,
                department,
                officeId,
                teamId,
                tourplanID,
                email,
                phoneWork,
                phoneAsterisk,
                password,
                managerId,
                userName,
                isAdmin,
                apiPortalUser,
                status,
                assignationNotification,
                employeeStatus,
                leadsMin,
                leadsMax,
                googleGroupNames,
            ] = [...user];

            myObj.salutation = salutation;
            myObj.id = id;
            myObj.title = title;
            myObj.department = department;
            myObj.officeId = officeId;
            myObj.tourplanID = tourplanID;
            myObj.phoneWork = phoneWork;
            myObj.phoneAsterisk = phoneAsterisk;
            myObj.managerId = managerId;
            myObj.isAdmin = isAdmin === "1" ? true : false;
            myObj.apiPortalUser = apiPortalUser === "1" ? true : false;
            myObj.status = status;
            myObj.assignationNotification = assignationNotification === "1" ? true : false;
            myObj.employeeStatus = employeeStatus;
            myObj.leadsMin = leadsMin;
            myObj.leadsMax = leadsMax;
            myObj.teams = [teamId];

            const common = {
                email,
                firstName,
                lastName,
                password,
                userName,
            } as ICommonProperties;
            const myUser = new User(common);

            myUser.sugarCurrentUser = new SugarUser(common, myObj);
            myUser.ggCurrentUser = new GoogleUser(myObj);
            myUser.postStatus = new PostStatus();

            const arrayOfGoogleGroupNames = googleGroupNames.split(";");
            arrayOfGoogleGroupNames.forEach((groupName) => {
                if (groupName === "") {
                    myUser.ggCurrentUser.googleGroups = [];
                } else {
                    const myGroup = this.googleGroups.find((group) => group.name.toLowerCase()
                        .includes(groupName.toLowerCase()));
                    myUser.ggCurrentUser.googleGroups.push(myGroup);
                }
            });

            this.populater.populateUserProperties(myUser);
            this.populateManager(myUser);
            this.populateOfficeFromTeam(myUser);
            this.users.push(myUser);
        });
    }

    public chunkArray(myArray, chunkSize) {
        const results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunkSize));
        }

        return results;
    }

    public populateManager(user: User) {
        if (user.sugarCurrentUser.managerId === "") {
            const manager = this.findManagerByTeam(user.sugarCurrentUser.teams[0]);

            user.sugarCurrentUser.managerId = manager != null ?
                manager.sugarCurrentUser.id : "";
        }
    }

    public displayManagerName(id): string {
        const manager = this.findManagerById(id);

        return manager != null ? `${manager.common.firstName} ${manager.common.lastName}` : "";
    }

    public displayOfficeNameFromId(officeId): string {
        const myOffice = this.offices.find((office) => office.id === officeId);

        return myOffice != null ? myOffice.name : "";
    }

    public postUsers(users: User[]) {
        // allSettled polyfill required because Sugar always resolves
        const allSettled = function(t) {
            return Promise.all(t.map(
                function(prom) {
                    return Promise.resolve(prom)
                        .then(this.$)
                        .catch(this._);
                },
                {
                    $(res) { return { status: "fulfilled", value: res }; },
                    _(res) { return { status: "rejected", reason: res }; },
                }));
        };

        return users.forEach((user: User) => {
            user.postStatus = new PostStatus();
            this.validator.handleUser(user)
                .then((usr) => {
                    return allSettled([
                        this.sugar.postDataToSugar(usr),
                        this.james.postUsers(usr),
                        this.gapi.postUser(usr),
                    ]);
                })
                .then((res: any) => {
                    console.log("Promise all", res);
                    if (res[0].status === "fulfilled") {
                        user.postStatus.sugar.isPosted = true;
                        user.postStatus.sugar.message = res[0].value.data[0].id;
                    } else {
                        // CAREFUL - Sugar always resolves no matter what
                        user.postStatus.sugar.isFailed = true;
                        user.postStatus.sugar.message = res[0].value.data[0].id;
                    }

                    if (res[1].status === "fulfilled") {
                        user.postStatus.jamespot.isPosted = true;
                        user.postStatus.jamespot.message = res[1].value.user.idUser;
                        user.sugarCurrentUser.jamespotId = res[1].value.user.idUser;
                        this.sugar.postDataToSugar(user);
                    } else if (res[1].status === "rejected") {
                        user.postStatus.jamespot.isFailed = true;
                        user.postStatus.jamespot.message = res[1].reason.substr(res[1].reason.indexOf("=>"));
                    } else {
                        alert("Problem in jamespot return");
                    }

                    if (res[2].status === "fulfilled") {
                        user.postStatus.gapi.isPosted = true;
                        user.postStatus.gapi.message = res[2].value.result.id;
                        this.createGmailSendAs(user);
                        user.ggCurrentUser = new GoogleUser(this.gapi.mapFromApi(res[2].value.result));
                        this.postGoogleGroups(user);
                    } else if (res[2].status === "rejected") {
                        user.postStatus.gapi.isFailed = true;
                        user.postStatus.gapi.message = res[2].reason.result.error.message;
                    } else {
                        alert("Problem in Google return");
                    }
                });
        });
    }

    public trackByFn(id) {
        return id;
    }

    private createGmailSendAs(user: User) {
        return this.gapi.createGmailSendAs(user)
            .then((resp) => console.log("create GMail SendAs and Signature", resp))
            .catch((err) => console.error(err));
    }

    private findManagerByTeam(teamId): User {
        return this.managers.find((user) => user.sugarCurrentUser.teams[0] === teamId);
    }

    private findManagerById(managerId): User {
        return this.managers.find((user) => user.sugarCurrentUser.id === managerId);
    }

    private populateOfficeFromTeam(user: User): void {
        if (user.sugarCurrentUser.officeId === "") {
            if (user.sugarCurrentUser.teams.length === 0 || user.sugarCurrentUser.teams[0] === "") {
                user.sugarCurrentUser.officeId = "";
            } else {
                const myOffice = this.offices.find((office) => office.name.includes(user.sugarCurrentUser.teams[0]));
                user.sugarCurrentUser.officeId = myOffice != null ? myOffice.id : "";
            }
        }
    }

    private postGoogleGroups(user: User) {
        return this.gapi.postGoogleGroups(user.ggCurrentUser)
            .then((res) => console.log("postGoogleGroups response", res))
            .catch((err) => console.error(err));
    }
}
