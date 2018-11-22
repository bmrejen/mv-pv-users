import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "../../src/app.component";

describe("AppComponent", () => {
    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
            imports: [
                RouterTestingModule,
            ],
        })
        .compileComponents();
    }));

    it("should create the component", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component)
            .toBeTruthy();
    }));
});
