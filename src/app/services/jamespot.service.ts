import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RequestOptions } from "@angular/http";
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

    public getUsers(): Observable<any> {
        return this.http.get(`${this.endPoint}user/list`, { headers: this.headers });
    }

    public postUsers(form): Observable<any> {
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

        return this.http.post(`${this.endPoint}user/create`, fd, { headers: this.headers });
    }

    public deleteUser(id: string): Observable<any> {
        const params = new HttpParams()
            .set("idUser", id);

        return this.http.delete(`${this.endPoint}user/delete`, { headers: this.headers, params });
    }
}
