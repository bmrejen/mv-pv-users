import { Component, OnInit } from "@angular/core";

@Component({
  selector: "mv-app-user",
  templateUrl: "./user.component.html",
})

export class UserComponent implements OnInit {

  constructor() {
    // constructor
  }

  public ngOnInit(): void {
    console.log("User component launched");
  }
}
