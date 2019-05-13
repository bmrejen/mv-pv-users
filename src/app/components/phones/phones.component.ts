import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
    selector: "mv-phones",
    styleUrls: ["./phones.component.css"],
    templateUrl: "./phones.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class PhonesComponent implements OnInit {
    @Input() public sugarCurrentUser;

    constructor() {
        //
    }

    public ngOnInit(): void {
        //
    }

    public trackByFn(item) {
        return item.id;
    }

}
