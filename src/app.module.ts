import { APP_BASE_HREF } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import "./app/rxjs-extensions";

import { AppRoutes } from "./app/routes";

import { AppComponent } from "./app.component";

import {
    HomeComponent,
} from "./app/components";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes),
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: LOCALE_ID, useValue: "fr-FR" },
    ],
})

export class AppModule { }
