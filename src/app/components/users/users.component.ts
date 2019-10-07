import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../models/user";

import { GapiAuthenticatorService } from "./../../services/gapi.service";
import { JamespotService } from "./../../services/jamespot.service";
import { SugarService } from "./../../services/sugar.service";

@Component({
    selector: "mv-app-users",
    styleUrls: ["./users.component.css"],
    templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
    // @ViewChild("gapps") public gapps;

    public usersFromSugar: User[] = [];
    public filteredUsers: User[] = [];
    public filter: string = "All";
    public selectedUsers: User[] = [];
    public isDeleted = {
        google: null,
        jamespot: null,
        sugar: null,
    };
    public messages = {
        google: null,
        jamespot: null,
        sugar: null,
    };

    constructor(
        private route: ActivatedRoute,
        private james: JamespotService,
        private sugar: SugarService,
        private gapi: GapiAuthenticatorService,
    ) {
        // constructor
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => {
                this.usersFromSugar = data.users;
                this.usersFromSugar.forEach((user) => user["isChecked"] = false);
                this.filterUsers("active");
            });

        this.disableGoogleUser("bmrejen@planetveo.com");
    }

    public filterUsers(filter: string) {
        switch (filter) {

            case "inactive":
                this.filter = "Inactive";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.sugarCurrentUser.status !== "Active"
                        || user.sugarCurrentUser.employeeStatus !== "Active");
                break;

            case "active":
                this.filter = "Active";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.sugarCurrentUser.status === "Active"
                        && user.sugarCurrentUser.employeeStatus === "Active");
                break;

            case "all":
                this.filter = "All";
                this.filteredUsers = this.usersFromSugar;
                break;

            default:
                console.error("Users not filtered");
                break;
        }
    }

    public trackByFn(index) {
        return index;
    }

    public mapIdToUser(id: string): string {
        const manager = this.usersFromSugar.find((user) => user.sugarCurrentUser.id === id);

        return (manager != null && manager.sugarCurrentUser != null) ?
            `${manager.common.firstName} ${manager.common.lastName}` : "";
    }

    public handleClick(user): void {
        if (!this.selectedUsers.includes(user)) {
            this.selectedUsers.push(user);
        } else {
            const index = this.selectedUsers.indexOf(user);
            this.selectedUsers.splice(index, 1);
        }
        console.log(this.selectedUsers);
    }

    public disableUsers() {
        if (confirm(`Etes-vous sur?`)) {
            this.isDeleted = {
                google: null,
                jamespot: null,
                sugar: null,
            };
            this.selectedUsers.forEach((user: User) => {
                this.disableJamespotUser(user.sugarCurrentUser.jamespotId);
                this.disableSugarUser(user.sugarCurrentUser.id);
                this.disableGoogleUser(`${user.common.userName}@planetveo.com`);
            });
        }
    }

    private disableJamespotUser(idUser) {
        this.james.disableUser(idUser)
            .then((res) => {
                this.isDeleted.jamespot = true;
                this.messages.jamespot = `User ${idUser} disabled`;
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
                this.isDeleted.jamespot = false;
                this.messages.jamespot = err.MSG;
            });
    }

    private disableSugarUser(id) {
        console.log(id);
        this.sugar.disableUser(id)
            .then((res) => {
                this.messages.sugar = `User ${res.data[0].id} disabled`;
            })
            .catch((err) => console.error(err));
    }

    private disableGoogleUser(mail) {
        this.gapi.disableUser(mail)
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }

    private initGapiServices() {
        this.gapi.loadClient()
            .then((result) => this.gapi.initClient())
            .then((res) => {
                this.gapi.initAuthClient()
                    .then((result) => {
                        if (result.currentUser.get()
                            .isSignedIn() !== true) {
                            // this.gapps.signIn();
                        }
                    })
                    .then(() => this.gapi.getGroups()
                        .catch((err) => console.error("initAuthClient error", err)))
                    .catch((err) => console.error(err));
            });
    }
}
