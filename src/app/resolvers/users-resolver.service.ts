import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ISugarConfigAndName } from "../interfaces/sugar-user";
import { SugarService } from "../services/sugar.service";

@Injectable()

export class UsersResolverService implements Resolve<Promise<ISugarConfigAndName[]>> {

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(): Promise<ISugarConfigAndName[]> {

        return new Promise((resolve, reject) => {
            this.sugar.getUsers()
                .then((res) => resolve(res))
                .catch((error) => reject(`Probleme Sugar Users: ${error}`));
        });
    }
}
