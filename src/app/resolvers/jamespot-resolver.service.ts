import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { JamespotService } from "./../services/jamespot.service";

import { Spot } from "./../models/jamespot-spot";

@Injectable()

export class JamespotResolverService implements Resolve<Promise<any>> {
    constructor(private james: JamespotService) {
        //
    }

    public resolve(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.james.getSpots()
                .then((res) => resolve(res))
                .catch((error) => reject(`Problem getting spots: ${error}`));
        });
    }
}
