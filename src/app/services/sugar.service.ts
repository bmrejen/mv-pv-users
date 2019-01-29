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
    return this.getData(`users/${id}`)
    .map((data) => new User(data))
    .toPromise()
    .catch((err) => {
      console.error(err);
      throw(err);
    });
  }

  public getUsersFromSugar(): User[] {
    this.getData("users")
    .subscribe((users) => {
      users.data.forEach((user) => {
        this.userList.push(new User(user));
      });
      console.log("USERLIST", this.userList);
    });

    return this.userList;
  }

  public getTeamsFromSugar(): Team[] {
    this.getData("teams")
    .subscribe((teams) => {
      teams.data.forEach((team) => {
        this.teamList.push(new Team(team));
      });
    });

    return this.teamList;
  }

  public getRolesFromSugar(): Role[] {
    this.getData("roles")
    .subscribe((roles) => {
      roles.data.forEach((role) => {
        this.roleList.push(new Role(role));
      });
    });

    return this.roleList;
  }

  public postDataToSugar(body) {
    return this.http.post<any>(this.endPoint, body)
    .pipe(catchError(this.errorHandler));
  }

  public errorHandler(error: HttpErrorResponse) {
    return _throw(error);
  }

  private getData(item: string): Observable<any> {
    return this.http.get<any>(this.endPoint + `${item}`);
  }
}
