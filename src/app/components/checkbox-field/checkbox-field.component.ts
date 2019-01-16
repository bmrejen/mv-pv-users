import { Component, Input } from "@angular/core";

@Component({
  selector: "mv-checkbox-field",
  styleUrls: ["./checkbox-field.component.css"],
  templateUrl: "./checkbox-field.component.html",
})

export class CheckboxFieldComponent {

  @Input() public checkboxes: any[];

  public trackByFn(item, id) {
    return id;
  }


}
