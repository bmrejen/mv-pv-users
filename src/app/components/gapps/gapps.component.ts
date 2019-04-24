import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-gapps",
    templateUrl: "./gapps.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class GappsComponent {
    @Input() public orgas;
    @Input() public currentUser;

    public trackByFn(item) {
        return item.id;
    }

}
