import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { _throw } from "rxjs/observable/throw";
import { catchError } from "rxjs/operators";

import { Role } from "../models/role";
import { Team } from "../models/team";
import { User } from "../models/user";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";

@Injectable()
export class SugarService {
  public roleList: Role[] = [];
  public teamList: Team[] = [];
  public userList: User[] = [];
  public itemList = [];
  private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";

  constructor(private http: HttpClient) {
    //
  }

  public getUserById(id): Promise<User> {
    return this.getData(`users/${id}`);
  }

  public getUsersFromSugar(): Promise<User[]> {
    return this.getData("users");
  }

  public getRolesFromSugar(): Promise<Role[]> {
    return this.getData("roles");
  }

  public postDataToSugar(body) {
    return this.http.post<any>(this.endPoint, body)
    .pipe(catchError(this.errorHandler));
  }

  public errorHandler(error: HttpErrorResponse) {
    return _throw(error);
  }

  private getData(item: string): Promise<any> {
    return this.http.get<any>(this.endPoint + `${item}`)
    .map((array) => array["data"])
    .toPromise();
  }
}
