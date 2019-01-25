import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: "mv-checkbox-field",
  styleUrls: ["./checkbox-field.component.css"],
  templateUrl: "./checkbox-field.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class CheckboxFieldComponent {

  @Input() public checkboxes: any[];
  @Output() public onClick = new EventEmitter<any>();

  public onChange(e, id) {
    console.log("in child", e, id);
    this.onClick.emit({e, id});
  }

  public trackByFn(item, id) {
    return id;
  }
}
