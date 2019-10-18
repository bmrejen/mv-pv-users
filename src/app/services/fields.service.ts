import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Fields } from "../models/fields";
import { Office } from "../models/office";

@Injectable()

export class FieldsService {

    public myObj = {} as Fields;
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
            "userFields",
            "userTemplates",
        ];

        const promises = fields.map((field) => this.getSingleField(field));

        return Promise.all(promises)
            .then((result) => new Promise((resolve, reject) => resolve(populateFields(result[0]))));
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

function populateFields(fields: Fields) {
    const offices: Office[] = [];
    fields.offices.forEach((office) => offices.push(new Office(office)));
    fields.offices = offices;

    return fields;
}
