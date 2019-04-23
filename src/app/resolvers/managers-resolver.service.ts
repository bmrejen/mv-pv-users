import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { SugarUser } from "../models/sugar-user";

@Injectable()

export class ManagersResolverService implements Resolve<Promise<SugarUser[]>> {
    public managersFromSugar: SugarUser[] = [];

    constructor(private sugarService: SugarService) {
        //
    }

    public resolve(): Promise<SugarUser[]> {

        return this.sugarService.getManagers()
            .then((users) => {
                users.forEach((user) => {
                    const userInfo = this.sugarService.mapUserFromApi(user);
                    this.managersFromSugar.push(new SugarUser(userInfo));
                });

                return this.managersFromSugar;
            });
    }
}
