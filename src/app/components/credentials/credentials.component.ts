import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

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
    @Input() public currentUser: User;
    @Input() public usersFromSugar: User[];

    public usernameStatus: string;
    public emailStatus: string;

    public credentialClick() {
        if (this.currentUser.firstName !== ""
            && this.currentUser.lastName !== ""
            && this.currentUser.userName === "") {
            this.currentUser.userName = this.setUsername();
            this.checkUsernameAvailability();
            this.currentUser.email = this.setEmail();
            this.checkEmailAvailability();
            this.currentUser.password = this.currentUser.id === "" ? this.setPassword() : "";
        }
        console.log(this.currentUser);
    }

    public setEmail() {
        return `${this.currentUser.userName}@marcovasco.fr`;
    }

    public setUsername() {
        return `${this.currentUser.firstName[0].toLowerCase()}${this.currentUser.lastName.toLowerCase()}`;
    }

    public checkUsernameAvailability(e?) {
        this.usernameStatus = (this.usersFromSugar
            .find((user) => user.userName === this.currentUser.userName) !== undefined) ?
            "USERNAME ALREADY TAKEN" : "Username available :)";
    }

    public checkEmailAvailability(e?) {
        this.emailStatus = (this.usersFromSugar
            .find((user) => user.email === this.currentUser.email) !== undefined) ?
            "EMAIL ALREADY TAKEN" : "Email available :)";
    }

    public setPassword() {
        if (this.currentUser.id !== "") { return null; }
        const rndStrg = Math.random()
            .toString()
            .substring(2, 7);

        return `${this.currentUser.firstName[0].toLowerCase()}${this.currentUser.lastName[0].toLowerCase()}${rndStrg}!`;
    }

    public trackByFn(item) {
        return item.id;
    }

}
