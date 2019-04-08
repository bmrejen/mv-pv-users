import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Role } from "../models/role";

@Injectable()

export class RolesResolverService implements Resolve<Promise<Role[]>> {

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(): Promise<Role[]> {

        const Roles: Promise<Role[]> = this.sugar.getRoles();

        return new Promise((resolve, reject) => {
            Roles
                .then((res) => resolve(res))
                .catch((error) => reject("Probleme"));
        });
    }
}
