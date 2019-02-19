import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";
import { User } from "../../models/user";

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

export class OfficeComponent implements OnInit {
  @Input() public offices;
  @Input() public selectedOffice;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    //
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
