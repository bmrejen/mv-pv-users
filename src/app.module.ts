import { APP_BASE_HREF } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app/routes";

import {
  BrowserModule,
  Title,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule } from "@angular/forms";

import {
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";

import {
  LOCALE_ID,
  NgModule,
} from "@angular/core";

import { RouterModule } from "@angular/router";

import { AccountsComponent } from "./app/components/accounts/accounts.component";
import { CheckboxFieldComponent } from "./app/components/checkbox-field/checkbox-field.component";
import { CreateUserFormComponent } from "./app/components/create-user-form/create-user-form.component";
import { CredentialsComponent } from "./app/components/credentials/credentials.component";
import { DestinationsComponent } from "./app/components/destinations/destinations.component";
import { DisableUserFormComponent } from "./app/components/disable-user-form/disable-user-form.component";
import { ExtraneousComponent } from "./app/components/extraneous/extraneous.component";
import { FunctionComponent } from "./app/components/function/function.component";
import { GappsComponent } from "./app/components/gapps/gapps.component";
import { ImportComponent } from "./app/components/import/import.component";
import { ManagerComponent } from "./app/components/manager/manager.component";
import { OfficeComponent } from "./app/components/office/office.component";
import { OthersComponent } from "./app/components/others/others.component";
import { PhonesComponent } from "./app/components/phones/phones.component";
import { ProfilesComponent } from "./app/components/profiles/profiles.component";
import { RolesComponent } from "./app/components/roles/roles.component";
import { SwitchvoxComponent } from "./app/components/switchvox/switchvox.component";
import { TeamsComponent } from "./app/components/teams/teams.component";
import { UserComponent } from "./app/components/user/user.component";
import { UsersComponent } from "./app/components/users/users.component";

import { ManagersResolverService } from "./app/resolvers/managers-resolver.service";
import { FieldsService } from "./app/services/fields.service";
import { ParserService } from "./app/services/parser.service";
import { SugarResolverService } from "./app/services/sugar-resolver.service";
import { SugarService } from "./app/services/sugar.service";
import { SwitchVoxService } from "./app/services/switchvox.service";

import { AlphabeticalPipe } from "./app/pipes/alphabetical.pipe";

import "./app/rxjs-extensions";

@NgModule({
  bootstrap: [
  AppComponent,
  ],
  declarations: [
  AccountsComponent,
  AlphabeticalPipe,
  AppComponent,
  CheckboxFieldComponent,
  CredentialsComponent,
  CreateUserFormComponent,
  DestinationsComponent,
  DisableUserFormComponent,
  ExtraneousComponent,
  FunctionComponent,
  GappsComponent,
  ImportComponent,
  ManagerComponent,
  OfficeComponent,
  OthersComponent,
  PhonesComponent,
  ProfilesComponent,
  RolesComponent,
  SwitchvoxComponent,
  TeamsComponent,
  UserComponent,
  UsersComponent,
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
  ManagersResolverService,
  ParserService,
  SugarService,
  SugarResolverService,
  SwitchVoxService,
  HttpClient,
  { provide: APP_BASE_HREF, useValue: "/" },
  { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
})

export class AppModule { }
