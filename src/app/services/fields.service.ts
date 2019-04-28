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

    public getData(): Promise<any> {
        const fields = [
            "accounts",
            "civilites",
            "departments",
            "functions",
            "offices",
            "orgas",
            "others",
            "userFields",
            "userTemplates",
        ];

        const promises = fields.map((field) => this.getSingleField(field));

        return Promise.all(promises)
            .then((result) => new Promise((resolve, reject) => resolve(result[0])));
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
