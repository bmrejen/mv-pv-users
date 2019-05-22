import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { IGapiRequest, IGapiUser } from "../interfaces/gapi-user";

import * as jwt from "jsrsasign";
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

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    // tslint:disable-next-line
    public SCOPES: string = "https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group https://mail.google.com/";

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

        if (user.lastName != null
            && user.firstName != null
            && user.ggCurrentUser.primaryEmail != null
        ) {

            return new Promise((resolve, reject) => {
                this.zone.run(() => {
                    gapi.client.directory.users.insert({
                        resource: {
                            name: {
                                familyName: user.lastName,
                                givenName: user.firstName,
                            },
                            orgUnitPath: user.ggCurrentUser.orgas,
                            password: user.password,
                            primaryEmail: user.ggCurrentUser.primaryEmail,
                        },
                    })
                        .then(resolve, reject);
                });
            });
        }
    }

    public updateUser(usr: User, oldUsr: User): Promise<any> {
        const user = usr.ggCurrentUser;
        const oldUser = oldUsr.ggCurrentUser;

        const myObj: IGapiRequest = {
            resource: {},
            userKey: oldUser.id,
        };

        for (const key in usr) {
            if (usr[key] !== null) {
                switch (key) {
                    case "lastName":
                        if (usr[key] !== oldUsr[key]) {
                            if (myObj.resource.name != null) {
                                myObj.resource.name.familyName = usr[key];
                            } else {
                                myObj.resource["name"] = {
                                    familyName: usr[key],
                                };
                            }
                        }
                        break;
                    case "firstName":
                        if (usr[key] !== oldUsr[key]) {
                            if (myObj.resource.name != null) {
                                myObj.resource.name.givenName = usr[key];
                            } else {
                                myObj.resource["name"] = {
                                    givenName: usr[key],
                                };
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        for (const key in user) {
            if (user[key] !== null) {

                switch (key) {
                    case "id":
                    case "sendAs":
                    case "signature":
                        // do not update id. sendAs or signature will be updated in Gmail service
                        break;

                    case "orgas":
                        if (user[key] !== oldUser[key]) {
                            myObj.resource["orgUnitPath"] = user[key];
                            delete myObj[key];
                        }
                        break;
                    default:
                        if (user[key] !== oldUser[key]) {
                            myObj.resource[key] = user[key];
                        }
                        break;
                }
            }
        }

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.directory.users.update(myObj)
                    .then(resolve, reject);
            });
        });
    }

    public updateGmailSendAs(usr: User, oldUsr: User): Promise<any> {
        console.log("updateGmailSendAs ", usr, oldUsr);
        const user = usr.ggCurrentUser;
        const oldUser = oldUsr.ggCurrentUser;

        const body = {};
        // CHECK WHY USER.SENDAS IS SOMETIMES NULL
        const newSendAsEmail = `${user.primaryEmail.split("@")[0]}@${user.sendAs}`;
        console.log("new alias:", newSendAsEmail);

        if (user.sendAs === oldUser.sendAs && user.signature === oldUser.signature) {
            return new Promise((resolve, reject) => reject("Alias and signature unchanged"));
        }

        // If signature has been modified
        if (user.signature !== oldUser.signature) {
            body["signature"] = user.signature;
            console.log("signature has been modified");
        }

        // If alias has been modified
        if (user.sendAs !== oldUser.sendAs) {
            console.log("alias has been modified");

            body["displayName"] = "";
            body["isDefault"] = true;
            body["replyToAddress"] = "";
            body["sendAsEmail"] = newSendAsEmail;
            body["treatAsAlias"] = true;
            body["sub"] = `${usr.ggCurrentUser.primaryEmail}`;
        }

        // Create the alias if it doesn't exist
        if (user.aliases.some((alias) => alias.sendAsEmail === newSendAsEmail)) {
            console.log("alias already exists");

            return this.updateAlias(body);
        } else {
            console.log("creating an alias ");

            return this.createNewAlias(body);
        }
    }

    public updateAlias(body) {
        const email = body.sendAsEmail;
        const primaryEmail = body.sub;

        return this.createToken(primaryEmail)
            .then(() => {
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs/${email}`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

                return this.http.patch(url, body, { headers })
                    .toPromise();
            });
    }

    public createNewAlias(body) {
        const primaryEmail = body.sub;
        console.log("body", body);

        return this.createToken(primaryEmail)
            .then(() => {
                console.log("token has been created:", this.accessToken);
                delete body["sub"];
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

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
                    console.log("getGroups response", res);
                    results.push(...res["result"].groups);
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

    public getUser(user): Promise<any> {
        console.log("getUser service", user);

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.directory.users.get({ userKey: user })
                    .then((res) => resolve(this.mapFromApi(res["result"])))
                    .catch((err) => reject(err));
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

    public activateImap(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.gmail.users.settings.updateImap({
                    resource: {
                        enabled: true,
                    },
                    userId: "me",
                })
                    .then(resolve, reject);
            });
        });
    }

    public deactivateImap(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.gmail.users.settings.updateImap({
                    resource: {
                        enabled: false,
                    },
                    userId: "me",
                })
                    .then(resolve, reject);
            });
        });
    }

    public getImap(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.gmail.users.settings.getImap({
                    userId: "me",
                })
                    .then(resolve, reject);
            });
        });
    }

    public createToken(email) {
        return new Promise((resolve) => setTimeout(resolve, 10000))
            .then(() => {

                console.log("creating a token for the primaryEmail: ", email);
                // Header
                const oHeader = { alg: "RS256", typ: "JWT" };
                // Payload
                const oPayload = {
                    aud: "https://www.googleapis.com/oauth2/v4/token/",
                    exp: jwt.KJUR.jws.IntDate.get("now + 1hour"),
                    iat: jwt.KJUR.jws.IntDate.get("now"),
                    iss: "370957812504-m0eophjpraff16mbnloc330bq7jkm6up@developer.gserviceaccount.com",
                    // tslint:disable-next-line
                    scope: "https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/gmail.settings.sharing https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify",
                    sub: email,
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
                        console.log("Token created", res);
                        this.accessToken = res["access_token"];

                        return this.accessToken;
                    })
                    .catch((err) => console.error("ERROR CREATING TOKEN", err));
            });

    }

    public getUserAliases(email) {
        console.log("getUserAliases for ", email);

        return this.createToken(email)
            .then((rep) => {
                const url = `https://www.googleapis.com/gmail/v1/users/me/settings/sendAs`;
                const headers = new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });

                return this.http.get(url, { headers })
                    .toPromise()
                    .then((res) => {
                        const aliases = res["sendAs"];

                        return aliases;
                    });
            });
    }

    public isAlias(primaryEmail, email, user) {
        let isCurrentUserAnAlias = null;

        const username = email.split("@")[0];
        const primaryUsername = primaryEmail.split("@")[0];

        const planetVeoAliases = user.aliases;
        const otherAliases = user.nonEditableAliases;

        if (planetVeoAliases === undefined
            || email === primaryEmail
            || (otherAliases.includes(email) && username === primaryUsername)) {
            isCurrentUserAnAlias = false;

        } else if (planetVeoAliases.includes(email)
            || (otherAliases.includes(email) && username !== primaryUsername)) {
            isCurrentUserAnAlias = true;

        } else {
            alert("problem checking alias");
        }

        return isCurrentUserAnAlias;
    }
}
