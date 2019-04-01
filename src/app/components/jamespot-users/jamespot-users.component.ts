import { Component, OnInit } from "@angular/core";
import { IJamespotApiResponse, IJamespotUser } from "../../interfaces/jamespot-api-response";
import { JamespotService } from "../../services/jamespot.service";
import { JamespotUser } from "./../../models/jamespot-user";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    public currentUser: JamespotUser;
    public currentId;
    public first;
    public last;
    public idToGet;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
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

                this.first = res.VAL.Firstname;
                this.last = res.VAL.Lastname;
                this.currentId = res.VAL.idUser;

                const [
                    Country,
                    Firstname,
                    Language,
                    Lastname,
                    Mail,
                    Pseudo,
                    Role,
                    idUser,
                    img,
                    active,
                ] = [
                        res.VAL.Country,
                        res.VAL.Firstname,
                        res.VAL.Language,
                        res.VAL.Lastname,
                        res.VAL.Mail,
                        res.VAL.Pseudo,
                        res.VAL.Role,
                        res.VAL.idUser,
                        res.VAL.img,
                        res.VAL.properties.active,
                    ];
                this.currentUser = new JamespotUser(
                    Country,
                    Firstname,
                    Language,
                    Lastname,
                    Mail,
                    Pseudo,
                    Role,
                    active,
                    idUser,
                    img,
                );
                console.log(this.currentUser);
            });
    }

    public onUpdate(form) {
        console.log(form);
        console.log(this.fields);
        this.james.updateUser(this.fields)
            .subscribe((res) => console.log(res));
    }

    public getUser(id: string) {
        this.resetFields();
        this.james.getUser(id)
            .subscribe((res: IJamespotApiResponse<IJamespotUser>) => {
                console.log(res);
                if (res.RC.CODE === 0) {
                    this.currentId = res.VAL.idUser;
                    this.mapResponseToFields(res);
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
    }

    private mapResponseToFields(res) {
        const val = res.VAL;
        // je dois reassigner l'objet entier? ca m'a l'air un peu dangereux
        [
            this.fields.active,
            this.fields.country,
            this.fields.firstname,
            this.fields.image,
            this.fields.language,
            this.fields.lastname,
            this.fields.mail,
            this.fields.password,
            this.fields.pseudo,
            this.fields.role,
        ] = [
                val.properties.active,
                val.Country,
                val.Firstname,
                null,
                val.Language,
                val.Lastname,
                val.Mail,
                null,
                val.Pseudo,
                val.Role,
            ];
    }
}
