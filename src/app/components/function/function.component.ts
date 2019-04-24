import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-function",
    templateUrl: "./function.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class FunctionComponent {
    @Input() public functions;
    @Input() public currentUser;

    public trackByFn(item) {
        return item.id;
    }

}
