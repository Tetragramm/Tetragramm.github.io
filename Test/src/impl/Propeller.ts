import { Part, AIRCRAFT_TYPE, Propellers_PS } from "./Part";
import { Stats } from "./Stats";
import { Serialize, Deserialize } from "./Serialize";
import { DRIVE_TYPE } from "./EngineStats";

export class Propeller extends Part {
    private prop_list: { name: string, stats: Stats, energy: number, turn: number }[];
    private upg_list: { name: string, stats: Stats, energy: number, turn: number }[];
    private idx_prop: number;
    private idx_upg: number;
    private engines: { type: DRIVE_TYPE, num: number }[];
    private acft_type: AIRCRAFT_TYPE;

    constructor(json: Propellers_PS) {
        super();
        this.engines = [];

        this.idx_prop = 2;
        this.prop_list = [];
        for (const elem of json["props"]) {
            this.prop_list.push({
                name: elem["name"], stats: new Stats(elem),
                energy: elem["energy"], turn: elem["turn"],
            });
        }

        this.idx_upg = 0;
        this.upg_list = [];
        for (const elem of json["upgrades"]) {
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

    public SetEngineTypes(engines: { type: DRIVE_TYPE, num: number }[]) {
        this.engines = engines;
    }

    public GetNumPropellers() {
        var num_propellers = 0;
        for (const e of this.engines) {
            if (e.type == DRIVE_TYPE.PROPELLER) {
                num_propellers += e.num;
            }
        }
        return num_propellers;
    }

    public GetEnergy() {
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER)
            return 2.5;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 6;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        if (this.engines.length == 0)
            return 2.5;

        var E = 999;
        for (const e of this.engines) {
            switch (e.type) {
                case DRIVE_TYPE.PROPELLER:
                    E = Math.min(E, this.prop_list[this.idx_prop].energy + this.upg_list[this.idx_upg].energy);
                    break;
                case DRIVE_TYPE.PULSEJET:
                    // E = Math.min(E, 4);
                    E = Math.min(E, 5);
                    break;
                case DRIVE_TYPE.TURBINE:
                    E = Math.min(E, 9);
                    break;
                default:
                    throw "Not a known Engine Type.";
            }
        }
        return E;
    }

    public GetTurn() {
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER)
            return 6;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 7;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        if (this.engines.length == 0)
            return 6;

        var T = 999;
        for (const e of this.engines) {
            switch (e.type) {
                case DRIVE_TYPE.PROPELLER:
                    T = Math.min(T, this.prop_list[this.idx_prop].turn + this.upg_list[this.idx_upg].turn);
                    break;
                case DRIVE_TYPE.PULSEJET:
                    // T = Math.min(T, 5);
                    T = Math.min(T, 2);
                    break;
                case DRIVE_TYPE.TURBINE:
                    T = Math.min(T, 4);
                    break;
                default:
                    throw "Not a known Engine Type.";
            }
        }
        return T;
    }

    public SetAcftType(type: AIRCRAFT_TYPE) {
        this.acft_type = type;
    }

    public PartStats(): Stats {
        var stats = new Stats();
        if (this.GetNumPropellers() != 0) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats.Multiply(this.GetNumPropellers()));
            stats = stats.Add(this.upg_list[this.idx_upg].stats.Multiply(this.GetNumPropellers()));
        }

        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        } else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 0.8;
        } else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            stats.pitchboost = 0.8;
            stats.pitchspeed = 0.8;
        } else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            stats.pitchboost = 1;
            stats.pitchspeed = 0.6;
        } else if (this.engines.length == 0) {
            //Default, no auto pitch
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        } else {
            stats.pitchboost = 999;
            stats.pitchspeed = 999;
            for (const e of this.engines) {
                switch (e.type) {
                    case DRIVE_TYPE.PROPELLER:
                        stats.pitchboost = Math.min(stats.pitchboost, this.prop_list[this.idx_prop].stats.pitchboost + this.upg_list[this.idx_upg].stats.pitchboost);
                        stats.pitchspeed = Math.min(stats.pitchspeed, this.prop_list[this.idx_prop].stats.pitchspeed + this.upg_list[this.idx_upg].stats.pitchspeed);
                        break;
                    case DRIVE_TYPE.PULSEJET:
                        // stats.pitchboost = Math.min(stats.pitchboost, 0.4);
                        // stats.pitchspeed = Math.min(stats.pitchspeed, 1.1);
                        stats.pitchboost = Math.min(stats.pitchboost, 0.6);
                        stats.pitchspeed = Math.min(stats.pitchspeed, 1.3);
                        break;
                    case DRIVE_TYPE.TURBINE:
                        stats.pitchboost = Math.min(stats.pitchboost, 0.2);
                        stats.pitchspeed = Math.min(stats.pitchspeed, e.num);
                        break;
                    default:
                        throw "Not a known Engine Type.";
                }

            }
        }
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
