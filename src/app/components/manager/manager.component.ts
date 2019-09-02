import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { User } from "./../../models/user";
import { SugarService } from "./../../services/sugar.service";

@Component({
    selector: "mv-manager",
    templateUrl: "./manager.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class ManagerComponent {
    @Input() public managers;
    @Input() public currentUser: User;

    constructor(private sugar: SugarService) {
        //
    }

    public handleClickManager(event) {
        const sugarId = event.target.value;
        if (sugarId !== "") {
            this.sugar.getUserById(sugarId)
                .then((res) => {
                    if (!["", null].includes(res.sugar.jamespotId)) {
                        this.currentUser.jamesCurrentUser.managerJamespotId = res.sugar.jamespotId;
                    } else {
                        alert("Manager has no Jamespot id");
                    }
                })
                .catch((err) => console.error(err));
        }
    }

    public trackByFn(item) {
        return item.id;
    }

}
