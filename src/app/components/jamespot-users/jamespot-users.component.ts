import { Component, OnInit } from "@angular/core";
import { IJamespotUserConfig } from "../../interfaces/jamespot-api-response";

import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    public updateSuccessful: boolean = false;
    public currentUser: JamespotUser;
    public oldUser: JamespotUser;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public image;
    public isUsernameTaken: boolean = false;

    constructor(private james: JamespotService) {
        //
    }

    public ngOnInit(): void {
        this.resetFields();
        this.james.getUsers()
            .subscribe((data) => console.log(data));
    }

    public onFileSelected(event) {
        this.image = event.target.files[0] as File;
    }

    public onPost(): void {
        this.james.postUsers(this.currentUser, this.image)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error(err);
                this.errorMessage = err.substr(31, err.length - 34);
            });
    }

    public onUpdate(): void {
        this.james.updateUser(this.currentUser, this.oldUser)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.updateSuccessful = true;
                this.getUser(res.idUser);
            })
            .catch((err: string) => {
                console.error(err);
                this.errorMessage = err.substr(31, err.length - 34);
            });
    }

    public getUser(id: string): void {
        this.james.getUser(id)
            .then((res: IJamespotUserConfig) => {
                this.resetFields();
                this.currentUser = new JamespotUser(res);
                this.oldUser = { ...this.currentUser };
            })
            .catch((err) => {
                console.error(err);
                this.errorMessage = `User ${id} doesn't exist`;
            });
    }

    public onDelete(): void {
        const id = this.currentUser.idUser;
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
        this.currentUser = new JamespotUser(
            {
                active: "1",
                company: "MARCO VASCO",
                country: "fr",
                firstname: "Benoit",
                idUser: null,
                img: null,
                language: "fr",
                lastname: "Mrejen",
                mail: "benoitmrejen@planetveo.com",
                password: "mypassword",
                phoneExtension: "1234",
                role: "User",
                timeZone: "Europe/Paris",
                username: "benoit.mrejen",
            });
    }

    public checkUsernameAvailability(): void {
        this.james.getByField("pseudo", this.currentUser.username)
            .then((res: IJamespotUserConfig) => {
                this.isUsernameTaken = true;
                this.errorMessage = null;
                if (res.idUser !== "" && this.currentUser.idUser === null) {
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
        this.james.disableUser(this.currentUser.idUser)
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
        this.onPrefill();
        this.errorMessage = null;
        this.idToGet = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
        this.oldUser = null;
    }
}
