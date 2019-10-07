import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { SugarUser } from "../../models/sugar-user";
import { User } from "../../models/user";

@Component({
    selector: "mv-credentials",
    // styleUrls: ["./credentials.component.css"],
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
    @Input() public jamespot;
    @Input() public gapps;

    public usernameStatus: string;
    public emailStatus: string;

    constructor() {
        //
    }

    public credentialClick() {
        // Check Jamespot username on James component even if name is filled
        this.jamespot.checkUsernameAvailability();

        if (this.currentUser.common.firstName !== ""
            && this.currentUser.common.lastName !== ""
            && this.currentUser.common.userName === "") {
            this.setUsername();
            this.setTourplan();

            this.currentUser.common.email = this.setEmail();
            this.checkEmailAvailability();
            this.currentUser.common.password = this.sugarCurrentUser.id === "" ? this.setPassword() : "";
            this.checkUsernameAvailability();

            // Call Gapp component method
            this.gapps.handleSendAsClick();

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

        this.currentUser.common.userName = `${initials}${lastName}`;
    }

    public setEmail() {
        return `${this.currentUser.common.userName}@${this.currentUser.ggCurrentUser.sendAs}`;
    }

    public checkUsernameAvailability(e?) {
        this.jamespot.checkUsernameAvailability();

        this.usernameStatus = (this.currentUser.common.userName === "") ?
            "Please add username" : ((this.usersFromSugar
                .find((user) =>
                    user.common.userName === this.currentUser.common.userName) !== undefined) ?
                "USERNAME TAKEN" : "Username available :)");
    }

    public checkEmailAvailability(e?) {
        this.emailStatus = (this.usersFromSugar
            .find((user) => user.common.email === this.currentUser.common.email) !== undefined) ?
            "EMAIL ALREADY TAKEN" : "Email available :)";
    }

    public setPassword() {
        if (this.sugarCurrentUser.id !== "") { return null; }

        const randomString = Math.random()
            .toString()
            .substring(2, 7);

        const initials =
            `${this.currentUser.common.firstName[0].toLowerCase()}${this.currentUser.common.lastName[0].toLowerCase()}`;

        return `${initials}${randomString}!`;
    }

    public setTourplan() {
        this.currentUser.sugarCurrentUser.tourplanID = this.currentUser.common.userName.substr(0, 6)
            .toUpperCase();
    }

    public trackByFn(item) {
        return item.id;
    }

}
