import { appVersion } from "./../app.version";

export class Config {

    /* tslint:disable: max-line-length */
    public static get(value: string, env?: string) {
        let val: any;
        const data = {
            enableProdMode: true,
            version: appVersion,
        };

        if (undefined === env || null == env) {
            env = ("undefined" !== typeof window) ? window.location.hostname : "production";
        }

        switch (env) {
            case "preprod.users.marcovasco.fr":
                data.enableProdMode = false;
                break;
            case "testing.users.marcovasco.fr":
                data.enableProdMode = false;
                break;
            case "users.local":
            case "localhost":
                data.enableProdMode = false;
                break;
            default:
        }

        switch (value) {
            default:
                val = data[value];
        }

        return val;
    }

    public static getEnv() {
        let env = ("undefined" !== typeof window) ? window.location.hostname : "Production";

        switch (env) {
            case "users.marcovasco.fr":
                env = "Production";
                break;
            case "preprod.users.marcovasco.fr":
                env = "Preprod";
                break;
            case "testing.users.marcovasco.fr":
            case "testing.prestige-voyages.com":
                env = "Testing";
                break;
            case "users.local":
                env = "Dev";
            default:
        }

        return env;
    }

    public static getSendAsServerUrl(): string {
        let url;

        switch (this.getEnv()) {
            case "Production":
            case "Preprod":
            case "Testing":
            case "Dev":
            default:
                url = "http://localhost:3000/users";
        }

        return url;
    }

    public static getEndpointUrl(): string {
        let url;

        switch (this.getEnv()) {
            case "Production":
                url = "http://pvcrm.com/c/api/";
                break;
            case "Preprod":
            case "Testing":
            case "Dev":
            default:
                url = "http://sh.pvcrm.com/sugarcrm/sugarcrm/api/";
        }

        return url;
    }
}
