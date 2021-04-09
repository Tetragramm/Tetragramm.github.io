/// <reference path="./Serialize.ts"/>
/// <reference path="../EngineBuilder/EngineBuilder.ts"/>
/// <reference path="../EngineBuilder/PulsejetBuilder.ts"/>

enum ENGINE_TYPE {
    PROPELLER,
    PULSEJET,
    TURBO_X,
}

class EngineInputs {
    public name: string;
    public engine_type: ENGINE_TYPE;
    public type: number;
    public era_sel: number;

    //Engine Stuff
    public displacement: number;
    public compression: number;
    public cyl_per_row: number;
    public rows: number;
    public RPM_boost: number;
    public material_fudge: number;
    public quality_fudge: number;
    public compressor_type: number;
    public compressor_count: number;
    public min_IAF: number;
    public upgrades: boolean[];

    //Pulsejet Stuff
    public power: number;
    public quality_cost: number;
    public quality_rely: number;
    public starter: boolean;

    //TurboX Stuff
    public fuel_heat_value: number; // kJ/kg
    public max_turbine_temp: number; // K
    public base_efficiency: number; // 0-1
    public diameter: number; // m
    public compression_ratio: number; //1+
    public fan_pressure_ratio: number; //0+
    public bypass_ratio: number;//0+

    constructor(js?: JSON) {
        this.name = "Default";
        this.engine_type = ENGINE_TYPE.PROPELLER;
        this.type = 0;
        this.era_sel = 0;

        this.displacement = 0;
        this.compression = 0;
        this.cyl_per_row = 0;
        this.rows = 0;
        this.RPM_boost = 0;
        this.material_fudge = 0;
        this.quality_fudge = 0;
        this.compressor_type = 0;
        this.compressor_count = 0;
        this.min_IAF = 0;
        this.upgrades = [...Array(4).fill(false)];

        this.power = 0;
        this.quality_cost = 0;
        this.quality_rely = 0;
        this.starter = false;

        if (js) {
            this.fromJSON(js);
        }
    }

    public toJSON() {
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    displacement: this.displacement,
                    compression: this.compression,
                    cyl_per_row: this.cyl_per_row,
                    rows: this.rows,
                    RPM_boost: this.RPM_boost,
                    material_fudge: this.material_fudge,
                    quality_fudge: this.quality_fudge,
                    compressor_type: this.compressor_type,
                    compressor_count: this.compressor_count,
                    min_IAF: this.min_IAF,
                    upgrades: this.upgrades,
                };
            }
            case ENGINE_TYPE.PULSEJET: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    power: this.power,
                    quality_cost: this.quality_cost,
                    quality_rely: this.quality_rely,
                    starter: this.starter,
                }
            }
            default:
                throw "EngineInputs.toJSON: Oh dear, you have a new engine type.";
        }
    }

    public fromJSON(js: JSON) {
        this.name = js["name"];
        this.engine_type = js["engine_type"];
        this.type = js["type"];
        this.era_sel = js["era_sel"];
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.displacement = js["displacement"];
                this.compression = js["compression"];
                this.cyl_per_row = js["cyl_per_row"];
                this.rows = js["rows"];
                this.RPM_boost = js["RPM_boost"];
                this.material_fudge = js["material_fudge"];
                this.quality_fudge = js["quality_fudge"];
                this.compressor_type = js["compressor_type"];
                this.compressor_count = js["compressor_count"];
                this.min_IAF = js["min_IAF"];
                this.upgrades = BoolArr(js["upgrades"], this.upgrades.length);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.power = js["power"];
                this.quality_cost = js["quality_cost"];
                this.quality_rely = js["quality_rely"];
                this.starter = js["starter"];
                break;
            }
            default:
                throw "EngineInputs.fromJSON: Oh dear, you have a new engine type.";
        }
    }

    public serialize(s: Serialize) {
        s.PushString(this.name);
        s.PushNum(this.engine_type);
        s.PushNum(this.type);
        s.PushNum(this.era_sel);

        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                s.PushFloat(this.displacement);
                s.PushFloat(this.compression);
                s.PushNum(this.cyl_per_row);
                s.PushNum(this.rows);
                s.PushFloat(this.RPM_boost);
                s.PushFloat(this.material_fudge);
                s.PushFloat(this.quality_fudge);
                s.PushNum(this.compressor_type);
                s.PushNum(this.compressor_count);
                s.PushNum(this.min_IAF);
                s.PushBoolArr(this.upgrades);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                s.PushNum(this.power);
                s.PushFloat(this.quality_cost);
                s.PushFloat(this.quality_rely);
                s.PushBool(this.starter);
                break;
            }
            default:
                throw "EngineInputs.serialize: Oh dear, you have a new engine type.";
        }
    }

    public deserialize(d: Deserialize) {
        this.name = d.GetString();
        this.engine_type = d.GetNum();
        this.type = d.GetNum();
        this.era_sel = d.GetNum();
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.displacement = d.GetFloat();
                this.compression = d.GetFloat();
                this.cyl_per_row = d.GetNum();
                this.rows = d.GetNum();
                this.RPM_boost = d.GetFloat();
                this.material_fudge = d.GetFloat();
                this.quality_fudge = d.GetFloat();
                this.compressor_type = d.GetNum();
                this.compressor_count = d.GetNum();
                this.min_IAF = d.GetNum();
                this.upgrades = d.GetBoolArr(this.upgrades.length);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.power = d.GetNum();
                this.quality_cost = d.GetFloat();
                this.quality_rely = d.GetFloat();
                this.starter = d.GetBool();
                break;
            }
            default:
                throw "EngineInputs.deserialize: Oh dear, you have a new engine type.";
        }
    }

    public PartStats() {
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                var eb = new EngineBuilder();
                eb.name = this.name;
                eb.cool_sel = this.type;
                eb.era_sel = this.era_sel;
                eb.engine_displacement = this.displacement;
                eb.compression_ratio = this.compression;
                eb.num_cyl_per_row = this.cyl_per_row;
                eb.num_rows = this.rows;
                eb.rpm_boost = this.RPM_boost;
                eb.material_fudge = this.material_fudge;
                eb.quality_fudge = this.quality_fudge;
                eb.compressor_type = this.compressor_type;
                eb.compressor_count = this.compressor_count;
                eb.min_IAF = this.min_IAF;
                eb.upg_sel = this.upgrades;
                return eb.EngineStats();
            }
            case ENGINE_TYPE.PULSEJET: {
                var pb = new PulsejetBuilder();
                pb.valve_sel = this.type;
                pb.era_sel = this.era_sel;
                pb.desired_power = this.power;
                pb.build_quality = this.quality_cost;
                pb.overall_quality = this.quality_rely;
                pb.starter = this.starter;
                let stats = pb.EngineStats();
                this.name = stats.name;
                return stats;
            }
            default:
                throw "EngineInputs.PartStats: Oh dear, you have a new engine type.";
        }
    }

    public Equal(other: EngineInputs) {
        return this.name == other.name;
    }

    public Clone() {
        var n = new EngineInputs();
        n.name = this.name;
        n.engine_type = this.engine_type;
        n.type = this.type;
        n.era_sel = this.era_sel;
        n.displacement = this.displacement;
        n.compression = this.compression;
        n.cyl_per_row = this.cyl_per_row;
        n.rows = this.rows;
        n.RPM_boost = this.RPM_boost;
        n.material_fudge = this.material_fudge;
        n.quality_fudge = this.quality_fudge;
        n.compressor_type = this.compressor_type;
        n.compressor_count = this.compressor_count;
        n.min_IAF = this.min_IAF;
        n.power = this.power;
        n.quality_cost = this.quality_cost;
        n.quality_rely = this.quality_rely;
        n.starter = this.starter;
        for (let i = 0; i < this.upgrades.length; i++) {
            n.upgrades[i] = this.upgrades[i];
        }
        return n;
    }
}