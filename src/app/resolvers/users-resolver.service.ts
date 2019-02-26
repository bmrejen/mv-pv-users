import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SugarService } from "../services/sugar.service";

import { User } from "../models/user";

@Injectable()

export class UsersResolverService implements Resolve<Promise<User[]>> {

  constructor(private sugar: SugarService) {
    //
  }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Promise<User[]> {

    const users: Promise<User[]> = this.sugar.getUsers();

    return new Promise((resolve, reject) => {
      users
      .then(
            (res) => resolve(res),
            (error) => reject("Probleme"));
    });
  }
}
