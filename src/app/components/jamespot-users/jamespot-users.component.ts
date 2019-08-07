import { Component, Input } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";

import { User } from "../../models/user";
import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    selector: "mv-jamespot",
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent {
    @Input() public jamesCurrentUser: JamespotUser;
    @Input() public jamesMessage: string;
    @Input() public currentUser: User;

    public oldJamespotUser: JamespotUser;
    public isDeleted: boolean = false;
    public deletedId;
    public isUsernameTaken: boolean = false;

    constructor(private james: JamespotService) {
        //
    }

    public onFileSelected(event) {
        this.jamesCurrentUser.image = event.target.files[0] as File;
    }

    public onDelete(): void {
        const id = this.jamesCurrentUser.idUser;
        if (confirm(`Etes-vous sur de supprimer l'utilisateur ${id} en production?`)) {
            this.jamesMessage = null;
            this.james.deleteUser(id)
                .then((res) => {
                    this.isDeleted = true;
                    this.deletedId = id;
                })
                .catch((err) => {
                    console.error(err);
                    this.isDeleted = false;
                    this.jamesMessage = err.RC.MSG;
                });
        }
    }

    public checkUsernameAvailability(): void {
        console.log("jamespot component checking user", this.currentUser.common.userName);
        this.jamesMessage = null;
        this.isUsernameTaken = null;

        this.james.getByField("pseudo", this.currentUser.common.userName)
            .then((res: IJamespotUserConfig) => {
                this.isUsernameTaken = true;
                if (res.idUser !== "" && this.jamesCurrentUser.idUser === null) {
                    this.isUsernameTaken = true;
                    this.jamesMessage = `Username taken by user #${res.idUser}`;
                }
            })
            .catch((err) => {
                this.isUsernameTaken = false;
                this.jamesMessage = `Username available :)`;
            });
    }
}
