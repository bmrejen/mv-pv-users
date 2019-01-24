import { Injectable } from "@angular/core";
import { Fields } from "../models/fields";

import { Accounts } from "../assets/accounts";
import { Autres } from "../assets/autres";
import { Bureaux } from "../assets/bureaux";
import { Civilites } from "../assets/civilites";
import { Destinations } from "../assets/destinations";
import { Functions } from "../assets/functions";
import { Managers } from "../assets/managers";
import { Orgas } from "../assets/orgas";
import { Roles } from "../assets/roles";
import { Services } from "../assets/services";
import { Teams } from "../assets/teams";
import { UserFields } from "../assets/user-fields";
import { UserTemplates } from "../assets/user-templates";

@Injectable()

export class FieldsService {

  public fields: Fields = new Fields(
                                     Accounts,
                                     Autres,
                                     Bureaux,
                                     Civilites,
                                     "",
                                     "",
                                     "",
                                     Destinations,
                                     Functions,
                                     "",
                                     false,
                                     false,
                                     "",
                                     null,
                                     null,
                                     Managers,
                                     Orgas,
                                     "",
                                     "",
                                     "",
                                     Roles,
                                     "",
                                     "",
                                     "",
                                     "",
                                     Services,
                                     Teams,
                                     "",
                                     UserFields,
                                     UserTemplates,
                                     "");

  constructor() {
    //
  }

  public getData(): Fields {
    return this.fields;
  }
}
