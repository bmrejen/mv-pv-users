import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { User } from "../models/user";

@Injectable()

export class UserResolverService implements Resolve<Promise<User>> {
    public currentUser: User;

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(route: ActivatedRouteSnapshot): Promise<User> {

        const id = route.params.id;
        const userPromise: Promise<User> = this.sugar.getUserById(id);

        return new Promise((resolve, reject) => {
            userPromise
                .then(
                    (res) => resolve(res),
                    (error) => reject("Probleme"));
        });
    }
}
