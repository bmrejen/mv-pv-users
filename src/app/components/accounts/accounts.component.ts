import { Component, OnInit } from "@angular/core";
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
  public fields: Fields = null;
  // public accounts;
  // @Input() public accountFields;

  constructor(private fieldsService: FieldsService) {
  }

  public ngOnInit(): void {
    // this.accounts = this.accountFields;
    // console.log("this.accounts", this.accountFields);

    this.fieldsService.getSingleField("accounts")
    .then((res) => this.fields = new Fields(res));
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
