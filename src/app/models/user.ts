export class User {
  public type: string;
  public id: string;
  public attributes;

  constructor(
              type: string,
              id: string,
              attributes: {
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

    this.type = type;
    this.id = id;
    this.attributes = attributes;
  }
}
