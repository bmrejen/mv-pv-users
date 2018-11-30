import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { User } from "../models/user";

@Injectable()
export class UserService {
  private fakeUser: User;
  private url: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/users/7ac24a6a-1eb1-db9e-e08d-549eec71bc8d";
  private data: Observable<any>;

  private myJson = '[{"data":{"type":"users","id":"7ac24a6a-1eb1-db9e-e08d-549eec71bc8d","attributes":{"lastName":"Tranvouez","firstName":"Heloïse","phoneHome":"","phoneMobile":"","phoneWork":"01 76 64 72 32","phoneOther":"","phoneFax":"01 45 75 43 39","phoneAsterisk":"1232","email":"noemail135272@marcovasco.fr" }}}]';
  private obj = JSON.parse(this.myJson);

  constructor(private http: HttpClient) {

  }

  public getFakeUser(): Observable<User> {

    for (const user of this.obj) {
      this.fakeUser = user.data;
    }

    return of(this.fakeUser);
  }

  public getUser(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  public getFakeUsers(): Observable<any> {
    return of([this.myJson, this.myJson, this.myJson]);
  }

}
