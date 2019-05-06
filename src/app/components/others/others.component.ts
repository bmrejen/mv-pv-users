import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

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
    @Input() public others;
    @Input() public currentUser;

    public handleClick(other): void {
        if (!this.currentUser.sugarCurrentUser.others.includes(other.id)) {
            this.currentUser.sugarCurrentUser.others.push(other.id);
        } else {
            const index = this.currentUser.sugarCurrentUser.others.indexOf(other.id);
            this.currentUser.sugarCurrentUser.others.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
