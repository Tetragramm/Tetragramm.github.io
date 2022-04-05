import { Stats, Stats_PS } from "./Stats";
import { Serialize, Deserialize, NumArr } from "./Serialize";
import { ENGINE_RARITY } from "./EngineInputs";



export enum DRIVE_TYPE {
    PROPELLER,
    TURBINE,
    PULSEJET,
}

export interface EngineStats_PS extends Stats_PS {
    overspeed?: number,
    altitude?: number,
    torque?: number,
    rumble?: number,
    oiltank?: boolean,
    pulsejet?: boolean,
    rarity?: ENGINE_RARITY,
};

export class EngineStats {
    public name = "Default";
    public overspeed = 0;
    public altitude = 0;
    public torque = 0;
    public rumble = 0;
    public oiltank = false;
    public pulsejet = false;
    public stats: Stats = new Stats();
    public rarity: ENGINE_RARITY = ENGINE_RARITY.CUSTOM;

    constructor(js?: EngineStats_PS) {
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
            rarity: this.rarity,
            ...this.stats.toJSON()
        };
    }

    public fromJSON(js: EngineStats_PS, json_version = 9999) {
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
        if (js["rarity"])
            this.rarity = js["rarity"];
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
        s.PushNum(this.rarity);
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
        if (d.version > 12.35) {
            this.rarity = d.GetNum();
        }
        this.stats.deserialize(d);
    }

    public Clone(): EngineStats {
        const c = new EngineStats();
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
            && this.pulsejet == other.pulsejet
            && this.rarity == other.rarity;
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
