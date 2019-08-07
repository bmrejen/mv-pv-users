import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { ISugarConfigAndName } from "../interfaces/sugar-user";

@Injectable()

export class SugarResolverService implements Resolve<Promise<ISugarConfigAndName>> {
    constructor(private sugar: SugarService) {
        //
    }

    public resolve(route: ActivatedRouteSnapshot): Promise<ISugarConfigAndName> {

        const id = route.params.id;
        const userPromise: Promise<ISugarConfigAndName> = this.sugar.getUserById(id);

        return new Promise((resolve, reject) => {
            userPromise
                .then((res) => resolve(res))
                .catch((error) => reject(error));
        });
    }
}
