import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

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

export class AccountsComponent implements OnInit {
  @Input() public accounts;

  constructor(private fieldsService: FieldsService) {
  }

  public ngOnInit(): void {
    //
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
