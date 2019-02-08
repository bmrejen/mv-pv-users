export abstract class Model {

  constructor(data?: any) {
    this.defaultConstructor(data);
  }

  public defaultConstructor(data?: any) {
    const self = this;

    if (undefined !== data && null !== data) {
      for (const prop in data) {
        if ("attributes" !== prop) {
          if (typeof data[prop] !== "function" && data[prop] != null && data[prop] !== "") {
            self[prop] = data[prop];
          }
        }
      }

      if (undefined !== data.attributes && null !== data.attributes) {
        for (const prop in data.attributes) {
          if (typeof data.attributes[prop] !== "function"
              && data.attributes[prop] != null
              && data.attributes[prop] !== "") {
            self[prop] = data.attributes[prop];
        }
      }
    }
  }
}
}
