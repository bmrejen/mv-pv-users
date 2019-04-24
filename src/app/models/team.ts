import { Model } from "./model";

export class Team extends Model {
    public type: string;
    public id: string;
    public name: string;
    public description: string; // === null for each team

    constructor(data?: any) {
        super(data);
    }
}
