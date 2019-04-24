import { Component, Input, OnInit } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";
import { SugarService } from "./../../services/sugar.service";

import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

import { User } from "./../../models/user";

@Component({
    selector: "mv-jamespot",
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    @Input() public currentUser: User;
    public updateSuccessful: boolean = false;
    public currentJamespotUser: JamespotUser;
    public oldJamespotUser: JamespotUser;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public image;
    public isUsernameTaken: boolean = false;

    constructor(private james: JamespotService, private sugar: SugarService) {
        //
    }

    public ngOnInit(): void {
        this.resetFields();
    }

    public onFileSelected(event) {
        this.image = event.target.files[0] as File;
    }

    public onPost(): void {
        this.mapUserToJamespot();
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

    public mapUserToJamespot() {
        this.currentJamespotUser = new JamespotUser({
            active: this.currentUser.jamesActive,
            company: this.currentUser.jamesCompany,
            country: this.currentUser.jamesCountry,
            firstname: this.currentUser.jamesFirstname,
            idUser: this.currentUser.jamesIdUser,
            img: this.currentUser.jamesImg,
            language: this.currentUser.jamesLanguage,
            lastname: this.currentUser.jamesLastname,
            mail: this.currentUser.jamesMail,
            password: this.currentUser.jamesPassword,
            phoneExtension: this.currentUser.jamesPhoneExtension,
            role: this.currentUser.jamesRole,
            timeZone: this.currentUser.jamesTimeZone,
            username: this.currentUser.jamesUsername,
        });
    }

    public onUpdate(): void {
        this.mapUserToJamespot();
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

    public getUser(id: string): void {
        this.james.getUser(id)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.currentJamespotUser = this.oldJamespotUser = new JamespotUser(res);

                Object.keys(this.currentJamespotUser)
                    .forEach((key) => this.currentUser[key] = this.currentJamespotUser[key]);

                this.sugar.getUserByUsername
                    (`${this.currentUser.jamesFirstname[0]}${this.currentUser.jamesLastname}`)
                    .then((response) => {
                        const sugarUserConfig = this.sugar.mapUserFromApi(response);
                        Object.keys(sugarUserConfig)
                            .forEach((key) => this.currentUser[key] = sugarUserConfig[key]);
                    });
            })
            .catch((err) => {
                console.error(err);
                this.errorMessage = `User ${id} doesn't exist`;
            });
    }

    public onDelete(): void {
        const id = this.currentUser.jamesIdUser;
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
        this.currentUser.jamesActive = "1";
        this.currentUser.jamesCompany = "MARCO VASCO";
        this.currentUser.jamesCountry = "fr";
        this.currentUser.jamesFirstname = "Benoit";
        this.currentUser.jamesIdUser = null;
        this.currentUser.jamesImg = null;
        this.currentUser.jamesLanguage = "fr";
        this.currentUser.jamesLastname = "Mrejen";
        this.currentUser.jamesMail = "benoitmrejen@planetveo.com";
        this.currentUser.jamesPassword = "mypassword";
        this.currentUser.jamesPhoneExtension = "1234";
        this.currentUser.jamesRole = "User";
        this.currentUser.jamesTimeZone = "Europe/Paris";
        this.currentUser.jamesUsername = "benoit.mrejen";
    }

    public checkUsernameAvailability(): void {
        this.james.getByField("pseudo", this.currentUser.jamesUsername)
            .then((res: IJamespotUserConfig) => {
                this.isUsernameTaken = true;
                this.errorMessage = null;
                if (res.idUser !== "" && this.currentUser.jamesIdUser === null) {
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
        this.james.disableUser(this.currentUser.jamesIdUser)
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
        this.currentUser.jamesActive = "1";
        this.currentUser.jamesCompany = "MARCO VASCO";
        this.currentUser.jamesCountry = "fr";
        this.currentUser.jamesFirstname = null;
        this.currentUser.jamesIdUser = null;
        this.currentUser.jamesImg = null;
        this.currentUser.jamesLanguage = "fr";
        this.currentUser.jamesLastname = null;
        this.currentUser.jamesMail = null;
        this.currentUser.jamesPassword = null;
        this.currentUser.jamesPhoneExtension = null;
        this.currentUser.jamesRole = "User";
        this.currentUser.jamesTimeZone = "Europe/Paris";
        this.currentUser.jamesUsername = null;

        this.errorMessage = null;
        this.idToGet = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
        this.oldJamespotUser = null;
    }
}
