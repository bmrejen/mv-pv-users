import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { _throw } from "rxjs/observable/throw";

import { Destination } from "../models/destination";
import { Other } from "../models/other";
import { Role } from "../models/role";
import { Team } from "../models/team";
import { User } from "../models/user";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/toPromise";

import { SugarUser } from "../models/sugar-user";
import { ISugarConfigAndName, ISugarUserToApi } from "./../interfaces/sugar-user";

@Injectable()
export class SugarService {
    public roleList: Role[] = [];
    public teamList: Team[] = [];
    public userList: User[] = [];
    public itemList = [];
    private endPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";
    private postEndPoint: string = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/users";

    constructor(private http: HttpClient) {
        //
    }

    public getUserById(id): Promise<ISugarConfigAndName> {
        return this.getData(`users/${id}`)
            .then((user) => this.mapUserFromApi(user));
    }

    public getUsers(): Promise<any> {
        return this.getData("users");
    }

    public getDestinations(): Promise<Destination[]> {
        return this.getData("teams")
            .then((items) => items.filter((item) => item.attributes["name"].startsWith("DESTI - ")));
    }

    public getManagers(): Promise<User[]> {
        return this.getUsers()
            .then((users) => users.filter((user) => user.attributes.title === "Manager"))
            .then((users) => this.createUsersArray(users));
    }

    public createUsersArray(users): User[] {
        const usersArray = [];
        users.forEach((user) => {
            const userInfo = this.mapUserFromApi(user);

            // Create new user and give it the common properties
            const myUser = new User({});
            myUser.common = userInfo.common;

            // Add a Sugar submodel generated from these common properties
            myUser.sugarCurrentUser = new SugarUser(userInfo.common, userInfo.sugar);

            // Push it to Users array
            usersArray.push(myUser);
        });

        return usersArray;
    }

    public getUserByUsername(username): Promise<any> {
        return this.getData(`users?username=${username}`)
            .then((users) => this.mapUserFromApi(users[0]));
    }

    public getUserByEmail(email): Promise<SugarUser> {
        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["email"] === email))
            .then((user) => user[0]);
    }

    public getUsersByTeam(team): Promise<SugarUser[]> {
        return this.getData("users")
            .then((users) => users.filter((user) => user.attributes["teamId"] === team));
    }

    public getRoles(): Promise<Role[]> {
        return this.getData("roles");
    }

    public postDataToSugar(user: User) {
        return this.http.post<any>(this.postEndPoint, mapCurrentUserToApi(user))
            .toPromise();
    }

    public getTeams(): Promise<Team[]> {
        return this.getData("teams")
            .then((items) => items.filter((item) => isTeamMember(item)));
    }

    public getOthers(): Promise<Other[]> {
        return this.getData("teams")
            .then((items) => items.filter((item) => !isDestOrTeam(item)))
            .then((others) => others.map((other) => other.attributes));
    }

    public mapUserFromApi(data): ISugarConfigAndName {
        return {
            common: {
                email: data.attributes.email,
                firstName: data.attributes.firstName,
                lastName: data.attributes.lastName,
                userName: data.attributes.userName,
            },
            sugar: {
                codeSonGalileo: data.attributes.codeSonGalileo,
                department: data.attributes.department,
                employeeStatus: data.attributes.employeeStatus,
                id: data.attributes.id,
                jamespotId: data.attributes.jamespotId,
                managerId: data.attributes.managerId,
                officeId: data.attributes.officeId,
                phoneAsterisk: data.attributes.phoneAsterisk,
                phoneFax: data.attributes.phoneFax,
                phoneHome: data.attributes.phoneHome,
                phoneMobile: data.attributes.phoneMobile,
                phoneOther: data.attributes.phoneOther,
                phoneWork: data.attributes.phoneWork,
                salutation: data.attributes.salutation,
                status: data.attributes.status,
                swAllowRemoteCalls: data.attributes.swAllowRemoteCalls === "1",
                swCallNotification: data.attributes.swCallNotification === "1",
                swClickToCall: data.attributes.swClickToCall === "1",
                teams: [data.attributes.teamId],
                title: data.attributes.title,
                tourplanID: data.attributes.tourplanID,
                type: data.attributes.type,
            },
        };
    }

    private getData(item: string): Promise<any> {
        return this.http.get<any>(this.endPoint + `${item}`)
            .map((array) => array["data"])
            .toPromise();
    }
}

// --------- FUNCTIONS ------------------

function isTeamMember(item): boolean {
    const prefixTeam = "EQ ";

    return item.attributes["name"].startsWith(prefixTeam);
}

function isDestOrTeam(item): boolean {
    const prefixDest = "DESTI ";
    const prefixTeam = "EQ ";

    return (item.attributes["name"].startsWith(prefixDest) || item.attributes["name"].startsWith(prefixTeam));
}

function mapCurrentUserToApi(user: User): ISugarUserToApi {
    return {
        data: {
            attributes: {
                codeSonGalileo: user.sugarCurrentUser.codeSonGalileo,
                department: user.sugarCurrentUser.department,
                email: user.common.email,
                employeeStatus: user.sugarCurrentUser.employeeStatus,
                firstName: user.common.firstName,
                jamespotId: user.jamesCurrentUser.idUser,
                lastName: user.common.lastName,
                managerId: user.sugarCurrentUser.managerId,
                officeId: user.sugarCurrentUser.officeId,
                phoneAsterisk: user.sugarCurrentUser.phoneAsterisk,
                phoneFax: user.sugarCurrentUser.phoneFax,
                phoneHome: user.sugarCurrentUser.phoneHome,
                phoneMobile: user.sugarCurrentUser.phoneMobile,
                phoneOther: user.sugarCurrentUser.phoneOther,
                phoneWork: user.sugarCurrentUser.phoneWork,
                salutation: user.sugarCurrentUser.salutation,
                status: user.sugarCurrentUser.status,
                swAllowRemoteCalls: user.sugarCurrentUser.swAllowRemoteCalls ? "1" : "0",
                swCallNotification: user.sugarCurrentUser.swCallNotification ? "1" : "0",
                swClickToCall: user.sugarCurrentUser.swClickToCall ? "1" : "0",
                title: user.sugarCurrentUser.title,
                tourplanID: user.sugarCurrentUser.tourplanID,
                userName: user.common.userName,
            },
            destinations: user.sugarCurrentUser.destinations,
            roles: [user.sugarCurrentUser.roleId],
            teams: [...user.sugarCurrentUser.teams, ...user.sugarCurrentUser.others],
            type: "users",
        },
    };
}
