import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";

import "../../../node_modules/@types/gapi/index.d.ts";

declare const gapi: any;

@Injectable()
export class GapiAuthenticatorService {
    public API_KEY: string = "AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ";
    public CLIENT_ID: string = "370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com";
    public DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    public SCOPES: string = "https://www.googleapis.com/auth/admin.directory.user.readonly";

    public auth2: any;
    public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private zone: NgZone,
        // private http: HttpClient
    ) { }

    // public validateToken(token: string): Observable<User> {
    //     return this.http.get<User>(`http://localhost:9099/validationApi/${token}`);
    // }

    public signIn(): void {
        this.auth2.signIn()
            .then(
                (user) => {
                    console.log("id token from service", user.getAuthResponse().id_token);
                    // this.validateToken(user.getAuthResponse().id_token).subscribe(user => {
                    this.zone.run(() => {
                        this.user$.next(user);
                        this.isLoggedIn$.next(true);
                        console.log("this.auth2", this.auth2);
                    });
                },
                (err) => console.error("uh-oh", err));
    }

    public signOut(): void {
        this.auth2.signOut()
            .then(() => {
                this.zone.run(() => {
                    this.isLoggedIn$.next(false);
                    this.user$.next(null);
                });
            },
                (err) => {
                    console.error(err);
                });
    }

    public loadAuth2(): void {
        gapi.load("client:auth2", () => {
            console.log("client auth2 loaded");
            gapi.client.init({
                apiKey: this.API_KEY,
                client_id: this.CLIENT_ID,
                // fetch_basic_profile: true,
                discoveryDocs: this.DISCOVERY_DOCS,
                scope: this.SCOPES,
            })
                .then(
                    (auth) => {
                        const isSignedIn = gapi.auth2.getAuthInstance()
                            .isSignedIn
                            .get();
                        console.log("isSignedIn\n", isSignedIn);

                        console.log("loadAuth2 in service\n", auth);
                        console.log("gapi from loadAuth2\n", gapi);

                        this.zone.run(() => {
                            console.log("auth", auth);
                            this.auth2 = auth;
                            this.isLoaded$.next(true);
                        });
                    },
                );
        });
    }

    /* tslint:disable:object-literal-key-quotes */
    public listUsers() {
        gapi.client.directory.users.list({
            "customer": "my_customer",
            "maxResults": 500,
            "orderBy": "email",
        })
            /* tslint:enable:object-literal-key-quotes */
            .then(
                function(response) {
                    const users = response.result.users;
                    console.log("users", users);

                    // appendPre("Users:");

                    // if (users && users.length > 0) {
                    //     for (i = 0; i < users.length; i++) {
                    //         var user = users[i];
                    //         appendPre("-" + user.primaryEmail + " (" + user.name.fullName + ")");
                    //     }
                    // } else {
                    //     appendPre("No users found.");
                    // }
                });
    }

    public loadClient(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                console.log("inside loadClient");
                gapi.load("client:auth2", {
                    callback: resolve,
                    onerror: reject,
                    ontimeout: reject,
                    timeout: 1000, // 5 seconds.
                });
            });
        });
    }
    /* tslint:disable:object-literal-key-quotes */
    public initClient(): Promise<any> {
        const initObj = {
            "apiKey": this.API_KEY,
            "discoveryDocs": this.DISCOVERY_DOCS,
        };
        /* tslint:enable:object-literal-key-quotes */

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.init(initObj)
                    .then(resolve, reject);
            });
        });
    }
}
