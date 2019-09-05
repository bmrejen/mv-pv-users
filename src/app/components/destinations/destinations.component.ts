import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { Destination } from "../../models/destination";
import { User } from "./../../models/user";

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
    @Input() public currentUser: User;

    public handleClick(dest: Destination): void {
        if (!this.currentUser.sugarCurrentUser.destinations.includes(dest.id)) {
            this.currentUser.sugarCurrentUser.destinations.push(dest.id);
            this.currentUser.jamesCurrentUser.destinations.push(dest.name.replace(/DESTI - /g, ""));
        } else {
            const index = this.currentUser.sugarCurrentUser.destinations.indexOf(dest.id);
            this.currentUser.sugarCurrentUser.destinations.splice(index, 1);
            this.currentUser.jamesCurrentUser.destinations.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
