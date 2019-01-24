export class Role {

  public type: string;
  public id: string;
  public attributes;

  constructor(
              type: string,
              id: string,
              attributes: {
                id: string,
                name: string,
                description: string,
              },
              ) {

    this.type = type;
    this.id = id;
    this.attributes = attributes;
    console.log(`Created role ${this.attributes.name}`);
  }
}
