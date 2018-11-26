import { Routes } from "@angular/router";

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
{ path: "**", redirectTo: "users" },
];
/* tslint:enable */
