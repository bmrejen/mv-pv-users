export class User {

  constructor(
    public type: string,
    public id: string,
    public attributes: {
      id: string,
      userName: string,
      salutation: string,
      lastName: string,
      firstName: string,
      phoneHome: string,
      phoneMobile: string,
      phoneWork: string,
      phoneOther: string,
      phoneFax: string,
      phoneAsterisk: string,
      email: string,
      status: string,
      employeeStatus: string,
      title: string,
      managerId: string,
      department: string,
      officeId: string,
      teamId: string,
      tourplanID: string,
      swClickToCall: string,
      swCallNotification: string,
      codeSonGalileo: string,
    }) {
    console.log(`Created user ${this.attributes.userName}`);
  }
}
