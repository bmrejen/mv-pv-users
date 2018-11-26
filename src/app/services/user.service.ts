import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { IUser } from "../models/user";

@Injectable()
export class UserService {
  private users: IUser[];
  private url: string = "https://jsonplaceholder.typicode.com/users";
  private data: Observable<any>;

  constructor(private http: HttpClient) {
    this.users =   [
    { name: "Ben"},
    { name: "Bob"},
    { name: "Rita"},
    { name: "Ata"},
    ];
  }

  public getUsers(): Observable<IUser[]> {
    console.log("UserService is fetching users...");

    return of(this.users);
  }

  public getRealUsers(): Observable<any> {
    return this.http.get<any>(this.url);
  }

}
