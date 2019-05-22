import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";

import { SugarService } from "../../services/sugar.service";

import { GoogleUser } from "../../models/google-user";
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
    @Input() public sugarCurrentUser: SugarUser;
    @Input() public roles;
    @Input() public userTemplates;
    @Input() public departments;
    @Input() public orgas;
    @Input() public others;
    @Input() public ggCurrentUser: GoogleUser;

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

    public pushOthersToUser(others: string[]) {
        others.forEach((other) => {
            const myOther = this.others.find((oth) => oth.name === other);
            this.sugarCurrentUser.others.push(myOther.id);
        });
    }

    public pushRoleToUser(roleName: string) {
        const myRole = this.roles.find((role) => role.name === roleName);
        this.sugarCurrentUser.roleId = myRole.id;
    }

    public handleClick(type) {
        this.resetProfiles();

        switch (type) {
            case "conseiller":
                {
                    this.sugarCurrentUser.userToCopyHPfrom = "user_default";
                    this.pushRoleToUser("Sales");
                    this.sugarCurrentUser.department = "Ventes";
                    this.pushOthersToUser(["Global", "Ventes", "Devis Cotation", "ROLE - Reservation"]);
                    break;
                }

            case "jm":
                {
                    this.sugarCurrentUser.userToCopyHPfrom = "user_default_jm";

                    this.pushRoleToUser("Sales");
                    this.sugarCurrentUser.department = "Ventes";
                    this.pushOthersToUser([
                        "Global",
                        "Ventes",
                        "Devis Cotation",
                        "ROLE - BI Validation",
                        "ROLE - View RCM",
                        "ROLE - View RM",
                        "Ventes",
                    ]);
                    this.sugarCurrentUser.functionId = "jm";
                    break;
                }
            case "manager":
                {
                    this.pushRoleToUser("Team Manager");
                    this.sugarCurrentUser.department = "Ventes";
                    this.pushOthersToUser([
                        "Global",
                        "Devis Cotation", "Devis V3",
                        "ROLE - BI Validation",
                        "Ventes",
                    ]);
                    this.sugarCurrentUser.functionId = "mgr";
                    break;
                }
            case "assistant":
                {
                    this.pushRoleToUser("Reservation");
                    this.sugarCurrentUser.department = "Ventes";
                    this.pushOthersToUser([
                        "Devis V3",
                        "Devis Cotation",
                        "Global",
                        "Reservation",
                        "ROLE - Reservation",
                    ]);
                    this.sugarCurrentUser.functionId = "av";
                    break;
                }
            case "qualite":
                {
                    this.sugarCurrentUser.officeId = "1006";
                    this.sugarCurrentUser.managerId = "c2a40794-67cc-c26a-1626-5abcfc134aa5";
                    this.pushRoleToUser("Quality Control");
                    this.sugarCurrentUser.department = "Service Qualité";
                    this.pushOthersToUser(
                        ["Backoffice", "Global", "SAV"]);
                    this.ggCurrentUser.orgas = "/BackOffice";
                    this.sugarCurrentUser.functionId = "aq";

                    break;
                }
            case "compta":
                {
                    this.sugarCurrentUser.officeId = "1377";
                    this.pushRoleToUser("Accountant");
                    this.sugarCurrentUser.department = "Comptabilité";
                    this.pushOthersToUser(
                        ["Global", "ROLE - Affaire Validation", "ROLE - Create Provider"]);
                    this.ggCurrentUser.orgas = "/Compta";
                    break;
                }
            case "inactif":
                {
                    this.pushRoleToUser("ReadOnly");
                    this.sugarCurrentUser.status = "Inactive";
                    this.sugarCurrentUser.employeeStatus = "Inactive";
                    break;
                }

            default:
                // code...
                break;
        }
    }

    public resetProfiles() {
        this.sugarCurrentUser.userToCopyHPfrom = "";
        this.sugarCurrentUser.roleId = "";
        this.sugarCurrentUser.department = "";
        this.sugarCurrentUser.functionId = null;
        this.sugarCurrentUser.officeId = "";
        this.sugarCurrentUser.others = [];
        this.ggCurrentUser.orgas = null;
        this.sugarCurrentUser.status = "Active";
        this.sugarCurrentUser.employeeStatus = "Active";
    }

    public trackByFn(item) {
        return item.id;
    }

}
