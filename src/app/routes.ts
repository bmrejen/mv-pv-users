import { Routes } from "@angular/router";

import {
  CreateUserFormComponent,
} from "./components/create-user-form/create-user-form.component";
import {
  CredentialsComponent,
} from "./components/credentials/credentials.component";
import {
  DisableUserFormComponent,
} from "./components/disable-user-form/disable-user-form.component";
import {
  ImportComponent,
} from "./components/import/import.component";

import {
  RolesComponent,
} from "./components/roles/roles.component";
import {
  TeamsComponent,
} from "./components/teams/teams.component";
import {
  UserComponent,
} from "./components/user/user.component";
import {
  UsersComponent,
} from "./components/users/users.component";

import { ManagersResolverService } from "./resolvers/managers-resolver.service";
import { SugarResolverService } from "./services/sugar-resolver.service";

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
{
  path: "users/:id",
  component: CreateUserFormComponent,
  resolve: {
    userData: SugarResolverService,
    managers: ManagersResolverService,
  },
},
{
  path: "create",
  component: CreateUserFormComponent,
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
