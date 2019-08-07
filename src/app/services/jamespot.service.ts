import { User } from "../models/user";
import {
    IJamespotApiResponse,
    IJamespotUserConfig,
    IJamespotUserFromApi,
    IJamespotUserList,
} from "./../interfaces/jamespot-api-response";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()

export class JamespotService {
    public endPoint: string = "https://polevoyages.jamespot.pro/api/server/2.0/";

    public headers: HttpHeaders = new HttpHeaders()
        .append("X-Com-Jamespot-Module-Name", "EXT-MV-User-Admin")
        .append("X-Com-Jamespot-Module-Key", "dAl4fQm52s");

    constructor(private http: HttpClient) {
        //
    }

    public getUsers(): Observable<IJamespotApiResponse<IJamespotUserList[]>> {
        return this.http.get<IJamespotApiResponse<IJamespotUserList[]>>(
            `${this.endPoint}user/list`, { headers: this.headers });
    }

    public getUser(id: string): Promise<any> {
        const params = new HttpParams()
            .set("idUser", id);

        return this.http.get<IJamespotApiResponse<IJamespotUserFromApi>>(
            `${this.endPoint}user/get`, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {
                return new Promise((resolve, reject) => {
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(`User ${id} doesn't exist`);
                });
            });
    }

    public postUsers(user: User): Promise<IJamespotUserConfig> {
        const fd = new FormData();
        // Common properties
        fd.append("Firstname", user.common.firstName);
        fd.append("Lastname", user.common.lastName.toUpperCase());
        fd.append("Pseudo", `${user.common.firstName} ${user.common.lastName.toUpperCase()}`);
        fd.append("Password", user.common.password);

        // Google and Sugar properties
        fd.append("Mail", user.common.email);
        fd.append("Field1", user.sugarCurrentUser.phoneAsterisk);

        fd.append("image", user.jamesCurrentUser.image);
        fd.append("Role", user.jamesCurrentUser.role);
        fd.append("Country", user.jamesCurrentUser.country);
        fd.append("Language", user.jamesCurrentUser.language);
        fd.append("Company", user.jamesCurrentUser.company);
        fd.append("timeZone", user.jamesCurrentUser.timeZone);

        const parseActive = user.jamesCurrentUser.active ? "1" : "0";
        fd.append("active", parseActive);

        return this.http
            .post<IJamespotApiResponse<IJamespotUserFromApi>>(
                `${this.endPoint}user/create`, fd, { headers: this.headers })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {
                return new Promise<IJamespotUserConfig>((resolve, reject) => {
                    const err = res.RC.MSG;
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(err);
                });
            });
    }

    public mapFromApi(res: IJamespotApiResponse<IJamespotUserFromApi>): IJamespotUserConfig {
        return {
            active: res.VAL.properties.active === "1" ? true : false,
            company: res.VAL.properties.company,
            country: res.VAL.Country,
            idUser: res.VAL.idUser,
            img: res.VAL.img,
            language: res.VAL.Language,
            phoneExtension: res.VAL.field1, // phoneExtension
            role: res.VAL.Role,
            timeZone: res.VAL.properties.timeZone,
        };
    }

    public updateUser(user: User, oldUser: User): Promise<IJamespotUserConfig> {
        const params = this.createParamsToUpdate(user, oldUser);

        const fd = new FormData();
        // update the image in the form data
        if (user.jamesCurrentUser.image &&
            user.jamesCurrentUser.image !== oldUser.jamesCurrentUser.image) {
            fd.append("image", user.jamesCurrentUser.image);
        }

        return this.http.put<IJamespotApiResponse<IJamespotUserFromApi>>
            (`${this.endPoint}user/update`, fd, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {
                console.log(res);

                return new Promise<IJamespotUserConfig>((resolve, reject) => {
                    const err = res.RC.MSG;
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(err);
                });
            });
    }

    public createParamsToUpdate(usr: User, oldUsr: User): HttpParams {
        const user = usr.jamesCurrentUser;
        const oldUser = oldUsr.jamesCurrentUser;

        let params = new HttpParams()
            .set("idUser", user.idUser);

        // PASSWORD
        if (usr.common.password !== "") {
            params = params.append("Password", usr.common.password);
        }

        // COMMON PROPERTIES
        for (const key in usr.common) {
            if (usr.common[key] !== oldUsr.common[key]) {
                switch (key) {

                    case "firstName":
                        params = params.append("Firstname", usr.common[key]);
                        break;

                    case "lastName":
                        params = params.append("Lastname", usr.common[key]);
                        break;

                    case "email":
                        params = params.append("Mail", usr.common[key]);
                        break;

                    case "userName":
                        // Username will be updated under
                        break;

                    default:
                        alert("Problem updating common properties in Jamespot");
                        break;
                }
            }
        }

        // Update username
        if (usr.common.firstName !== oldUsr.common.firstName
            || usr.common.lastName !== oldUsr.common.lastName) {
            params = params.append("Pseudo",
                `${usr.common.firstName} ${usr.common.lastName.toUpperCase()}`);
        }

        // Update Jamespot properties
        for (const key in user) {
            if (user[key] !== oldUser[key]) {
                switch (key) {
                    // id, username and image will not be updated (or not here)
                    case "idUser":
                    case "image":
                    case "username":
                        break;

                    // other properties are added to params if they have been edited
                    case "phoneExtension":
                        params = params.append("field1", user[key]);
                        break;

                    case "active":
                        const activeStatus = user[key] === true ? "1" : "0";
                        params = params.append("active", activeStatus);
                        break;

                    case "company":
                        params = params.append("company", user[key]);
                        break;

                    case "country":
                        params = params.append("Country", user[key]);
                        break;

                    case "language":
                        params = params.append("Language", user[key]);
                        break;

                    case "mail":
                        params = params.append("Mail", usr.common.email);
                        break;

                    case "role":
                        params = params.append("Role", user[key]);
                        break;

                    case "timeZone":
                        params = params.append("timeZone", user[key]);
                        break;

                    default:
                        break;
                }
            }
        }

        return params;
    }

    public deleteUser(id: string): Promise<IJamespotApiResponse<any>> {
        const params = new HttpParams()
            .set("idUser", id);

        return this.http
            .delete<IJamespotApiResponse<any>>(`${this.endPoint}user/delete`, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<any>>()
            .then((res) => {

                return new Promise<IJamespotApiResponse<any>>((resolve, reject) => {
                    res["RC"].CODE === 0 ? resolve(res) : reject(res);
                });
            });
    }

    public getByField(field: string, value: string): Promise<IJamespotUserConfig> {
        const params = new HttpParams()
            .set("name", field)
            .append("value", value);

        return this.http.get<IJamespotApiResponse<IJamespotUserFromApi>>(
            `${this.endPoint}user/getByField`, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {

                return new Promise<IJamespotUserConfig>((resolve, reject) => {
                    const err = res.RC.MSG;
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(err);
                });
            });
    }
}