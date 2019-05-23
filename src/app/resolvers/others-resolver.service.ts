import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Other } from "../models/other";

@Injectable()

export class OthersResolverService implements Resolve<Promise<Other[]>> {

    constructor(private sugarService: SugarService) {
        //
    }

    public resolve(): Promise<Other[]> {
        return this.sugarService.getOthers();
    }
}
