export class User {
  public data: any;
  public type: string;
  public id: string;
  public attributes: {
    lastName: string;
    firstName: string;
    phoneHome: string;
    phoneMobile: string;
    phoneWork: string;
    phoneOther: string;
    phoneFax: string;
    phoneAsterisk: string;
    email: string;
  };

  constructor(data?: any) {
    this.defaultConstructor(data);
  }

  public defaultConstructor(data?: any) {
    const self = this;

    if (undefined !== data && null !== data) {
      for (const prop in data) {
        if (prop != null) {
          self[prop] = data[prop];
        }
      }
    }
    console.log("why doesn't this line show ?");
  }
}
