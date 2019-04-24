import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-office",
    templateUrl: "./office.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class OfficeComponent {
    @Input() public offices;
    @Input() public currentUser;

    constructor() {
        //
    }

    public trackByFn(item) {
        return item.id; // or index
    }

}
