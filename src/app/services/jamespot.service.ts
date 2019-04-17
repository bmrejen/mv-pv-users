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

    public postUsers(user, image): Promise<IJamespotUserConfig> {
        const fd = new FormData();
        fd.append("Mail", user.jamesMail);
        fd.append("Role", user.jamesRole);
        fd.append("Country", user.jamesCountry);
        fd.append("Language", user.jamesLanguage);
        fd.append("active", user.jamesActive);
        fd.append("Pseudo", user.jamesUsername);
        fd.append("Password", user.jamesPassword);
        fd.append("Firstname", user.jamesFirstname);
        fd.append("Lastname", user.jamesLastname.toUpperCase());
        fd.append("Company", user.jamesCompany);
        fd.append("Field1", user.jamesPhoneExtension);
        fd.append("timeZone", user.jamesTimeZone);
        fd.append("image", image);

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
        console.log(user === oldUser);
        let params = new HttpParams()
            .set("idUser", user.idUser);

        for (const key in user) {
            if (user[key] !== null) {

                switch (key) {
                    case "img":
                        if (user[key] === null) {
                            // do not update image in params - it will be updated in Form Data
                        }
                        break;
                    case "password":
                        if (user[key] === null) {
                            // do not update password unless it's been changed
                        }
                        break;
                    case "idUser":
                        // do not update id
                        break;
                    case "phoneExtension":
                        if (user[key] !== oldUser[key]) {
                            params = params.append("field1", user[key]);
                        }
                        break;
                    default:
                        if (user[key] !== oldUser[key]) {
                            params = params.append(key, user[key]);
                        }
                        break;
                }
            }
        }

        const fd = new FormData();
        // update the image in the form data
        if (user.image && user.image !== undefined) {
            fd.append("image", user.image);
        }

        return this.http.put<IJamespotApiResponse<IJamespotUserFromApi>>
            (`${this.endPoint}user/update`, fd, { headers: this.headers, params })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res: IJamespotApiResponse<IJamespotUserFromApi>) => {
                return new Promise<IJamespotUserConfig>((resolve, reject) => {
                    const err = res.RC.MSG;
                    res.RC.CODE === 0 ? resolve(this.mapFromApi(res)) : reject(err);
                });
            });
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
