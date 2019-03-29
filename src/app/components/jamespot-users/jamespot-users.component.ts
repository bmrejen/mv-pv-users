import { Component, OnInit } from "@angular/core";
import { JamespotService } from "../../services/jamespot.service";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    public currentId;
    public first;
    public last;
    public id;
    public isDeleted: boolean = false;
    public deletedId;
    public errorMessage;
    public fields = {
        active: "1",
        country: "fr",
        firstname: "Mister",
        image: null,
        language: "fr",
        lastname: "Pouet",
        mail: "pouet6@pouet.com",
        password: "mypass",
        pseudo: "misterpouet7",
        role: "User",
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
                this.id = res.VAL.idUser;
            });
    }

    public getUser(id: string): void {
        this.james.getUser(id)
            .subscribe((res) => {
                this.currentId = res.VAL.idUser;
                this.mapResponseToFields(res);
            });
    }

    public onDelete(id) {
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

    private mapResponseToFields(res) {
        const val = res.VAL;
        // je dois reassigner l'objet entier? ca m'a l'air un peu dangereux
        this.fields = {
            active: val.properties.active,
            country: val.Country,
            firstname: val.Firstname,
            image: null,
            language: val.Language,
            lastname: val.Lastname,
            mail: val.Mail,
            password: null,
            pseudo: val.Pseudo,
            role: val.Role,
        };
    }
}
