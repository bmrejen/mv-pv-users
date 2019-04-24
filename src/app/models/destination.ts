import { Model } from "./model";

export class Destination extends Model {
    public type: string;
    public id: string;
    public name: string;
    public description: string;

    constructor(data?: any) {
        super(data);
    }
}
