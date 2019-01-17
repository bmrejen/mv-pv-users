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

import { CheckboxFieldComponent } from "./app/components/checkbox-field/checkbox-field.component";
import { CreateUserFormComponent } from "./app/components/create-user-form/create-user-form.component";
import { DisableUserFormComponent } from "./app/components/disable-user-form/disable-user-form.component";
import { ImportComponent } from "./app/components/import/import.component";

import { RolesComponent } from "./app/components/roles/roles.component";
import { TeamsComponent } from "./app/components/teams/teams.component";
import { UserComponent } from "./app/components/user/user.component";
import { UsersComponent } from "./app/components/users/users.component";
import { FieldsService } from "./app/services/fields.service";
import { ParserService } from "./app/services/parser.service";
import { SwitchVoxService } from "./app/services/switchvox.service";
import { SugarService } from "./app/services/sugar.service";

import "./app/rxjs-extensions";

@NgModule({
  bootstrap: [
  AppComponent,
  ],
  declarations: [
  AppComponent,
  HomeComponent,
  ImportComponent,
  UserComponent,
  UsersComponent,
  CheckboxFieldComponent,
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
  ParserService,
  SugarService,
  SwitchVoxService,
  HttpClient,
  { provide: APP_BASE_HREF, useValue: "/" },
  { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
})

export class AppModule { }
