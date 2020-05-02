/// <reference path="./Stats.ts" />
/// <reference path="./Serialize.ts"/>

class EngineStats {
    public name: string = "";
    public overspeed: number = 0;
    public altitude: number = 0;
    public torque: number = 0;
    public rumble: number = 0;
    public oiltank: boolean = false;
    public pulsejet: boolean = false;
    public stats: Stats = new Stats();
    constructor(js?: JSON) {
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
            ...this.stats.toJSON()
        };
    }

    public fromJSON(js: JSON) {
        this.name = js["name"];
        this.overspeed = js["overspeed"];
        this.altitude = js["altitude"];
        this.torque = js["torque"];
        this.rumble = js["rumble"];
        this.oiltank = js["oiltank"];
        this.pulsejet = js["pulsejet"];
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
        this.stats.deserialize(d);
    }

    public Add(other: EngineStats): EngineStats {
        let res = new EngineStats();
        res.stats = this.stats.Add(other.stats);
        res.name = this.name;
        res.overspeed = this.overspeed + other.overspeed;
        res.altitude = this.altitude + other.altitude;
        res.torque = this.torque + other.torque;
        res.rumble = this.rumble + other.rumble;
        res.oiltank = this.oiltank || other.oiltank;
        res.pulsejet = this.pulsejet || other.pulsejet;
        return res;
    }
    public Clone(): EngineStats {
        return this.Add(new EngineStats());
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