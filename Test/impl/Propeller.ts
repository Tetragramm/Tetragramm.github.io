/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Propeller extends Part {
    private prop_list: { name: string, stats: Stats, energy: number, turn: number }[];
    private upg_list: { name: string, stats: Stats, energy: number, turn: number }[];
    private idx_prop: number;
    private idx_upg: number;
    private num_propellers: number;
    private etype: ENGINE_TYPE;
    private acft_type: AIRCRAFT_TYPE;

    constructor(json: JSON) {
        super();
        this.num_propellers = 0;

        this.idx_prop = 2;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({
                name: elem["name"], stats: new Stats(elem),
                energy: elem["energy"], turn: elem["turn"],
            });
        }

        this.idx_upg = 0;
        this.upg_list = [];
        for (let elem of json["upgrades"]) {
            this.upg_list.push({
                name: elem["name"], stats: new Stats(elem),
                energy: elem["energy"], turn: elem["turn"],
            });
        }

    }

    public toJSON() {
        return {
            type: this.idx_prop,
            upgrade: this.idx_upg
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.idx_prop = js["type"];
        if (json_version < 11.35) {
            this.idx_upg = 0;
            if (js["use_variable"])
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2
                this.idx_prop = 2;
            }
        } else {
            this.idx_upg = js["upgrade"];
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.idx_prop);
        s.PushNum(this.idx_upg);
    }

    public deserialize(d: Deserialize) {
        this.idx_prop = d.GetNum();
        if (d.version < 11.35) {
            this.idx_upg = 0;
            if (d.GetBool())
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2
                this.idx_prop = 2;
            }
        } else {
            this.idx_upg = d.GetNum();
        }
    }

    public GetPropList() {
        return this.prop_list;
    }

    public GetUpgradeList() {
        return this.upg_list;
    }

    public SetPropIndex(num: number) {
        this.idx_prop = num;
        this.CalculateStats();
    }

    public GetPropIndex() {
        return this.idx_prop;
    }

    public SetUpgradeIndex(use: number) {
        this.idx_upg = use;
        this.CalculateStats();
    }

    public GetUpgradeIndex() {
        return this.idx_upg;
    }

    public SetNumPropeller(have: number, etype: ENGINE_TYPE) {
        this.num_propellers = have;
        this.etype = etype;
    }

    public GetNumPropellers() {
        return this.num_propellers;
    }

    public GetEnergy() {
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER)
            return 2.5;
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].energy + this.upg_list[this.idx_upg].energy;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 6;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        //Pulsejet, Turbines
        return 9;
    }

    public GetTurn() {
        if (this.acft_type)
            return 6;
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].turn + this.upg_list[this.idx_upg].turn;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 7;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        //Pulsejet, Turbines
        return 4;
    }

    public SetAcftType(type: AIRCRAFT_TYPE) {
        this.acft_type = type;
        if(IsAnyOrnithopter(type)){
            this.num_propellers = 0;
        }
    }

    public PartStats(): Stats {
        var stats = new Stats();
        if (this.num_propellers != 0) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats.Multiply(this.num_propellers));
            stats = stats.Add(this.upg_list[this.idx_upg].stats.Multiply(this.num_propellers));
        } else if (this.etype == ENGINE_TYPE.PULSEJET) {//Pulsejet
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        } else if (this.etype == ENGINE_TYPE.TURBOMACHINERY) {//Turbojets
            stats.pitchboost = 0.2;
            // stats.pitchspeed = 1.3; //Created by Engine Builder. Not from here.
        } else if(this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 0.8;
        } else if(this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            stats.pitchboost = 0.8;
            stats.pitchspeed = 0.8;
        } else if(this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            stats.pitchboost = 1;
            stats.pitchspeed = 0.6;
        } else {
            //Default, no auto pitch
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}