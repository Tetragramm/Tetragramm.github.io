/// <reference path="./Part.ts" />

class Used extends Part {
    private enabled: boolean;
    public burnt_out: number;
    public ragged: number;
    public hefty: number;
    public sticky_guns: number;
    public weak: number;
    public fragile: number;
    public leaky: number;
    public sluggish: number;

    constructor() {
        super();
        this.enabled = false;
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
    }

    public GetEnabled() {
        return this.enabled;
    }

    public SetEnabled(use: boolean) {
        this.enabled = use;
        if (!this.enabled) {
            this.burnt_out = 0;
            this.ragged = 0;
            this.hefty = 0;
            this.sticky_guns = 0;
            this.weak = 0;
            this.fragile = 0;
            this.leaky = 0;
            this.sluggish = 0;
        }
        this.CalculateStats();
    }

    public toJSON() {
        return {
            enabled: this.enabled,
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

    public fromJSON(js: JSON, json_version: number) {
        this.enabled = js["enabled"];
        this.burnt_out = js["burnt_out"];
        this.ragged = js["ragged"];
        this.hefty = js["hefty"];
        this.sticky_guns = js["sticky_guns"];
        this.weak = js["weak"];
        this.fragile = js["fragile"];
        this.leaky = js["leaky"];
        this.sluggish = js["sluggish"];
    }

    public serialize(s: Serialize) {
        s.PushBool(this.enabled);
        s.PushNum(this.burnt_out);
        s.PushNum(this.ragged);
        s.PushNum(this.hefty);
        s.PushNum(this.sticky_guns);
        s.PushNum(this.weak);
        s.PushNum(this.fragile);
        s.PushNum(this.leaky);
        s.PushNum(this.sluggish);
    }

    public deserialize(d: Deserialize) {
        this.enabled = d.GetBool();
        this.burnt_out = d.GetNum();
        this.ragged = d.GetNum();
        this.hefty = d.GetNum();
        this.sticky_guns = d.GetNum();
        this.weak = d.GetNum();
        this.fragile = d.GetNum();
        this.leaky = d.GetNum();
        this.sluggish = d.GetNum();
    }

    public PartStats() {
        this.burnt_out = Math.floor(1.0e-6 + this.burnt_out);
        this.ragged = Math.floor(1.0e-6 + this.ragged);
        this.hefty = Math.floor(1.0e-6 + this.hefty);
        this.sticky_guns = Math.floor(1.0e-6 + this.sticky_guns);
        this.weak = Math.floor(1.0e-6 + this.weak);
        this.fragile = Math.floor(1.0e-6 + this.fragile);
        this.leaky = Math.floor(1.0e-6 + this.leaky);
        this.sluggish = Math.floor(1.0e-6 + this.sluggish);
        return new Stats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public TriggerCS() {

        if (this.burnt_out != this.burnt_out)
            this.burnt_out = 0;
        if (this.ragged != this.ragged)
            this.ragged = 0;
        if (this.hefty != this.hefty)
            this.hefty = 0;
        if (this.sticky_guns != this.sticky_guns)
            this.sticky_guns = 0;
        if (this.weak != this.weak)
            this.weak = 0;
        if (this.fragile != this.fragile)
            this.fragile = 0;
        if (this.leaky != this.leaky)
            this.leaky = 0;
        if (this.sluggish != this.sluggish)
            this.sluggish = 0;

        this.CalculateStats();
    }
}