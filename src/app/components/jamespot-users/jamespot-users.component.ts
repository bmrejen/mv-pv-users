import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";

import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    selector: "mv-jamespot",
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    @Input() public currentJamespotUser: JamespotUser;
    public updateSuccessful: boolean = false;
    public oldJamespotUser: JamespotUser;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public image;
    public isUsernameTaken: boolean = false;
    // @Output() public readonly notifyParent = new EventEmitter<any>();
    @Output() public readonly getJamespotUser = new EventEmitter<any>();

    constructor(private james: JamespotService) {
        //
    }

    public ngOnInit(): void {
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
                this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error("Jamespot Problem :", err);
                this.errorMessage = err.substr(31, err.length - 34);
            });
    }

    public onUpdate(): void {
        // this.mapUserToJamespot();
        this.james.updateUser(this.currentJamespotUser, this.oldJamespotUser)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.updateSuccessful = true;
                this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error("Jamespot update error: ", err);
                this.errorMessage = err;
            });
    }

    public getUser(user?): void {
        // let id;
        // if (user.constructor.name === "GoogleUser") {
        //     console.log("this is a user sent from Gapi");
        //     id = "258";
        // } else if (user.constructor.name === "SugarUser") {
        //     console.log("this is a user from Credentials");
        //     id = "258";
        // } else {
        //     id = this.idToGet;
        // }
        // this.notifyParent.emit(id);
        console.log("jamespot component getUser looking for user", user);
        this.getJamespotUser.emit(user);
        this.resetFields();

        // this.james.getUser(id)
        //     .then((res: IJamespotUserConfig) => {
        //         this.resetFields();
        //         this.currentJamespotUser = this.oldJamespotUser = new JamespotUser(res);

        //         Object.keys(this.currentJamespotUser)
        //             .forEach((key) => this.currentUser[key] = this.currentJamespotUser[key]);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         this.errorMessage = `User ${id} doesn't exist`;
        //     });
    }

    public onDelete(): void {
        const id = this.currentJamespotUser.idUser;
        if (confirm(`Etes-vous sur de supprimer l'utilisateur ${id} en production?`)) {
            this.errorMessage = null;
            this.james.deleteUser(id)
                .then((res) => {
                    this.resetFields();
                    this.isDeleted = true;
                    this.deletedId = id;
                })
                .catch((err) => {
                    console.error(err);
                    this.isDeleted = false;
                    this.errorMessage = err.RC.MSG;
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
                this.errorMessage = null;
                if (res.idUser !== "" && this.currentJamespotUser.idUser === null) {
                    this.isUsernameTaken = true;
                    this.errorMessage = `Username taken by user #${res.idUser}`;
                }
            })
            .catch((err) => {
                console.error(err);
                this.errorMessage = err;
            });
    }

    public onDisable(): void {
        this.james.disableUser(this.currentJamespotUser.idUser)
            .then((res: IJamespotUserConfig) => {
                if (res.idUser !== "") {
                    this.resetFields();
                    this.getUser(res.idUser);
                }
            })
            .catch((err) => {
                console.error(err);
                this.errorMessage = err;
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

        this.errorMessage = null;
        this.idToGet = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
        this.oldJamespotUser = null;
    }
}
