import { Component, OnInit } from "@angular/core";
import { FieldsService } from "../../services/fields.service";

@Component({
  selector: "mv-app-disable-user-form",
  templateUrl: "./disable-user-form.component.html",
})

export class DisableUserFormComponent implements OnInit {

  public fields;
  public enableAdd: boolean = true;
  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
    this.fields.accounts.forEach((account) => {
      account.checked = true;
    });
  }

  public trackByFn(index, item) {
    return item.id;
  }

}
