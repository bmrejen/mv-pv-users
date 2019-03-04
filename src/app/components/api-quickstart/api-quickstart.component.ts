import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

@Component({
  selector: "mv-api-quickstart",
  templateUrl: "./api-quickstart.component.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})

export class ApiQuickStartComponent implements OnInit {
  public credentials;

  constructor(private http: HttpClient) {
    //
  }

  public ngOnInit() {
    //
  }
}
