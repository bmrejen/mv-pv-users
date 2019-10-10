import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { ISugarConfigAndName } from "../interfaces/sugar-user";
import { SugarUser } from "../models/sugar-user";
import { User } from "../models/user";

@Injectable()

export class SugarResolverService implements Resolve<Promise<User>> {
    constructor(private sugar: SugarService) {
        //
    }

    public resolve(route: ActivatedRouteSnapshot): Promise<User> {

        const id = route.params.id;
        const userPromise: Promise<User> = this.sugar.getUserById(id)
            .then((res: ISugarConfigAndName) => {
                const myUser = new User({});
                myUser.sugarCurrentUser = new SugarUser(res.common, res.sugar);
                myUser.common = res.common;

                return myUser;
            });

        return new Promise((resolve, reject) => {
            userPromise
                .then((res) => resolve(res))
                .catch((error) => reject(error));
        });
    }
}
