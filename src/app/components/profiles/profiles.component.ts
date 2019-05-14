import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { SugarService } from "../../services/sugar.service";

import { SugarUser } from "../../models/sugar-user";
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
    @Input() public sugarCurrentUser;
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
            .then((users) => users.forEach((user) => {
                const userInfo = this.sugarService.mapUserFromApi(user);

                const myUser = new User({});
                myUser.firstName = userInfo.common.firstName;
                myUser.lastName = userInfo.common.lastName;
                myUser.sugarCurrentUser = new SugarUser(userInfo.sugar);

                this.allUsersFromSugar.push(myUser);
            }))

            // filter active users
            .then((users) => this.activeUsersFromSugar = this.allUsersFromSugar
                .filter((user) => user.sugarCurrentUser.status === "Active"))

            // create userTemplates from userlist
            .then((data) => {
                return this.activeUsersFromSugar.map((user) => {
                    return {
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
            .catch((err) => console.error(err));
    }

    public handleClick(type) {
        const others = this.others;
        const orgas = this.orgas;

        switch (type) {
            case "conseiller":
                {
                    this.sugarCurrentUser.userToCopyHPfrom = "user_default";
                    this.sugarCurrentUser.role = "Sales";
                    this.sugarCurrentUser.department = "Ventes";
                    this.checkStuff(others, ["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
                    break;
                }

            case "jm":
                {
                    this.sugarCurrentUser.userToCopyHPfrom = "user_default_jm";

                    this.sugarCurrentUser.role = "Sales";
                    this.sugarCurrentUser.department = "Ventes";
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

                    this.sugarCurrentUser.role = "Team Manager";
                    this.sugarCurrentUser.department = "Ventes";
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
                    this.sugarCurrentUser.role = "Reservation";
                    this.sugarCurrentUser.department = "Ventes";
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
                    this.sugarCurrentUser.office = "Bureau - Billetterie & Qualité";
                    // this.sugarCurrentUser.selectedManager = "Manager du service qualité (Aminata)";

                    this.sugarCurrentUser.role = "Quality Control";
                    this.sugarCurrentUser.department = "Service Qualité";
                    this.checkStuff(others, ["BackOffice", "Global", "SAV"]);
                    this.checkStuff(orgas, ["BackOffice"]);
                    break;
                }
            case "compta":
                {
                    this.sugarCurrentUser.office = "1377";

                    this.sugarCurrentUser.role = "Accountant";
                    this.sugarCurrentUser.department = "Comptabilité";
                    this.checkStuff(others, ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
                    this.checkStuff(orgas, ["Compta"]);
                    break;
                }
            case "inactif":
                {
                    this.sugarCurrentUser.role = "ReadOnly";
                    this.sugarCurrentUser.status = "Inactive";
                    this.sugarCurrentUser.employeeStatus = "Inactive";
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
