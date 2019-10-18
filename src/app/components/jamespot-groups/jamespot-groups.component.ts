import { Component, Input } from "@angular/core";
import { Spot } from "./../../models/jamespot-spot";
import { User } from "./../../models/user";

@Component({
    selector: "mv-jamespot-groups",
    styleUrls: ["./jamespot-groups.component.css"],
    templateUrl: "./jamespot-groups.component.html",
})

export class JamespotGroupsComponent {
    @Input() public currentUser: User;
    @Input() public spots: Spot[];

    public handleClick(spot): void {
        if (!this.currentUser.jamesCurrentUser.spots.includes(spot)) {
            this.currentUser.jamesCurrentUser.spots.push(spot);
        } else {
            const index = this.currentUser.jamesCurrentUser.spots.indexOf(spot);
            this.currentUser.jamesCurrentUser.spots.splice(index, 1);
        }
    }

    public trackByFn(item) {
        return item.id;
    }
}
