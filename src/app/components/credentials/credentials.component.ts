import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { SugarService } from "./../../services/sugar.service";

import { SugarUser } from "../../models/sugar-user";
import { User } from "../../models/user";

@Component({
    selector: "mv-credentials",
    styleUrls: ["./credentials.component.css"],
    templateUrl: "./credentials.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class CredentialsComponent {
    @Input() public civilites;
    @Input() public userFields;
    @Input() public sugarCurrentUser: SugarUser;
    @Input() public currentUser: User;
    @Input() public usersFromSugar: User[];
    @Input() public sugarMessage;

    public usernameStatus: string;
    public emailStatus: string;

    constructor(private sugar: SugarService) {
        //
    }

    public credentialClick() {
        if (this.currentUser.common.firstName !== ""
            && this.currentUser.common.lastName !== ""
            && this.currentUser.common.userName === "") {
            this.currentUser.common.userName = this.setUsername();
            this.checkUsernameAvailability();
            this.sugarCurrentUser.email = this.setEmail();
            this.checkEmailAvailability();
            this.currentUser["password"] = this.sugarCurrentUser.id === "" ? this.setPassword() : "";
            if (this.currentUser.ggCurrentUser.primaryEmail === "") {
                this.currentUser.ggCurrentUser.primaryEmail = `${this.currentUser.common.userName}@planetveo.com`;
            }
        }
    }

    public setUsername() {
        const initials = this.currentUser.common.firstName.split(" ")
            .map((part) => part[0])
            .join()
            .replace(/,/g, "")
            .toLowerCase();
        const lastName = this.currentUser.common.lastName.replace(/ /g, "")
            .toLowerCase();

        return `${initials}${lastName}`;
    }

    public setEmail() {
        return `${this.currentUser.common.userName}@marcovasco.fr`;
    }

    public checkUsernameAvailability(e?) {
        this.usernameStatus = (this.usersFromSugar
            .find((user) =>
                user.common.userName === this.currentUser.common.userName) !== undefined) ?
            "USERNAME ALREADY TAKEN" : "Username available :)";
    }

    public checkEmailAvailability(e?) {
        this.emailStatus = (this.usersFromSugar
            .find((user) => user.sugarCurrentUser.email === this.sugarCurrentUser.email) !== undefined) ?
            "EMAIL ALREADY TAKEN" : "Email available :)";
    }

    public setPassword() {
        if (this.sugarCurrentUser.id !== "") { return null; }
        const rndStrg = Math.random()
            .toString()
            .substring(2, 7);

        return `${this.currentUser.common.firstName[0].toLowerCase()}
        ${this.currentUser.common.lastName[0].toLowerCase()}
        ${rndStrg}!`;
    }

    public trackByFn(item) {
        return item.id;
    }

}
