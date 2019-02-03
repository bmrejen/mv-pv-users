import { Model } from "./model";

export class Role extends Model {
  public type: string = "users";
  public id: string;
  public name: string;
  public description: string;

  constructor(data?: any) {
    super(data);
  }
}
