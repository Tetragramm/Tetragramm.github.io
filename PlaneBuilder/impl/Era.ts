/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Era extends Part {
    private vals: { name: string, maxbomb: number, cant_lift: number, stats: Stats }[];
    private selected: number;
    constructor(js: JSON) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = {
                name: elem["name"], maxbomb: elem["maxbomb"],
                cant_lift: elem["cant_lift"], stats: new Stats(elem),
            };
            this.vals.push(opt);
        }
    }

    public toJSON() {
        return {
            selected: this.selected
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.selected = js["selected"];
        if (json_version < 10.35) {
            if (this.selected > 2) {
                this.selected++;
            }
        }
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

    public GetSelectedText() {
        return this.vals[this.selected].name;
    }

    public SetSelected(index: number) {
        this.selected = index;
        this.CalculateStats();
    }

    public GetEraOptions(): { name: string }[] {
        return this.vals;
    }

    public GetLiftBleed(): number {
        return this.vals[this.selected].stats.liftbleed;
    }

    public GetMaxBomb(): number {
        return this.vals[this.selected].maxbomb;
    }

    public GetCantLift(): number {
        return this.vals[this.selected].cant_lift;
    }

    public PartStats(): Stats {
        var s = new Stats();
        s = s.Add(this.vals[this.selected].stats);
        return s;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}