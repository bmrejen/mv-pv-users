import { Component, OnInit } from "@angular/core";
import { JamespotService } from "../../services/jamespot.service";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
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

    public ngOnInit() {
        // this.james.getUsers()
        //     .subscribe((data) => console.log(data));
    }

    public onFileSelected(event) {
        this.fields.image = event.target.files[0] as File;
    }

    public onPost() {
        this.james.postUsers(this.fields)
            .subscribe((res) => {
                console.log(res);
                this.first = res.VAL.Firstname;
                this.last = res.VAL.Lastname;
                this.currentId = res.VAL.idUser;
            });
    }

    public getUser(id: string) {
        this.resetFields();
        this.james.getUser(id)
            .subscribe((res) => {
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
                        this.isDeleted = true;
                        this.deletedId = id;
                        this.resetFields();
                    } else {
                        this.isDeleted = false;
                        this.errorMessage = res.RC.MSG;
                    }
                });
        }
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
