import { Routes } from "@angular/router";

import {
    HomeComponent,
} from "./components";

/* tslint:disable object-literal-sort-keys */
export const AppRoutes: Routes = [
    {
        path: "home",
        component: HomeComponent,
    },
    { path: "**", redirectTo: "home" },
];
/* tslint:enable */
