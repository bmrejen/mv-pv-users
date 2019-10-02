import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../models/user";

@Component({
    selector: "mv-app-users",
    styleUrls: ["./users.component.css"],
    templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
    public usersFromSugar: User[] = [];
    public filteredUsers: User[] = [];
    public filter: string = "All";

    constructor(
        private route: ActivatedRoute,
    ) {
        // constructor
    }

    public ngOnInit(): void {
        this.route.data
            .subscribe((data) => {
                this.usersFromSugar = data.users;
                this.filterUsers("active");
            });
    }

    public filterUsers(filter: string) {
        switch (filter) {

            case "inactive":
                this.filter = "Inactive";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.sugarCurrentUser.status !== "Active"
                        || user.sugarCurrentUser.employeeStatus !== "Active");
                break;

            case "active":
                this.filter = "Active";
                this.filteredUsers = this.usersFromSugar
                    .filter((user) => user.sugarCurrentUser.status === "Active"
                        && user.sugarCurrentUser.employeeStatus === "Active");
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

    public mapIdToUser(id: string): string {
        const manager = this.usersFromSugar.find((user) => user.sugarCurrentUser.id === id);

        return (manager != null && manager.sugarCurrentUser != null) ?
            `${manager.common.firstName} ${manager.common.lastName}` : "";
    }
}
