import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

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
    @Input() public sugarCurrentUser;

    public handleClick(team): void {
        if (!this.sugarCurrentUser.teams.includes(team.id)) {
            this.sugarCurrentUser.teams.push(team.id);
        } else {
            const index = this.sugarCurrentUser.teams.indexOf(team.id);
            this.sugarCurrentUser.teams.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }
}
