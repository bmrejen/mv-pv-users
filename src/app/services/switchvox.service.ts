import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
// import { of } from "rxjs/observable/of";

@Injectable()
export class SwitchVoxService {
  public username: string = "admin";
  public password: string = "Nzv8P7!6CZp2x+#";

  public endPoint: string = "https://sw.marcovasco.fr/xml";
  public body = `<request method="switchvox.extensions.getVoicemailInfo" version="17487">
  <parameters>
  <sort_field>extension</sort_field>
  <sort_order>ASC</sort_order>
  <items_per_page>50</items_per_page>
  <page_number>1</page_number>
  </parameters>
  </request>`;

  constructor(
              private http: HttpClient) {
    //
  }

  public getData(): Observable<any> {
    const headers = new HttpHeaders()
    .append("Content-Type", "application/xml")
    .append("Content-Type", "application/x-www-form-urlencoded")
    .append("Authorization", "Basic " + btoa(`${this.username}:${this.password}`));

    return this.http.post<any>(this.endPoint, this.body, {headers});
  }
}
