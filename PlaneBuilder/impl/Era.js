import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
export class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (const elem of js["options"]) {
            const opt = {
                name: elem["name"], maxbomb: elem["maxbomb"],
                cant_lift: elem["cant_lift"], stats: new Stats(elem),
            };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js, json_version) {
        this.selected = js["selected"];
        if (json_version < 10.35) {
            if (this.selected > 2) {
                this.selected++;
            }
        }
    }
    serialize(s) {
        s.PushNum(this.selected);
    }
    deserialize(d) {
        this.selected = d.GetNum();
    }
    GetSelected() {
        return this.selected;
    }
    GetSelectedText() {
        return this.vals[this.selected].name;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].stats.liftbleed;
    }
    GetMaxBomb() {
        return this.vals[this.selected].maxbomb;
    }
    GetCantLift() {
        return this.vals[this.selected].cant_lift;
    }
    PartStats() {
        var s = new Stats();
        s = s.Add(this.vals[this.selected].stats);
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
