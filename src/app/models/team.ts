import { Model } from "./model";

export class Team extends Model {
  public type: string;
  public id: string;
  public name: string;
  public checked: boolean = false;
  public description: string; // === null for each team

  constructor(data?: any) {
    super(data);
  }
}
