class Stats {
    constructor(js) {
        this.liftbleed = 0;
        this.wetmass = 0;
        this.mass = 0;
        this.drag = 0;
        this.control = 0;
        this.cost = 0;
        this.reqsections = 0;
        this.visibility = 0;
        this.flightstress = 0;
        this.escape = 0;
        this.pitchstab = 0;
        this.latstab = 0;
        this.cooling = 0;
        this.reliability = 0;
        this.power = 0;
        this.fuelconsumption = 0;
        this.maxstrain = 0;
        this.structure = 0;
        this.pitchspeed = 0;
        this.pitchboost = 0;
        this.wingarea = 0;
        this.toughness = 0;
        this.upkeep = 0;
        this.crashsafety = 0;
        this.bomb_mass = 0;
        this.fuel = 0;
        this.charge = 0;
        this.warnings = [];
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return {
            liftbleed: this.liftbleed,
            wetmass: this.wetmass,
            mass: this.mass,
            drag: this.drag,
            control: this.control,
            cost: this.cost,
            reqsections: this.reqsections,
            visibility: this.visibility,
            flightstress: this.flightstress,
            escape: this.escape,
            pitchstab: this.pitchstab,
            latstab: this.latstab,
            cooling: this.cooling,
            reliability: this.reliability,
            power: this.power,
            fuelconsumption: this.fuelconsumption,
            maxstrain: this.maxstrain,
            structure: this.structure,
            pitchboost: this.pitchboost,
            pitchspeed: this.pitchspeed,
            wingarea: this.wingarea,
            toughness: this.toughness,
            upkeep: this.upkeep,
            crashsafety: this.crashsafety,
            bomb_mass: this.bomb_mass,
            fuel: this.fuel,
            charge: this.charge,
        };
    }
    fromJSON(js) {
        if (js["liftbleed"])
            this.liftbleed = js["liftbleed"];
        if (js["wetmass"])
            this.wetmass = js["wetmass"];
        if (js["mass"])
            this.mass = js["mass"];
        if (js["drag"])
            this.drag = js["drag"];
        if (js["control"])
            this.control = js["control"];
        if (js["cost"])
            this.cost = js["cost"];
        if (js["reqsections"])
            this.reqsections = js["reqsections"];
        if (js["visibility"])
            this.visibility = js["visibility"];
        if (js["flightstress"])
            this.flightstress = js["flightstress"];
        if (js["escape"])
            this.escape = js["escape"];
        if (js["pitchstab"])
            this.pitchstab = js["pitchstab"];
        if (js["latstab"])
            this.latstab = js["latstab"];
        if (js["cooling"])
            this.cooling = js["cooling"];
        if (js["reliability"])
            this.reliability = js["reliability"];
        if (js["power"])
            this.power = js["power"];
        if (js["fuelconsumption"])
            this.fuelconsumption = js["fuelconsumption"];
        if (js["maxstrain"])
            this.maxstrain = js["maxstrain"];
        if (js["structure"])
            this.structure = js["structure"];
        if (js["pitchspeed"])
            this.pitchspeed = js["pitchspeed"];
        if (js["pitchboost"])
            this.pitchboost = js["pitchboost"];
        if (js["wingarea"])
            this.wingarea = js["wingarea"];
        if (js["toughness"])
            this.toughness = js["toughness"];
        if (js["upkeep"])
            this.upkeep = js["upkeep"];
        if (js["crashsafety"])
            this.crashsafety = js["crashsafety"];
        if (js["bomb_mass"])
            this.bomb_mass = js["bomb_mass"];
        if (js["fuel"])
            this.fuel = js["fuel"];
        if (js["charge"])
            this.charge = js["charge"];
        if (js["warning"])
            this.warnings.push({ source: js["name"], warning: js["warning"] });
    }
    serialize(s) {
        s.PushNum(this.liftbleed);
        s.PushNum(this.wetmass);
        s.PushNum(this.mass);
        s.PushNum(this.drag);
        s.PushNum(this.control);
        s.PushNum(this.cost);
        s.PushNum(this.reqsections);
        s.PushNum(this.visibility);
        s.PushNum(this.flightstress);
        s.PushNum(this.escape);
        s.PushNum(this.pitchstab);
        s.PushNum(this.latstab);
        s.PushNum(this.cooling);
        s.PushNum(this.reliability);
        s.PushNum(this.power);
        s.PushNum(this.fuelconsumption);
        s.PushNum(this.maxstrain);
        s.PushNum(this.structure);
        s.PushFloat(this.pitchboost);
        s.PushFloat(this.pitchspeed);
        s.PushNum(this.wingarea);
        s.PushNum(this.toughness);
        s.PushNum(this.upkeep);
        s.PushNum(this.crashsafety);
        s.PushNum(this.bomb_mass);
        s.PushNum(this.fuel);
        s.PushNum(this.charge);
    }
    deserialize(d) {
        this.liftbleed = d.GetNum();
        this.wetmass = d.GetNum();
        this.mass = d.GetNum();
        this.drag = d.GetNum();
        this.control = d.GetNum();
        this.cost = d.GetNum();
        this.reqsections = d.GetNum();
        this.visibility = d.GetNum();
        this.flightstress = d.GetNum();
        this.escape = d.GetNum();
        this.pitchstab = d.GetNum();
        this.latstab = d.GetNum();
        this.cooling = d.GetNum();
        this.reliability = d.GetNum();
        this.power = d.GetNum();
        this.fuelconsumption = d.GetNum();
        this.maxstrain = d.GetNum();
        this.structure = d.GetNum();
        this.pitchboost = d.GetFloat();
        this.pitchspeed = d.GetFloat();
        this.wingarea = d.GetNum();
        this.toughness = d.GetNum();
        this.upkeep = d.GetNum();
        this.crashsafety = d.GetNum();
        this.bomb_mass = d.GetNum();
        this.fuel = d.GetNum();
        this.charge = d.GetNum();
    }
    Add(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed + other.liftbleed;
        res.wetmass = this.wetmass + other.wetmass;
        res.mass = this.mass + other.mass;
        res.drag = this.drag + other.drag;
        res.control = this.control + other.control;
        res.cost = this.cost + other.cost;
        res.reqsections = this.reqsections + other.reqsections;
        res.visibility = this.visibility + other.visibility;
        res.flightstress = this.flightstress + other.flightstress;
        res.escape = this.escape + other.escape;
        res.pitchstab = this.pitchstab + other.pitchstab;
        res.latstab = this.latstab + other.latstab;
        res.cooling = this.cooling + other.cooling;
        res.reliability = this.reliability + other.reliability;
        res.power = this.power + other.power;
        res.fuelconsumption = this.fuelconsumption + other.fuelconsumption;
        res.maxstrain = this.maxstrain + other.maxstrain;
        res.structure = this.structure + other.structure;
        res.pitchboost = this.pitchboost + other.pitchboost;
        res.pitchspeed = this.pitchspeed + other.pitchspeed;
        res.wingarea = this.wingarea + other.wingarea;
        res.toughness = this.toughness + other.toughness;
        res.upkeep = this.upkeep + other.upkeep;
        res.crashsafety = this.crashsafety + other.crashsafety;
        res.bomb_mass = this.bomb_mass + other.bomb_mass;
        res.fuel = this.fuel + other.fuel;
        res.charge = this.charge + other.charge;
        res.warnings = this.MergeWarnings(other.warnings);
        return res;
    }
    MergeWarnings(owarn) {
        var newList = [];
        for (let w2 of this.warnings) {
            newList.push(w2);
        }
        for (let w of owarn) {
            let dup = false;
            for (let w2 of this.warnings) {
                if (w.source == w2.source && w.warning == w2.warning)
                    dup = true;
            }
            if (!dup)
                newList.push(w);
        }
        return newList;
    }
    Multiply(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed * other;
        res.wetmass = this.wetmass * other;
        res.mass = this.mass * other;
        res.drag = this.drag * other;
        res.control = this.control * other;
        res.cost = this.cost * other;
        res.reqsections = this.reqsections * other;
        res.visibility = this.visibility * other;
        res.flightstress = this.flightstress * other;
        res.escape = this.escape * other;
        res.pitchstab = this.pitchstab * other;
        res.latstab = this.latstab * other;
        res.cooling = this.cooling * other;
        res.reliability = this.reliability * other;
        res.power = this.power * other;
        res.fuelconsumption = this.fuelconsumption * other;
        res.maxstrain = this.maxstrain * other;
        res.structure = this.structure * other;
        res.pitchboost = this.pitchboost * other;
        res.pitchspeed = this.pitchspeed * other;
        res.wingarea = this.wingarea * other;
        res.toughness = this.toughness * other;
        res.upkeep = this.upkeep * other;
        res.crashsafety = this.crashsafety * other;
        res.bomb_mass = this.bomb_mass * other;
        res.fuel = this.fuel * other;
        res.charge = this.charge * other;
        if (other != 0)
            res.warnings = this.warnings;
        return res;
    }
    Equal(other) {
        return this.liftbleed == other.liftbleed
            && this.wetmass == other.wetmass
            && this.mass == other.mass
            && this.drag == other.drag
            && this.control == other.control
            && this.cost == other.cost
            && this.reqsections == other.reqsections
            && this.visibility == other.visibility
            && this.flightstress == other.flightstress
            && this.escape == other.escape
            && this.pitchstab == other.pitchstab
            && this.latstab == other.latstab
            && this.cooling == other.cooling
            && this.reliability == other.reliability
            && this.power == other.power
            && this.fuelconsumption == other.fuelconsumption
            && this.maxstrain == other.maxstrain
            && this.structure == other.structure
            && this.pitchspeed == other.pitchspeed
            && this.pitchboost == other.pitchboost
            && this.wingarea == other.wingarea
            && this.toughness == other.toughness
            && this.upkeep == other.upkeep
            && this.crashsafety == other.crashsafety
            && this.bomb_mass == other.bomb_mass
            && this.fuel == other.fuel
            && this.charge == other.charge;
    }
    Round() {
        this.liftbleed = Math.trunc(this.liftbleed);
        this.wetmass = Math.trunc(this.wetmass);
        this.mass = Math.trunc(this.mass);
        this.drag = Math.trunc(this.drag);
        this.control = Math.trunc(this.control);
        this.cost = Math.trunc(this.cost);
        this.reqsections = Math.trunc(this.reqsections);
        this.visibility = Math.trunc(this.visibility);
        this.flightstress = Math.trunc(this.flightstress);
        this.escape = Math.trunc(this.escape);
        this.pitchstab = Math.trunc(this.pitchstab);
        this.latstab = Math.trunc(this.latstab);
        this.cooling = Math.trunc(this.cooling);
        this.reliability = Math.trunc(this.reliability);
        this.power = Math.trunc(this.power);
        this.fuelconsumption = Math.trunc(this.fuelconsumption);
        this.maxstrain = Math.trunc(this.maxstrain);
        this.structure = Math.trunc(this.structure);
        this.wingarea = Math.trunc(this.wingarea);
        this.toughness = Math.trunc(this.toughness);
        this.upkeep = Math.trunc(this.upkeep);
        this.crashsafety = Math.trunc(this.crashsafety);
        this.bomb_mass = Math.trunc(this.bomb_mass);
        this.fuel = Math.trunc(this.fuel);
        this.charge = Math.trunc(this.charge);
    }
    Clone() {
        return this.Add(new Stats());
    }
}
class Serialize {
    constructor(arr) {
        this.array = new ArrayBuffer(51200);
        this.view = new DataView(this.array);
        this.offset = 0;
    }
    Check() {
        if (this.offset >= this.array.byteLength)
            throw "Serialization Way too long.";
    }
    PushNum(num) {
        this.view.setInt16(this.offset, num, false);
        this.offset += 2;
        this.Check();
    }
    PushBool(bool) {
        if (bool)
            this.view.setUint8(this.offset, 1);
        else
            this.view.setUint8(this.offset, 0);
        this.offset += 1;
        this.Check();
    }
    PushString(str) {
        this.PushNum(str.length);
        for (let i = 0; i < str.length; i++) {
            this.view.setUint8(this.offset, str.charCodeAt(i));
            this.offset++;
        }
        this.Check();
    }
    PushNumArr(nums) {
        this.PushNum(nums.length);
        for (let n of nums) {
            this.PushNum(n);
        }
        this.Check();
    }
    PushBoolArr(bools) {
        this.PushNum(bools.length);
        for (let b of bools) {
            this.PushBool(b);
        }
        this.Check();
    }
    PushFloat(flt) {
        this.view.setFloat32(this.offset, flt, false);
        this.offset += 4;
        this.Check();
    }
    FinalArray() {
        return this.array.slice(0, this.offset);
    }
}
class Deserialize {
    constructor(arr) {
        this.array = arr;
        this.view = new DataView(this.array);
        this.offset = 0;
    }
    Check() {
        if (this.offset >= this.array.byteLength)
            throw "Deserialization Failed";
    }
    GetNum() {
        this.Check();
        var num = this.view.getInt16(this.offset, false);
        this.offset += 2;
        return num;
    }
    GetBool() {
        this.Check();
        var bool = this.view.getUint8(this.offset);
        this.offset += 1;
        return bool > 0;
    }
    GetString() {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            var char = this.view.getUint8(this.offset);
            arr.push(char);
            this.offset += 1;
        }
        return String.fromCharCode(...arr);
    }
    GetNumArr() {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetNum());
        }
        return arr;
    }
    GetBoolArr() {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetBool());
        }
        return arr;
    }
    GetFloat() {
        this.Check();
        var flt = this.view.getFloat32(this.offset, false);
        this.offset += 4;
        return flt;
    }
}
/// <reference path="./Stats.ts" />
/// <reference path="./Serialize.ts"/>
class EngineStats {
    constructor(js) {
        this.name = "";
        this.overspeed = 0;
        this.altitude = 0;
        this.torque = 0;
        this.rumble = 0;
        this.oiltank = false;
        this.pulsejet = false;
        this.stats = new Stats();
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return Object.assign({ name: this.name, overspeed: this.overspeed, altitude: this.altitude, torque: this.torque, rumble: this.rumble, oiltank: this.oiltank, pulsejet: this.pulsejet }, this.stats.toJSON());
    }
    fromJSON(js) {
        this.name = js["name"];
        this.overspeed = js["overspeed"];
        this.altitude = js["altitude"];
        this.torque = js["torque"];
        this.rumble = js["rumble"];
        this.oiltank = js["oiltank"];
        this.pulsejet = js["pulsejet"];
        this.stats = new Stats(js);
    }
    serialize(s) {
        s.PushString(this.name);
        s.PushNum(this.overspeed);
        s.PushNum(this.altitude);
        s.PushNum(this.torque);
        s.PushNum(this.rumble);
        s.PushBool(this.oiltank);
        s.PushBool(this.pulsejet);
        this.stats.serialize(s);
    }
    deserialize(d) {
        this.name = d.GetString();
        this.overspeed = d.GetNum();
        this.altitude = d.GetNum();
        this.torque = d.GetNum();
        this.rumble = d.GetNum();
        this.oiltank = d.GetBool();
        this.pulsejet = d.GetBool();
        this.stats.deserialize(d);
    }
    Add(other) {
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
    Clone() {
        return this.Add(new EngineStats());
    }
    Equal(other) {
        return this.stats.Equal(other.stats)
            && this.overspeed == other.overspeed
            && this.altitude == other.altitude
            && this.torque == other.torque
            && this.rumble == other.rumble
            && this.oiltank == other.oiltank
            && this.pulsejet == other.pulsejet;
    }
    Verify() {
        if (this.oiltank) {
            this.stats.cooling = 0;
        }
        this.PulseJetCheck();
    }
    PulseJetCheck() {
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
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
class EngineList {
    constructor() {
        this.list = [];
        var ejson = window.localStorage.engines;
        if (ejson != null)
            this.fromJSON(JSON.parse(ejson));
    }
    toJSON() {
        var ret = [];
        for (let li of this.list) {
            ret.push(li.toJSON());
        }
        return { engines: ret };
    }
    fromJSON(js) {
        for (let elem of js["engines"]) {
            this.push(new EngineStats(elem));
        }
    }
    serialize(s) {
        s.PushNum(this.list.length);
        for (let li of this.list) {
            li.serialize(s);
        }
    }
    deserialize(d) {
        var len = d.GetNum();
        for (let i = 0; i < len; i++) {
            let stats = new EngineStats();
            stats.deserialize(d);
            this.push(stats);
        }
    }
    deserializeEngine(d) {
        let stats = new EngineStats();
        stats.deserialize(d);
        return this.push(stats);
    }
    push(es) {
        for (let i = 0; i < this.length; i++) {
            let li = this.list[i];
            if (li.Equal(es))
                return i;
        }
        this.list.push(es.Clone());
        window.localStorage.engines = JSON.stringify(this.toJSON());
        this.list.sort((a, b) => { return ('' + a.name).localeCompare(b.name); });
        return this.find(es);
    }
    get(i) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i];
    }
    find(es) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }
    remove(es) {
        var idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
    }
    get length() {
        return this.list.length;
    }
}
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
class EngineBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", materials: 3, cost: 0.5, maxRPM: 30, powerdiv: 8, fuelfactor: 10 },
            { name: "WWI", materials: 2, cost: 1, maxRPM: 35, powerdiv: 7, fuelfactor: 8 },
            { name: "Interbellum", materials: 1.5, cost: 2, maxRPM: 40, powerdiv: 6, fuelfactor: 6 },
            { name: "WWII", materials: 1.25, cost: 2.5, maxRPM: 45, powerdiv: 5, fuelfactor: 4 },
            { name: "Last Hurrah", materials: 1, cost: 3, maxRPM: 50, powerdiv: 4, fuelfactor: 2 },
        ];
        this.CoolingTable = [
            { name: "Liquid Cooled", forcefactor: 1.2, RPMoff: 0, thrustfactor: 1, radiator: 1, massfactor: 1 },
            { name: "Air Cooled", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Rotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.5, radiator: 0, massfactor: 1 },
            { name: "Contrarotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.25, radiator: 0, massfactor: 1 },
            { name: "Semi-Radial", forcefactor: 0.8, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Liquid Radial", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 2.5, massfactor: 1.3 },
        ];
        this.Upgrades = [
            { name: "Supercharger", powerfactor: 0.1, fuelfactor: 0.25, massfactor: 0.2, dragfactor: 0.5, idealalt: 3, costfactor: 6, reqsection: false },
            { name: "Turbocharger", powerfactor: 0.25, fuelfactor: 0, massfactor: 0.5, dragfactor: 0.5, idealalt: 4, costfactor: 8, reqsection: true },
            { name: "Asperator Boost", powerfactor: 0.11, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: -1, costfactor: 3, reqsection: false },
            { name: "War Emergency Power", powerfactor: 0, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 5, reqsection: false },
            { name: "Fuel Injector", powerfactor: 0, fuelfactor: -0.1, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 2, reqsection: false },
            { name: "Diesel", powerfactor: -0.2, fuelfactor: -0.5, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 0, reqsection: false },
        ];
        this.name = "Default Name";
        this.era_sel = 0;
        this.cool_sel = 0;
        this.upg_sel = [...Array(this.Upgrades.length).fill(false)];
        this.engine_displacement = 1;
        this.num_cyl_per_row = 2;
        this.num_rows = 2;
        this.compression_ratio = 2;
        this.rpm_boost = 1;
        this.material_fudge = 1;
        this.quality_fudge = 1;
    }
    UpgradePower() {
        var power = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                power += this.Upgrades[i].powerfactor;
        }
        if (this.upg_sel[0]) {
            power *= 1 + this.Upgrades[0].powerfactor;
        }
        return power;
    }
    RPM() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        return (Era.maxRPM - Cool.RPMoff) * (this.compression_ratio / 10);
    }
    GearedRPM() {
        var GearedRPM = this.RPM() * this.rpm_boost;
        return GearedRPM;
    }
    CalcPower() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        //Calculate Force
        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var RawForce = EngineForce * this.UpgradePower();
        //Output Force
        var OutputForce = RawForce * (this.GearedRPM() / 10);
        return Math.floor(1.0e-6 + OutputForce / Era.powerdiv);
    }
    UpgradeMass() {
        var mass = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                mass += this.Upgrades[i].massfactor;
        }
        return mass;
    }
    CalcMass() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        var CylMass = Math.pow(this.engine_displacement, 2) * this.compression_ratio / 1000;
        var CrankMass = (this.engine_displacement * this.num_rows) / 10 + 1;
        var PistMass = this.engine_displacement / 5;
        var Mass = Math.floor(1.0e-6 + (CylMass + CrankMass + PistMass) * this.UpgradeMass() * this.material_fudge * Cool.massfactor);
        return Mass;
    }
    UpgradeDrag() {
        var drag = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                drag += this.Upgrades[i].dragfactor;
        }
        return drag;
    }
    CoolDrag() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 1;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return this.GearedRPM() / 10;
            case "Contrarotary":
                return this.GearedRPM() / 8;
            case "Semi-Radial":
                return 1;
            case "Liquid Radial":
                return 1.2;
        }
        throw "Error in CoolDrag, no valid switch case.";
    }
    CalcDrag() {
        var RawDrag = 3 + (this.engine_displacement / this.num_rows) / 3;
        return Math.floor(1.0e-6 + RawDrag * this.CoolDrag() * this.UpgradeDrag());
    }
    CoolReliability() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return (this.num_rows / 2 + 5 * this.num_cyl_per_row) / 10;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return 1;
            case "Contrarotary":
                return 1.1;
            case "Semi-Radial":
                return 0.8;
            case "Liquid Radial":
                return 1;
        }
        throw "Error in CoolReliability, no valid switch case.";
    }
    CoolBurnout() {
        var EraBurnout = this.EraTable[this.era_sel].materials / 2;
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 2;
            case "Air Cooled":
                return (2 + (Math.pow(this.num_rows, 2))) * EraBurnout;
            case "Rotary":
                return (Math.pow(this.num_rows, 2)) / (this.GearedRPM() / 10);
            case "Contrarotary":
                return (Math.pow(this.num_rows, 2)) / (this.GearedRPM() / 10);
            case "Semi-Radial":
                return (2 + (Math.pow(this.num_rows, 2)) / 2) * EraBurnout;
            case "Liquid Radial":
                return 0.5;
        }
        throw "Error in CoolBurnout, no valid switch case.";
    }
    MaterialModifier() {
        var EraBurnout = this.EraTable[this.era_sel].materials;
        var num_cyl = this.num_cyl_per_row * this.num_rows;
        var CylinderBurnout = this.engine_displacement / num_cyl * (Math.pow(this.compression_ratio, 2)) * EraBurnout;
        var GearingBurnout = this.rpm_boost * CylinderBurnout * this.CoolBurnout();
        return GearingBurnout * this.rpm_boost / (this.material_fudge + this.quality_fudge - 1);
    }
    CalcReliability() {
        var Reliability = 6 - this.MaterialModifier() * this.CoolReliability() / 25;
        return Math.trunc(Reliability);
    }
    IsRotary() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary"
            || this.CoolingTable[this.cool_sel].name == "Contrarotary")
            return true;
        return false;
    }
    CalcCooling() {
        if (this.IsRotary())
            return 0;
        return Math.floor(1.0e-6 + this.MaterialModifier() / 20 * this.CoolingTable[this.cool_sel].radiator);
    }
    CalcOverspeed() {
        return Math.round(1.5 * this.RPM());
    }
    UpgradeFuel() {
        var fuel = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                fuel += this.Upgrades[i].fuelfactor;
        }
        return fuel * this.EraTable[this.era_sel].fuelfactor;
    }
    CalcFuelConsumption() {
        var FuelConsumption = this.engine_displacement * this.RPM() / 100;
        return Math.floor(1.0e-6 + FuelConsumption * this.UpgradeFuel());
    }
    CalcAltitude() {
        var alt = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                alt += this.Upgrades[i].idealalt;
        }
        return 3 + alt;
    }
    CoolTorque() {
        if (this.IsRotary()) {
            return this.CalcMass();
        }
        return 1;
    }
    CalcTorque() {
        return Math.floor(1.0e-6 + (this.CoolTorque() * this.GearedRPM() / 5) / 4);
    }
    UpgradeCost() {
        var cost = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                cost += this.Upgrades[i].costfactor;
        }
        return cost;
    }
    CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var CylinderForce = EngineForce / (this.num_rows * this.num_cyl_per_row);
        var Cost = this.UpgradeCost() + (CylinderForce / 10 * (this.num_cyl_per_row + (this.num_rows * 1.3)));
        return Math.floor(1.0e-6 + this.quality_fudge * Era.cost * Cost);
    }
    EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;
        estats.stats.power = this.CalcPower();
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.cooling = this.CalcCooling();
        estats.oiltank = this.IsRotary();
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.altitude = this.CalcAltitude();
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        return estats;
    }
}
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
class PulsejetBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
            { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
            { name: "Interbellum", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
            { name: "WWII", cost: 0.25, drag: 40, mass: 100, fuel: 1, vibe: 5, material: 24 },
            { name: "Last Hurrah", cost: 0.1, drag: 50, mass: 150, fuel: 0.7, vibe: 6, material: 50 },
        ];
        this.ValveTable = [
            { name: "Valved", scale: 1, rumble: 1, designcost: 2, reliability: 1 },
            { name: "Valveless", scale: 1.1, rumble: 0.9, designcost: 1, reliability: 3 },
        ];
        this.desired_power = 1;
        this.valve_sel = 0;
        this.era_sel = 0;
        this.build_quality = 1;
        this.overall_quality = 1;
        this.starter = false;
    }
    TempMass() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];
        var StarterMass = 0;
        if (this.starter)
            StarterMass = 1;
        var Mass = (this.desired_power / Era.mass) * Valve.scale + StarterMass;
        return Mass;
    }
    CalcMass() {
        return Math.floor(1.0e-6 + this.TempMass()) + 1;
    }
    CalcDrag() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];
        var Drag = (this.desired_power / Era.drag) * Valve.scale + 1;
        return Math.floor(1.0e-6 + this.TempMass() + Drag + 1);
    }
    CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];
        var Reliability = this.desired_power / (Era.material * Valve.reliability * this.overall_quality) - 1;
        return Math.trunc(-Reliability);
    }
    CalcFuelConsumption() {
        var Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.desired_power * Era.fuel);
    }
    CalcRumble() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];
        return Math.floor(1.0e-6 + this.desired_power * Valve.rumble / (2 * Era.vibe));
    }
    CalcCost() {
        var Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.TempMass() * this.build_quality * Era.cost) + 1;
    }
    DesignCost() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];
        var StarterCost = 0;
        if (this.starter)
            StarterCost = 3;
        var Cost = this.desired_power * Era.cost / Valve.designcost;
        return Math.floor(1.0e-6 + 1 + this.build_quality * (Cost + StarterCost));
    }
    EngineStats() {
        var estats = new EngineStats();
        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";
        estats.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        estats.stats.power = this.desired_power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.rumble = this.CalcRumble();
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 3;
        estats.pulsejet = true;
        return estats;
    }
}
var internal_id = 0;
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}
function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}
function CreateFlexSection(elem) {
    var fs = {
        div0: document.createElement("DIV"), div1: document.createElement("DIV"),
        div2: document.createElement("DIV")
    };
    fs.div0.classList.add("flex-container-o");
    fs.div1.classList.add("flex-container-i");
    fs.div2.classList.add("flex-container-i");
    fs.div0.appendChild(fs.div1);
    fs.div0.appendChild(fs.div2);
    elem.appendChild(fs.div0);
    return fs;
}
function CreateTH(row, content) {
    var th = document.createElement("TH");
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}
function CreateInput(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "number");
    elem.min = "0";
    elem.step = "1";
    elem.valueAsNumber = 0;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function FlexInput(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "number");
    inp.min = "0";
    inp.step = "1";
    inp.valueAsNumber = 0;
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexText(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "text");
    inp.value = "Default";
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexDisplay(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexSelect(txt, sel, fs) {
    var lbl = document.createElement("LABEL");
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}
function CreateSpace(elem) {
    var span = document.createElement("SPAN");
    span.innerHTML = "&nbsp;";
    elem.appendChild(span);
}
function CreateCheckbox(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "checkbox");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateSelect(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateButton(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.hidden = true;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "<b>&nbsp;" + txt + "&nbsp;&nbsp;</b>";
    txtSpan.classList.add("lbl_action");
    txtSpan.classList.add("btn_th");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br) {
        table.appendChild(document.createElement("BR"));
        table.appendChild(document.createElement("BR"));
    }
}
function FlexCheckbox(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "checkbox");
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexLabel(txt, div1) {
    var lbl = document.createElement("LABEL");
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
}
function FlexSpace(fs) {
    var lbl = document.createElement("LABEL");
    lbl.innerHTML = "&nbsp;";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    var lbl2 = document.createElement("LABEL");
    lbl2.innerHTML = "&nbsp;";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}
function Blink(elem) {
    elem.classList.toggle("changed", false);
    elem.offsetHeight;
    elem.classList.toggle("changed");
}
function BlinkIfChanged(elem, str) {
    if (elem.innerText != str) {
        Blink(elem);
    }
    elem.innerText = str;
}
function _arrayBufferToString(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
function _stringToArrayBuffer(str) {
    var bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
}
const loadJSON = (path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function () {
    // private property
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return baseReverseDic[alphabet][character];
    }
    var LZString = {
        compressToBase64: function (input) {
            if (input == null)
                return "";
            var res = LZString._compress(input, 6, function (a) { return keyStrBase64.charAt(a); });
            switch (res.length % 4) { // To produce valid Base64
                default: // When could this happen ?
                case 0: return res;
                case 1: return res + "===";
                case 2: return res + "==";
                case 3: return res + "=";
            }
        },
        decompressFromBase64: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
        },
        compressToUTF16: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 15, function (a) { return f(a + 32); }) + " ";
        },
        decompressFromUTF16: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function (uncompressed) {
            var compressed = LZString.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                var current_value = compressed.charCodeAt(i);
                buf[i * 2] = current_value >>> 8;
                buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function (compressed) {
            if (compressed === null || compressed === undefined) {
                return LZString.decompress(compressed);
            }
            else {
                var buf = new Array(compressed.length / 2); // 2 bytes per character
                for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                    buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
                }
                var result = [];
                buf.forEach(function (c) {
                    result.push(f(c));
                });
                return LZString.decompress(result.join(''));
            }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 6, function (a) { return keyStrUriSafe.charAt(a); });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            input = input.replace(/ /g, "+");
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
        },
        compress: function (uncompressed) {
            return LZString._compress(uncompressed, 16, function (a) { return f(a); });
        },
        _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null)
                return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
            context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                }
                else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    }
                    else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }
            // Output the code for w.
            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }
            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                }
                else
                    context_data_position++;
            }
            return context_data.join('');
        },
        decompress: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
        },
        _decompress: function (length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return "";
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
                if (dictionary[c]) {
                    entry = dictionary[c];
                }
                else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0);
                    }
                    else {
                        return null;
                    }
                }
                result.push(entry);
                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
    };
    return LZString;
})();
/// <reference path="../disp/Tools.ts" />
/// <reference path="./EngineBuilder.ts" />
/// <reference path="./PulsejetBuilder.ts" />
/// <reference path="../lz/lz-string.ts" />
const init = () => {
    const sp = new URLSearchParams(location.search);
    var ep = sp.get("engine");
    elist = new EngineList();
    ebuild = new EngineBuilder_HTML();
    loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
        var engine_json = JSON.parse(engine_resp);
        elist.fromJSON(engine_json);
    });
    if (ep != null) {
        try {
            var str = LZString.decompressFromEncodedURIComponent(ep);
            var arr = _stringToArrayBuffer(str);
            var des = new Deserialize(arr);
            var num = elist.deserializeEngine(des);
            ebuild.SelectEngine(num);
        }
        catch (_a) {
            console.log("Compressed Engine Parameter Failed.");
        }
    }
};
window.onload = init;
var ebuild;
var elist;
class EngineBuilder_HTML {
    constructor() {
        this.enginebuilder = new EngineBuilder();
        this.pulsejetbuilder = new PulsejetBuilder();
        var etbl = document.getElementById("table_engine");
        var erow = etbl.insertRow();
        this.InitEngineInputs(erow.insertCell());
        this.InitEngineUpgrades(erow.insertCell());
        this.InitEngineOutputs(erow.insertCell());
        this.UpdateEngine();
        var ptbl = document.getElementById("table_pulsejet");
        var prow = ptbl.insertRow();
        this.InitPulsejetInputs(prow.insertCell());
        this.InitPulsejetOutputs(prow.insertCell());
        this.UpdatePulsejet();
        var mtbl = document.getElementById("table_manual");
        var mrow = mtbl.insertRow();
        this.InitManual(mrow.insertCell());
        this.InitListManagement(mrow.insertCell());
    }
    InitEngineInputs(cell) {
        this.e_name = document.createElement("INPUT");
        this.e_sera = document.createElement("SELECT");
        this.e_cool = document.createElement("SELECT");
        this.e_disp = document.createElement("INPUT");
        this.e_cmpr = document.createElement("INPUT");
        this.e_ncyl = document.createElement("INPUT");
        this.e_nrow = document.createElement("INPUT");
        this.e_rpmb = document.createElement("INPUT");
        this.e_mfdg = document.createElement("INPUT");
        this.e_qfdg = document.createElement("INPUT");
        for (let e of this.enginebuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.e_sera.add(opt);
        }
        for (let c of this.enginebuilder.CoolingTable) {
            let opt = document.createElement("OPTION");
            opt.text = c.name;
            this.e_cool.add(opt);
        }
        var fs = CreateFlexSection(cell);
        FlexText("Name", this.e_name, fs);
        FlexSelect("Era", this.e_sera, fs);
        FlexSelect("Engine Type", this.e_cool, fs);
        FlexInput("Engine Displacement (L)", this.e_disp, fs);
        FlexInput("Compression Ratio (N:1)", this.e_cmpr, fs);
        FlexInput("Cylinders per Row", this.e_ncyl, fs);
        FlexInput("Number of Rows", this.e_nrow, fs);
        FlexInput("RPM Boost", this.e_rpmb, fs);
        FlexInput("Material Fudge Factor", this.e_mfdg, fs);
        FlexInput("Quality Fudge Factor", this.e_qfdg, fs);
        this.e_disp.step = "0.01";
        this.e_cmpr.step = "0.01";
        this.e_rpmb.step = "0.01";
        this.e_rpmb.min = "0.01";
        this.e_rpmb.max = "2000";
        this.e_mfdg.step = "0.01";
        this.e_mfdg.min = "0.01";
        this.e_mfdg.max = "99999";
        this.e_qfdg.step = "0.01";
        this.e_qfdg.min = "0.01";
        this.e_qfdg.max = "99999";
        this.e_name.onchange = () => { this.enginebuilder.name = this.e_name.value; this.UpdateEngine(); };
        this.e_sera.onchange = () => { this.enginebuilder.era_sel = this.e_sera.selectedIndex; this.UpdateEngine(); };
        this.e_cool.onchange = () => { this.enginebuilder.cool_sel = this.e_cool.selectedIndex; this.UpdateEngine(); };
        this.e_disp.onchange = () => { this.enginebuilder.engine_displacement = this.e_disp.valueAsNumber; this.UpdateEngine(); };
        this.e_cmpr.onchange = () => { this.enginebuilder.compression_ratio = this.e_cmpr.valueAsNumber; this.UpdateEngine(); };
        this.e_ncyl.onchange = () => { this.enginebuilder.num_cyl_per_row = this.e_ncyl.valueAsNumber; this.UpdateEngine(); };
        this.e_nrow.onchange = () => { this.enginebuilder.num_rows = this.e_nrow.valueAsNumber; this.UpdateEngine(); };
        this.e_rpmb.onchange = () => { this.enginebuilder.rpm_boost = this.e_rpmb.valueAsNumber; this.UpdateEngine(); };
        this.e_mfdg.onchange = () => { this.enginebuilder.material_fudge = this.e_mfdg.valueAsNumber; this.UpdateEngine(); };
        this.e_qfdg.onchange = () => { this.enginebuilder.quality_fudge = this.e_qfdg.valueAsNumber; this.UpdateEngine(); };
    }
    InitEngineUpgrades(cell) {
        var fs = CreateFlexSection(cell);
        this.e_upgs = [];
        for (let i = 0; i < this.enginebuilder.Upgrades.length; i++) {
            let u = this.enginebuilder.Upgrades[i];
            let inp = document.createElement("INPUT");
            inp.onchange = () => { this.enginebuilder.upg_sel[i] = this.e_upgs[i].checked; this.UpdateEngine(); };
            FlexCheckbox(u.name, inp, fs);
            this.e_upgs.push(inp);
        }
    }
    InitEngineOutputs(cell) {
        this.ed_name = document.createElement("LABEL");
        this.ed_powr = document.createElement("LABEL");
        this.ed_mass = document.createElement("LABEL");
        this.ed_drag = document.createElement("LABEL");
        this.ed_rely = document.createElement("LABEL");
        this.ed_cool = document.createElement("LABEL");
        this.ed_ospd = document.createElement("LABEL");
        this.ed_fuel = document.createElement("LABEL");
        this.ed_malt = document.createElement("LABEL");
        this.ed_torq = document.createElement("LABEL");
        this.ed_cost = document.createElement("LABEL");
        this.ed_oilt = document.createElement("LABEL");
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.ed_name, fs);
        FlexDisplay("Power", this.ed_powr, fs);
        FlexDisplay("Mass", this.ed_mass, fs);
        FlexDisplay("Drag", this.ed_drag, fs);
        FlexDisplay("Reliability", this.ed_rely, fs);
        FlexDisplay("Required Cooling", this.ed_cool, fs);
        FlexDisplay("Overspeed", this.ed_ospd, fs);
        FlexDisplay("Fuel Consumption", this.ed_fuel, fs);
        FlexDisplay("Altitude", this.ed_malt, fs);
        FlexDisplay("Torque", this.ed_torq, fs);
        FlexDisplay("Cost", this.ed_cost, fs);
        FlexDisplay("Oil Tank", this.ed_oilt, fs);
    }
    UpdateEngine() {
        this.e_name.value = this.enginebuilder.name;
        this.e_sera.selectedIndex = this.enginebuilder.era_sel;
        this.e_cool.selectedIndex = this.enginebuilder.cool_sel;
        this.e_disp.valueAsNumber = this.enginebuilder.engine_displacement;
        this.e_ncyl.valueAsNumber = this.enginebuilder.num_cyl_per_row;
        this.e_nrow.valueAsNumber = this.enginebuilder.num_rows;
        this.e_cmpr.valueAsNumber = this.enginebuilder.compression_ratio;
        this.e_rpmb.valueAsNumber = this.enginebuilder.rpm_boost;
        this.e_mfdg.valueAsNumber = this.enginebuilder.material_fudge;
        this.e_qfdg.valueAsNumber = this.enginebuilder.quality_fudge;
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].checked = this.enginebuilder.upg_sel[i];
        }
        var estats = this.enginebuilder.EngineStats();
        BlinkIfChanged(this.ed_name, estats.name);
        BlinkIfChanged(this.ed_powr, estats.stats.power.toString());
        BlinkIfChanged(this.ed_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.ed_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.ed_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.ed_cool, estats.stats.cooling.toString());
        BlinkIfChanged(this.ed_ospd, estats.overspeed.toString());
        BlinkIfChanged(this.ed_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.ed_malt, estats.altitude.toString());
        BlinkIfChanged(this.ed_torq, estats.torque.toString());
        BlinkIfChanged(this.ed_cost, estats.stats.cost.toString());
        if (estats.oiltank)
            BlinkIfChanged(this.ed_oilt, "Yes");
        else
            BlinkIfChanged(this.ed_oilt, "No");
    }
    InitPulsejetInputs(cell) {
        this.p_powr = document.createElement("INPUT");
        this.p_type = document.createElement("SELECT");
        this.p_sera = document.createElement("SELECT");
        this.p_bqul = document.createElement("INPUT");
        this.p_oqul = document.createElement("INPUT");
        this.p_strt = document.createElement("INPUT");
        for (let v of this.pulsejetbuilder.ValveTable) {
            let opt = document.createElement("OPTION");
            opt.text = v.name;
            this.p_type.add(opt);
        }
        for (let e of this.pulsejetbuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.p_sera.add(opt);
        }
        var fs = CreateFlexSection(cell);
        FlexInput("Desired Power", this.p_powr, fs);
        FlexSelect("Engine Type", this.p_type, fs);
        FlexSelect("Era", this.p_sera, fs);
        FlexInput("Quality (Cost)", this.p_bqul, fs);
        FlexInput("Quality (Reliability)", this.p_oqul, fs);
        FlexCheckbox("Starter", this.p_strt, fs);
        this.p_bqul.step = "1";
        this.p_bqul.min = "0";
        this.p_oqul.step = "0.1";
        this.p_oqul.min = "0.1";
        this.p_powr.onchange = () => { this.pulsejetbuilder.desired_power = this.p_powr.valueAsNumber; this.UpdatePulsejet(); };
        this.p_type.onchange = () => { this.pulsejetbuilder.valve_sel = this.p_type.selectedIndex; this.UpdatePulsejet(); };
        this.p_sera.onchange = () => { this.pulsejetbuilder.era_sel = this.p_sera.selectedIndex; this.UpdatePulsejet(); };
        this.p_bqul.onchange = () => { this.pulsejetbuilder.build_quality = this.p_bqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_oqul.onchange = () => { this.pulsejetbuilder.overall_quality = this.p_oqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_strt.onchange = () => { this.pulsejetbuilder.starter = this.p_strt.checked; this.UpdatePulsejet(); };
    }
    InitPulsejetOutputs(cell) {
        this.pd_name = document.createElement("LABEL");
        this.pd_powr = document.createElement("LABEL");
        this.pd_mass = document.createElement("LABEL");
        this.pd_drag = document.createElement("LABEL");
        this.pd_rely = document.createElement("LABEL");
        this.pd_fuel = document.createElement("LABEL");
        this.pd_rumb = document.createElement("LABEL");
        this.pd_cost = document.createElement("LABEL");
        this.pd_malt = document.createElement("LABEL");
        this.pd_dcst = document.createElement("LABEL");
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.pd_name, fs);
        FlexDisplay("Power", this.pd_powr, fs);
        FlexDisplay("Mass", this.pd_mass, fs);
        FlexDisplay("Drag", this.pd_drag, fs);
        FlexDisplay("Reliability", this.pd_rely, fs);
        FlexDisplay("Fuel Consumption", this.pd_fuel, fs);
        FlexDisplay("Rumble", this.pd_rumb, fs);
        FlexDisplay("Cost", this.pd_cost, fs);
        FlexDisplay("Altitude", this.pd_malt, fs);
        FlexDisplay("Design Cost", this.pd_dcst, fs);
    }
    UpdatePulsejet() {
        this.p_powr.valueAsNumber = this.pulsejetbuilder.desired_power;
        this.p_type.selectedIndex = this.pulsejetbuilder.valve_sel;
        this.p_sera.selectedIndex = this.pulsejetbuilder.era_sel;
        this.p_bqul.valueAsNumber = this.pulsejetbuilder.build_quality;
        this.p_oqul.valueAsNumber = this.pulsejetbuilder.overall_quality;
        this.p_strt.checked = this.pulsejetbuilder.starter;
        var estats = this.pulsejetbuilder.EngineStats();
        BlinkIfChanged(this.pd_name, estats.name);
        BlinkIfChanged(this.pd_powr, estats.stats.power.toString());
        BlinkIfChanged(this.pd_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.pd_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.pd_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.pd_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.pd_rumb, estats.rumble.toString());
        BlinkIfChanged(this.pd_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.pd_malt, estats.altitude.toString());
        BlinkIfChanged(this.pd_dcst, this.pulsejetbuilder.DesignCost().toString());
    }
    InitManual(cell) {
        this.m_name = document.createElement("INPUT");
        this.m_pwr = document.createElement("INPUT");
        this.m_mass = document.createElement("INPUT");
        this.m_drag = document.createElement("INPUT");
        this.m_rely = document.createElement("INPUT");
        this.m_cool = document.createElement("INPUT");
        this.m_over = document.createElement("INPUT");
        this.m_fuel = document.createElement("INPUT");
        this.m_alti = document.createElement("INPUT");
        this.m_torq = document.createElement("INPUT");
        this.m_rumb = document.createElement("INPUT");
        this.m_cost = document.createElement("INPUT");
        this.m_oil = document.createElement("INPUT");
        this.m_pulsejet = document.createElement("INPUT");
        this.m_turbo = document.createElement("INPUT");
        var fs = CreateFlexSection(cell);
        //Set up the individual stat input boxes
        FlexText("Name", this.m_name, fs);
        FlexInput("Power", this.m_pwr, fs);
        FlexInput("Mass", this.m_mass, fs);
        FlexInput("Drag", this.m_drag, fs);
        FlexInput("Reliability", this.m_rely, fs);
        FlexInput("Cooling", this.m_cool, fs);
        FlexInput("Overspeed", this.m_over, fs);
        FlexInput("Fuel Consumption", this.m_fuel, fs);
        FlexInput("Altitude", this.m_alti, fs);
        FlexInput("Torque", this.m_torq, fs);
        FlexInput("Rumble", this.m_rumb, fs);
        FlexInput("Cost", this.m_cost, fs);
        FlexCheckbox("Oil Tank", this.m_oil, fs);
        FlexCheckbox("Pulsejet", this.m_pulsejet, fs);
        FlexCheckbox("Turbocharger", this.m_turbo, fs);
        var trigger = () => { this.UpdateManual(); };
        this.m_name.onchange = trigger;
        this.m_pwr.onchange = trigger;
        this.m_mass.onchange = trigger;
        this.m_drag.onchange = trigger;
        this.m_rely.onchange = trigger;
        this.m_cool.onchange = trigger;
        this.m_over.onchange = trigger;
        this.m_fuel.onchange = trigger;
        this.m_alti.onchange = trigger;
        this.m_torq.onchange = trigger;
        this.m_rumb.onchange = trigger;
        this.m_cost.onchange = trigger;
        this.m_oil.onchange = trigger;
        this.m_pulsejet.onchange = trigger;
        this.m_turbo.onchange = trigger;
    }
    InitListManagement(cell) {
        this.m_select = document.createElement("SELECT");
        this.m_add = document.createElement("BUTTON");
        this.m_delete = document.createElement("BUTTON");
        this.m_add_eb = document.createElement("BUTTON");
        this.m_add_pj = document.createElement("BUTTON");
        this.m_copy = document.createElement("BUTTON");
        this.m_save = document.createElement("BUTTON");
        this.m_load = document.createElement("INPUT");
        this.m_select.onchange = () => { this.SetValues(elist.get(this.m_select.selectedIndex)); this.m_select.selectedIndex = -1; };
        this.m_delete.onclick = () => { elist.remove(this.UpdateManual()); this.UpdateList(); };
        this.m_add.onclick = () => { elist.push(this.UpdateManual()); this.UpdateList(); };
        this.m_add_eb.onclick = () => { elist.push(this.enginebuilder.EngineStats()); this.UpdateList(); };
        this.m_add_pj.onclick = () => { elist.push(this.pulsejetbuilder.EngineStats()); this.UpdateList(); };
        this.m_save.onclick = () => { download(JSON.stringify(elist.toJSON()), "EngineList.json", "json"); };
        this.m_load.setAttribute("type", "file");
        this.m_load.multiple = false;
        this.m_load.accept = "application/JSON";
        this.m_load.onchange = (evt) => {
            if (this.m_load.files.length == 0)
                return;
            var file = this.m_load.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var str = JSON.parse(reader.result);
                    elist.fromJSON(str);
                    this.UpdateList();
                }
                catch (_a) { }
            };
            reader.readAsText(file);
            this.m_load.value = "";
        };
        this.m_copy.onclick = () => {
            var ser = new Serialize();
            this.UpdateManual().serialize(ser);
            var arr = ser.FinalArray();
            var str2 = _arrayBufferToString(arr);
            var txt2 = LZString.compressToEncodedURIComponent(str2);
            var link = (location.origin + "/PlaneBuilder/index.html?engine=" + txt2);
            copyStringToClipboard(link);
        };
        CreateSelect("Engines", this.m_select, cell);
        cell.appendChild(document.createElement("BR"));
        CreateButton("Copy Single Engine", this.m_copy, cell);
        CreateButton("Save Engine List", this.m_save, cell);
        CreateButton("Load Engine List", this.m_load, cell);
        CreateButton("Add From Engine Builder", this.m_add_eb, cell);
        CreateButton("Add From Pulsejet Builder", this.m_add_pj, cell);
        CreateButton("Add From Manual Input", this.m_add, cell);
        CreateButton("Delete Engine", this.m_delete, cell);
        this.UpdateList();
    }
    UpdateList() {
        var idx = this.m_select.selectedIndex;
        while (this.m_select.options.length > 0) {
            this.m_select.options.remove(0);
        }
        for (let i = 0; i < elist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = elist.get(i).name;
            this.m_select.add(opt);
        }
        if (idx >= elist.length) {
            idx = elist.length - 1;
        }
        this.m_select.selectedIndex = idx;
    }
    UpdateManual() {
        var e_stats = new EngineStats();
        e_stats.name = this.m_name.value;
        e_stats.stats.power = this.m_pwr.valueAsNumber;
        e_stats.stats.mass = this.m_mass.valueAsNumber;
        e_stats.stats.drag = this.m_drag.valueAsNumber;
        e_stats.stats.reliability = this.m_rely.valueAsNumber;
        e_stats.stats.cooling = this.m_cool.valueAsNumber;
        e_stats.overspeed = this.m_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.m_fuel.valueAsNumber;
        e_stats.altitude = this.m_alti.valueAsNumber;
        e_stats.torque = this.m_torq.valueAsNumber;
        e_stats.rumble = this.m_rumb.valueAsNumber;
        e_stats.stats.cost = this.m_cost.valueAsNumber;
        e_stats.oiltank = this.m_oil.checked;
        e_stats.pulsejet = this.m_pulsejet.checked;
        if (this.m_turbo.checked)
            e_stats.stats.reqsections = 1;
        e_stats.Verify();
        this.SetValues(e_stats);
        return e_stats;
    }
    SetValues(e_stats) {
        e_stats.Verify();
        this.m_name.value = e_stats.name;
        this.m_pwr.valueAsNumber = e_stats.stats.power;
        this.m_mass.valueAsNumber = e_stats.stats.mass;
        this.m_drag.valueAsNumber = e_stats.stats.drag;
        this.m_rely.valueAsNumber = e_stats.stats.reliability;
        this.m_cool.valueAsNumber = e_stats.stats.cooling;
        this.m_over.valueAsNumber = e_stats.overspeed;
        this.m_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.m_alti.valueAsNumber = e_stats.altitude;
        this.m_torq.valueAsNumber = e_stats.torque;
        this.m_rumb.valueAsNumber = e_stats.rumble;
        this.m_cost.valueAsNumber = e_stats.stats.cost;
        this.m_oil.checked = e_stats.oiltank;
        this.m_pulsejet.checked = e_stats.pulsejet;
        this.m_turbo.checked = e_stats.stats.reqsections > 0;
    }
    SelectEngine(num) {
        this.SetValues(elist.get(num));
    }
}
