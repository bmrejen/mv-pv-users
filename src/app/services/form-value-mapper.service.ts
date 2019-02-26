import { Injectable } from "@angular/core";

import { NgForm } from "@angular/forms";
import { User } from "../models/user";

@Injectable()
export class FormValueMapperService {
  public user;

  constructor() {
    //
  }

  public createUserForSugar(createForm: NgForm) {
    const form = createForm.value;

    const [
    firstName,
    lastName,
    userName,
    email,
    ] = [
    form.userInfo.credentials.firstname,
    form.userInfo.credentials.lastname,
    form.userInfo.credentials.username,
    form.userInfo.credentials.email,
    ];

    const codeSonGalileo = form.codeSON;

    const departments = getCheckedItems(form.departments);
    const roles = getCheckedItems(form.roles);
    const destinations = getCheckedItems(form.destinations);
    const teams = getCheckedItems(form.teams);

    const employeeStatus = !form.inactiveEmployee;
    const functionId = form.fonction;
    const id = form.id;
    const inheritsPreferencesFrom = form.userToCopyHPfrom;
    const isAdmin = false;
    const leadsMax = form.leadsMax;
    const leadsMin = form.leadsMin;
    const managerId = form.manager;
    const officeId = form.office;
    const phoneAsterisk = "phoneAsterisk";
    const phoneFax = "phoneFax";
    const phoneMobile = "phoneMobile";
    const phoneWork = "phoneWork";
    const salutation = form.userInfo.gender;
    const status = !form.inactiveStatus;
    const title = form.title;
    const tourplanID = form.sugar_tourplan;

    this.user = {
      codeSonGalileo,
      departments,
      destinations,
      email,
      employeeStatus,
      firstName,
      functionId,
      id,
      inheritsPreferencesFrom,
      isAdmin,
      lastName,
      leadsMax,
      leadsMin,
      managerId,
      officeId,
      phoneAsterisk,
      phoneFax,
      phoneMobile,
      phoneWork,
      roles,
      salutation,
      status,
      teams,
      title,
      tourplanID,
      userName,
    };

    return JSON.stringify({users: [this.user]});
  }
}

function getCheckedItems(object) {
  const checkedDepts = [];

  for (const key of Object.keys(object)) {

    // if the value of that key is true (===checked)
    if (object[key]) {
      checkedDepts.push(key);
    }
  }

  return checkedDepts;
}
