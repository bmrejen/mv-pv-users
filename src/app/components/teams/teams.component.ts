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

    public trackByFn(item) {
        return item.id;
    }
}
