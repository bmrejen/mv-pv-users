import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

@Injectable()
export class UserService {
  private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";
  private mockUrl: string = this.endPoint + "users/7ac24a6a-1eb1-db9e-e08d-549eec71bc8d";

  constructor(private http: HttpClient) {
    //
  }

  public getUser(): Observable<any> {
    return this.getData(this.mockUrl);
  }

  public getUsersFromSugar(): Observable<any> {
    return this.getData("users");
  }

  public getTeamsFromSugar(): Observable<any> {
    return this.getData("teams");
  }

  public getRolesFromSugar(): Observable<any> {
    return this.getData("roles");
  }

  private getData(item: string): Observable<any> {
    return this.http.get<any>(this.endPoint + `${item}`);
  }
}
