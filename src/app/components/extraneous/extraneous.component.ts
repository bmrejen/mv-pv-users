import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

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

export class ExtraneousComponent implements OnInit {
  @Input() public codeTourplan;
  @Input() public codeSON;
  @Input() public title;
  @Input() public inactiveStatus;
  @Input() public inactiveEmployee;
  @Input() public currentUser;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.codeTourplan = this.currentUser.tourplanID;
    this.inactiveEmployee = this.currentUser.employeeStatus !== "Active";
    this.inactiveStatus = this.currentUser.status !== "Active";
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
