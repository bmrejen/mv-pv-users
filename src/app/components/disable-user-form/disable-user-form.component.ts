import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

@Component({
  selector: "mv-app-disable-user-form",
  templateUrl: "./disable-user-form.component.html",
})

export class DisableUserFormComponent implements OnInit {

  public fields: Fields;
  public enableAdd: boolean = true;
  constructor(
              private fieldsService: FieldsService,
              private route: ActivatedRoute) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getData()
    .then((res) => this.fields = new Fields(res[0]));

    this.route.paramMap.subscribe((params) => (params));

  }

  public trackByFn(index, item) {
    return item.id;
  }

}
