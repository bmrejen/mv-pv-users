import { Model } from "./model";
import { Office } from "./office";
import { Other } from "./other";

export class Fields extends Model {

    // Json-related properties must have same name as their json file
    public accounts: any[];
    public civilites: any[];
    public departments: any[];
    public destinations: any[];
    public functions: any[];
    public managers: any[];
    public offices: any[];
    public orgas: any[];
    public others: Other[] = [];
    public roles: any[];
    public teams: any[];
    public userFields: any[];
    public userTemplates: any[];

    constructor(data?: any) {
        super(data);
    }
}
