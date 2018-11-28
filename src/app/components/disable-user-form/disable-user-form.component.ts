import { Component, OnInit } from "@angular/core";

@Component({
  selector: "mv-app-disable-user-form",
  templateUrl: "./disable-user-form.component.html",
})

export class DisableUserFormComponent implements OnInit {
  public enableAdd: boolean = true;
  constructor() {
    // constructor
  }

  public ngOnInit(): void {
    console.log("DisableUserForm Component launched");
  }
}
