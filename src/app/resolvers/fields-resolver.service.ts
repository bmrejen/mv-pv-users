import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { FieldsService } from "../services/fields.service";

import { Fields } from "../models/fields";

@Injectable()

export class FieldsResolverService implements Resolve<Promise<Fields>> {
    constructor(private fields: FieldsService) {
        //
    }

    public resolve(): Promise<Fields> {
        return new Promise((resolve, reject) => {
            this.fields.getData()
                .then((res) => resolve(res))
                .catch((error) => reject(`Problem getting fields: ${error}`));
        });
    }
}
