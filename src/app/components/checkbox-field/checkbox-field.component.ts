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
  @Output() public readonly clickEmitter = new EventEmitter<any>();

  public boxClicked(e, id) {
    this.clickEmitter.emit({e, id});
  }

  public trackByFn(item, id) {
    return id;
  }
}
