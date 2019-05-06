import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { _throw } from "rxjs/observable/throw";
import { catchError } from "rxjs/operators";

import { Destination } from "../models/destination";
import { Role } from "../models/role";
import { Team } from "../models/team";
import { User } from "../models/user";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";

import { ISugarUserConfig } from "./../interfaces/sugar-user";

// Using an interface to work around tslint-prefer-function-over-method rule
interface ISugarService {
    mapUserFromApi(data: any): ISugarUserConfig;
}

@Injectable()
export class SugarService implements ISugarService {
    public roleList: Role[] = [];
    public teamList: Team[] = [];
    public userList: User[] = [];
    public itemList = [];
    private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";
    private postEndPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/users";

    constructor(private http: HttpClient) {
        //
    }

    public getUserById(id): Promise<ISugarUserConfig> {
        return this.getData(`users/${id}`)
            .then((user) => this.mapUserFromApi(user));
    }

    public getUsers(): Promise<User[]> {
        return this.getData("users");
    }

    public getDestinations(): Promise<Destination[]> {
        return this.getData("teams")
            .then((items) => items.filter((item) => item.attributes["name"].startsWith("DESTI - ")));
    }

    public getManagers(): Promise<User[]> {
        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["title"] === "Manager"));
    }

    public getUserByUsername(username): Promise<ISugarUserConfig> {
        console.log("username we are looking for: ", username);

        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["userName"] === username.toLowerCase()))
            .then((user) => this.mapUserFromApi(user[0]));
    }

    public getUserByEmail(email): Promise<User> {
        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["email"] === email))
            .then((user) => user[0]);
    }

    public getUsersByTeam(team): Promise<User[]> {
        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["teamId"] === team));
    }

    public getRoles(): Promise<Role[]> {
        return this.getData("roles");
    }

    public postDataToSugar(body) {
        return this.http.post<any>(this.postEndPoint, body)
            .pipe(catchError(this.errorHandler));
    }

    public errorHandler(error: HttpErrorResponse) {
        return _throw(error);
    }

    public getTeams(): Promise<Team[]> {
        return this.getData("teams")
            .then((items) => items.filter((item) => isTeamMember(item)));
    }

    public mapUserFromApi(data): ISugarUserConfig {
        return {
            codeSonGalileo: data.attributes.codeSonGalileo || "",
            department: data.attributes.department || "",
            email: data.attributes.email || "",
            employeeStatus: data.attributes.employeeStatus || "",
            id: data.attributes.id || "",
            managerId: data.attributes.managerId || "",
            officeId: data.attributes.officeId || "",
            phoneAsterisk: data.attributes.phoneAsterisk || "",
            phoneFax: data.attributes.phoneFax || "",
            phoneHome: data.attributes.phoneHome || "",
            phoneMobile: data.attributes.phoneMobile || "",
            phoneOther: data.attributes.phoneOther || "",
            phoneWork: data.attributes.phoneWork || "",
            salutation: data.attributes.salutation || "",
            status: data.attributes.status || "",
            swAllowRemoteCalls: data.attributes.swAllowRemoteCalls || "",
            swCallNotification: data.attributes.swCallNotification || "",
            swClickToCall: data.attributes.swClickToCall || "",
            teamId: data.attributes.teamId || "",
            title: data.attributes.title || "",
            tourplanID: data.attributes.tourplanID || "",
            type: data.attributes.type || "",
            userName: data.attributes.userName || "",
        };
    }

    private getData(item: string): Promise<any> {
        return this.http.get<any>(this.endPoint + `${item}`)
            .map((array) => array["data"])
            .toPromise();
    }
}

function isTeamMember(item): boolean {
    const prefixTeam = "EQ ";

    return item.attributes["name"].startsWith(prefixTeam);
}
