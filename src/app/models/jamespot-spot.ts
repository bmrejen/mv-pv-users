import { IJamespotSpotConfig } from "../interfaces/jamespot-spot";

export class Spot {
    public id: string;
    public title: string = "";
    public type: string = "spot";
    public isEnabled: boolean = false;

    constructor(data: IJamespotSpotConfig) {
        this.id = data.id || this.id;
        this.title = data.title || this.title;
        this.type = data.type || this.type;
        this.isEnabled = data.isEnabled || this.isEnabled;
    }
}
