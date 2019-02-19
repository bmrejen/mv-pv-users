import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

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

export class ManagerComponent implements OnInit {
  @Input() public managers;
  @Input() public selectedManager;

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
