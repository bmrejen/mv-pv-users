import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { User } from "../models/user";

@Injectable()

export class ManagersResolverService implements Resolve<Promise<User[]>> {
    public managersFromSugar: User[] = [];

    constructor(private sugarService: SugarService) {
        //
    }

    public resolve(): Promise<User[]> {

        return this.sugarService.getManagers()
            .then((users) => {
                users.forEach((user) => this.managersFromSugar.push(new User(user)));

                return this.managersFromSugar;
            });
    }
}
