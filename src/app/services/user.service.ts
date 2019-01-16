import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { _throw } from "rxjs/observable/throw";
import { catchError } from "rxjs/operators";

@Injectable()
export class UserService {
  private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";

  constructor(private http: HttpClient) {
    //
  }

  public getUsersFromSugar(): Observable<any> {
    return this.getData("users");
  }

  public getUserById(id): Observable<any> {
    return this.getData(`users/${id}`);
  }

  public getTeamsFromSugar(): Observable<any> {
    return this.getData("teams");
  }

  public getRolesFromSugar(): Observable<any> {
    return this.getData("roles");
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
