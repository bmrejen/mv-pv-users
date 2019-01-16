import {
  Component,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "mv-users",
  template: `
    <div id="mv-users" class="content">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {

  public constructor() {
    // constructor
  }
}
