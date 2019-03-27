import { Component, OnInit } from "@angular/core";
import { JamespotService } from "../../services/jamespot.service";

@Component({
    templateUrl: "./jamespot-users.component.html",
})

export class JamespotUsersComponent implements OnInit {
    constructor(private james: JamespotService) {
        //
    }

    public ngOnInit() {
        this.james.getUsers()
            .subscribe((data) => console.log(data));
    }
}
