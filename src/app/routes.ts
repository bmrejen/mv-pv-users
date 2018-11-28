import { Routes } from "@angular/router";

import {
  CreateUserFormComponent,
} from "./components/create-user-form/create-user-form.component";
import {
  DisableUserFormComponent,
} from "./components/disable-user-form/disable-user-form.component";

import {
  HomeComponent,
} from "./components";
import {
  UsersComponent,
} from "./components/users/users.component";

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
{
  path: "home",
  component: HomeComponent,
},
{
  path: "users",
  component: UsersComponent,
},
{
  path: "create",
  component: CreateUserFormComponent,
},
{
  path: "disable",
  component: DisableUserFormComponent,
},
{ path: "**", redirectTo: "users" },
];
/* tslint:enable */
