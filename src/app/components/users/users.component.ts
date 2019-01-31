import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { SugarService } from "../../services/sugar.service";

@Component({
  selector: "mv-app-users",
  styleUrls: ["./users.component.css"],
  templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
  public usersFromSugar: User[] = [];
  public mockList: User[] = [];

  public myJson = {
    data: [
    {
      attributes: {
        codeSonGalileo: "",
        department: "Ventes",
        email: null,
        employeeStatus: "Active",
        firstName: "Justine",
        id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
        lastName: "Chouteau",
        managerId: "",
        officeId: "1009",
        phoneAsterisk: "2083",
        phoneFax: null,
        phoneHome: null,
        phoneMobile: null,
        phoneOther: null,
        phoneWork: "01 56 67 00 83",
        salutation: "",
        status: "Active",
        swCallNotification: "1",
        swClickToCall: "1",
        teamId: "",
        title: null,
        tourplanID: "JCHOUT",
        userName: "jchouteau",
      },
      id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
      type: "users",
    },
    {
      attributes: {
        codeSonGalileo: "",
        department: "Ventes",
        email: null,
        employeeStatus: "Active",
        firstName: "Justine",
        id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
        lastName: "Chouteau",
        managerId: "",
        officeId: "1009",
        phoneAsterisk: "2083",
        phoneFax: null,
        phoneHome: null,
        phoneMobile: null,
        phoneOther: null,
        phoneWork: "01 56 67 00 83",
        salutation: "",
        status: "Active",
        swCallNotification: "1",
        swClickToCall: "1",
        teamId: "",
        title: null,
        tourplanID: "JCHOUT",
        userName: "jchouteau",
      },
      id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
      type: "users",
    },
    {
      attributes: {
        codeSonGalileo: "",
        department: "Ventes",
        email: null,
        employeeStatus: "Active",
        firstName: "Justine",
        id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
        lastName: "Chouteau",
        managerId: "",
        officeId: "1009",
        phoneAsterisk: "2083",
        phoneFax: null,
        phoneHome: null,
        phoneMobile: null,
        phoneOther: null,
        phoneWork: "01 56 67 00 83",
        salutation: "",
        status: "Active",
        swCallNotification: "1",
        swClickToCall: "1",
        teamId: "",
        title: null,
        tourplanID: "JCHOUT",
        userName: "jchouteau",
      },
      id: "4ab50c2e-fce7-8385-2e9f-5c2e85737c1a",
      type: "users",
    },
    ],
  };

  constructor(private sugarService: SugarService) {
    // constructor
  }

  public ngOnInit(): void {
    this.usersFromSugar = this.sugarService.getUsersFromSugar();
    this.myJson.data.forEach((user) => this.mockList.push(new User(user)));
    console.log("mocklist", this.mockList);
  }

  public trackByFn(index, item) {
    const self = this;

    return index; // or item.id
  }
}
