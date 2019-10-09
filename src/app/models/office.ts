export class Office {
    public label: string = "";
    public value: string = "";
    constructor(data) {
        this.label = data.label;
        this.value = data.value;
    }
}
