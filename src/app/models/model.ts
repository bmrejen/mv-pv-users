export abstract class Model {

  public constructor(data?: any) {
    const self = this;

    if (undefined !== data && null !== data) {
      for (const prop in data) {
        if ("attributes" !== prop) {
          if (typeof data[prop] !== "function") {
            self[prop] = data[prop];
          }
        }
      }

      if (undefined !== data.attributes && null !== data.attributes) {
        for (const prop in data.attributes) {
          if (typeof data.attributes[prop] !== "function") {
            self[prop] = data.attributes[prop];
          }
        }
      }
    }
  }

}
