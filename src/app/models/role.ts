export class Role {
  constructor(
    public type: string,
    public id: string,
    public attributes: {
      id: string,
      name: string,
      description: string,
    }) {
    console.log(`Created role ${this.attributes.name}`);
  }
}
