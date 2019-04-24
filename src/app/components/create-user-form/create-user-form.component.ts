import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Destination } from "../../models/destination";
import { Fields } from "../../models/fields";
import { Role } from "../../models/role";
import { SugarUser } from "../../models/sugar-user";
import { Team } from "../../models/team";
import { User } from "../../models/user";

@Component({
    selector: "mv-app-create-user-form",
    styleUrls: ["./create-user-form.component.css"],
    templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {
    public fields: Fields;
    public errorMsg;
    public passwordExists = false;
    public usersFromSugar: User[] = [];
    public usernameTaken;
    public currentUser: User;
    public teams: Team[] = [];
    public roles: Role[] = [];
    public destinations: Destination[] = [];
    public managers: SugarUser[] = [];
    public currentSugarUser: SugarUser;

    // tslint:disable-next-line:max-line-length
    public body = `{"data":[{"codeSonGalileo":"","departments":["departments-Backoffice","departments-Backoffice Billet"],"destinations":["4e12eefb-5dbb-f913-d80b-4c2ab8202809","6f9aedb6-6d68-b4f3-0270-4cc10e363077"],"email":"mfeuillet@marcovasco.fr","employeeStatus":true,"firstName":"Mathilde","functionId":"","inheritsPreferencesFrom":"user_default","isAdmin":false,"lastName":"Feuillet","leadsMax":45,"leadsMin":15,"managerId":"","officeId":"","phoneAsterisk":"phoneAsterisk","phoneFax":"phoneFax","phoneMobile":"phoneMobile","phoneWork":"phoneWork","roles":["128e2eae-322a-8a0d-e9f0-4cf35b5bfe5b","25218251-3011-b347-5d4f-4bfced4de2cc"],"salutation":"Mrs.","status":true,"teams":["0ec63f44-aa38-11e7-924f-005056911f09","1046f88d-3d37-10d5-7760-506023561b57"],"title":"","tourplanID":"MFEUIL","userName":"mfeuillet"}]}`;

    public userObject;

    constructor(private route: ActivatedRoute) {
        //
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => {
                // set current user if any
                this.currentSugarUser = new SugarUser(data.sugarUser || {});
                this.currentUser = new User({});

                Object.keys(this.currentSugarUser)
                    .forEach((key) => this.currentUser[key] = this.currentSugarUser[key]);

                // get manager list
                this.managers = data.managers;

                // get user list
                data.users.forEach((user) => this.usersFromSugar.push(new User(user)));

                // get team list
                data.teams.forEach((team) => this.teams.push(new Team(team)));

                // get role list
                data.roles.forEach((role) => this.roles.push(new Role(role)));

                // get destinations list
                data.destinations.forEach((dest) => this.destinations.push(new Destination(dest)));

                // get fields list
                this.fields = new Fields(data.fields);
            });

    }

    public onParentChange({ e, id }) {
        // const myField = this.fields.others.find((field) => field.id === id);
        // myField.checked = e;
    }

    public onSubmit(form) {
        console.log("submitted", form);
        // this.sugar.postDataToSugar(this.body)
        //     .subscribe(
        //         (res) => {
        //             this.currentUser = new User(res.data[0]);
        //         },
        //         (error) => this.errorMsg = error.statusText,
        //     );
        // this.userObject = this.mapper.createUserForSugar(form);
        // this.sugarService.postDataToSugar(form)
        // .subscribe(
        //            (data) => console.log("DATA- ", data),
        //            (error) => this.errorMsg = error.statusText);
    }

    public trackByFn(index, item) {
        const self = this;

        return item.id; // or index
    }
}
