import { APP_BASE_HREF } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app/routes";

import {
    BrowserModule,
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
import { GapiUsersComponent } from "./app/components/gapi-users/gapi-users.component";
import { GappsComponent } from "./app/components/gapps/gapps.component";
import { ImportComponent } from "./app/components/import/import.component";
import { JamespotGroupsComponent } from "./app/components/jamespot-groups/jamespot-groups.component";
import { JamespotUsersComponent } from "./app/components/jamespot-users/jamespot-users.component";
import { ManagerComponent } from "./app/components/manager/manager.component";
import { NavbarComponent } from "./app/components/navbar/navbar.component";
import { OfficeComponent } from "./app/components/office/office.component";
import { OthersComponent } from "./app/components/others/others.component";
import { PhonesComponent } from "./app/components/phones/phones.component";
import { PrivacyComponent } from "./app/components/privacy/privacy.component";
import { ProfilesComponent } from "./app/components/profiles/profiles.component";
import { RolesComponent } from "./app/components/roles/roles.component";
import { TeamsComponent } from "./app/components/teams/teams.component";
import { UserComponent } from "./app/components/user/user.component";
import { UsersComponent } from "./app/components/users/users.component";

import { DestinationsResolverService } from "./app/resolvers/destinations-resolver.service";
import { FieldsResolverService } from "./app/resolvers/fields-resolver.service";
import { JamespotResolverService } from "./app/resolvers/jamespot-resolver.service";
import { ManagersResolverService } from "./app/resolvers/managers-resolver.service";
import { OthersResolverService } from "./app/resolvers/others-resolver.service";
import { RolesResolverService } from "./app/resolvers/roles-resolver.service";
import { SugarResolverService } from "./app/resolvers/sugar-resolver.service";
import { TeamsResolverService } from "./app/resolvers/teams-resolver.service";
import { UsersResolverService } from "./app/resolvers/users-resolver.service";
import { ValidateUserService } from "./app/services/validate-user.service";

import { FieldsService } from "./app/services/fields.service";
import { GapiAuthenticatorService } from "./app/services/gapi.service";
import { JamespotService } from "./app/services/jamespot.service";
import { NavbarService } from "./app/services/navbar.service";
import { ParserService } from "./app/services/parser.service";
import { SugarService } from "./app/services/sugar.service";
import { SwitchVoxService } from "./app/services/switchvox.service";
import { UserPopulaterService } from "./app/services/user-populater.service";

import { AlphabeticalPipe } from "./app/pipes/alphabetical.pipe";

// import { NavbarComponentModule } from "./app/components/navbar/navbar.module";

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
        GapiUsersComponent,
        GappsComponent,
        ImportComponent,
        JamespotGroupsComponent,
        JamespotUsersComponent,
        ManagerComponent,
        NavbarComponent,
        OfficeComponent,
        OthersComponent,
        PhonesComponent,
        PrivacyComponent,
        ProfilesComponent,
        RolesComponent,
        TeamsComponent,
        UserComponent,
        UsersComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        // NavbarComponentModule,
        RouterModule.forRoot(AppRoutes),
    ],
    providers: [
        DestinationsResolverService,
        FieldsService,
        FieldsResolverService,
        GapiAuthenticatorService,
        JamespotResolverService,
        JamespotService,
        ManagersResolverService,
        NavbarService,
        OthersResolverService,
        ParserService,
        RolesResolverService,
        SugarResolverService,
        SugarService,
        SwitchVoxService,
        TeamsResolverService,
        UserPopulaterService,
        UsersResolverService,
        ValidateUserService,
        HttpClient,
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: LOCALE_ID, useValue: "fr-FR" },
    ],
})

export class AppModule { }
