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

    public updateSuccessful: boolean = false;
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

    public onPost(): void {
        //
    }

    public onUpdate(): void {
        // this.mapUserToJamespot();
        this.james.updateUser(this.jamesCurrentUser, this.oldJamespotUser)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.updateSuccessful = true;
                // this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error("Jamespot update error: ", err);
                this.jamesMessage = err;
            });
    }

    public onDelete(): void {
        const id = this.jamesCurrentUser.idUser;
        if (confirm(`Etes-vous sur de supprimer l'utilisateur ${id} en production?`)) {
            this.jamesMessage = null;
            this.james.deleteUser(id)
                .then((res) => {
                    this.resetFields();
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
        this.james.getByField("pseudo", this.jamesCurrentUser.username)
            .then((res: IJamespotUserConfig) => {
                this.isUsernameTaken = true;
                this.jamesMessage = null;
                if (res.idUser !== "" && this.jamesCurrentUser.idUser === null) {
                    this.isUsernameTaken = true;
                    this.jamesMessage = `Username taken by user #${res.idUser}`;
                }
            })
            .catch((err) => {
                console.error(err);
                this.jamesMessage = err;
            });
    }

    public onDisable(): void {
        this.james.disableUser(this.jamesCurrentUser.idUser)
            .then((res: IJamespotUserConfig) => {
                if (res.idUser !== "") {
                    this.resetFields();
                    // this.getUser(res.idUser);
                }
            })
            .catch((err) => {
                console.error(err);
                this.jamesMessage = err;
            });
    }

    private resetFields(): void {
        this.jamesCurrentUser.active = "1";
        this.jamesCurrentUser.company = "MARCO VASCO";
        this.jamesCurrentUser.country = "fr";
        this.jamesCurrentUser.idUser = null;
        this.jamesCurrentUser.image = null;
        this.jamesCurrentUser.language = "fr";
        this.jamesCurrentUser.mail = null;
        this.jamesCurrentUser.phoneExtension = null;
        this.jamesCurrentUser.role = "User";
        this.jamesCurrentUser.timeZone = "Europe/Paris";
        this.jamesCurrentUser.username = null;

        this.jamesMessage = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
        this.oldJamespotUser = null;
    }
}
