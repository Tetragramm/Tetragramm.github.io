/// <reference path="./Stats.ts" />
/// <reference path="./Serialize.ts"/>

class EngineStats {
    public name: string = "Default";
    public overspeed: number = 0;
    public altitude: number = 0;
    public torque: number = 0;
    public rumble: number = 0;
    public oiltank: boolean = false;
    public pulsejet: boolean = false;
    public stats: Stats = new Stats();
    public input_eb: {
        displacement: number,
        compression: number,
        type: number,
        cyl_per_row: number,
        rows: number,
        RPM_boost: number,
        era_sel: number,
        material_fudge: number,
        quality_fudge: number,
        compressor_type: number,
        compressor_count: number,
        min_IAF: number,
        upgrades: boolean[],
    };
    public input_pj: {
        power: number,
        type: number,
        era_sel: number,
        quality_cost: number,
        quality_rely: number,
        starter: boolean,
    };
    constructor(js?: JSON) {
        this.input_pj = {
            power: 0, type: 0, era_sel: 0,
            quality_cost: 0, quality_rely: 0, starter: false
        };
        this.input_eb = {
            displacement: 0, compression: 0, type: 0,
            cyl_per_row: 0, rows: 0, RPM_boost: 0,
            era_sel: 0, material_fudge: 0, quality_fudge: 0,
            compressor_type: 0, compressor_count: 0, min_IAF: 0,
            upgrades: []
        };

        if (js) {
            this.fromJSON(js);
        }
    }

    public toJSON() {
        return {
            name: this.name,
            overspeed: this.overspeed,
            altitude: this.altitude,
            torque: this.torque,
            rumble: this.rumble,
            oiltank: this.oiltank,
            pulsejet: this.pulsejet,
            input_eb: this.input_eb,
            input_pj: this.input_pj,
            ...this.stats.toJSON()
        };
    }

    public fromJSON(js: JSON, json_version: number = 9999) {
        if (js["name"])
            this.name = js["name"];
        if (js["overspeed"])
            this.overspeed = js["overspeed"];
        if (js["altitude"])
            this.altitude = js["altitude"];
        if (js["torque"])
            this.torque = js["torque"];
        if (js["rumble"])
            this.rumble = js["rumble"];
        if (js["oiltank"])
            this.oiltank = js["oiltank"];
        if (js["pulsejet"])
            this.pulsejet = js["pulsejet"];

        if (this.pulsejet && js["input_pj"]) {
            var ipj = js["input_pj"];
            this.input_pj.power = ipj["power"];
            this.input_pj.type = ipj["type"];
            this.input_pj.era_sel = ipj["era_sel"];
            this.input_pj.quality_cost = ipj["quality_cost"];
            this.input_pj.quality_rely = ipj["quality_rely"];
            this.input_pj.starter = ipj["starter"];
        } else if (js["input_eb"]) {
            var ieb = js["input_eb"];
            this.input_eb.displacement = ieb["displacement"];
            this.input_eb.compression = ieb["compression"];
            this.input_eb.type = ieb["type"];
            this.input_eb.cyl_per_row = ieb["cyl_per_row"];
            this.input_eb.rows = ieb["rows"];
            this.input_eb.RPM_boost = ieb["RPM_boost"];
            this.input_eb.era_sel = ieb["era_sel"];
            this.input_eb.material_fudge = ieb["material_fudge"];
            this.input_eb.quality_fudge = ieb["quality_fudge"];
            this.input_eb.upgrades = ieb["upgrades"];
            if (this.input_eb.upgrades.length == 6) {
                this.altitude = this.altitude * 10 - 1;
                if (this.input_eb.upgrades[0]) {
                    this.input_eb.compressor_type = 2;
                    this.input_eb.compressor_count = 1;
                }
                if (this.input_eb.upgrades[1]) {
                    this.input_eb.compressor_type = 3;
                    this.input_eb.compressor_count = 1;
                }
                this.input_eb.upgrades.splice(0, 2);
            } else {
                this.input_eb.compressor_type = ieb["compressor_type"];
                this.input_eb.compressor_count = ieb["compressor_count"];
                this.input_eb.min_IAF = ieb["min_IAF"];
            }
        }

        this.stats = new Stats(js);
    }

    public serialize(s: Serialize) {
        s.PushString(this.name);
        s.PushNum(this.overspeed);
        s.PushNum(this.altitude);
        s.PushNum(this.torque);
        s.PushNum(this.rumble);
        s.PushBool(this.oiltank);
        s.PushBool(this.pulsejet);
        if (this.pulsejet) {
            s.PushNum(this.input_pj.power);
            s.PushNum(this.input_pj.type);
            s.PushNum(this.input_pj.era_sel);
            s.PushNum(this.input_pj.quality_cost);
            s.PushNum(this.input_pj.quality_rely);
            s.PushBool(this.input_pj.starter);
        } else {
            s.PushNum(this.input_eb.displacement);
            s.PushNum(this.input_eb.compression);
            s.PushNum(this.input_eb.type);
            s.PushNum(this.input_eb.cyl_per_row);
            s.PushNum(this.input_eb.rows);
            s.PushNum(this.input_eb.RPM_boost);
            s.PushNum(this.input_eb.era_sel);
            s.PushNum(this.input_eb.material_fudge);
            s.PushNum(this.input_eb.quality_fudge);
            s.PushBoolArr(this.input_eb.upgrades);
            s.PushNum(this.input_eb.compressor_type);
            s.PushNum(this.input_eb.compressor_count);
            s.PushNum(this.input_eb.min_IAF);
        }
        this.stats.serialize(s);
    }

    public deserialize(d: Deserialize) {
        this.name = d.GetString();
        this.overspeed = d.GetNum();
        this.altitude = d.GetNum();
        this.torque = d.GetNum();
        this.rumble = d.GetNum();
        this.oiltank = d.GetBool();
        this.pulsejet = d.GetBool();
        if (d.version > 10.45) {
            if (this.pulsejet) {
                this.input_pj.power = d.GetNum();
                this.input_pj.type = d.GetNum();
                this.input_pj.era_sel = d.GetNum();
                this.input_pj.quality_cost = d.GetNum();
                this.input_pj.quality_rely = d.GetNum();
                this.input_pj.starter = d.GetBool();
            } else {
                this.input_eb.displacement = d.GetNum();
                this.input_eb.compression = d.GetNum();
                this.input_eb.type = d.GetNum();
                this.input_eb.cyl_per_row = d.GetNum();
                this.input_eb.rows = d.GetNum();
                this.input_eb.RPM_boost = d.GetNum();
                this.input_eb.era_sel = d.GetNum();
                this.input_eb.material_fudge = d.GetNum();
                this.input_eb.quality_fudge = d.GetNum();
                this.input_eb.upgrades = d.GetBoolArr();
                if (this.input_eb.upgrades.length == 6) {
                    this.altitude = this.altitude * 10 - 1;
                    if (this.input_eb.upgrades[0]) {
                        this.input_eb.compressor_type = 2;
                        this.input_eb.compressor_count = 1;
                    }
                    if (this.input_eb.upgrades[1]) {
                        this.input_eb.compressor_type = 3;
                        this.input_eb.compressor_count = 1;
                    }
                    this.input_eb.upgrades.splice(0, 2);
                } else {
                    this.input_eb.compressor_type = d.GetNum();
                    this.input_eb.compressor_count = d.GetNum();
                    this.input_eb.min_IAF = d.GetNum();
                }
            }
        }
        this.stats.deserialize(d);
    }

    public Clone(): EngineStats {
        var c = new EngineStats();
        c.fromJSON(JSON.parse(JSON.stringify(this.toJSON())));
        return c;
    }
    public Equal(other: EngineStats) {
        return this.stats.Equal(other.stats)
            && this.overspeed == other.overspeed
            && this.altitude == other.altitude
            && this.torque == other.torque
            && this.rumble == other.rumble
            && this.oiltank == other.oiltank
            && this.pulsejet == other.pulsejet;
    }
    public Verify() {
        if (this.oiltank) {
            this.stats.cooling = 0;
        }
        this.PulseJetCheck();
    }

    private PulseJetCheck() {
        if (this.pulsejet) {
            this.stats.cooling = 0;
            this.overspeed = 100;
            this.altitude = 3;
            this.torque = 0;
        }
        else {
            this.rumble = 0;
        }
    }
}