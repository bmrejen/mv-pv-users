import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { ISugarUserConfig } from "../interfaces/sugar-user";

@Injectable()

export class SugarResolverService implements Resolve<Promise<ISugarUserConfig>> {
    constructor(private sugar: SugarService) {
        //
    }

    public resolve(route: ActivatedRouteSnapshot): Promise<ISugarUserConfig> {

        const id = route.params.id;
        const userPromise: Promise<ISugarUserConfig> = this.sugar.getUserById(id);

        return new Promise((resolve, reject) => {
            userPromise
                .then((res) => resolve(res))
                .catch((error) => reject(error));
        });
    }
}
