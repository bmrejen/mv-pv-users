import { Component, OnInit } from "@angular/core";
import { SugarUser } from "../../models/sugar-user";
import { SugarService } from "../../services/sugar.service";

@Component({
    selector: "mv-app-users",
    styleUrls: ["./users.component.css"],
    templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
    public usersFromSugar: SugarUser[] = [];
    public filteredUsers: SugarUser[] = [];
    public filter: string = "All";

    constructor(private sugarService: SugarService) {
        // constructor
    }

    public ngOnInit(): void {
        this.sugarService.getUsers()
            .then((users) => users.forEach((user) => {
                const userInfo = this.sugarService.mapUserFromApi(user);
                this.usersFromSugar.push(new SugarUser(userInfo));
            }))
            .then((users) => this.filteredUsers = this.usersFromSugar);
    }

    public filterUsers(prop: string) {
        switch (prop) {

            case "inactive":
                this.filter = "Inactive";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.status !== "Active" || user.employeeStatus !== "Active");
                break;

            case "active":
                this.filter = "Active";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.status === "Active" && user.employeeStatus === "Active");
                break;

            case "all":
                this.filter = "All";
                this.filteredUsers = this.usersFromSugar;
                break;

            default:
                console.error("Users not filtered");
                break;
        }
    }

    public trackByFn(index) {
        return index;
    }
}
