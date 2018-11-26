import { APP_BASE_HREF } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app/routes";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  BrowserModule,
  Title,
} from "@angular/platform-browser";

import { HomeComponent } from "./app/components";

import {
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";

import {
  LOCALE_ID,
  NgModule,
} from "@angular/core";

import { RouterModule } from "@angular/router";
import { UserComponent } from "./app/components/user/user.component";
import { UsersComponent } from "./app/components/users/users.component";
import { UserService } from "./app/services/user.service";

import "./app/rxjs-extensions";

@NgModule({
  bootstrap: [
  AppComponent,
  ],
  declarations: [
  AppComponent,
  HomeComponent,
  UserComponent,
  UsersComponent,
  ],
  imports: [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  RouterModule.forRoot(AppRoutes),
  ],
  providers: [
  UserService,
  HttpClient,
  { provide: APP_BASE_HREF, useValue: "/" },
  { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
})

export class AppModule { }
