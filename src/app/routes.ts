import { Routes } from "@angular/router";

import {
    CreateUserFormComponent,
} from "./components/create-user-form/create-user-form.component";
import {
    DisableUserFormComponent,
} from "./components/disable-user-form/disable-user-form.component";
import { GapiUsersComponent } from "./components/gapi-users/gapi-users.component";
import {
    ImportComponent,
} from "./components/import/import.component";
import { JamespotUsersComponent } from "./components/jamespot-users/jamespot-users.component";

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
import { ManagersResolverService } from "./resolvers/managers-resolver.service";
import { RolesResolverService } from "./resolvers/roles-resolver.service";
import { TeamsResolverService } from "./resolvers/teams-resolver.service";
import { UserResolverService } from "./resolvers/user-resolver.service";
import { UsersResolverService } from "./resolvers/users-resolver.service";

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
    {
        path: "users/:id",
        component: CreateUserFormComponent,
        resolve: {
            destinations: DestinationsResolverService,
            fields: FieldsResolverService,
            managers: ManagersResolverService,
            roles: RolesResolverService,
            user: UserResolverService,
            users: UsersResolverService,
            teams: TeamsResolverService,
        },
    },
    {
        path: "create",
        component: CreateUserFormComponent,
        resolve: {
            destinations: DestinationsResolverService,
            fields: FieldsResolverService,
            managers: ManagersResolverService,
            roles: RolesResolverService,
            teams: TeamsResolverService,
            users: UsersResolverService,
        },
    },
    {
        path: "users",
        component: UsersComponent,
    },
    {
        path: "user",
        component: UserComponent,
    },
    {
        path: "james",
        component: JamespotUsersComponent,
    },
    {
        path: "gapi",
        component: GapiUsersComponent,
    },
    {
        path: "disable/:id",
        component: DisableUserFormComponent,
    },
    {
        path: "disable",
        component: DisableUserFormComponent,
    },
    {
        path: "roles",
        component: RolesComponent,
    },
    {
        path: "import",
        component: ImportComponent,
    },
    { path: "**", redirectTo: "users" },
];
/* tslint:enable */
