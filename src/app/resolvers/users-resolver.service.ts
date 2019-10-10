import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { User } from "../models/user";
import { SugarService } from "../services/sugar.service";

@Injectable()

export class UsersResolverService implements Resolve<Promise<User[]>> {

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(): Promise<User[]> {

        return new Promise((resolve, reject) => {
            this.sugar.getUsers()
                .then((res) => resolve(this.sugar.createUsersArray(res)))
                .catch((error) => reject(`Probleme Sugar Users: ${error}`));
        });
    }
}
