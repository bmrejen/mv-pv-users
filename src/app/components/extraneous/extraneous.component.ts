import { Component, Input } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

enum Statuses {
    AC = "Active",
    IN = "Inactive",
}

enum EmployeeStatuses {
    AC = "Active",
    IN = "Inactive",
    LA = "Leave of Absence",
    TR = "Terminated",
}

@Component({
    selector: "mv-extraneous",
    templateUrl: "./extraneous.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class ExtraneousComponent {
    @Input() public sugarCurrentUser;

    public statuses = Object.keys(Statuses)
        .map((status) => Statuses[status]);

    public employeeStatuses = Object.keys(EmployeeStatuses)
        .map((status) => EmployeeStatuses[status]);

    public trackByFn(item) {
        return item.id;
    }

}
