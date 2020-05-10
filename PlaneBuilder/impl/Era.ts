/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Era extends Part {
    private vals: { name: string, value: number, maxbomb: number, cant_lift: boolean }[];
    private selected: number;
    constructor(js: JSON) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = {
                name: elem["name"], value: elem["liftbleed"],
                maxbomb: elem["maxbomb"], cant_lift: elem["cant_lift"]
            };
            this.vals.push(opt);
        }
    }

    public toJSON() {
        return {
            selected: this.selected
        };
    }

    public fromJSON(js: JSON, json_version: string) {
        this.selected = js["selected"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.selected);
    }

    public deserialize(d: Deserialize) {
        this.selected = d.GetNum();
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

    public GetMaxBomb(): number {
        return this.vals[this.selected].maxbomb;
    }

    public GetCantLift(): boolean {
        return this.vals[this.selected].cant_lift;
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