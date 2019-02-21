import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Fields } from "../models/fields";

@Injectable()

export class FieldsService {

  public myObj = {};
  public fields = new Fields();
  constructor(private http: HttpClient) {
    //
  }

  public getData() {
    const fields = [
    "accounts",
    "civilites",
    "destinations",
    "functions",
    "managers",
    "offices",
    "orgas",
    "others",
    "roles",
    "services",
    "userFields",
    "userTemplates",
    ];

    const promises = fields.map((field) => this.getSingleField(field));

    return Promise.all(promises)
    .then((result) => new Promise((resolve, reject) => resolve(result)));
  }

  public getSingleField(field: string) {

    return this.http.get(`./src/app/assets/${field}.json`)
    .map((res) => {
      this.myObj[field] = res["data"];

      return this.myObj;
    })
    .toPromise();
  }

}
