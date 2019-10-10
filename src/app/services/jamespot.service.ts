import { User } from "../models/user";
import { Spot } from "./../models/jamespot-spot";

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

    // : Promise<IJamespotUserConfig>
    public postUsers(user: User) {
        const fd = new FormData();
        // Common properties
        fd.append("Firstname", capitalize(user.common.firstName));
        fd.append("Lastname", user.common.lastName.toUpperCase());
        fd.append("Pseudo", capitalize(`${user.common.firstName} ${user.common.lastName}`));
        fd.append("Password", user.common.password);

        // Google and Sugar properties
        fd.append("Mail", user.common.email);
        fd.append("Field1", user.sugarCurrentUser.phoneAsterisk);
        fd.append("image", user.jamesCurrentUser.image);
        fd.append("Role", user.jamesCurrentUser.role);
        fd.append("Country", user.jamesCurrentUser.country);
        fd.append("Company", user.jamesCurrentUser.company);
        fd.append("PhoneNumber", user.sugarCurrentUser.phoneWork);
        fd.append("MobileNumber", user.sugarCurrentUser.phoneMobile);
        fd.append("Department", user.jamesCurrentUser.teams.join(", "));    // Teams
        fd.append("Function", user.sugarCurrentUser.department);
        fd.append("Gender", user.sugarCurrentUser.salutation);
        fd.append("Field2", user.common.email);
        fd.append("TimeZone", user.jamesCurrentUser.timeZone);
        fd.append("Language", user.jamesCurrentUser.language);
        fd.append("Field4", user.jamesCurrentUser.destinations.join(", "));  // Destinations
        fd.append("Field3", user.jamesCurrentUser.birthDate);  // Birth date
        fd.append("Field5", user.jamesCurrentUser.skypeUsername);  // Pseudo Skype
        fd.append("tag_5", Object.keys(user.jamesCurrentUser.city)[0]); // Ville de travail
        fd.append("tag_8", Object.keys(user.jamesCurrentUser.service)[0]); // Service
        fd.append("tag_2", Object.keys(user.jamesCurrentUser.expertiseZone)[0]); // Zone d'expertises
        fd.append("businessManagementManager", `user/${user.jamesCurrentUser.managerJamespotId}`);
        // Jamespot id of manager, eg. user/258

        // *** Empty fields ***
        fd.append("Site", "");
        fd.append("Description", "");   // Présence en entreprise
        fd.append("DateOfBirth", "");   // Empty field, use Field3 instead
        fd.append("Profile", "");
        fd.append("Communities", "");
        fd.append("classifiedAdTypeOfContract", ""); // Type de contrat - CDD, CDI, CTT
        fd.append("userBanner", ""); // must be file

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
            })
            .then((res: IJamespotUserConfig) => this.postUserGroups(res, user.jamesCurrentUser.spots));
    }

    public postUserGroups(res: IJamespotUserConfig, spots: Spot[]) {
        const responses = [];

        spots.forEach((spot) => {
            let params = new HttpParams()
                .set("idUser", res.idUser);
            params = params.append("idSpot", spot.id);
            params = params.append("Level", "3");   // 0 Fondateur, 1 Admin, 2 Redacteur, 3 Membre, 4 Non-membre
            this.http.get(`${this.endPoint}spot/setUserLevel`, { headers: this.headers, params })
                .toPromise()
                .then((response) => responses.push(response));
        });

        return {
            groups: responses,
            user: res,
        };
    }

    public mapFromApi(res: IJamespotApiResponse<IJamespotUserFromApi>): IJamespotUserConfig {
        return {
            active: res.VAL.properties.active === "1" ? true : false,
            birthDate: res.VAL.field3,
            city: res.VAL.properties.tag_5,
            company: res.VAL.properties.company,
            country: res.VAL.Country,
            destinations: [res.VAL.field4],
            expertiseZone: res.VAL.properties.tag_2,
            function: res.VAL.properties.function,
            idUser: res.VAL.idUser,
            img: res.VAL.img,
            language: res.VAL.Language,
            managerJamespotId: res.VAL.properties.businessManagementManager,
            phoneExtension: res.VAL.field1,
            role: res.VAL.Role,
            service: res.VAL.properties.tag_8,
            skypeUsername: res.VAL.field5,
            teams: [res.VAL.properties.department],
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

    public disableUser(idUser: string): Promise<IJamespotUserFromApi> {
        return this.http.put<IJamespotApiResponse<IJamespotUserFromApi>>
            (`${this.endPoint}user/update?idUser=${idUser}&active=1`, {}, { headers: this.headers })
            .toPromise<IJamespotApiResponse<IJamespotUserFromApi>>()
            .then((res) => new Promise<IJamespotUserFromApi>((resolve, reject) => {
                if (res.RC.CODE === 0) {
                    resolve(res.VAL);
                } else {
                    reject(res);
                }
            }));
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
                        params = params.append("Firstname", capitalize(usr.common[key]));
                        break;

                    case "lastName":
                        params = params.append("Lastname", usr.common[key].toUpperCase());
                        break;

                    case "email":
                        params = params.append("Mail", usr.common[key]);
                        break;

                    case "userName":
                        // do nothing - userName is updated lower
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
            params = params.append("Pseudo", capitalize(`${usr.common.firstName} ${usr.common.lastName}`));

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

                    case "destinations":
                        params = params.append("Field4", user.destinations.join(", "));
                        break;
                    case "birthDate":
                        params = params.append("Field3", user.birthDate);
                        break;
                    case "skypeUsername":
                        params = params.append("Field5", user.skypeUsername);
                        break;
                    case "managerJamespotId":
                        params = params.append("businessManagementManager",
                            `user/${user.managerJamespotId}`);
                        break;

                    // *** FOLLOWING FIELDS ARE CURRENTLY DISABLED ***
                    case "expertiseZone":
                        // params = params.append("tag_2", Object.keys(user.expertiseZone)[0]);
                        break;
                    case "city":
                        // params = params.append("tag_5", Object.keys(user.city)[0]);
                        break;
                    case "service":
                        // params = params.append("tag_8", Object.keys(user.service)[0]);
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

    public getSpots() {
        return this.http.get(`./src/app/assets/jamespot-groups.json`)
            .map((res) => res["data"])
            .toPromise();
    }
}

function capitalize(s) {
    if (typeof s !== "string") {
        return "";
    }

    return s.split(/ /)
        .map((word) => word.charAt(0)
            .toUpperCase() + word.toLowerCase()
                .slice(1))
        .join(" ");
}
