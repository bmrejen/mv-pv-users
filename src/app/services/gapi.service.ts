import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { IGapiUser } from "../interfaces/gapi-user";

declare const gapi: any;

@Injectable()
export class GapiAuthenticatorService {
    public API_KEY: string = "AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ";
    public CLIENT_ID: string = "370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com";
    public DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    public SCOPES: string = "https://www.googleapis.com/auth/admin.directory.user";

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

    public isSignedIn() {
        return gapi.auth2.getAuthInstance().isSignedIn
            .get();
    }

    public postUser(user) {
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
                        primaryEmail: user.primaryEmail,
                    },
                })
                    .then(resolve, reject);
            });
        });
    }

    public updateUser(user: IGapiUser, oldUser: IGapiUser): Promise<any> {
        const myObj = {
            resource: {},
            userKey: oldUser.primaryEmail,
        };

        for (const key in user) {
            if (key === "id") {
                // do not update id
            } else if (key === "password" && user[key] === null) {
                // do not update password if empty
            } else if (key === "primaryEmailSuffix") {
                // do not update primaryEmailSuffix
            } else if (key === "orgas" && user[key] !== oldUser[key]) {
                myObj["orgUnitPath"] = user[key];
            } else {
                if (user[key] !== oldUser[key]) {
                    myObj[key] = user[key];
                }
            }
        }
        myObj.resource["userKey"] = user.id;

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
