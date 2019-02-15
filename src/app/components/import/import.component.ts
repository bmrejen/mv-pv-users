import { Component, OnInit } from "@angular/core";
import { ParserService } from "../../services/parser.service";

import { User } from "../../models/user";

@Component({
  selector: "mv-import",
  styleUrls: ["./import.component.css"],
  templateUrl: "./import.component.html",
})

export class ImportComponent implements OnInit {

  public numberOfFields = 22;
  public users: User[] = [];
  public usersData;

  // tslint:disable:max-line-length
  public csv = '"Cindy","Guerineau","","New","Ventes","","","cguerineau@marcovasco.fr","01 76 64 72 87","1287","cg11215!","","cguerineau","0","0","Active","0","Active","0","1","15","45","Coralie","Viarnes","","New","Ventes","","","cviarnes@marcovasco.fr","01 56 67 01 00","2100","cv19833!","","cviarnes","0","0","Active","0","Active","0","1","15","45","Nejma","Mebarki","","New","Ventes","","","nmebarki@marcovasco.fr","01 76 64 72 92","1292","nm62684!","","nmebarki","0","0","Active","0","Active","0","1","15","45","Fanny","Marh-Zhoock","","New","Ventes","","","farhzhoock@marcovasco.fr","01 56 67 00 88","2088","fm48032!","","farhzhoock","0","0","Active","0","Active","0","1","15","45"';
  // tslint:enable:max-line-length

  constructor(private parserService: ParserService) {
    //
  }

  public parse(d) {

    const raw = this.parserService.getData(d);
    if (raw.length % this.numberOfFields !== 0) {
      alert(`Wrong number of values. Each user should have ${this.numberOfFields} values`);

      return ;
    }

    this.usersData = this.chunkArray(raw, this.numberOfFields);

    this.usersData.forEach((user) => {
      const myObj = {};
      const [
      firstname,
      lastname,
      id,
      functionId,
      serviceId,
      officeId,
      tourplanID,
      email,
      phoneWork,
      phoneAsterisk,
      password,    // not in user model
      managerId,
      userName,
      isAdmin,
      apiPortalUser,
      status,
      assignationNotification,
      employeeStatus,
      groupUser,       // not in user model
      numberOfTeams,    // not in user model
      leadsMin,
      leadsMax,
      ] = [ ...user ];

      myObj["firstname"] = firstname;
      myObj["lastname"] = lastname;
      myObj["id"] = id;
      myObj["functionId"] = functionId;
      myObj["serviceId"] = serviceId;
      myObj["officeId"] = officeId;
      myObj["tourplanID"] = tourplanID;
      myObj["email"] = email;
      myObj["phoneWork"] = phoneWork;
      myObj["phoneAsterisk"] = phoneAsterisk;
      myObj["password"] = password;
      myObj["managerId"] = managerId;
      myObj["userName"] = userName;
      myObj["isAdmin"] = isAdmin;
      myObj["apiPortalUser"] = apiPortalUser;
      myObj["status"] = status;
      myObj["assignationNotification"] = assignationNotification;
      myObj["employeeStatus"] = employeeStatus;
      myObj["groupUser"] = groupUser;
      myObj["numberOfTeams"] = numberOfTeams;
      myObj["leadsMin"] = leadsMin;
      myObj["leadsMax"] = leadsMax;

      this.users.push(new User(myObj));
    });
    console.log(this.users);
  }

  public chunkArray(myArray, chunkSize) {

    const results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunkSize));
    }

    return results;
  }

  public ngOnInit(): void {
    //
  }

  public trackByFn(item, id) {
    return id;
  }
}
