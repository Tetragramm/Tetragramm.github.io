import { Part, MergeElectrics } from "./Part.js";
import { Stats } from "./Stats.js";
import { Serialize, Deserialize } from "./Serialize.js";
import { lu } from "./Localization.js";
import { Cockpit } from "./Cockpit.js";
import { StringFmt } from "../string/index.js";

export class Cockpits extends Part {
    private positions: Cockpit[];
    private types: { name: string, exposed: boolean, stats: Stats }[];
    private upgrades: { name: string, stats: Stats }[];
    private safety: { name: string, stats: Stats }[];
    private gunsights: { name: string, attack: number, stats: Stats }[];

    constructor(js: JSON) {
        super();
        this.positions = [];

        this.types = [];
        //Add all the cockpit types
        for (const elem of js["options"]) {
            let opt = { name: elem["name"], exposed: elem["exposed"], stats: new Stats(elem) };
            this.types.push(opt);
        }
        this.upgrades = [];
        //Add all the upgrades
        for (const elem of js["upgrades"]) {
            let upg = { name: elem["name"], stats: new Stats(elem) };
            this.upgrades.push(upg);
        }
        this.safety = [];
        //Add all the safety
        for (const elem of js["safety"]) {
            let sft = { name: elem["name"], stats: new Stats(elem) };
            this.safety.push(sft);
        }
        this.gunsights = [];
        //Add all the gunsights
        for (const elem of js["gunsights"]) {
            let gun = { name: elem["name"], attack: elem["attack"], stats: new Stats(elem) };
            this.gunsights.push(gun);
        }
    }

    public toJSON() {
        const lst = [];
        for (const cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.positions = [];
        for (const elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.fromJSON(elem, json_version);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);

        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.positions.length);
        for (const cp of this.positions) {
            cp.serialize(s);
        }
    }

    public deserialize(d: Deserialize) {
        const len = d.GetNum();
        this.positions = [];
        for (let i = 0; i < len; i++) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.deserialize(d);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }

    public GetAttackList() {
        const lst = [];
        for (const c of this.positions) {
            lst.push(c.GetAttack());
        }
        return lst;
    }

    public GetVisibilityList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }

    public GetStressList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }

    public GetEscapeList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }

    public GetCrashList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetCrash());
        }
        return lst;
    }

    public SetNumberOfCockpits(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        var js = null;
        if (this.positions.length > 0) {
            js = JSON.stringify(this.positions[this.positions.length - 1].toJSON());
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            if (js)
                cp.fromJSON(JSON.parse(js), 1000);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
        this.CalculateStats();
    }

    public GetNumberOfCockpits() {
        return this.positions.length;
    }

    public GetCockpit(index: number) {
        return this.positions[index];
    }

    public SetHasRotary(has: boolean) {
        for (const c of this.positions) {
            c.SetHasRotary(has);
        }
    }

    public IsElectrics() {
        for (const c of this.positions) {
            if (c.IsElectrics())
                return true;
        }
        return false;
    }

    public PartStats(): Stats {
        var s = new Stats();
        let warningmap = new Map();
        for (let i = 0; i < this.positions.length; i++) {
            let cp = this.positions[i];
            let cps = cp.PartStats();
            s = s.Add(cps);
            // We want to merge all the warnings for different seats so we don't end up with a pile of warnings.
            for (const w of cps.warnings) {
                let exist = warningmap.get(w.source);
                if (exist) {
                    exist.push(i + 1);
                    warningmap.set(w.source, exist);
                } else {
                    warningmap.set(w.source, [i + 1]);
                }
            }
        }

        for (const w of s.warnings) {
            w.source = lu("Seats #", StringFmt.Join(",", warningmap.get(w.source))) + " " + w.source;
        }

        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0;
        //This needs special work for co-pilot controls
        //s.flightstress = 0;
        s.visibility = 0;
        s.crashsafety = 0;
        return s;
    }

    public SetArmed(armed: boolean[]) {
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i].SetArmed(armed[i]);
        }
    }

    public UpdateCrewStats(escape: number, controlstress: number, rumblestress: number, visibility: number, crash: number) {
        let copilots = 0;
        for (const cp of this.positions) {
            if (cp.IsCopilot()) {
                copilots += 1;
            }
        }
        for (const cp of this.positions) {
            cp.CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash);
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };

        for (const c of this.positions) {
            value = MergeElectrics(value, c.GetElectrics());
        }

        return value;
    }

}
