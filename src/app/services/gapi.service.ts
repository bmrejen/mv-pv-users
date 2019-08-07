import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { IGapiRequest, IGapiUser } from "../interfaces/gapi-user";

import * as jwt from "jsrsasign";

import { GoogleUser } from "../models/google-user";
import { User } from "../models/user";

declare const gapi: any;

@Injectable()
export class GapiAuthenticatorService {
    public API_KEY: string = "AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ";
    public CLIENT_ID: string = "370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com";
    public DISCOVERY_DOCS: string[] = [
        "https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest",
        "https://content.googleapis.com/discovery/v1/apis/gmail/v1/rest",
    ];
    public accessToken: string;
    public tokenInfo = {
        primaryEmail: null,
        timeCreated: null,
    };

    public numberOfTimesGetHasFailed: number = 0;

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
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

    public activatePopSettings(primaryEmail) {
        return this.createToken(primaryEmail)
            .then(() => {
                console.log("token created, now activating POP settings");
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/pop`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
                const body = {
                    accessWindow: "allMail",
                    disposition: "markRead",
                };

                return this.http.put(url, body, { headers })
                    .toPromise();
            });
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
        console.log("usr ", usr);
        console.log("oldUsr ", oldUsr);
        const body = {};

        // "sub" property needed for token but will be deleted if a new alias must be created
        body["sub"] = `${usr.ggCurrentUser.primaryEmail}`;

        const newSendAsEmail = `${usr.ggCurrentUser.primaryEmail.split("@")[0]}@${usr.ggCurrentUser.sendAs}`;

        if (usr.ggCurrentUser.sendAs === oldUsr.ggCurrentUser.sendAs
            && usr.ggCurrentUser.signature === oldUsr.ggCurrentUser.signature) {
            return new Promise((resolve, reject) => reject("Alias and signature unchanged"));
        }

        // If signature has been modified
        if (usr.ggCurrentUser.signature !== oldUsr.ggCurrentUser.signature) {
            body["signature"] = usr.ggCurrentUser.signature;
        }

        // If alias has been modified
        if (usr.ggCurrentUser.sendAs !== oldUsr.ggCurrentUser.sendAs) {
            body["displayName"] = `${usr.common.firstName} ${usr.common.lastName}`;
            body["isDefault"] = true;
            body["replyToAddress"] = "";
            body["sendAsEmail"] = newSendAsEmail;
            body["treatAsAlias"] = true;
        }

        // Create the alias if it doesn't exist
        if (usr.ggCurrentUser.aliases.some((alias) => alias.sendAsEmail === newSendAsEmail)) {
            return this.updateAlias(body);
        } else {
            return this.createNewAlias(body);
        }
    }

    public updateAlias(body): Promise<any> {
        const primaryEmail = body.sub;
        console.log("BODY OF REQUEST", body);

        return this.createToken(primaryEmail)
            .then(() => {
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs/${body.sendAsEmail}`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
                delete body.sub;

                return this.http.patch(url, body, { headers })
                    .toPromise();
            });
    }

    public createNewAlias(body): Promise<any> {
        const primaryEmail = body.sub;

        return this.createToken(primaryEmail)
            .then(() => {
                console.log("token has been created:", this.accessToken);
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
                delete body.sub;

                return this.http.post(url, body, { headers })
                    .toPromise();
            });
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
                    .then((resp) => {
                        console.log(resp);

                        return resp;
                    })
                    .then((res) => {
                        this.numberOfTimesGetHasFailed = 0;

                        return resolve(this.mapFromApi(res["result"]));
                    })
                    .catch((err) => {
                        ++this.numberOfTimesGetHasFailed;
                        console.log("numberOfFailures ", this.numberOfTimesGetHasFailed);

                        return this.numberOfTimesGetHasFailed <= 30 ?
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

        return Promise.all(promises);
    }

    public createToken(primaryEmail): Promise<any> {
        const timeNow = jwt.KJUR.jws.IntDate.get("now");

        // if (this.tokenInfo.primaryEmail != null
        //     && this.tokenInfo.timeCreated != null
        //     && (timeNow - this.tokenInfo.timeCreated < 3600)
        //     && (primaryEmail === this.tokenInfo.primaryEmail)) {
        //     console.log("token already exists");

        //     return Promise.resolve(this.accessToken);
        // } else {

        this.accessToken = null;

        console.log("creating a token for the primaryEmail: ", primaryEmail);
        // Header
        const oHeader = { alg: "RS256", typ: "JWT" };
        // Payload
        const oPayload = {
            aud: "https://www.googleapis.com/oauth2/v4/token/",
            exp: jwt.KJUR.jws.IntDate.get("now + 1hour"),
            iat: jwt.KJUR.jws.IntDate.get("now"),
            iss: "370957812504-m0eophjpraff16mbnloc330bq7jkm6up@developer.gserviceaccount.com",
            // tslint:disable-next-line
            scope: "https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/gmail.settings.sharing https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly",
            sub: primaryEmail,
        };

        // Sign JWT
        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);

        // tslint:disable-next-line
        const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCktko8W7B/J6+l\nDQooHSH+IIq6tAIWPKSYjhON4NYD7XTHhSDgcW1qGvaMorPhS2k/UbeR0J3hBzJr\nSuBNLMa9XiHLZ+n8Z3f0j2UBO3QQwSOejSvf38LnloWtV20LY2njAW/9pNys6f9w\njMQSVIBwBOgnBC6UebzNVMsVAq5zm0zBGDIlInUPYP7NQkt5TI+eYsmuveULmm6Q\ntehf6M7krGu958nK207Y3dpvgiZR59mBpwlni9EwOq+zbjL3XC8bUA0ODUcorrxx\nQ8WJ+Mx9aE8nBXdjDz8EfFcD+6ccotwbbsiTFmUv56cLaa1kfj4cmA+me0wC8vBg\nnaHIR/aJAgMBAAECgf9HMb74a5WtOSGVGGZpBAdBFc/NbXdSEZWJvbgsLuU/CG5A\nbPIhmzRXUAF8tK+VlJakgvK4McypqMtTgU7BSAWy+/M9FfJSbBgBHYPjq9jrjGin\nxw6cIjl1Vsu/3Dtjf4snsW2FjcbogIsGX/lMaSZWCfBOnjs1QPNQ4RDmvxC8XQpy\nXuHU+sD8vBiZpclgaF2R1mf8nNfZbPCHiZws8B7Y1PhWLvutGlVdEAjMbJuMVkXP\nbmnuWh9MdL7FGZdWEola27mPkDpZSYy/Dr0ghOV9puKbZNP3wgDkWsHkw848ndFk\nfYV31g4eT7ByXbLKLuyjEnqaRDsa26D0s2epfukCgYEA4e8EAL4grLhmG+xRveci\ng5HoXVFZRVgInplsONpu1M2mXIBtWWDfVycblVkM5d1Ohd/n1Pw3fEdfK/hg2ymg\nofGVRVpYQP73NJMw1rTa5kcWRsG+YDAi4ostExlXI2rnlbnUoIuEerEzHtj4Wh9A\nPWAzBrRi8f87YTp2TDrqikUCgYEAuqGcX+p8YO5dMi/s5lGPGprptMHmCmOqU2gr\nYEectOoytOPJEiaxd7pGSa4W4ao0euNMnKsMT6q+wtRqBvpg/t8jrsvdu4hbq2Hf\nzZI6lgRKOOoawAzRjiKGcbOwgsz2UjHoIB4OWO/ujFDsrIO2yhJypdxZg/SQC3E0\nHRligXUCgYEAnnJqQz8TWS4E5iZIeT7ElLLZ27/2NEx11wxPultuCK2ksxCaH2lx\nmARkMsv94KLgs8CALH0pSG4hT4vkGS9LaOcswTOH2yU0JtnnEVxKe950v/CV241G\nmcvzM4a89qi9euKVPHY71XO6HzMYkNOD0MdLYbNWBNLzSM+gMPvMimUCgYAfcRSo\nMBfuOJoo11wg3UKvp8ORuUzpGStby+Pq34WuEPqj8PAyB6TEV/R5e0PNluAqh9qj\nVknHritfJWwLaukmZy9axmu/qVRQRjfvKSCHn4dlmUMScdZoDLb7ttsY3jDtXg0O\nRCIEp79XkladJb+IwZzhBoNqMKyH0PWHpXwr9QKBgB7YGcXYy8XFW0kwpcu7lSVz\np6dROafSMk4QMljHo8yila1I0Z/TOmHalFhn9Wsafdg4JoYy12Z7OPkngCurhWv9\nCGPf4Q2/Cex5bUsjI67oUTeEkP4+a1BDDqEiUyvmQVWiE5rJZR3WsWK6jpDdHin9\nsyFa9YbHVlwpSCna8LSn\n-----END PRIVATE KEY-----\n";

        const sJWT = jwt.KJUR.jws.JWS.sign("RS256", sHeader, sPayload, privateKey);

        const url = "https://www.googleapis.com/oauth2/v4/token/";
        const headers = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });
        const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${sJWT}`;

        return this.http.post(url, body, { headers })
            .toPromise()
            .then((res) => {
                this.accessToken = res["access_token"];
                this.tokenInfo.timeCreated = oPayload.iat;
                this.tokenInfo.primaryEmail = oPayload.sub;

                console.log("TOKEN CREATED", res, this.tokenInfo);

                return this.accessToken;
            })
            .catch((err) => {
                console.log("Failed. Trying to generate token again");

                return new Promise((resolve) => setTimeout(resolve, 4000))
                    .then(() => Promise.resolve(this.createToken(primaryEmail)));
            });
        // }

    }

    public getUserAliases(email) {
        return this.createToken(email)
            .then((rep) => {
                console.log("token created, now getting aliases and signature");
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

                return this.http.get(url, { headers })
                    .toPromise()
                    .then((res) => {
                        const aliases = res["sendAs"];
                        console.log("GET aliases", aliases);

                        return aliases;
                    })
                    .catch((err) => console.error("error getting aliases and signature", err));
            });
    }

    public isRealUser(primaryEmail, email) {
        return firstNameFromEmail(primaryEmail) === firstNameFromEmail(email);
    }
}

function firstNameFromEmail(email) {
    return email.split("@")[0];
}