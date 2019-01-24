import { Routes } from "@angular/router";

import {
  CreateUserFormComponent,
} from "./components/create-user-form/create-user-form.component";
import {
  DisableUserFormComponent,
} from "./components/disable-user-form/disable-user-form.component";
import {
  ImportComponent,
} from "./components/import/import.component";

import {
  HomeComponent,
} from "./components";
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

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
{
  path: "/",
  component: UsersComponent,
},
{
  path: "users/:id",
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
  path: "teams",
  component: TeamsComponent,
},
{
  path: "roles",
  component: RolesComponent,
},
{
  path: "import",
  component: ImportComponent,
},
{ path: "**", redirectTo: "user" },
];
/* tslint:enable */
