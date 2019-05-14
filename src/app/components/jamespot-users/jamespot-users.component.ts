import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";

import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    selector: "mv-jamespot",
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent {
    @Input() public jamesCurrentUser: JamespotUser;
    @Input() public jamesMessage: string;

    public updateSuccessful: boolean = false;
    public oldJamespotUser: JamespotUser;
    public isDeleted: boolean = false;
    public deletedId;
    public image;
    public isUsernameTaken: boolean = false;

    constructor(private james: JamespotService) {
        //
    }

    public onFileSelected(event) {
        this.image = event.target.files[0] as File;
    }

    public onPost(): void {
        // this.mapUserToJamespot();
        this.james.postUsers(this.jamesCurrentUser, this.image)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                // this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error("Jamespot Problem :", err);
                this.jamesMessage = err.substr(31, err.length - 34);
            });
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

    public onPrefill(): void {
        this.jamesCurrentUser.active = "1";
        this.jamesCurrentUser.company = "MARCO VASCO";
        this.jamesCurrentUser.country = "fr";
        this.jamesCurrentUser.firstname = "Benoit";
        this.jamesCurrentUser.idUser = null;
        this.jamesCurrentUser.img = null;
        this.jamesCurrentUser.language = "fr";
        this.jamesCurrentUser.lastname = "Mrejen";
        this.jamesCurrentUser.mail = "benoitmrejen@planetveo.com";
        this.jamesCurrentUser.password = "mypassword";
        this.jamesCurrentUser.phoneExtension = "1234";
        this.jamesCurrentUser.role = "User";
        this.jamesCurrentUser.timeZone = "Europe/Paris";
        this.jamesCurrentUser.username = "benoit.mrejen";
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
        this.jamesCurrentUser.firstname = null;
        this.jamesCurrentUser.idUser = null;
        this.jamesCurrentUser.img = null;
        this.jamesCurrentUser.language = "fr";
        this.jamesCurrentUser.lastname = null;
        this.jamesCurrentUser.mail = null;
        this.jamesCurrentUser.password = null;
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
