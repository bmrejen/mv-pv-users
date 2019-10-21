import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class NavbarService {
    public groupsSource = new BehaviorSubject([]);
    public currentGroups = this.groupsSource.asObservable();

    public getGroups(groups) {
        this.groupsSource.next(groups);
    }
}
