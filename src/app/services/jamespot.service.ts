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

    public postUsers(user): Promise<IJamespotUserConfig> {
        const fd = new FormData();
        fd.append("Firstname", user.firstName);
        fd.append("Lastname", user.lastName.toUpperCase());
        fd.append("image", user.image);

        fd.append("Mail", user.jamesCurrentUser.mail);
        fd.append("Role", user.jamesCurrentUser.role);
        fd.append("Country", user.jamesCurrentUser.country);
        fd.append("Language", user.jamesCurrentUser.language);
        fd.append("active", user.jamesCurrentUser.active);
        fd.append("Pseudo", user.jamesCurrentUser.username);
        fd.append("Password", user.jamesCurrentUser.password);
        fd.append("Company", user.jamesCurrentUser.company);
        fd.append("Field1", user.jamesCurrentUser.phoneExtension);
        fd.append("timeZone", user.jamesCurrentUser.timeZone);

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
            active: res.VAL.properties.active,
            company: res.VAL.properties.company,
            country: res.VAL.Country,
            firstname: res.VAL.Firstname,
            idUser: res.VAL.idUser,
            img: res.VAL.img,
            language: res.VAL.Language,
            lastname: res.VAL.Lastname,
            mail: res.VAL.Mail,
            password: null, // password
            phoneExtension: res.VAL.field1, // phoneExtension
            role: res.VAL.Role,
            timeZone: res.VAL.properties.timeZone,
            username: res.VAL.Pseudo,
        };
    }

    public mapJamespotUserToUserConfig(res: IJamespotUserConfig) {
        return {
            jamesActive: res.active,
            jamesCompany: res.company,
            jamesCountry: res.country,
            jamesFirstname: res.firstname,
            jamesIdUser: res.idUser,
            jamesImg: res.img,
            jamesLanguage: res.language,
            jamesLastname: res.lastname,
            jamesMail: res.mail,
            jamesPassword: res.password,
            jamesPhoneExtension: res.phoneExtension,
            jamesRole: res.role,
            jamesTimeZone: res.timeZone,
            jamesUsername: res.username,
        };
    }

    public updateUser(user, oldUser): Promise<IJamespotUserConfig> {
        const params = this.createParamsToUpdate(user, oldUser);

        const fd = new FormData();
        // update the image in the form data
        if (user.image && user.image !== undefined) {
            fd.append("image", user.image);
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

    public createParamsToUpdate(user, oldUser): HttpParams {
        let params = new HttpParams()
            .set("idUser", user.jamesIdUser);

        for (const key in user) {
            if (user[key] !== null) {
                switch (key) {
                    // id will not be updated
                    case "jamesIdUser":
                        break;

                    // image is not updated in params - it will be updated in Form Data
                    case "jamesImg":
                        break;

                    // password updated if it's been inputted
                    case "jamesPassword":
                        if (user[key] != null) {
                            params = params.append("Password", user[key]);
                        }
                        break;

                    // other properties are added to params if they have been edited
                    case "jamesPhoneExtension":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("field1", user[key]);
                        }
                        break;

                    case "jamesActive":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("active", user[key]);
                        }
                        break;

                    case "jamesCompany":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("company", user[key]);
                        }
                        break;

                    case "jamesCountry":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Country", user[key]);
                        }
                        break;

                    case "jamesFirstname":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Firstname", user[key]);
                        }
                        break;

                    case "jamesLastname":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Lastname", user[key]);
                        }
                        break;

                    case "jamesLanguage":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Language", user[key]);
                        }
                        break;

                    case "jamesMail":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Mail", user[key]);
                        }
                        break;

                    case "jamesRole":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Role", user[key]);
                        }
                        break;

                    case "jamesTimeZone":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("timeZone", user[key]);
                        }
                        break;

                    case "jamesUsername":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("Pseudo", user[key]);
                        }
                        break;

                    default:
                        alert("Problem creating the params in the JamespotUpdate service");
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

    public disableUser(id: string): Promise<IJamespotUserConfig> {
        const params = new HttpParams()
            .set("idUser", id)
            .append("active", "0");

        return this.http.put<IJamespotApiResponse<IJamespotUserFromApi>>
            (`${this.endPoint}user/update`, null, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {
                return new Promise<IJamespotUserConfig>((resolve, reject) => {
                    const err = res.RC.MSG;
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(err);
                });
            });
    }
}
