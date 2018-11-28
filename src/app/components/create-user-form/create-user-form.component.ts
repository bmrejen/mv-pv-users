import { Component, OnInit } from "@angular/core";

@Component({
  selector: "mv-app-create-user-form",
  templateUrl: "./create-user-form.component.html",
})

export class CreateUserFormComponent implements OnInit {

  constructor() {
    // constructor
  }

  public ngOnInit(): void {
    console.log("CreateUserFormComponent launched");
  }
}
