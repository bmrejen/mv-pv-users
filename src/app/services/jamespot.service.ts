import {
    IJamespotApiResponse,
    IJamespotUser,
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

    public getUser(id: string): Observable<IJamespotApiResponse<IJamespotUser>> {
        const params = new HttpParams()
            .set("idUser", id);

        return this.http.get<IJamespotApiResponse<IJamespotUser>>(
            `${this.endPoint}user/get`, { headers: this.headers, params });
    }

    public postUsers(user, image): Observable<IJamespotApiResponse<IJamespotUser>> {
        const fd = new FormData();
        fd.append("Mail", user.Mail);
        fd.append("Role", user.Role);
        fd.append("Country", user.Country);
        fd.append("Language", user.Language);
        fd.append("active", user.active);
        fd.append("Pseudo", user.Pseudo);
        fd.append("Password", user.Password);
        fd.append("Firstname", user.Firstname);
        fd.append("Lastname", user.Lastname.toUpperCase());
        fd.append("Company", user.company);
        fd.append("Field1", user.phoneExtension);
        fd.append("timeZone", user.timeZone);
        fd.append("image", image);

        return this.http.post<IJamespotApiResponse<IJamespotUser>>(
            `${this.endPoint}user/create`, fd, { headers: this.headers });
    }

    public updateUser(user, oldUser) {
        let params = new HttpParams()
            .set("idUser", user.idUser);

        for (const key in user) {
            if (key === "img" && user[key] === null) {
                // do not update image in params - it will be updated in Form Data
            } else if (key === "password" && user[key] === null) {
                // do not update password unless it's been changed
            } else if (key === "idUser") {
                // do not update id
            } else if (key === "phoneExtension" && user[key] !== oldUser[key]) {
                params = params.append("field1", user[key]);
            } else {
                if (user[key] !== oldUser[key]) {
                    params = params.append(key, user[key]);
                }
            }
        }

        const fd = new FormData();
        // update the image in the form data
        if (user.image && user.image !== undefined) {
            fd.append("image", user.image);
        }

        return this.http.put(`${this.endPoint}user/update`, fd, { headers: this.headers, params });
    }

    public deleteUser(id: string): Observable<any> {
        const params = new HttpParams()
            .set("idUser", id);

        return this.http.delete(`${this.endPoint}user/delete`, { headers: this.headers, params });
    }

    public getByField(field: string, value: string): Observable<IJamespotApiResponse<IJamespotUser>> {
        const params = new HttpParams()
            .set("name", field)
            .append("value", value);

        return this.http.get<IJamespotApiResponse<IJamespotUser>>(
            `${this.endPoint}user/getByField`, { headers: this.headers, params });
    }
}
