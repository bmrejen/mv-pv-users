import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Team } from "../models/team";

@Injectable()

export class TeamsResolverService implements Resolve<Promise<Team[]>> {

    constructor(private sugar: SugarService) {
        //
    }

    public resolve(): Promise<Team[]> {

        const teams: Promise<Team[]> = this.sugar.getTeams();

        return new Promise((resolve, reject) => {
            teams
                .then((res) => resolve(res))
                .catch((error) => reject(error));
        });
    }
}
