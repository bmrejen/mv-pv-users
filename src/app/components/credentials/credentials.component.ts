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
        if (this.currentUser.firstName !== ""
            && this.currentUser.lastName !== ""
            && this.sugarCurrentUser.userName === "") {
            this.sugarCurrentUser.userName = this.setUsername();
            this.checkUsernameAvailability();
            this.sugarCurrentUser.email = this.setEmail();
            this.checkEmailAvailability();
            this.currentUser["password"] = this.sugarCurrentUser.id === "" ? this.setPassword() : "";
        }
    }

    public setEmail() {
        return `${this.sugarCurrentUser.userName}@marcovasco.fr`;
    }

    public setUsername() {
        const initials = this.currentUser.firstName.split(" ")
            .map((part) => part[0])
            .join()
            .replace(/,/g, "")
            .toLowerCase();
        const lastName = this.currentUser.lastName.replace(/ /g, "")
            .toLowerCase();

        return `${initials}${lastName}`;
    }

    public checkUsernameAvailability(e?) {
        this.usernameStatus = (this.usersFromSugar
            .find((user) =>
                user.sugarCurrentUser.userName === this.sugarCurrentUser.userName) !== undefined) ?
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

        return `${this.currentUser.firstName[0].toLowerCase()}${this.currentUser.lastName[0].toLowerCase()}${rndStrg}!`;
    }

    public trackByFn(item) {
        return item.id;
    }

}
