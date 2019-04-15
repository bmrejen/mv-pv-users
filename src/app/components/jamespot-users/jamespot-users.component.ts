import { Component, OnInit } from "@angular/core";
import { IJamespotApiResponse, IJamespotUser } from "../../interfaces/jamespot-api-response";
import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    public currentId;
    public updateSuccessful: boolean = false;
    public currentUser: JamespotUser;
    public oldUser: JamespotUser;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public image;
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
        this.resetFields();
        this.james.getUsers()
            .subscribe((data) => console.log(data.VAL.forEach((user) => user.idUser)));
    }

    public onFileSelected(event) {
        this.image = event.target.files[0] as File;
    }

    public onPost(form) {
        this.james.postUsers(form, this.image)
            .subscribe((res) => {
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

    public onDelete(id) {
        if (confirm(`Etes-vous sur de supprimer l'utilisateur ${id} en production?`)) {
            this.errorMessage = null;
            this.james.deleteUser(id)
                .subscribe((res) => {
                    console.log(res);
                    if (res.RC.CODE === 0) {
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

    public onDisable(id: string) {
        this.james.disableUser(id)
            .subscribe((res) => console.log(res));
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
