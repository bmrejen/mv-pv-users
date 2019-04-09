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
    public updatedUser: JamespotUser;
    public currentId;
    public first;
    public last;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public userToDelete;
    public fields = {
        active: null,
        country: null,
        firstname: null,
        image: null,
        language: null,
        lastname: null,
        mail: null,
        password: null,
        pseudo: null,
        role: null,
    };

    constructor(private james: JamespotService) {
        //
    }

    public ngOnInit(): void {
        this.james.getUsers()
            .subscribe((data) => console.log(data.VAL.forEach((user) => user.idUser)));
    }

    public onFileSelected(event) {
        this.fields.image = event.target.files[0] as File;
    }

    public onPost() {
        this.james.postUsers(this.fields)
            .subscribe((res) => {
                console.log(res);
                this.resetFields();
                this.currentId = res.VAL.idUser;

                this.currentUser = new JamespotUser(
                    res.VAL.Country,
                    res.VAL.Firstname,
                    res.VAL.Language,
                    res.VAL.Lastname,
                    res.VAL.Mail,
                    res.VAL.Pseudo,
                    res.VAL.Role,
                    res.VAL.properties.active,
                    res.VAL.idUser,
                    res.VAL.img,
                );
                console.log("this.currentUser", this.currentUser);
            });
    }
    public onUpdate(form) {
        this.updatedUser = new JamespotUser(
            this.fields.country,
            this.fields.firstname,
            this.fields.language,
            this.fields.lastname,
            this.fields.mail,
            this.fields.pseudo,
            this.fields.role,
            this.fields.active,
            this.currentId,
            this.fields.image,
            this.fields.password,
        );
        console.log("this.updatedUser", this.updatedUser);
        this.james.updateUser(this.updatedUser, this.currentUser)
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
                    this.currentId = this.currentUser.idUser;
                    this.mapResponseToFields(res);
                    console.log("this.currentUser", this.currentUser);
                } else {
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
        this.fields = {
            active: "1",
            country: "fr",
            firstname: "Benoit",
            image: null,
            language: "fr",
            lastname: "Mrejen",
            mail: "benoit.mrejen@planetveo.com",
            password: "mypassword",
            pseudo: "benoitmrejen",
            role: "User",
        };
    }

    public onDisable(id: string) {
        this.james.disableUser(id)
            .subscribe((res) => console.log(res));
    }

    private resetFields() {
        this.fields = {
            active: null,
            country: null,
            firstname: null,
            image: null,
            language: null,
            lastname: null,
            mail: null,
            password: null,
            pseudo: null,
            role: null,
        };
        this.errorMessage = null;
        this.currentId = null;
        this.idToGet = null;
        this.isDeleted = false;
        this.first = null;
        this.last = null;
        this.updateSuccessful = false;
    }

    private mapResponseToFields(res) {
        const val = res.VAL;
        this.fields.active = val.properties.active;
        this.fields.country = val.Country;
        this.fields.firstname = val.Firstname;
        this.fields.image = null;
        this.fields.language = val.Language;
        this.fields.lastname = val.Lastname;
        this.fields.mail = val.Mail;
        this.fields.password = null;
        this.fields.pseudo = val.Pseudo;
        this.fields.role = val.Role;
    }
}
