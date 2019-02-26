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

    const departments = getCheckedDepartments(form.departments);

    // const department = form.services.find((dep) => dep.checked === true);
    // const destinations = form.destinations
    // .filter((des) => des.checked === true)
    // .map((des) => des.id);
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
    // const roleId = form.roles.filter((r) => r.checked === true);
    const salutation = form.userInfo.gender;
    const status = !form.inactiveStatus;
    // const teamId = form.teams.filter((t) => t.checked === true);
    const title = form.title;
    const tourplanID = form.sugar_tourplan;

    this.user = {
      codeSonGalileo,
      // department,
      // destinations,
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
      // roleId,
      salutation,
      status,
      // teamId,
      title,
      tourplanID,
      userName,
    };
    console.log(Array.isArray(form.destinations));

    return JSON.stringify({users: [this.user]});
  }
}

function getCheckedDepartments(depts) {
  console.log("depts", depts);
  const checkedDepts = [];

  for (const dept of Object.keys(depts)) {
    if (depts["dept"] === true) {
      console.log(dept);
      checkedDepts.push(dept);
    }
  }
  console.log(checkedDepts);

  return checkedDepts;
}
