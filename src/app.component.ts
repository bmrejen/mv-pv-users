import {
    Component,
} from "@angular/core";

@Component({
    selector: "mv-users",
    template: `
    <div id="mv-users" class="content">
        <mv-navbar></mv-navbar>
        <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {

    public constructor() {
        // constructor
    }
}
