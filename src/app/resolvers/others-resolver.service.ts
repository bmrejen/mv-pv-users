import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Team } from "../models/team";

@Injectable()

export class OthersResolverService implements Resolve<Promise<Team[]>> {

    constructor(private sugarService: SugarService) {
        //
    }

    public resolve(): Promise<Team[]> {
        return this.sugarService.getOthers();
    }
}
