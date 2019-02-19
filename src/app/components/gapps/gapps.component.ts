import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { FieldsService } from "../../services/fields.service";

import { Fields } from "../../models/fields";

@Component({
  selector: "mv-gapps",
  templateUrl: "./gapps.component.html",
  viewProviders: [
  {
    provide: ControlContainer,
    useExisting: NgForm,
  },
  ],
})

export class GappsComponent implements OnInit {
  @Input() public orgas;
  @Input() public selectedOrganisation;
  @Input() public groupes;

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
