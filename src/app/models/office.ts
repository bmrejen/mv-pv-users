export class Office {
    public name: string = "";
    public id: string = "";
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
    }
}
