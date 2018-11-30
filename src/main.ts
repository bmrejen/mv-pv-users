import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import { Config } from "./app/config";

import { AppModuleNgFactory } from "./aot/src/app.module.ngfactory";

const isEnabledProdMode = Config.get("enableProdMode");

if (true === isEnabledProdMode) {
  enableProdMode();
}

platformBrowser()
.bootstrapModuleFactory(AppModuleNgFactory);
