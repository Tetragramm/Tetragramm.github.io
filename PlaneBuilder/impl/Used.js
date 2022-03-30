import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
export class Used extends Part {
    constructor() {
        super();
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
    }
    GetEnabled() {
        const total = Math.abs(this.burnt_out) +
            Math.abs(this.ragged) +
            Math.abs(this.hefty) +
            Math.abs(this.sticky_guns) +
            Math.abs(this.weak) +
            Math.abs(this.fragile) +
            Math.abs(this.leaky) +
            Math.abs(this.sluggish);
        return total != 0;
    }
    SetEnabled(use) {
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
        this.CalculateStats();
    }
    toJSON() {
        return {
            enabled: true,
            burnt_out: this.burnt_out,
            ragged: this.ragged,
            hefty: this.hefty,
            sticky_guns: this.sticky_guns,
            weak: this.weak,
            fragile: this.fragile,
            leaky: this.leaky,
            sluggish: this.sluggish,
        };
    }
    fromJSON(js, json_version) {
        this.burnt_out = js["burnt_out"];
        this.ragged = js["ragged"];
        this.hefty = js["hefty"];
        this.sticky_guns = js["sticky_guns"];
        this.weak = js["weak"];
        this.fragile = js["fragile"];
        this.leaky = js["leaky"];
        this.sluggish = js["sluggish"];
    }
    serialize(s) {
        s.PushBool(true);
        s.PushNum(this.burnt_out);
        s.PushNum(this.ragged);
        s.PushNum(this.hefty);
        s.PushNum(this.sticky_guns);
        s.PushNum(this.weak);
        s.PushNum(this.fragile);
        s.PushNum(this.leaky);
        s.PushNum(this.sluggish);
    }
    deserialize(d) {
        d.GetBool();
        this.burnt_out = d.GetNum();
        this.ragged = d.GetNum();
        this.hefty = d.GetNum();
        this.sticky_guns = d.GetNum();
        this.weak = d.GetNum();
        this.fragile = d.GetNum();
        this.leaky = d.GetNum();
        this.sluggish = d.GetNum();
    }
    Normalize(num) {
        if (num != num) {
            num = 0;
        }
        num = Math.floor(1.0e-6 + num);
        num = Math.min(1, num);
        num = Math.max(-1, num);
        return num;
    }
    PartStats() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        return new Stats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    TriggerCS() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        this.CalculateStats();
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
