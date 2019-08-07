import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { Other } from "../../models/other";
import { SugarUser } from "../../models/sugar-user";

@Component({
    selector: "mv-others",
    styleUrls: ["./others.component.css"],
    templateUrl: "./others.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class OthersComponent {
    @Input() public others: Other[];
    @Input() public sugarCurrentUser: SugarUser;

    public handleClick(other: Other): void {
        if (!this.sugarCurrentUser.others.includes(other.id)) {
            this.sugarCurrentUser.others.push(other.id);
        } else {
            const index = this.sugarCurrentUser.others.indexOf(other.id);
            this.sugarCurrentUser.others.splice(index, 1);
        }
    }

    public trackByFn(index) {
        return index;
    }

}
