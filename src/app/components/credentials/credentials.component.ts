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
    @Input() public currentUser: User;
    @Input() public usersFromSugar: User[];
    @Output() public readonly notifyParent = new EventEmitter<any>();

    public usernameStatus: string;
    public emailStatus: string;

    constructor(private sugar: SugarService) {
        //
    }

    public credentialClick() {
        if (this.currentUser.firstName !== ""
            && this.currentUser.lastName !== ""
            && this.currentUser.sugarCurrentUser.userName === "") {
            this.currentUser.sugarCurrentUser.userName = this.setUsername();
            this.checkUsernameAvailability();
            this.currentUser.sugarCurrentUser.email = this.setEmail();
            this.checkEmailAvailability();
            this.currentUser["password"] = this.currentUser.sugarCurrentUser.id === "" ? this.setPassword() : "";
        }
        console.log(this.currentUser);
    }

    public setEmail() {
        return `${this.currentUser.sugarCurrentUser.userName}@marcovasco.fr`;
    }

    public setUsername() {
        return `${this.currentUser.firstName[0].toLowerCase()}${this.currentUser.lastName.toLowerCase()}`;
    }

    public checkUsernameAvailability(e?) {
        this.usernameStatus = (this.usersFromSugar
            .find((user) =>
                user.sugarCurrentUser.userName === this.currentUser.sugarCurrentUser.userName) !== undefined) ?
            "USERNAME ALREADY TAKEN" : "Username available :)";
    }

    public checkEmailAvailability(e?) {
        this.emailStatus = (this.usersFromSugar
            .find((user) => user.sugarCurrentUser.email === this.currentUser.sugarCurrentUser.email) !== undefined) ?
            "EMAIL ALREADY TAKEN" : "Email available :)";
    }

    public setPassword() {
        if (this.currentUser.sugarCurrentUser.id !== "") { return null; }
        const rndStrg = Math.random()
            .toString()
            .substring(2, 7);

        return `${this.currentUser.firstName[0].toLowerCase()}${this.currentUser.lastName[0].toLowerCase()}${rndStrg}!`;
    }

    public getSugarUser(user?) {
        const idToGet = user != null ? user.id : this.currentUser.sugarCurrentUser.id;
        this.sugar.getUserById(idToGet)
            .then((res) => {
                const myUser = new SugarUser(res);
                Object.keys(myUser)
                    .forEach((key) => {
                        this.currentUser[key] = myUser[key];
                    });
                if (user == null) {
                    this.notifyParent.emit(this.currentUser);
                }
            })
            .catch((err) => console.error(err));
    }

    // following method is used by Jamespot and Gapi to call Sugar
    public getSugarUserByUsername(user) {
        let username;
        if (user.constructor.name === "JamespotUserComponent") {
            username = user.jamesMail.split("@")[0];
            console.log("user passed to credentials comes from Jamespot");
        } else if (user.constructor.name === "GoogleUser") {
            // user was sent by gapi
            // username = user.ggCurrentUser.primaryEmail.split("@")[0];
            console.log("user passed to credentials comes from Gapi");
        }

        this.sugar.getUserByUsername(username)
            .then((res) => {
                const myUser = new SugarUser(res);
                Object.keys(myUser)
                    .forEach((key) => {
                        this.currentUser[key] = myUser[key];
                    });
                console.log(res);
            })
            .catch((err) => console.error(err));
    }

    public trackByFn(item) {
        return item.id;
    }

}
