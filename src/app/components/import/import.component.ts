import { Component, OnInit } from "@angular/core";
import { ParserService } from "../../services/parser.service";

@Component({
  selector: "mv-import",
  styleUrls: ["./import.component.css"],
  templateUrl: "./import.component.html",
})

export class ImportComponent implements OnInit {

  public numberOfFields = 22;
  public res;
  public firstname;
  public lastname;

  // tslint:disable:max-line-length
  public csv = '"Cindy","Guerineau","","New","Ventes","","","cguerineau@marcovasco.fr","01 76 64 72 87","1287","cg11215!","","cguerineau","0","0","Active","0","Active","0","1","15","45","Coralie","Viarnes","","New","Ventes","","","cviarnes@marcovasco.fr","01 56 67 01 00","2100","cv19833!","","cviarnes","0","0","Active","0","Active","0","1","15","45","Nejma","Mebarki","","New","Ventes","","","nmebarki@marcovasco.fr","01 76 64 72 92","1292","nm62684!","","nmebarki","0","0","Active","0","Active","0","1","15","45","Fanny","Marh-Zhoock","","New","Ventes","","","farhzhoock@marcovasco.fr","01 56 67 00 88","2088","fm48032!","","farhzhoock","0","0","Active","0","Active","0","1","15","45"';
  // tslint:enable:max-line-length

  constructor(private parserService: ParserService) {
    //
  }

  public parse(d) {
    this.res = this.parserService.getData(d);
    console.table(this.res);

    if (this.res.length % this.numberOfFields !== 0) {
      alert("csv has wrong number of fields");
    }
    this.firstname = this.res[0];
    this.lastname = this.res[1];

  }

  public ngOnInit(): void {
    //
  }

  public trackByFn(item, id) {
    return id;
  }
}
