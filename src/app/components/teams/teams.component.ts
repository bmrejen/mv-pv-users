import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { Team } from "./../../models/team";
import { User } from "./../../models/user";

@Component({
    selector: "mv-teams",
    styleUrls: ["./teams.component.css"],
    templateUrl: "./teams.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class TeamsComponent {
    @Input() public teams;
    @Input() public currentUser: User;

    public handleClick(team: Team): void {
        if (!this.currentUser.sugarCurrentUser.teams.includes(team.id)) {
            this.currentUser.sugarCurrentUser.teams.push(team.id);
            this.currentUser.jamesCurrentUser.teams.push(team.name.replace(/EQ /, "Team "));
        } else {
            const index = this.currentUser.sugarCurrentUser.teams.indexOf(team.id);
            this.currentUser.sugarCurrentUser.teams.splice(index, 1);
            this.currentUser.jamesCurrentUser.teams.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }
}
