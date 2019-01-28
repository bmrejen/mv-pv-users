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
  public userList: User[] = [];
  private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";

  constructor(private http: HttpClient) {
    //
  }

  public getUserById(id): Promise<User> {
    return this.getData(`users/${id}`)
    .map((user) => user.data)
    .map((user) => new User(
                            user.type,
                            user.id,
                            user.attributes))
    .toPromise()
    .catch((err) => {
      console.error(err);
      throw(err);
    });
  }

  public createUserList(): User[] {
    this.getUsersFromSugar()
    .subscribe((users) => {
      users.data.forEach((user) => {
        this.userList.push(new User(
                                    user.type,
                                    user.id,
                                    user.attributes.userName,
                                    user.attributes.salutation,
                                    user.attributes.lastName,
                                    user.attributes.firstName,
                                    user.attributes.phoneHome,
                                    user.attributes.phoneMobile,
                                    user.attributes.phoneWork,
                                    user.attributes.phoneOther,
                                    user.attributes.phoneFax,
                                    user.attributes.phoneAsterisk,
                                    user.attributes.email,
                                    user.attributes.status,
                                    user.attributes.employeeStatus,
                                    user.attributes.title,
                                    user.attributes.managerId,
                                    user.attributes.department,
                                    user.attributes.officeId,
                                    user.attributes.teamId,
                                    user.attributes.tourplanID,
                                    user.attributes.swClickToCall,
                                    user.attributes.swCallNotification,
                                    user.attributes.codeSonGalileo,
                                    ));
      });
      console.log("USERLIST", this.userList);
    });

    return this.userList;
  }

  public getTeamsFromSugar(): Team[] {
    this.getData("teams")
    .subscribe((teams) => {
      teams.data.forEach((team) => {
        this.roleList.push(new Role(
                                    team.type,
                                    team.id,
                                    team.attributes.name,
                                    team.attributes.description));
      });
    });

    return this.roleList;
  }

  public getRolesFromSugar(): Role[] {
    this.getData("roles")
    .subscribe((roles) => {
      roles.data.forEach((role) => {
        this.roleList.push(new Role(
                                    role.type,
                                    role.id,
                                    role.attributes.name,
                                    role.attributes.description));
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

  private getUsersFromSugar(): Observable<any> {
    return this.getData("users");
  }

  private getData(item: string): Observable<any> {
    return this.http.get<any>(this.endPoint + `${item}`);
  }
}
