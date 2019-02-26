import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { Destination } from "../models/destination";

@Injectable()

export class DestinationsResolverService implements Resolve<Promise<Destination[]>> {

  constructor(private sugar: SugarService) {
    //
  }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Promise<Destination[]> {

    const destinations: Promise<Destination[]> = this.sugar.getDestinations();

    return new Promise((resolve, reject) => {
      destinations
      .then(
            (res) => resolve(res),
            (error) => reject("Probleme"));
    });
  }
}
