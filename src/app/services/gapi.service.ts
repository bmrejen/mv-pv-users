import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Config } from "../config";
import { IGapiRequest, IGapiUser } from "../interfaces/gapi-user";

import * as jwt from "jsrsasign";

import { GoogleUser } from "../models/google-user";
import { User } from "../models/user";
import { Keys } from "./../keys";

declare const gapi: any;

@Injectable()
export class GapiAuthenticatorService {
    public API_KEY: string = Keys.getApiKey();
    public CLIENT_ID: string = Keys.getClientId();
    public DISCOVERY_DOCS: string[] = [
        "https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest",
        "https://content.googleapis.com/discovery/v1/apis/gmail/v1/rest",
    ];
    public accessToken: string;

    public numberOfTimesGetHasFailed: number = 0;
    public numberOfTimesCreateAliasHasFailed: number = 0;
    public numberOfTimesGetAliasesHasFailed: number = 0;

    public userSendAsUrl: string = Config.getSendAsServerUrl();

    // tslint:disable-next-line
    public SCOPES: string = "https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group https://www.googleapis.com/auth/admin.directory.group.member https://mail.google.com/";

    constructor(private zone: NgZone, private http: HttpClient) {
        //
    }

    public getGapi() {
        return gapi;
    }

    public listUsers(): Promise<any> {
        console.log("listUsers");

        return gapi.client.directory.users.list({
            customer: "my_customer",
            maxResults: 500,
            orderBy: "email",
        });
    }

    public loadClient(): Promise<any> {
        console.log("loadClient");

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
        console.log("initClient");

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
        console.log("initAuthClient ");

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

    public postUser(user: User): Promise<any> {

        if (user.common.lastName != null
            && user.common.firstName != null
            && user.ggCurrentUser.primaryEmail != null
        ) {

            return new Promise((resolve, reject) => {
                this.zone.run(() => {
                    gapi.client.directory.users.insert({
                        resource: {
                            name: {
                                familyName: user.common.lastName,
                                givenName: user.common.firstName,
                            },
                            orgUnitPath: user.ggCurrentUser.orgas,
                            password: user.common.password,
                            primaryEmail: user.ggCurrentUser.primaryEmail,
                        },
                    })
                        .then(resolve, reject);
                });
            });
        }
    }

    public getPopSettings(primaryEmail) {
        return this.createToken(primaryEmail)
            .then(() => {
                console.log("token created, now GETTING POP settings");

                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/pop`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

                return this.http.get(url, { headers })
                    .toPromise();
            });
    }

    public updateUser(usr: User, oldUsr: User): Promise<any> {
        const ggCurrentUser = usr.ggCurrentUser;
        const ggOldUser = oldUsr.ggCurrentUser;

        console.log("UPDATING GAPI USER", usr, oldUsr);

        const myObj: IGapiRequest = {
            resource: {},
            userKey: ggOldUser.id,
        };

        // Update first and last name
        for (const key in usr.common) {
            if (usr.common[key] !== oldUsr.common[key]) {
                switch (key) {
                    case "lastName":
                        if (myObj.resource.name != null) {
                            myObj.resource.name.familyName = usr.common[key];
                        } else {
                            myObj.resource["name"] = {
                                familyName: usr.common[key],
                            };
                        }
                        break;
                    case "firstName":
                        if (myObj.resource.name != null) {
                            myObj.resource.name.givenName = usr.common[key];
                        } else {
                            myObj.resource["name"] = {
                                givenName: usr.common[key],
                            };
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        // Update orgas
        for (const key in ggOldUser) {
            if (ggOldUser[key] !== ggCurrentUser[key]) {

                switch (key) {
                    case "primaryEmail":
                    case "nonEditableAliases":
                    case "id":
                    case "sendAs":
                    case "signature":
                    case "aliases":
                    case "googleGroups":
                        // do not update id. sendAs or signature will be updated in Gmail service
                        break;

                    case "orgas":
                        myObj.resource["orgUnitPath"] = ggCurrentUser[key];
                        break;
                    default:
                        alert("Problem updating Google Admin SDK");
                        break;
                }
            }
        }

        console.log("myObj", myObj);

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                return gapi.client.directory.users.update(myObj)
                    .then(resolve, reject);
            });
        });
    }

    public updateGmailSendAs(usr: User, oldUsr: User): Promise<any> {
        console.log("updateGmailSendAs ", usr, oldUsr);
        const body = {};

        const primaryEmail = `${usr.ggCurrentUser.primaryEmail}`;

        const newSendAsEmail = `${usr.ggCurrentUser.primaryEmail.split("@")[0]}@${usr.ggCurrentUser.sendAs}`;

        if (usr.ggCurrentUser.sendAs === oldUsr.ggCurrentUser.sendAs
            && usr.ggCurrentUser.signature === oldUsr.ggCurrentUser.signature) {
            return new Promise((resolve, reject) => reject("Alias and signature unchanged"));
        }

        // If signature has been modified
        if (usr.ggCurrentUser.signature !== oldUsr.ggCurrentUser.signature) {
            body["signature"] = usr.ggCurrentUser.signature;
        }

        // If alias or signature have been modified
        if (usr.ggCurrentUser.sendAs !== oldUsr.ggCurrentUser.sendAs ||
            usr.ggCurrentUser.signature !== oldUsr.ggCurrentUser.signature) {
            body["displayName"] = `${usr.common.firstName} ${usr.common.lastName}`;
            body["isDefault"] = true;
            body["sendAsEmail"] = newSendAsEmail;
            body["treatAsAlias"] = true;
            body["replyToAddress"] = newSendAsEmail;
        }

        // Create the alias if it doesn't exist
        if (usr.ggCurrentUser.aliases !== [] &&
            usr.ggCurrentUser.aliases.some((alias) => alias.sendAsEmail === newSendAsEmail)) {
            return this.updateAlias(primaryEmail, body, "patch");
        } else {
            return this.updateAlias(primaryEmail, body, "post");
        }
    }

    public createGmailSendAs(usr: User): Promise<any> {
        console.log("updateGmailSendAs ", usr);
        const body = {};

        const primaryEmail = `${usr.ggCurrentUser.primaryEmail}`;
        const newSendAsEmail = `${usr.ggCurrentUser.primaryEmail.split("@")[0]}@${usr.ggCurrentUser.sendAs}`;

        body["signature"] = usr.ggCurrentUser.signature;
        body["displayName"] = `${usr.common.firstName} ${usr.common.lastName}`;
        body["isDefault"] = true;
        body["sendAsEmail"] = newSendAsEmail;
        body["treatAsAlias"] = true;
        body["replyToAddress"] = newSendAsEmail;

        return this.updateAlias(primaryEmail, body, "post");
    }

    public updateAlias(primaryEmail, body, method): Promise<any> {
        console.log("primaryEmail, body, method ", primaryEmail, body, method);

        let url = "https://www.googleapis.com/gmail/v1/users/me/settings/sendAs/";
        if (method === "patch") {
            url += body.sendAsEmail;
        }

        const objectForServer = {
            body,
            method,
            primaryEmail,
            url,
        };
        console.log("ON POSTE LAAAAAAAAAAA", this.userSendAsUrl);

        return this.http.post(this.userSendAsUrl, objectForServer)
            .toPromise()
            .then((res) => console.log("POSTED TO LOCAL SERVER", res))
            .catch((err) => console.error("ERROR FROM LOCAL SERVER", err));
    }

    public getGroups(mail?): Promise<any[]> {
        // 2 requests are run in a row because Google only sends 200 results per response
        const body = {
            customer: "my_customer",
            maxResults: 200,
            orderBy: "email",
        };

        if (mail != null) {
            body["userKey"] = mail;
            delete body.customer;
        }

        const results = [];
        // tslint:disable-next-line
        const pageToken = "CkeMnpaMlpq_j5OekZqLiZqQ0ZyQkv8A_piYmKDPz8_Pz8-bycaZm5zLms_O_wD-__7_mJiYoM_Pz8_Pz5vJxpmbnMuaz87__hDKASE0KsyTpKSjjVACWgsJ3PYWI7ot48AQA2Dz2sJU";

        return new Promise((resolve, reject) => {

            gapi.client.directory.groups.list(body)
                .then((res) => {

                    return results.push(...res["result"].groups);
                })
                .then((_) => {
                    body["pageToken"] = pageToken;

                    return gapi.client.directory.groups.list(body)
                        .then((res) => {
                            results.push(...res["result"].groups);

                            resolve(results);
                        })
                        .catch((err) => reject(err));
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

    public getUser(primaryEmail): Promise<any> {
        console.log("getUser service", primaryEmail);

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.directory.users.get({ userKey: primaryEmail })
                    .then((res) => {
                        this.numberOfTimesGetHasFailed = 0;
                        console.log("getUser service response", res);

                        return resolve(this.mapFromApi(res["result"]));
                    })
                    .catch((err) => {
                        ++this.numberOfTimesGetHasFailed;
                        console.log("numberOfFailures ", this.numberOfTimesGetHasFailed);

                        return this.numberOfTimesGetHasFailed <= 3 ?
                            resolve(this.getUser(primaryEmail)) : reject(err);
                    });
            });
        });
    }

    public mapFromApi(res): IGapiUser {
        return {
            emails: res.emails,
            id: res.id,
            nonEditableAliases: res.nonEditableAliases,
            orgas: res.orgUnitPath,
            primaryEmail: res.primaryEmail,
        };
    }

    public updateGoogleGroups(user: User, oldUser: User): Promise<any> {
        const promises = [];

        user.ggCurrentUser.googleGroups.forEach((group) => {
            if (!oldUser.ggCurrentUser.googleGroups
                .includes(group)) {
                console.log(`group ${group.name} has been added`);
                promises.push(new Promise((resolve, reject) => {
                    this.zone.run(() => {
                        return gapi.client.directory.members.insert({
                            groupKey: group.id,
                            resource: {
                                email: user.ggCurrentUser.primaryEmail,
                            },
                        })
                            .then(resolve, reject);
                    });
                }),
                );
            }
        });

        oldUser.ggCurrentUser.googleGroups.forEach((group) => {
            if (!user.ggCurrentUser.googleGroups.includes(group)) {
                console.log(`group ${group.name} was deleted`);
                promises.push(new Promise((resolve, reject) => {
                    this.zone.run(() => {
                        return gapi.client.directory.members.delete({
                            groupKey: group.id,
                            memberKey: user.ggCurrentUser.primaryEmail,
                        })
                            .then(resolve, reject);
                    });
                }));
            }
        });
        console.log("promises", promises);

        return Promise.all(promises)
            .then((res) => res);
    }

    public postGoogleGroups(user: GoogleUser): Promise<any> {
        const promises: Array<Promise<any>> = [];

        user.googleGroups.forEach((group) => {
            promises.push(new Promise((resolve, reject) => {
                this.zone.run(() => {
                    return gapi.client.directory.members.insert({
                        groupKey: group.id,
                        resource: {
                            email: user.primaryEmail,
                        },
                    })
                        .then(resolve, reject);
                });
            }),
            );
        });

        return Promise.all(promises)
            .then((res) => console.log("google groups posted", res));
    }

    public createToken(primaryEmail): Promise<any> {
        this.accessToken = null;

        console.log("creating a token for the primaryEmail: ", primaryEmail);
        // Header
        const oHeader = { alg: "RS256", typ: "JWT" };
        // Payload
        const oPayload = {
            aud: "https://www.googleapis.com/oauth2/v4/token/",
            exp: jwt.KJUR.jws.IntDate.get("now + 1hour"),
            iat: jwt.KJUR.jws.IntDate.get("now"),
            iss: Keys.getIss(),
            // tslint:disable-next-line
            scope: "https://mail.google.com https://www.googleapis.com/auth/admin.directory.group https://www.googleapis.com/auth/admin.directory.orgunit https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.settings.sharing",
            sub: primaryEmail,
        };

        // Sign JWT
        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);

        const privateKey = Keys.getPrivateKey();

        const sJWT = jwt.KJUR.jws.JWS.sign("RS256", sHeader, sPayload, privateKey);

        const url = "https://www.googleapis.com/oauth2/v4/token/";
        const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });
        const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${sJWT}`;

        return this.http.post(url, body, { headers })
            .toPromise()
            .then((res) => {
                this.accessToken = res["access_token"];

                console.log("TOKEN CREATED", res);

                return this.accessToken;
            })
            .catch((err) => err);
    }

    public getUserAliases(email) {
        return this.createToken(email)
            .then((rep) => {
                console.log("token created, now getting aliases and signature");
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

                return this.http.get<any[]>(url, { headers })
                    .toPromise()
                    .then((res) => {
                        const aliases = res["sendAs"];
                        console.log("GET aliases", aliases);
                        this.numberOfTimesGetAliasesHasFailed = 0;

                        return aliases;
                    })
                    .catch((err) => {
                        console.log("error getting aliases and signature. Trying again...", err);
                        ++this.numberOfTimesGetAliasesHasFailed;

                        if (this.numberOfTimesGetAliasesHasFailed <= 3) {
                            Promise.resolve(setTimeout(() => this.getUserAliases(email), 1000));
                        } else { return []; }
                    });
            });
    }

    public isRealUser(primaryEmail, email) {
        return firstNameFromEmail(primaryEmail) === firstNameFromEmail(email);
    }

    public disableUser(primaryEmail: string) {
        const myObj: IGapiRequest = {
            resource: {
                orgUnitPath: "/X Partis",
            },
            userKey: primaryEmail,
        };

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                return gapi.client.directory.users.update(myObj)
                    .then(resolve, reject);
            });
        });
    }
}

function firstNameFromEmail(email) {
    return email.split("@")[0];
}
