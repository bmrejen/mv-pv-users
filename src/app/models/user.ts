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
    // this.defaultConstructor(data);
  }

  // public defaultConstructor(data?: any) {
    //   const self = this;

    //   if (undefined !== data && null !== data) {
      //     for (const prop in data) {
        //       if (prop != null) {
          //         self[prop] = data[prop];
          //       }
          //     }
          //   }
          //   console.log("why doesn't this line show ?");
          // }
        }
