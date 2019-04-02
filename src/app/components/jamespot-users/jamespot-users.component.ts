import { Component, OnInit } from "@angular/core";
import { IJamespotApiResponse, IJamespotUser } from "../../interfaces/jamespot-api-response";
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

    constructor(private james: JamespotService) {
        //
    }

    public ngOnInit(): void {
        this.resetFields();
        console.log("this.currentUser", this.currentUser);
        this.james.getUsers()
            .subscribe((data) => console.log(data.VAL.forEach((user) => user.idUser)));
    }

    public onFileSelected(event) {
        this.image = event.target.files[0] as File;
    }

    public onPost(form) {
        this.james.postUsers(form, this.image)
            .subscribe((res) => {
                console.log("res", res);
                this.resetFields();
                if (res["RC"].CODE === 0) {

                    this.currentUser = new JamespotUser(
                        res.VAL.Country,
                        res.VAL.Firstname,
                        res.VAL.Language,
                        res.VAL.Lastname,
                        res.VAL.Mail,
                        res.VAL.Pseudo,
                        res.VAL.Role,
                        res.VAL.properties.active,
                        res.VAL.properties.timeZone,
                        res.VAL.field1, // phoneExtension
                        res.VAL.idUser,
                        res.VAL.img,
                        null, // password
                        res.VAL.properties.company,
                    );
                    console.log("this.currentUser", this.currentUser);
                }
            });
    }
    public onUpdate(form) {
        this.james.updateUser(this.currentUser, this.oldUser)
            .subscribe((res) => {
                if (res["RC"].CODE === 0) {
                    this.resetFields();
                    this.updateSuccessful = true;
                }
            },
                (err) => console.error(err));
    }

    public getUser(id: string): void {
        this.james.getUser(id)
            .subscribe((res: IJamespotApiResponse<IJamespotUser>) => {
                console.log(res);
                if (res.RC.CODE === 0) {
                    this.currentUser = new JamespotUser(
                        res.VAL.Country,
                        res.VAL.Firstname,
                        res.VAL.Language,
                        res.VAL.Lastname,
                        res.VAL.Mail,
                        res.VAL.Pseudo,
                        res.VAL.Role,
                        res.VAL.properties.active,
                        res.VAL.properties.timeZone,
                        res.VAL.field1, // phoneExtension
                        res.VAL.idUser,
                        res.VAL.img,
                        null, // password
                        res.VAL.properties.company,
                    );
                    this.oldUser = { ...this.currentUser };
                    console.log("this.currentUser", this.currentUser);
                } else {
                    this.resetFields();
                    this.errorMessage = `User ${id} doesn't exist`;

                }
            });
    }

    public onDelete(id) {
        if (confirm(`Etes-vous sur de supprimer l'utilisateur ${id} en production?`)) {
            this.errorMessage = null;
            this.james.deleteUser(id)
                .subscribe((res) => {
                    console.log(res);
                    if (res.RC.CODE === 0) {
                        this.resetFields();
                        this.isDeleted = true;
                        this.deletedId = id;
                    } else {
                        this.isDeleted = false;
                        this.errorMessage = res.RC.MSG;
                    }
                });
        }
    }

    public onPrefill() {
        this.currentUser = new JamespotUser(
            "fr",           // country
            "Benoit",             // firstName
            "fr",           // language
            "Mrejen",             // lastName
            "benoitmrejen@planetveo.com",             // mail
            "benoit.mrejen",             // pseudo
            "User",         // role
            "1",            // active
            "Europe/Paris", // timeZone
            "1234",           // phoneExtension
            null,           // idUser
            null,           // image
            "mypassword",           // password
            "MARCO VASCO",  // company
        );
    }

    private resetFields() {
        this.currentUser = new JamespotUser(
            "fr",           // country
            "",             // firstName
            "fr",           // language
            "",             // lastName
            "",             // mail
            "",             // pseudo
            "User",         // role
            "1",            // active
            "Europe/Paris", // timeZone
            null,           // phoneExtension
            null,           // idUser
            null,           // image
            null,           // password
            "MARCO VASCO",  // company
        );
        this.errorMessage = null;
        this.idToGet = null;
        this.isDeleted = false;
        this.updateSuccessful = false;
    }
}
