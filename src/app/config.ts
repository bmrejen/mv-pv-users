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
        data.enableProdMode     = false;
        break;
      case "testing.users.marcovasco.fr":
        data.enableProdMode     = false;
        break;
      case "users.local":
        data.enableProdMode     = false;
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
}
