import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GapiAuthenticatorService } from "../../services/gapi.service";

import * as jwt from "jsrsasign";

enum Domains {
    PL = "planetveo.com",
    MA = "marcovasco.fr",
    CH = "chinaveo.com",
    MR = "marcovasco.com",
    PR = "prestige-voyages.com",
}

@Component({
    selector: "mv-gapi-users",
    styleUrls: ["./gapi-users.component.css"],
    templateUrl: "./gapi-users.component.html",
})

export class GapiUsersComponent implements OnInit {
    public apiLoaded: boolean = false;
    public apiReady: boolean = false;
    public apiFailed: boolean = false;
    public userLoggedIn: string = "Logged out";
    public users;
    public userToGet: string;
    public currentUser;
    public oldUser;
    public orgas;
    public message = null;

    // CREATE
    public newUser = {
        familyName: null,
        givenName: null,
        orgas: null,
        password: null,
        primaryEmail: null,
    };

    public domains = Object.keys(Domains)
        .map((dom) => Domains[dom]);

    constructor(
        private gapiService: GapiAuthenticatorService,
        private route: ActivatedRoute,
    ) {
        //
    }

    public ngOnInit(): void {
        this.resetForm();
        this.route.data
            .subscribe((data) => {
                if (data.fields != null) {
                    this.orgas = data.fields.orgas;
                    console.log(this.currentUser);
                }
            });

        this.gapiService.loadClient()
            .then((result) => {
                this.apiLoaded = true;

                return this.gapiService.initClient();
            })
            .catch((err) => this.apiFailed = true)
            .then((res) => {
                this.apiReady = true;
                this.gapiService.initAuthClient()
                    .then((result: any) => {
                        if (this.isSignedIn()) {
                            this.userLoggedIn = result.currentUser.get().w3.ig;
                        }
                    })
                    .catch((err) => console.log("init auth client error", err));
            });

        // Following method creates JWT token to retrieve token for aacic@planetveo.com
        this.createToken();
    }

    public createToken() {
        // Header
        const oHeader = { alg: "RS256", typ: "JWT" };
        // Payload
        const oPayload = {
            aud: "https://www.googleapis.com/oauth2/v4/token/",
            exp: jwt.KJUR.jws.IntDate.get("now + 1hour"),
            iat: jwt.KJUR.jws.IntDate.get("now"),
            iss: "370957812504-m0eophjpraff16mbnloc330bq7jkm6up@developer.gserviceaccount.com",
            scope: "https://mail.google.com/ https://www.googleapis.com/auth/admin.directory.user",
            sub: "aacic@planetveo.com",
        };

        // Sign JWT, password=616161
        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);

        // tslint:disable-next-line
        const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCktko8W7B/J6+l\nDQooHSH+IIq6tAIWPKSYjhON4NYD7XTHhSDgcW1qGvaMorPhS2k/UbeR0J3hBzJr\nSuBNLMa9XiHLZ+n8Z3f0j2UBO3QQwSOejSvf38LnloWtV20LY2njAW/9pNys6f9w\njMQSVIBwBOgnBC6UebzNVMsVAq5zm0zBGDIlInUPYP7NQkt5TI+eYsmuveULmm6Q\ntehf6M7krGu958nK207Y3dpvgiZR59mBpwlni9EwOq+zbjL3XC8bUA0ODUcorrxx\nQ8WJ+Mx9aE8nBXdjDz8EfFcD+6ccotwbbsiTFmUv56cLaa1kfj4cmA+me0wC8vBg\nnaHIR/aJAgMBAAECgf9HMb74a5WtOSGVGGZpBAdBFc/NbXdSEZWJvbgsLuU/CG5A\nbPIhmzRXUAF8tK+VlJakgvK4McypqMtTgU7BSAWy+/M9FfJSbBgBHYPjq9jrjGin\nxw6cIjl1Vsu/3Dtjf4snsW2FjcbogIsGX/lMaSZWCfBOnjs1QPNQ4RDmvxC8XQpy\nXuHU+sD8vBiZpclgaF2R1mf8nNfZbPCHiZws8B7Y1PhWLvutGlVdEAjMbJuMVkXP\nbmnuWh9MdL7FGZdWEola27mPkDpZSYy/Dr0ghOV9puKbZNP3wgDkWsHkw848ndFk\nfYV31g4eT7ByXbLKLuyjEnqaRDsa26D0s2epfukCgYEA4e8EAL4grLhmG+xRveci\ng5HoXVFZRVgInplsONpu1M2mXIBtWWDfVycblVkM5d1Ohd/n1Pw3fEdfK/hg2ymg\nofGVRVpYQP73NJMw1rTa5kcWRsG+YDAi4ostExlXI2rnlbnUoIuEerEzHtj4Wh9A\nPWAzBrRi8f87YTp2TDrqikUCgYEAuqGcX+p8YO5dMi/s5lGPGprptMHmCmOqU2gr\nYEectOoytOPJEiaxd7pGSa4W4ao0euNMnKsMT6q+wtRqBvpg/t8jrsvdu4hbq2Hf\nzZI6lgRKOOoawAzRjiKGcbOwgsz2UjHoIB4OWO/ujFDsrIO2yhJypdxZg/SQC3E0\nHRligXUCgYEAnnJqQz8TWS4E5iZIeT7ElLLZ27/2NEx11wxPultuCK2ksxCaH2lx\nmARkMsv94KLgs8CALH0pSG4hT4vkGS9LaOcswTOH2yU0JtnnEVxKe950v/CV241G\nmcvzM4a89qi9euKVPHY71XO6HzMYkNOD0MdLYbNWBNLzSM+gMPvMimUCgYAfcRSo\nMBfuOJoo11wg3UKvp8ORuUzpGStby+Pq34WuEPqj8PAyB6TEV/R5e0PNluAqh9qj\nVknHritfJWwLaukmZy9axmu/qVRQRjfvKSCHn4dlmUMScdZoDLb7ttsY3jDtXg0O\nRCIEp79XkladJb+IwZzhBoNqMKyH0PWHpXwr9QKBgB7YGcXYy8XFW0kwpcu7lSVz\np6dROafSMk4QMljHo8yila1I0Z/TOmHalFhn9Wsafdg4JoYy12Z7OPkngCurhWv9\nCGPf4Q2/Cex5bUsjI67oUTeEkP4+a1BDDqEiUyvmQVWiE5rJZR3WsWK6jpDdHin9\nsyFa9YbHVlwpSCna8LSn\n-----END PRIVATE KEY-----\n";

        const sJWT = jwt.KJUR.jws.JWS.sign("RS256", sHeader, sPayload, privateKey);

        console.log("the encoded JWT: ", sJWT);
    }

    public listUsers(): void {
        this.gapiService.listUsers()
            .then((res) => this.users = res.result.users)
            .catch((err) => console.log("error", err));
    }

    public signIn() {
        this.gapiService.signIn()
            .then(() => this.gapiService.initAuthClient()
                .then((result: any) => this.userLoggedIn = result.currentUser.get().w3.ig)
                .catch((err) => console.log("init auth client error", err)),
            );
    }

    public signOut() {
        this.gapiService.signOut()
            .then(() => this.gapiService.initAuthClient()
                .then((result: any) => {
                    if (!this.isSignedIn()) {
                        this.userLoggedIn = "Logged out";
                    }
                })
                .catch((err) => console.log("init auth client error", err)));
    }

    public isSignedIn(): boolean {
        return this.gapiService.isSignedIn();
    }

    public getUser(): void {
        this.resetForm();
        this.gapiService.getUser(this.userToGet)
            .then((res) => {
                console.log(res);
                if (res["result"] != null && res["result"].name != null) {
                    const email = res["result"].primaryEmail;

                    this.currentUser.givenName = res["result"].name.givenName;
                    this.currentUser.familyName = res["result"].name.familyName;
                    this.currentUser.emails = res["result"].emails;
                    this.currentUser.id = res["result"].id;
                    this.currentUser.orgas = res["result"].orgUnitPath;
                    this.currentUser.primaryEmail = email;
                    this.currentUser.primaryEmailSuffix = email.substring(email.lastIndexOf("@") + 1);
                    this.oldUser = { ...this.currentUser };
                }
            })
            .catch((err) => {
                console.error(err);
                if (err["result"] != null && err["result"].error != null) {
                    this.message = err["result"].error.message;
                }
            });
        this.getImap(this.userToGet);
    }

    public postUser() {
        this.message = null;
        this.gapiService.postUser(this.newUser)
            .then((res) => {
                if (res["result"] != null) {
                    this.resetForm();
                    this.userToGet = res["result"].id;
                    this.getUser();
                    this.setUser(res);
                    this.message = "User created !";
                    console.log("res ", res);
                }
            })
            .catch((err) => this.message = err["result"].error.message);
    }

    public updateUser() {
        this.message = null;
        this.gapiService.updateUser(this.currentUser, this.oldUser)
            .then((res) => {
                this.userToGet = res["result"].id;
                this.getUser();
            })
            .catch((err) => console.error(err));
    }

    public trackByFn(index) {
        return index;
    }

    public refreshEmail() {
        const email = this.currentUser.primaryEmail;
        const emailPrefix = email.lastIndexOf("@") === -1 ? email : email.substring(0, email.lastIndexOf("@"));

        this.currentUser.primaryEmail = `${emailPrefix}@${this.currentUser.primaryEmailSuffix}`;
    }

    public resetForm(): void {
        this.message = null;
        this.currentUser = {
            emails: null,
            familyName: null,
            givenName: null,
            id: null,
            orgas: null,
            password: null,
            primaryEmail: "",
            primaryEmailSuffix: "planetveo.com",
        };

        this.newUser = {
            familyName: null,
            givenName: null,
            orgas: null,
            password: null,
            primaryEmail: null,
        };
    }

    public activateImap(id: string) {
        return this.gapiService.activateImap(id)
            .then((res) => console.log("IMAP Activated", res))
            .catch((err) => console.error("IMAP Activation error", err));
    }

    public getImap(id: string) {
        return this.gapiService.getImap(id)
            .then((res) => console.log("IMAP settings", res))
            .catch((err) => console.error("Error when getting IMAP", err));
    }

    public deactivateImap(id: string) {
        return this.gapiService.deactivateImap(id)
            .then((res) => console.log("IMAP settings", res))
            .catch((err) => console.error("Error when getting IMAP", err));
    }

    private setUser(res): void {
        console.log(res);
        this.resetForm();
        if (res["result"] != null && res["result"].name != null) {
            this.currentUser.givenName = res["result"].name.givenName;
            this.currentUser.id = res["result"].id;
            this.currentUser.familyName = res["result"].name.familyName;
            this.currentUser.orgas = res["result"].orgUnitPath;
            this.currentUser.password = null;
            this.currentUser.primaryEmail = res["result"].primaryEmail;
        }
    }
}
