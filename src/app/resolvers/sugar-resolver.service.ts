import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { SugarUser } from "../models/sugar-user";

@Injectable()

export class SugarResolverService implements Resolve<Promise<SugarUser>> {
    constructor(private sugar: SugarService) {
        //
    }

    public resolve(route: ActivatedRouteSnapshot): Promise<SugarUser> {

        const id = route.params.id;
        const userPromise: Promise<SugarUser> = this.sugar.getUserById(id);

        return new Promise((resolve, reject) => {
            userPromise
                .then((res) => resolve(res))
                .catch((error) => reject(error));
        });
    }
}
