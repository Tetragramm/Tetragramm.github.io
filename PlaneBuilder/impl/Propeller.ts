/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Propeller extends Part {
    private prop_list: { name: string, stats: Stats, automatic: boolean, energy: number, turn: number }[];
    private idx_prop: number;
    private use_variable: boolean;
    private num_propellers: number;

    constructor(json: JSON) {
        super();
        this.idx_prop = 2;
        this.use_variable = false;
        this.num_propellers = 0;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({
                name: elem["name"], stats: new Stats(elem),
                automatic: elem["automatic"],
                energy: elem["energy"], turn: elem["turn"],
            });
        }
    }

    public toJSON() {
        return {
            type: this.idx_prop,
            use_variable: this.use_variable
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.idx_prop = js["type"];
        this.use_variable = js["use_variable"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.idx_prop);
        s.PushBool(this.use_variable);
    }

    public deserialize(d: Deserialize) {
        this.idx_prop = d.GetNum();
        this.use_variable = d.GetBool();
    }

    public GetPropList() {
        return this.prop_list;
    }

    public SetPropIndex(num: number) {
        this.idx_prop = num;
        if (this.prop_list[num].automatic)
            this.use_variable = false;
        this.CalculateStats();
    }

    public GetPropIndex() {
        return this.idx_prop;
    }

    public SetVariable(use: boolean) {
        if (!this.prop_list[this.idx_prop].automatic)
            this.use_variable = use;
        else
            this.use_variable = false;
        this.CalculateStats();
    }

    public GetVariable() {
        return this.use_variable;
    }

    public CanBeVariable() {
        return !this.prop_list[this.idx_prop].automatic;
    }

    public SetNumPropeller(have: number) {
        this.num_propellers = have;
    }

    public GetNumPropellers() {
        return this.num_propellers;
    }

    public GetEnergy() {
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].energy;
        else
            return 5;
    }

    public GetTurn() {
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].turn;
        else
            return 7;
    }

    public PartStats(): Stats {
        var stats = new Stats();
        if (this.num_propellers) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats.Multiply(this.num_propellers));
            if (this.use_variable) {
                stats.cost += 2 * this.num_propellers;
                stats.warnings.push({
                    source: lu("Manually Variable Propeller"),
                    warning: lu("MVP_Warning")
                })
            }
        }
        else {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}