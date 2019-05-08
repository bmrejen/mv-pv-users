import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";

import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    selector: "mv-jamespot",
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent {
    @Input() public currentJamespotUser: JamespotUser;
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
        this.james.postUsers(this.currentJamespotUser, this.image)
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
        this.james.updateUser(this.currentJamespotUser, this.oldJamespotUser)
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
        const id = this.currentJamespotUser.idUser;
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
        this.currentJamespotUser.active = "1";
        this.currentJamespotUser.company = "MARCO VASCO";
        this.currentJamespotUser.country = "fr";
        this.currentJamespotUser.firstname = "Benoit";
        this.currentJamespotUser.idUser = null;
        this.currentJamespotUser.img = null;
        this.currentJamespotUser.language = "fr";
        this.currentJamespotUser.lastname = "Mrejen";
        this.currentJamespotUser.mail = "benoitmrejen@planetveo.com";
        this.currentJamespotUser.password = "mypassword";
        this.currentJamespotUser.phoneExtension = "1234";
        this.currentJamespotUser.role = "User";
        this.currentJamespotUser.timeZone = "Europe/Paris";
        this.currentJamespotUser.username = "benoit.mrejen";
    }

    public checkUsernameAvailability(): void {
        this.james.getByField("pseudo", this.currentJamespotUser.username)
            .then((res: IJamespotUserConfig) => {
                this.isUsernameTaken = true;
                this.jamesMessage = null;
                if (res.idUser !== "" && this.currentJamespotUser.idUser === null) {
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
        this.james.disableUser(this.currentJamespotUser.idUser)
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
        this.currentJamespotUser.active = "1";
        this.currentJamespotUser.company = "MARCO VASCO";
        this.currentJamespotUser.country = "fr";
        this.currentJamespotUser.firstname = null;
        this.currentJamespotUser.idUser = null;
        this.currentJamespotUser.img = null;
        this.currentJamespotUser.language = "fr";
        this.currentJamespotUser.lastname = null;
        this.currentJamespotUser.mail = null;
        this.currentJamespotUser.password = null;
        this.currentJamespotUser.phoneExtension = null;
        this.currentJamespotUser.role = "User";
        this.currentJamespotUser.timeZone = "Europe/Paris";
        this.currentJamespotUser.username = null;

        this.jamesMessage = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
        this.oldJamespotUser = null;
    }
}
