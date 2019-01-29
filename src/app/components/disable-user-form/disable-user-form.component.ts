import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";

@Component({
  selector: "mv-app-disable-user-form",
  templateUrl: "./disable-user-form.component.html",
})

export class DisableUserFormComponent implements OnInit {

  public fields;
  public enableAdd: boolean = true;
  constructor(
              private fieldsService: FieldsService,
              private route: ActivatedRoute) {
    //
  }

  public ngOnInit(): void {
    this.fields = this.fieldsService.getData();
    this.fields.accounts.forEach((account) => {
      account.checked = true;
    });
    this.route.paramMap.subscribe((params) => (params));
  }

  public trackByFn(index, item) {
    return item.id;
  }

}
