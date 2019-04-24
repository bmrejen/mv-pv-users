import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

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
    @Input() public currentUser;

    public trackByFn(item) {
        return item.id;
    }

}
