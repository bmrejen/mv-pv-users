import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

@Component({
  selector: "mv-function",
  templateUrl: "./function.component.html",
  viewProviders: [
  {
    provide: ControlContainer,
    useExisting: NgForm,
  },
  ],
})

export class FunctionComponent implements OnInit {
  public fields: Fields;

  constructor(private fieldsService: FieldsService) {
    //
  }

  public ngOnInit(): void {
    this.fieldsService.getSingleField("functions")
    .then((res) => this.fields = new Fields(res));
  }

  public trackByFn(index, item) {
    const self = this;

    return item.id; // or index
  }

}
