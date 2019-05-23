export class Other {
    public checked: boolean = false;
    public id: string = null;
    public name: string = null;
    public description: string = null;

    constructor(data: any) {
        this.checked = data.checked || this.checked;
        this.id = data.id || this.id;
        this.name = data.name || this.name;
        this.description = data.description || this.description;
    }
}
