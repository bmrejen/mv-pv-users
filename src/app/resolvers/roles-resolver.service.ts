import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Role } from "../models/role";

@Injectable()

export class RolesResolverService implements Resolve<Promise<Role[]>> {

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<Role[]> {

        const Roles: Promise<Role[]> = this.sugar.getRoles();

        return new Promise((resolve, reject) => {
            Roles
                .then(
                    (res) => resolve(res),
                    (error) => reject("Probleme"));
        });
    }
}
