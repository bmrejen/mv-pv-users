import { Routes } from "@angular/router";

import {
    CreateUserFormComponent,
} from "./components/create-user-form/create-user-form.component";
import {
    DisableUserFormComponent,
} from "./components/disable-user-form/disable-user-form.component";
import { ImportComponent } from "./components/import/import.component";
import { PrivacyComponent } from "./components/privacy/privacy.component";

import {
    RolesComponent,
} from "./components/roles/roles.component";
import {
    UserComponent,
} from "./components/user/user.component";
import {
    UsersComponent,
} from "./components/users/users.component";

import { DestinationsResolverService } from "./resolvers/destinations-resolver.service";
import { FieldsResolverService } from "./resolvers/fields-resolver.service";
import { JamespotResolverService } from "./resolvers/jamespot-resolver.service";
import { ManagersResolverService } from "./resolvers/managers-resolver.service";
import { OthersResolverService } from "./resolvers/others-resolver.service";
import { RolesResolverService } from "./resolvers/roles-resolver.service";
import { SugarResolverService } from "./resolvers/sugar-resolver.service";
import { TeamsResolverService } from "./resolvers/teams-resolver.service";
import { UsersResolverService } from "./resolvers/users-resolver.service";

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
    {
        path: "create",
        component: CreateUserFormComponent,
        resolve: {
            destinations: DestinationsResolverService,
            fields: FieldsResolverService,
            managers: ManagersResolverService,
            others: OthersResolverService,
            roles: RolesResolverService,
            spots: JamespotResolverService,
            teams: TeamsResolverService,
            users: UsersResolverService,
        },
    },
    {
        path: "users/:id",
        component: CreateUserFormComponent,
        resolve: {
            destinations: DestinationsResolverService,
            fields: FieldsResolverService,
            managers: ManagersResolverService,
            others: OthersResolverService,
            roles: RolesResolverService,
            spots: JamespotResolverService,
            sugarUser: SugarResolverService,
            users: UsersResolverService,
            teams: TeamsResolverService,
        },
    },
    {
        path: "users",
        component: UsersComponent,
        resolve: {
            destinations: DestinationsResolverService,
            fields: FieldsResolverService,
            managers: ManagersResolverService,
            others: OthersResolverService,
            roles: RolesResolverService,
            users: UsersResolverService,
            teams: TeamsResolverService,
        },
    },
    {
        path: "privacy",
        component: PrivacyComponent,
    },
    {
        path: "user",
        component: UserComponent,
    },
    {
        path: "disable/:id",
        component: DisableUserFormComponent,
    },
    {
        path: "disable",
        component: DisableUserFormComponent,
        resolve: {
            users: UsersResolverService,
        },
    },
    {
        path: "roles",
        component: RolesComponent,
    },
    {
        path: "import",
        component: ImportComponent,
    },
    { path: "**", redirectTo: "create" },
];
/* tslint:enable */
