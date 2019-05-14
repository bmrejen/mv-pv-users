import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { Destination } from "../../models/destination";

@Component({
    selector: "mv-destinations",
    styleUrls: ["./destinations.component.css"],
    templateUrl: "./destinations.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class DestinationsComponent {
    @Input() public destinations: Destination[];
    @Input() public sugarCurrentUser;

    public handleClick(dest: Destination): void {
        if (!this.sugarCurrentUser.destinations.includes(dest.id)) {
            this.sugarCurrentUser.destinations.push(dest.id);
        } else {
            const index = this.sugarCurrentUser.destinations.indexOf(dest.id);
            this.sugarCurrentUser.destinations.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
