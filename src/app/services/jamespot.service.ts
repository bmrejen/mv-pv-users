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

    public postUsers(form): Observable<IJamespotApiResponse<IJamespotUser>> {
        const fd = new FormData();
        fd.append("image", form.image);
        fd.append("Mail", form.mail);
        fd.append("Role", form.role);
        fd.append("Country", form.country);
        fd.append("Language", form.language);
        fd.append("active", form.active);
        fd.append("Pseudo", form.pseudo);
        fd.append("Password", form.password);
        fd.append("Firstname", form.firstname);
        fd.append("Lastname", form.lastname.toUpperCase());

        return this.http.post<IJamespotApiResponse<IJamespotUser>>(
            `${this.endPoint}user/create`, fd, { headers: this.headers });
    }

    public updateUser(user, oldUser) {
        let params = new HttpParams()
            .set("idUser", user.idUser);

        for (const key in user) {
            if (key === "img" && user[key] === null) {
                // do not update image in params
            } else if (key === "password" && user[key] === null) {
                // do not update password
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
}
