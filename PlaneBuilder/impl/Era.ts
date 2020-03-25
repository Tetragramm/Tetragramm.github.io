// export { Era };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Era extends Part {
    private vals: { name: string, value: number }[];
    private selected: number;
    constructor(js: JSON) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = { name: elem["name"], value: parseInt(elem["liftbleed"]) };
            this.vals.push(opt);
        }
    }

    public toJSON() {
        return {
            selected: this.selected
        };
    }

    public fromJSON(js: JSON) {
        this.selected = js["selected"];
    }

    public GetSelected() {
        return this.selected;
    }

    public SetSelected(index: number) {
        this.selected = index;
        this.CalculateStats();
    }

    public GetEraOptions(): { name: string, value: number }[] {
        return this.vals;
    }

    public GetLiftBleed(): number {
        return this.vals[this.selected].value;
    }

    public PartStats(): Stats {
        var s = new Stats();
        s.liftbleed = this.GetLiftBleed();
        return s;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}