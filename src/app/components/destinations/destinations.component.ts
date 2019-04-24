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
    @Input() public currentUser;

    public handleClick(dest: Destination): void {
        if (!this.currentUser.destinations.includes(dest.id)) {
            this.currentUser.destinations.push(dest.id);
        } else {
            const index = this.currentUser.destinations.indexOf(dest.id);
            this.currentUser.destinations.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
