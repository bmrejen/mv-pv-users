import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SugarService } from "./sugar.service";

import { User } from "../models/user";

@Injectable()

export class SugarResolverService implements Resolve<Promise<User[]>> {
  public myPromise;
  public currentUser: User;

  constructor(private sugar: SugarService) {
    //
  }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Promise<any> {

    const id = route.params.id;

    const userPromise: Promise<User> = this.sugar.getUserById(id);
    const usersPromise: Promise<User[]> = this.sugar.getUsers();

    const promises: [Promise<User>, Promise<User[]>] = [ userPromise, usersPromise ];

    return new Promise((resolve, reject) => {
      Promise.all(promises)
      .then(
            (res) => resolve(res),
            (error) => reject("Probleme"));
    });
  }
}
