import { Model } from "./model";

export class Role extends Model {
    public type: string;
    public id: string;
    public name: string;
    public description: string;
    public checked: boolean = false;

    constructor(data?: any) {
        super(data);
    }
}
