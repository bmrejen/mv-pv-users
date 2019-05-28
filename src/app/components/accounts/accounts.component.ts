import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-accounts",
    templateUrl: "./accounts.component.html",

    // do I still need to keep this ?
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class AccountsComponent {
    @Input() public accounts;

    public trackByFn(item) {
        return item.id;
    }

}
