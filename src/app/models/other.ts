import { Model } from "./model";

export class Other extends Model {
    public checked: boolean;
    public id: string;
    public label: string;

    constructor(data?: any) {
        super(data);
    }
}
