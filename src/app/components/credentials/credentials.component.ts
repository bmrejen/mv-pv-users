import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { SugarUser } from "../../models/sugar-user";
import { User } from "../../models/user";
import { UserPopulaterService } from "../../services/user-populater.service";

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
    @Input() public jamespot;
    @Input() public gapps;

    public usernameStatus: string;
    public emailStatus: string;

    constructor(private populater: UserPopulaterService) {
        //
    }

    public credentialClick() {
        // Check Jamespot username on James component even if name is filled
        this.jamespot.checkUsernameAvailability();

        if (this.currentUser.common.firstName !== ""
            && this.currentUser.common.lastName !== ""
            && this.currentUser.common.userName === "") {
            this.populater.populateUserProperties(this.currentUser);

            this.checkEmailAvailability();
            this.checkUsernameAvailability();

            // Call Gapp component method
            this.gapps.handleSendAsClick();
        }
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

    public trackByFn(item) {
        return item.id;
    }

}
