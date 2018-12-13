import { APP_BASE_HREF } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app/routes";

import {
  BrowserModule,
  Title,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule } from "@angular/forms";
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

import { CreateUserFormComponent } from "./app/components/create-user-form/create-user-form.component";
import { DisableUserFormComponent } from "./app/components/disable-user-form/disable-user-form.component";

import { RolesComponent } from "./app/components/roles/roles.component";
import { TeamsComponent } from "./app/components/teams/teams.component";
import { UserComponent } from "./app/components/user/user.component";
import { UsersComponent } from "./app/components/users/users.component";
import { FieldsService } from "./app/services/fields.service";
import { SwitchVoxService } from "./app/services/switchvox.service";
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
  CreateUserFormComponent,
  DisableUserFormComponent,
  RolesComponent,
  TeamsComponent,
  ],
  imports: [
  BrowserModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  RouterModule.forRoot(AppRoutes),
  ],
  providers: [
  FieldsService,
  SwitchVoxService,
  UserService,
  HttpClient,
  { provide: APP_BASE_HREF, useValue: "/" },
  { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
})

export class AppModule { }
