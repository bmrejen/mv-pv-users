import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-gapps",
    styleUrls: ["./gapps.component.css"],
    templateUrl: "./gapps.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class GappsComponent {
    @Input() public ggCurrentUser;
    @Input() public googleGroups;

    public handleClick(group): void {
        if (!this.ggCurrentUser.googleGroups.includes(group)) {
            this.ggCurrentUser.googleGroups.push(group);
        } else {
            const index = this.ggCurrentUser.googleGroups.indexOf(group);
            this.ggCurrentUser.googleGroups.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
