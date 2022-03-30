import { Part, MergeElectrics } from "./Part.js";
import { Stats } from "./Stats.js";
import { lu } from "./Localization.js";
import { Cockpit } from "./Cockpit.js";
import { StringFmt } from "../string/index.js";
export class Cockpits extends Part {
    constructor(js) {
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
    toJSON() {
        const lst = [];
        for (const cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }
    fromJSON(js, json_version) {
        this.positions = [];
        for (const elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.fromJSON(elem, json_version);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    serialize(s) {
        s.PushNum(this.positions.length);
        for (const cp of this.positions) {
            cp.serialize(s);
        }
    }
    deserialize(d) {
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
    GetAttackList() {
        const lst = [];
        for (const c of this.positions) {
            lst.push(c.GetAttack());
        }
        return lst;
    }
    GetVisibilityList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }
    GetStressList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }
    GetEscapeList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }
    GetCrashList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetCrash());
        }
        return lst;
    }
    SetNumberOfCockpits(num) {
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
    GetNumberOfCockpits() {
        return this.positions.length;
    }
    GetCockpit(index) {
        return this.positions[index];
    }
    SetHasRotary(has) {
        for (const c of this.positions) {
            c.SetHasRotary(has);
        }
    }
    IsElectrics() {
        for (const c of this.positions) {
            if (c.IsElectrics())
                return true;
        }
        return false;
    }
    PartStats() {
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
                }
                else {
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
    SetArmed(armed) {
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i].SetArmed(armed[i]);
        }
    }
    UpdateCrewStats(escape, controlstress, rumblestress, visibility, crash) {
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        for (const c of this.positions) {
            value = MergeElectrics(value, c.GetElectrics());
        }
        return value;
    }
}
