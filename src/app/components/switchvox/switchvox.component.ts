import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-switchvox",
    styleUrls: ["./switchvox.component.css"],
    templateUrl: "./switchvox.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class SwitchvoxComponent {
    @Input() public sugarCurrentUser;
    public isChecked: boolean;

    public trackByFn(item) {
        return item.id;
    }

}
