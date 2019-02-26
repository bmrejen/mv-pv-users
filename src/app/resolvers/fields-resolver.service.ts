import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { FieldsService } from "../services/fields.service";

import { Fields } from "../models/fields";

@Injectable()

export class FieldsResolverService implements Resolve<Promise<Fields>> {
  constructor(private fields: FieldsService) {
    //
  }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Promise<Fields> {

    const fields: Promise<Fields> = this.fields.getData();

    return new Promise((resolve, reject) => {
      fields
      .then(
            (res) => resolve(res),
            (error) => reject("Probleme"));
    });
  }
}
