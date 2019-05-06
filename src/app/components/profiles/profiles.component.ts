import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { SugarService } from "../../services/sugar.service";

import { User } from "../../models/user";

@Component({
    selector: "mv-profiles",
    templateUrl: "./profiles.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: NgForm,
        },
    ],
})

export class ProfilesComponent implements OnInit {
    @Input() public currentUser;
    @Input() public selectedFunction;
    @Input() public selectedOffice;
    @Input() public roles;
    @Input() public userTemplates;
    @Input() public departments;
    @Input() public orgas;
    @Input() public others;

    public hideLeads = true;
    public allUsersFromSugar: User[] = [];
    public activeUsersFromSugar: User[];

    constructor(private sugarService: SugarService) {
        //
    }

    public ngOnInit(): void {
        this.populateUserInheritance();
    }

    public populateUserInheritance() {
        this.sugarService.getUsers()

            // populate usersFromSugar array
            .then((users) => users.forEach((user) => this.allUsersFromSugar.push(new User(user))))

            // filter active users
            .then((users) => this.activeUsersFromSugar = this.allUsersFromSugar
                .filter((user) => user.sugarCurrentUser.status === "Active"))

            // create userTemplates from userlist
            .then((data) => {
                return this.activeUsersFromSugar.map((user) => {
                    return {
                        label: user.sugarCurrentUser.userName,
                        selected: false,
                        value: user.sugarCurrentUser.userName,
                    };
                });
            })

            // push them into fields
            .then((templates) => {
                if (templates !== undefined && templates !== null) {
                    this.userTemplates.push(...templates);
                }
            })
            .catch((err) => console.log(err));
    }

    public handleClick(type) {
        const others = this.others;
        const orgas = this.orgas;

        switch (type) {
            case "conseiller":
                {
                    this.currentUser.userToCopyHPfrom = "user_default";
                    this.currentUser.role = "Sales";
                    this.currentUser.department = "Ventes";
                    this.checkStuff(others, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
                    break;
                }

            case "jm":
                {
                    this.currentUser.userToCopyHPfrom = "user_default_jm";
                    this.selectedFunction = "jm";

                    this.currentUser.role = "Sales";
                    this.currentUser.department = "Ventes";
                    this.checkStuff(others,
                        [
                            "Global",
                            "Ventes",
                            "Devis Cotation",
                            "ROLE - BI Validation",
                            "ROLE - ViewRCM",
                            "ROLE - View RM",
                            "Ventes",
                        ],
                    );
                    break;
                }
            case "manager":
                {
                    this.selectedFunction = "mgr";

                    this.currentUser.role = "Team Manager";
                    this.currentUser.department = "Ventes";
                    this.checkStuff(others, [
                        "Global",
                        "Devis Cotation", "Devis V3",
                        "ROLE - BI Validation",
                        "Ventes",
                    ],
                    );
                    break;
                }
            case "assistant":
                {
                    this.selectedFunction = "av";
                    this.currentUser.role = "Reservation";
                    this.currentUser.department = "Ventes";
                    this.checkStuff(others, [
                        "Devis V3",
                        "Devis Cotation",
                        "Global",
                        "Reservation",
                        "ROLE - Reservation",
                    ]);
                    break;
                }
            case "qualite":
                {
                    this.selectedFunction = "aq";
                    this.currentUser.office = "Bureau - Billetterie & Qualité";
                    this.currentUser.selectedManager = "Manager du service qualité (Aminata)";

                    this.currentUser.role = "Quality Control";
                    this.currentUser.department = "Service Qualité";
                    this.checkStuff(others, ["BackOffice", "Global", "SAV"]);
                    this.checkStuff(orgas, ["BackOffice"]);
                    break;
                }
            case "compta":
                {
                    this.currentUser.office = "1377";

                    this.currentUser.role = "Accountant";
                    this.currentUser.department = "Comptabilité";
                    this.checkStuff(others, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
                    this.checkStuff(orgas, ["Compta"]);
                    break;
                }
            case "inactif":
                {
                    this.currentUser.role = "ReadOnly";
                    this.currentUser.status = "Inactive";
                    this.currentUser.employeeStatus = "Inactive";
                    break;
                }

            default:
                // code...
                break;
        }
    }

    public checkStuff(where, arr) {
        let prefix;
        switch (where) {
            case this.orgas:
                prefix = "orgas";
                break;
            case this.others:
                prefix = "others";
                break;

            default:
                console.error("Wrong input");
                break;
        }
        arr.forEach((element) => {
            const myOther = where.find((other) => other.id === `${prefix}-${element}`);
            if (!!myOther) { myOther.checked = true; }
        });
    }

    public trackByFn(item) {
        return item.id;
    }
}
