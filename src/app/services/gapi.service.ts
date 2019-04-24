import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { IGapiRequest, IGapiUser } from "../interfaces/gapi-user";

declare const gapi: any;

@Injectable()
export class GapiAuthenticatorService {
    public API_KEY: string = "AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ";
    public CLIENT_ID: string = "370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com";
    public DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    public SCOPES: string = "https://www.googleapis.com/auth/admin.directory.user https://mail.google.com/";

    constructor(
        private zone: NgZone,
        private http: HttpClient,
    ) {
        //
    }

    public getGapi() {
        return gapi;
    }

    public listUsers(): Promise<any> {
        return gapi.client.directory.users.list({
            customer: "my_customer",
            maxResults: 500,
            orderBy: "email",
        });
    }

    public loadClient(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.load("client:auth2", {
                    callback: resolve,
                    onerror: reject,
                    ontimeout: reject,
                    timeout: 1000, // 5 seconds.
                });
            });
        });
    }
    public initClient(): Promise<any> {
        const initObj = {
            apiKey: this.API_KEY,
            discoveryDocs: this.DISCOVERY_DOCS,
        };

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.init(initObj)
                    .then(resolve, reject);
            });
        });
    }

    public initAuthClient(): Promise<any> {
        const initObj = {
            client_id: this.CLIENT_ID,
            scope: this.SCOPES,
        };

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.auth2.init(initObj)
                    .then(resolve, reject);
            });
        });
    }

    public isSignedIn(): boolean {
        return gapi.auth2.getAuthInstance().isSignedIn
            .get();
    }

    public postUser(user): Promise<any> {
        console.log("user in service", user);

        if (user != null && user.givenName != null) {
            const email = `${user.givenName[0]}${user.familyName}@${user.primaryEmail}`;

            return new Promise((resolve, reject) => {
                this.zone.run(() => {
                    gapi.client.directory.users.insert({
                        resource: {
                            name: {
                                familyName: user.familyName,
                                givenName: user.givenName,
                            },
                            orgUnitPath: user.orgas,
                            password: user.password,
                            primaryEmail: email,
                        },
                    })
                        .then(resolve, reject);
                });
            });
        }
    }

    public updateUser(user: IGapiUser, oldUser: IGapiUser): Promise<any> {
        console.log("old user", oldUser);
        const myObj: IGapiRequest = {
            resource: {},
            userKey: oldUser.id,
        };

        for (const key in user) {
            if (user[key] !== null) {

                switch (key) {
                    case "id":
                        // do not update id
                        break;
                    case "primaryEmailSuffix":
                        // do not update primaryEmailSuffix
                        delete myObj[key];
                        break;
                    case "familyName":
                        if (user[key] !== oldUser[key]) {
                            if (myObj.resource.name != null) {
                                myObj.resource.name.familyName = user[key];
                            } else {
                                myObj.resource["name"] = {
                                    familyName: user[key],
                                };
                            }
                        }
                        break;
                    case "givenName":
                        if (user[key] !== oldUser[key]) {
                            if (myObj.resource.name != null) {
                                myObj.resource.name.givenName = user[key];
                            } else {
                                myObj.resource["name"] = {
                                    givenName: user[key],
                                };
                            }
                        }
                        break;
                    case "orgas":
                        if (user[key] !== oldUser[key]) {
                            myObj.resource["orgUnitPath"] = user[key];
                            delete myObj[key];
                        }
                    default:
                        if (user[key] !== oldUser[key]) {
                            myObj.resource[key] = user[key];
                        }
                        break;
                }
            }
        }
        console.log("objet a poster:", myObj);

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.directory.users.update(myObj)
                    .then(resolve, reject);
            });
        });
    }

    public signIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            gapi.auth2.getAuthInstance()
                .signIn()
                .then(resolve, reject);
        });
    }

    public signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            gapi.auth2.getAuthInstance()
                .signOut()
                .then(resolve, reject);
        });
    }

    public getUser(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.directory.users.get({ userKey: user })
                    .then(resolve, reject);
            });
        });
    }
}
