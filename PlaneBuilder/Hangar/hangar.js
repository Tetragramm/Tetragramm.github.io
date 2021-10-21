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
        this.era = [];
        if (js) {
            this.fromJSON(js, 0);
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
            warnings: this.warnings,
            eras: this.era,
        };
    }
    fromJSON(js, json_version) {
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
            this.warnings.push({
                source: lu(js["name"]),
                warning: lu(js["warning"])
            });
        if (js["warnings"]) {
            let warnings = js["warnings"];
            let newwarn = [];
            for (let w of warnings) {
                newwarn.push({
                    source: w["source"],
                    warning: w["warning"],
                });
            }
            this.warnings = this.MergeWarnings(newwarn);
        }
        if (js["era"]) {
            this.era.push({
                name: lu(js["name"]),
                era: lu(js["era"])
            });
        }
        if (js["eras"]) {
            let eras = js["eras"];
            let newera = [];
            for (let e of eras) {
                newera.push({
                    name: e["name"],
                    era: e["era"],
                });
            }
            this.era = this.MergeEra(newera);
        }
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
        s.PushNum(this.warnings.length);
        for (let warn of this.warnings) {
            s.PushString(warn.source);
            s.PushString(warn.warning);
        }
        s.PushNum(this.era.length);
        for (let e of this.era) {
            s.PushString(e.name);
            s.PushString(e.era);
        }
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
        if (d.version > 12.25) {
            var wcount = d.GetNum();
            this.warnings = [];
            for (let i = 0; i < wcount; i++) {
                this.warnings.push({ source: d.GetString(), warning: d.GetString() });
            }
            var ecount = d.GetNum();
            this.era = [];
            for (let i = 0; i < ecount; i++) {
                this.era.push({ name: d.GetString(), era: d.GetString() });
            }
        }
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
        res.era = this.MergeEra(other.era);
        return res;
    }
    MergeWarnings(owarn) {
        var newList = [];
        for (let w2 of this.warnings) {
            newList.push({ source: w2.source, warning: w2.warning });
        }
        for (let w of owarn) {
            let dup = false;
            for (let w2 of this.warnings) {
                if (w.source == w2.source && w.warning == w2.warning)
                    dup = true;
            }
            if (!dup)
                newList.push({ source: w.source, warning: w.warning });
        }
        return newList;
    }
    MergeEra(oera) {
        var newList = [];
        for (let w2 of this.era) {
            newList.push({ name: w2.name, era: w2.era });
        }
        for (let w of oera) {
            let dup = false;
            for (let w2 of this.era) {
                if (w.name == w2.name && w.era == w2.era)
                    dup = true;
            }
            if (!dup)
                newList.push({ name: w.name, era: w.era });
        }
        return newList;
    }
    Multiply(other) {
        var res = this.Clone();
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
        //Pitch Speed and Pitch Boost don't get multiplied.
        res.wingarea = this.wingarea * other;
        res.toughness = this.toughness * other;
        res.upkeep = this.upkeep * other;
        res.crashsafety = this.crashsafety * other;
        res.bomb_mass = this.bomb_mass * other;
        res.fuel = this.fuel * other;
        res.charge = this.charge * other;
        if (Math.abs(other) > 1.0e-6) {
            res.warnings = this.warnings;
            res.era = this.era;
        }
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
    rtz(num) {
        if (num > 0) {
            return Math.floor(1.0e-6 + num);
        }
        return Math.ceil(-1.0e-6 + num);
    }
    Round() {
        this.liftbleed = this.rtz(this.liftbleed);
        this.wetmass = this.rtz(this.wetmass);
        this.mass = this.rtz(this.mass);
        this.drag = this.rtz(this.drag);
        this.control = this.rtz(this.control);
        this.cost = this.rtz(this.cost);
        this.reqsections = this.rtz(this.reqsections);
        this.visibility = this.rtz(this.visibility);
        this.flightstress = this.rtz(this.flightstress);
        this.escape = this.rtz(this.escape);
        this.pitchstab = this.rtz(this.pitchstab);
        this.latstab = this.rtz(this.latstab);
        this.cooling = this.rtz(this.cooling);
        this.reliability = this.rtz(this.reliability);
        this.power = this.rtz(this.power);
        this.fuelconsumption = this.rtz(this.fuelconsumption);
        this.maxstrain = this.rtz(this.maxstrain);
        this.structure = this.rtz(this.structure);
        this.wingarea = this.rtz(this.wingarea);
        this.toughness = this.rtz(this.toughness);
        this.upkeep = this.rtz(this.upkeep);
        this.crashsafety = this.rtz(this.crashsafety);
        this.bomb_mass = this.rtz(this.bomb_mass);
        this.fuel = this.rtz(this.fuel);
        this.charge = this.rtz(this.charge);
    }
    Clone() {
        return this.Add(new Stats());
    }
}
var era2numHh = (era) => {
    switch (era) {
        case "Pioneer":
            return 0;
        case "WWI":
            return 1;
        case "Roaring 20s":
            return 2;
        case "Coming Storm":
            return 3;
        case "WWII":
            return 4;
        case "Last Hurrah":
            return 5;
        case "Himmilgard":
            return 6;
    }
};
var era2numHl = (era) => {
    switch (era) {
        case "Pioneer":
            return 0;
        case "WWI":
            return 1;
        case "Roaring 20s":
            return 2;
        case "Coming Storm":
            return 3;
        case "WWII":
            return 4;
        case "Last Hurrah":
            return 5;
        case "Himmilgard":
            return -1;
    }
};
var num2era = (era) => {
    switch (era) {
        case 0:
            return "Pioneer";
        case 1:
            return "WWI";
        case 2:
            return "Roaring 20s";
        case 3:
            return "Coming Storm";
        case 4:
            return "WWII";
        case 5:
            return "Last Hurrah";
        case 6:
        case -1:
            return "Himmilgard";
    }
};
/// <reference path="./Stats.ts" />
class Part {
}
class Localization {
    constructor(js) {
        this.lang = "en";
        this.languages = js;
    }
    GetLanguages() {
        var lang = [];
        for (let elem of this.languages["languages"]) {
            lang.push(elem);
        }
        return lang;
    }
    SetLanguages(lang) {
        if (this.languages[lang]) {
            this.lang = lang;
        }
    }
    e(key) {
        if (this.languages[this.lang][key]) {
            return this.languages[this.lang][key];
        }
        else if (this.languages["en"][key]) {
            return this.languages["en"][key];
        }
        else {
            console.error("Failed to find " + key);
            return "!" + key + "!";
        }
    }
}
function lu(s, ...args) {
    return StringFmt.Format(local.e(s), ...args);
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
    GetNumArr(tgt_length) {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetNum());
        }
        while (arr.length < tgt_length) {
            arr.push(0);
        }
        return arr;
    }
    GetBoolArr(tgt_length) {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetBool());
        }
        while (arr.length < tgt_length) {
            arr.push(false);
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
function NumArr(arr, tgt_length) {
    while (arr.length < tgt_length) {
        arr.push(0);
    }
    return arr;
}
function BoolArr(arr, tgt_length) {
    while (arr.length < tgt_length) {
        arr.push(false);
    }
    return arr;
}
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
var CompressorEnum;
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
(function (CompressorEnum) {
    CompressorEnum[CompressorEnum["NONE"] = 0] = "NONE";
    CompressorEnum[CompressorEnum["ALTITUDE_THROTTLE"] = 1] = "ALTITUDE_THROTTLE";
    CompressorEnum[CompressorEnum["SUPERCHARGER"] = 2] = "SUPERCHARGER";
    CompressorEnum[CompressorEnum["TURBOCHARGER"] = 3] = "TURBOCHARGER";
})(CompressorEnum || (CompressorEnum = {}));
class EngineBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", materials: 3, cost: 0.5, maxRPM: 30, powerdiv: 8, fuelfactor: 10 },
            { name: "WWI", materials: 2, cost: 1, maxRPM: 35, powerdiv: 7, fuelfactor: 8 },
            { name: "Roaring 20s", materials: 1.5, cost: 2, maxRPM: 40, powerdiv: 6.8, fuelfactor: 6 },
            { name: "Coming Storm", materials: 1.35, cost: 2.25, maxRPM: 45, powerdiv: 6.6, fuelfactor: 5 },
            { name: "WWII", materials: 1.25, cost: 2.5, maxRPM: 50, powerdiv: 6.5, fuelfactor: 4 },
            { name: "Last Hurrah", materials: 1, cost: 3, maxRPM: 50, powerdiv: 6.2, fuelfactor: 2 },
        ];
        this.CoolingTable = [
            { name: "Liquid Cooled", forcefactor: 1.2, RPMoff: 0, thrustfactor: 1, radiator: 1, massfactor: 1 },
            { name: "Air Cooled", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Rotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.5, radiator: 0, massfactor: 1 },
            { name: "Contrarotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.25, radiator: 0, massfactor: 1 },
            { name: "Semi-Radial", forcefactor: 0.8, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Liquid Radial", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 2.5, massfactor: 1.3 },
        ];
        this.CompressorTable = [
            { name: "None" },
            { name: "Altitude Throttle" },
            { name: "Supercharger" },
            { name: "Turbocharger" },
        ];
        this.Upgrades = [
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
        this.compressor_type = CompressorEnum.NONE;
        this.compressor_count = 0;
        this.min_IAF = 0;
    }
    CanUpgrade() {
        var can_upg = [...Array(this.Upgrades.length).fill(true)];
        can_upg[0] = false;
        if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            can_upg[0] = false;
            can_upg[1] = false;
            can_upg[2] = false;
        }
        return can_upg;
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
        var CylMass = this.engine_displacement ** 2 * this.compression_ratio / 1000;
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
    // private CoolReliability() {
    //     switch (this.CoolingTable[this.cool_sel].name) {
    //         case "Liquid Cooled":
    //             return (this.num_rows / 2 + 5 * this.num_cyl_per_row) / 10;
    //         case "Air Cooled":
    //             return 1;
    //         case "Rotary":
    //             return 1;
    //         case "Contrarotary":
    //             return 1.1;
    //         case "Semi-Radial":
    //             return 0.8;
    //         case "Liquid Radial":
    //             return 1;
    //     }
    //     throw "Error in CoolReliability, no valid switch case.";
    // }
    CoolBurnout() {
        var EraBurnout = this.EraTable[this.era_sel].materials / 2;
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 2;
            case "Air Cooled":
                return (2 + (this.num_rows ** 2)) * EraBurnout;
            case "Rotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Contrarotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Semi-Radial":
                return (2 + (this.num_rows ** 2) / 2) * EraBurnout;
            case "Liquid Radial":
                return 0.5;
        }
        throw "Error in CoolBurnout, no valid switch case.";
    }
    MaterialModifier() {
        var EraBurnout = this.EraTable[this.era_sel].materials;
        var num_cyl = this.num_cyl_per_row * this.num_rows;
        var CylinderBurnout = this.engine_displacement / num_cyl * (this.compression_ratio ** 2) * EraBurnout;
        var GearingBurnout = this.rpm_boost * CylinderBurnout * this.CoolBurnout();
        return GearingBurnout * this.rpm_boost;
    }
    // private CalcReliability() {
    //     var Reliability = 6 - this.MaterialModifier() * this.CoolReliability() / 25;
    //     return Math.trunc(Reliability);
    // }
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
        return (3 + alt) * 10 - 1;
    }
    CoolTorque() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary") {
            return this.CalcMass();
        }
        else if (this.CoolingTable[this.cool_sel].name == "Contrarotary") {
            return Math.floor(1.0e-6 + this.CalcMass() / 2);
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
        var Quality = Math.max(1, this.quality_fudge);
        var EngineForce = this.engine_displacement * this.compression_ratio / 10;
        var Cost = (this.UpgradeCost() + EngineForce);
        var PlusBSandEra = Quality * Era.cost * Cost;
        if (Cool.radiator > 0) {
            PlusBSandEra *= 1.4;
        }
        return Math.floor(1.0e-6 + PlusBSandEra);
    }
    VerifyValues() {
        this.engine_displacement = Math.max(0.01, this.engine_displacement);
        this.engine_displacement = Math.min(150, this.engine_displacement);
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.cool_sel = Math.max(0, Math.min(this.CoolingTable.length - 1, this.cool_sel));
        this.num_cyl_per_row = Math.floor(Math.max(1, this.num_cyl_per_row));
        this.num_rows = Math.floor(Math.max(1, this.num_rows));
        this.compression_ratio = Math.max(0.01, this.compression_ratio);
        this.compression_ratio = Math.min(25, this.compression_ratio);
        this.rpm_boost = Math.max(0.1, this.rpm_boost);
        this.rpm_boost = Math.min(2, this.rpm_boost);
        this.material_fudge = Math.max(0.1, this.material_fudge);
        this.material_fudge = Math.min(2.0, this.material_fudge);
        this.quality_fudge = Math.max(0.1, this.quality_fudge);
        this.quality_fudge = Math.min(2.0, this.quality_fudge);
        while ((this.material_fudge - 1) + (this.quality_fudge - 1) < -0.9) {
            this.material_fudge += 0.1;
            this.quality_fudge += 0.1;
        }
        this.min_IAF = 10 * Math.round(1.0e-6 + this.min_IAF / 10);
        this.compressor_count = Math.floor(1.0e-6 + this.compressor_count);
        this.compressor_count = Math.min(5, this.compressor_count);
        if (this.compressor_type == CompressorEnum.NONE) {
            this.compressor_count = 0;
            this.min_IAF = 0;
        }
        else if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            this.compressor_count = 1;
            this.min_IAF = 0;
            this.upg_sel[0] = false;
            this.upg_sel[1] = false;
            this.upg_sel[2] = false;
        }
        else {
            this.min_IAF = Math.max(0, this.min_IAF);
            this.compressor_count = Math.max(1, this.compressor_count);
        }
    }
    EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;
        this.VerifyValues();
        estats.stats.power = this.CalcPower();
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = Math.floor(1.0e-6 - 2 + this.era_sel + (this.quality_fudge + this.material_fudge - 2) * 10);
        estats.stats.cooling = this.CalcCooling();
        estats.oiltank = this.IsRotary();
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.altitude = this.CalcAltitude();
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        estats.stats.era.push({ name: this.name, era: lu(num2era(this.era_sel)) });
        switch (this.compressor_type) {
            case CompressorEnum.NONE: {
                break;
            }
            case CompressorEnum.ALTITUDE_THROTTLE: {
                estats.stats.cost += 3;
                estats.altitude = 49;
                estats.stats.warnings.push({
                    source: lu("Altitude Throttle"),
                    warning: lu("Altitude Throttle Warning")
                });
                break;
            }
            case CompressorEnum.SUPERCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.fuelconsumption = Math.floor(1.0e-6 + 1.25 * estats.stats.fuelconsumption);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += this.min_IAF / 10;
                estats.stats.cost += 1 + Math.floor(1.0e-6 + estats.stats.power / 50);
                var extra = this.compressor_count - 1;
                estats.altitude = 29 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                break;
            }
            case CompressorEnum.TURBOCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += 2 * (this.min_IAF / 10);
                estats.stats.cost += 1 + Math.floor(1.0e-6 + estats.stats.power / 50);
                var extra = this.compressor_count - 1;
                estats.altitude = 49 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                estats.stats.reqsections += 1;
                break;
            }
        }
        estats.stats.fuelconsumption = Math.max(1, estats.stats.fuelconsumption);
        return estats;
    }
    EngineInputs() {
        var ei = new EngineInputs();
        ei.engine_type = ENGINE_TYPE.PROPELLER;
        ei.RPM_boost = this.rpm_boost;
        ei.compression = this.compression_ratio;
        ei.compressor_count = this.compressor_count;
        ei.compressor_type = this.compressor_type;
        ei.cyl_per_row = this.num_cyl_per_row;
        ei.displacement = this.engine_displacement;
        ei.era_sel = this.era_sel;
        ei.material_fudge = this.material_fudge;
        ei.min_IAF = this.min_IAF;
        ei.name = this.name;
        ei.quality_fudge = this.quality_fudge;
        ei.rows = this.num_rows;
        ei.type = this.cool_sel;
        for (let i = 0; i < ei.upgrades.length; i++)
            ei.upgrades[i] = this.upg_sel[i];
        return ei;
    }
    fromJSON(js) {
        this.engine_displacement = js["displacement"];
        this.compression_ratio = js["compression"];
        this.cool_sel = js["type"];
        this.num_cyl_per_row = js["cyl_per_row"];
        this.num_rows = js["rows"];
        this.rpm_boost = js["RPM_boost"];
        this.era_sel = js["era_sel"];
        this.material_fudge = js["material_fudge"];
        this.quality_fudge = js["quality_fudge"];
        this.compressor_type = js["compressor_type"];
        this.compressor_count = js["compressor_count"];
        this.min_IAF = js["min_IAF"];
        this.upg_sel = BoolArr(js["upgrades"], this.upg_sel.length);
        return this.EngineStats();
    }
}
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
class PulsejetBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
            { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
            { name: "Roaring 20s", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
            { name: "Coming Storm", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
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
    VerifyValues() {
        this.desired_power = Math.max(1, Math.floor(this.desired_power));
        this.valve_sel = Math.max(0, Math.min(this.ValveTable.length - 1, this.valve_sel));
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.build_quality = Math.max(0.01, this.build_quality);
        this.overall_quality = Math.max(0.01, this.overall_quality);
        this.build_quality = Math.max(this.build_quality, this.overall_quality);
        this.overall_quality = this.build_quality;
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
    EngineInputs() {
        var ei = new EngineInputs();
        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";
        ei.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        ei.engine_type = ENGINE_TYPE.PULSEJET;
        ei.era_sel = this.era_sel;
        ei.type = this.valve_sel;
        ei.power = this.desired_power;
        ei.starter = this.starter;
        ei.quality_cost = this.build_quality;
        ei.quality_rely = this.overall_quality;
        return ei;
    }
    EngineStats() {
        var estats = new EngineStats();
        this.VerifyValues();
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
        estats.altitude = 29;
        estats.pulsejet = true;
        estats.stats.era.push({ name: estats.name, era: lu(num2era(this.era_sel)) });
        return estats;
    }
}
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
class TurboBuilder {
    constructor() {
        this.TypeTable = [
            { name: "Turbojet", efficiency: 0, massfactor: 0.8, costfactor: 1 },
            { name: "Turbofan", efficiency: 0, massfactor: 1., costfactor: 1 },
            { name: "Propfan", efficiency: -9, massfactor: 0.8, costfactor: 1 },
            { name: "Turboprop", efficiency: -3, massfactor: 0.8, costfactor: 1 },
        ];
        this.EraTable = [
            { name: "Gen 1 1945-1955", max_temp: 1100, efficiency: -2, costfactor: 0.5 },
            { name: "Gen 1.5 1955-1965", max_temp: 1100, efficiency: -1, costfactor: 0.6 },
            { name: "Gen 2 1965-1975", max_temp: 1400, efficiency: -1, costfactor: 0.7 },
            { name: "Gen 2.5 1975-1985", max_temp: 1400, efficiency: 0, costfactor: 0.8 },
            { name: "Gen 3 1985-1995", max_temp: 1800, efficiency: 0, costfactor: 0.9 },
            { name: "Gen 3.5 1995-2005", max_temp: 1800, efficiency: 1, costfactor: 1.0 },
            { name: "Gen 4 2005-2015", max_temp: 2000, efficiency: 1, costfactor: 1.1 },
            { name: "Gen 4.5 2015-2025", max_temp: 2000, efficiency: 2, costfactor: 1.2 },
            { name: "Gen 0 Himmilgard", max_temp: 800, efficiency: -10, costfactor: 0.5 },
        ];
        this.name = "Default";
        this.era_sel = 0;
        this.type_sel = 0;
        this.fuel_heat_value = 43020;
        this.flow_adjustment = 0;
        this.diameter = 0.89;
        this.compression_ratio = 3.5;
        this.bypass_ratio = 0;
        this.afterburner = false;
    }
    TempMass() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        var tmass = Math.log2(this.compression_ratio) * Math.PI * Math.pow(this.diameter / 2, 2) * 1.75 * 361.75 / (1 + this.bypass_ratio / 3) * Type.massfactor;
        return 0.75 * tmass;
    }
    CalcMass() {
        var tmass = this.TempMass();
        //Turbofan fit.  Using list from jet-engines.net and an excel curve to align them.
        if (this.type_sel == 1) {
            tmass = tmass * (0.4833 * Math.log(this.compression_ratio) - 0.3168);
        }
        var mass = tmass / 25 + 95.684 * this.flow_adjustment;
        //Turboprop fit.  Using list from jet-engines.net and an excel curve to align them.
        //Because turboprops have too much variation, some end up negative. So needs to be done here.
        if (this.type_sel == 2 || this.type_sel == 3) {
            var x = 0.5 - this.flow_adjustment;
            mass = Math.abs(mass) * (19.74 * Math.pow(x, 3) - 11.462 * x * x + 1.0666 * x + 0.4333);
        }
        return Math.max(1, Math.floor(1.0e-6 + mass));
    }
    CalcDrag() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        return Math.floor(1.0e-6 + 5 * Math.PI * Math.pow(this.diameter / 2.0, 2));
    }
    CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        var Reliability = -Math.log2(this.compression_ratio) - 20 * this.flow_adjustment;
        return Math.trunc(Reliability + 1);
    }
    CalcStages() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        const M = 0.0;
        const a0 = 340.3;
        const Pa = 108.9; //Ambient Pressure
        const Ta = 288.15; //Ambient Temp
        const Cp = 1.006; //Specific Heat at Constant Pressure
        const y = 1.4; //Specific Heat
        const fan_pressure_ratio = 1.6;
        const area = Math.PI * Math.pow(this.diameter / 2, 2);
        const net_efficiency = 0.8 + (Era.efficiency + Type.efficiency) / 20.0 + this.flow_adjustment;
        var P3 = Pa * this.compression_ratio;
        var T3 = Ta * Math.pow(P3 / Pa, (y - 1) / y);
        var Tr = 1 + (y - 1) / 2 * M * M;
        var Ty = Era.max_temp / Ta;
        var Tc = Math.pow(this.compression_ratio, 1 - 1 / y);
        var ST11 = a0 * (Math.sqrt((2 * Tr) / (y - 1) * (Ty / (Tr * Tc) - 1) * (Tc - 1) + Ty / (Tr * Tc) * M * M) - M) * net_efficiency / 1000;
        var Tcp = Math.pow(fan_pressure_ratio, 1 - 1 / y);
        var ST13 = a0 * (Math.sqrt(2 / (y - 1) * (Tr * Tcp - 1)) - M) * net_efficiency / 1000;
        var f = (Cp * Ta / this.fuel_heat_value) * (Era.max_temp / Ta - T3 / Ta);
        var ST = ST11 / (1 + this.bypass_ratio) + this.bypass_ratio * ST13 / (1 + this.bypass_ratio);
        var TSFC11 = f / ((1 + this.bypass_ratio) * ST) * 1000;
        var C2 = Pa * area * this.MFP(1) / ((1 + f));
        var mc2 = this.compression_ratio * C2 * Math.sqrt(1 / Era.max_temp) * net_efficiency;
        if (!isFinite(ST) || !isFinite(mc2) || !isFinite(TSFC11)) {
            ST = 0;
            mc2 = 0;
            TSFC11 = 0;
        }
        return { thrust: ST * mc2, fuel: TSFC11 * ST * mc2 };
    }
    MFP(M) {
        const R = 287.058 / 1000; //Gas Constant
        const y = 1.4; //Specific Heat
        return Math.sqrt(y / R) * M * Math.pow(1 + (y - 1) / 2 * M * M, (y + 1) / (2 * (y - 1)));
    }
    CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        return Math.floor(1.0e-6 + this.TempMass() * 0.5 * (1 + this.flow_adjustment) * Era.costfactor * Type.costfactor) + 1;
    }
    VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.type_sel = Math.max(0, Math.min(this.TypeTable.length - 1, this.type_sel));
        this.flow_adjustment = Math.max(-0.5, Math.min(0.5, this.flow_adjustment));
        this.diameter = Math.max(0.1, this.diameter);
        this.compression_ratio = Math.max(1, this.compression_ratio);
        this.bypass_ratio = Math.max(0, this.bypass_ratio);
        this.bypass_ratio = Math.min(20, this.bypass_ratio);
        if (this.type_sel > 2) {
            this.afterburner = false;
        }
    }
    EngineInputs() {
        var ei = new EngineInputs();
        ei.name = this.name;
        ei.engine_type = ENGINE_TYPE.TURBOMACHINERY;
        ei.era_sel = this.era_sel;
        ei.type = this.type_sel;
        ei.flow_adjustment = this.flow_adjustment;
        ei.diameter = this.diameter;
        ei.compression_ratio = this.compression_ratio;
        ei.bypass_ratio = this.bypass_ratio;
        ei.upgrades[0] = this.afterburner;
        return ei;
    }
    EngineStats() {
        var estats = new EngineStats();
        this.VerifyValues();
        var tf = this.CalcStages();
        this.kN = tf.thrust;
        this.tsfc = tf.fuel / tf.thrust;
        estats.name = this.name;
        estats.stats.power = Math.round(tf.thrust * 1000 / 89);
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = Math.round(10 * 20 * tf.fuel / 1000);
        estats.rumble = 0;
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 59;
        estats.stats.era.push({ name: estats.name, era: lu(num2era(this.era_sel)) });
        return estats;
    }
}
/// <reference path="./Serialize.ts"/>
/// <reference path="../EngineBuilder/EngineBuilder.ts"/>
/// <reference path="../EngineBuilder/PulsejetBuilder.ts"/>
/// <reference path="../EngineBuilder/TurboBuilder.ts"/>
var ENGINE_TYPE;
/// <reference path="./Serialize.ts"/>
/// <reference path="../EngineBuilder/EngineBuilder.ts"/>
/// <reference path="../EngineBuilder/PulsejetBuilder.ts"/>
/// <reference path="../EngineBuilder/TurboBuilder.ts"/>
(function (ENGINE_TYPE) {
    ENGINE_TYPE[ENGINE_TYPE["PROPELLER"] = 0] = "PROPELLER";
    ENGINE_TYPE[ENGINE_TYPE["PULSEJET"] = 1] = "PULSEJET";
    ENGINE_TYPE[ENGINE_TYPE["TURBOMACHINERY"] = 2] = "TURBOMACHINERY";
})(ENGINE_TYPE || (ENGINE_TYPE = {}));
class EngineInputs {
    constructor(js) {
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
        this.flow_adjustment = 0;
        this.diameter = 0;
        this.compression_ratio = 0;
        this.bypass_ratio = 0;
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
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
                };
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    flow_adjustment: this.flow_adjustment,
                    diameter: this.diameter,
                    compression_ratio: this.compression_ratio,
                    bypass_ratio: this.bypass_ratio,
                    upgrades: this.upgrades,
                };
            }
            default:
                throw "EngineInputs.toJSON: Oh dear, you have a new engine type.";
        }
    }
    fromJSON(js) {
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
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.flow_adjustment = js["flow_adjustment"];
                this.diameter = js["diameter"];
                this.compression_ratio = js["compression_ratio"];
                this.bypass_ratio = js["bypass_ratio"];
                this.upgrades = js["upgrades"];
                break;
            }
            default:
                throw "EngineInputs.fromJSON: Oh dear, you have a new engine type.";
        }
    }
    serialize(s) {
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
            case ENGINE_TYPE.TURBOMACHINERY: {
                s.PushFloat(this.flow_adjustment);
                s.PushFloat(this.diameter);
                s.PushFloat(this.compression_ratio);
                s.PushFloat(this.bypass_ratio);
                s.PushBoolArr(this.upgrades);
                break;
            }
            default:
                throw "EngineInputs.serialize: Oh dear, you have a new engine type.";
        }
    }
    deserialize(d) {
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
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.flow_adjustment = d.GetFloat();
                this.diameter = d.GetFloat();
                this.compression_ratio = d.GetFloat();
                this.bypass_ratio = d.GetFloat();
                this.upgrades = d.GetBoolArr(this.upgrades.length);
                break;
            }
            default:
                throw "EngineInputs.deserialize: Oh dear, you have a new engine type.";
        }
    }
    PartStats() {
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
            case ENGINE_TYPE.TURBOMACHINERY: {
                var tb = new TurboBuilder();
                tb.type_sel = this.type;
                tb.era_sel = this.era_sel;
                tb.flow_adjustment = this.flow_adjustment;
                tb.diameter = this.diameter;
                tb.compression_ratio = this.compression_ratio;
                tb.bypass_ratio = this.bypass_ratio;
                tb.afterburner = this.upgrades[0];
                tb.name = this.name;
                return tb.EngineStats();
            }
            default:
                throw "EngineInputs.PartStats: Oh dear, you have a new engine type.";
        }
    }
    Equal(other) {
        return this.name == other.name;
    }
    Clone() {
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
        n.flow_adjustment = this.flow_adjustment;
        n.diameter = this.diameter;
        n.compression_ratio = this.compression_ratio;
        n.bypass_ratio = this.bypass_ratio;
        return n;
    }
}
/// <reference path="./Stats.ts" />
/// <reference path="./Serialize.ts"/>
/// <reference path="./EngineInputs.ts"/>
class EngineStats {
    constructor(js) {
        this.name = "Default";
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
    fromJSON(js, json_version = 9999) {
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
    Clone() {
        var c = new EngineStats();
        c.fromJSON(JSON.parse(JSON.stringify(this.toJSON())));
        return c;
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
    constructor(name) {
        this.constant = false;
        this.name = name;
        this.list = [];
        var ejson = window.localStorage.getItem("engines." + this.name);
        if (ejson != null)
            this.fromJSON(JSON.parse(ejson));
        var nameliststr = window.localStorage.getItem("engines_names");
        var namelist = [];
        if (nameliststr) {
            namelist = JSON.parse(nameliststr);
        }
        var hasname = false;
        for (let e of namelist) {
            if (e == name) {
                hasname = true;
                break;
            }
        }
        if (!hasname)
            namelist.push(name);
        window.localStorage.setItem("engines_names", JSON.stringify(namelist));
    }
    toJSON() {
        var ret = [];
        for (let li of this.list) {
            ret.push(li.toJSON());
        }
        return { name: this.name, engines: ret };
    }
    fromJSON(js, force = false) {
        if (js["name"])
            this.name = js["name"];
        if (force) {
            this.list = [];
        }
        for (let elem of js["engines"]) {
            try {
                this.push(new EngineInputs(elem), force);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    serialize(s) {
        s.PushString(this.name);
        s.PushNum(this.list.length);
        for (let li of this.list) {
            li.serialize(s);
        }
    }
    deserialize(d) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        this.name = d.GetString();
        var len = d.GetNum();
        for (let i = 0; i < len; i++) {
            let stats = new EngineInputs();
            stats.deserialize(d);
            this.push(stats);
        }
    }
    deserializeEngine(d) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        let stats = new EngineInputs();
        stats.deserialize(d);
        return this.push(stats);
    }
    push(es, force = false) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        if (force) {
            this.remove(es);
        }
        else {
            for (let i = 0; i < this.length; i++) {
                let li = this.list[i];
                if (li.Equal(es)) {
                    return i;
                }
            }
        }
        this.list.push(es.Clone());
        this.list = this.list.sort((a, b) => { return ('' + a.name).localeCompare(b.name); });
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
        return this.find(es);
    }
    get(i) {
        if (i < 0 || i >= this.length)
            return new EngineInputs();
        return this.list[i];
    }
    get_name(n) {
        var i = this.find_name(n);
        return this.get(i);
    }
    get_stats(i) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i].PartStats();
    }
    get_stats_name(n) {
        var i = this.find_name(n);
        return this.get_stats(i);
    }
    find(es) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }
    find_name(n) {
        for (let i = 0; i < this.length; i++) {
            if (this.list[i].name == n)
                return i;
        }
        return -1;
    }
    remove(es) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        var idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    remove_name(name) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        var idx = this.find_name(name);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    get length() {
        return this.list.length;
    }
    SetConstant() {
        this.constant = true;
    }
}
function SearchAllEngineLists(n) {
    for (let key of engine_list.keys()) {
        if (key != "Custom") {
            let elist = engine_list.get(key);
            let idx = elist.find_name(n);
            if (idx >= 0) {
                return key;
            }
        }
    }
    let idx = engine_list.get("Custom").find_name(n);
    if (idx >= 0) {
        return "Custom";
    }
    return "";
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = {
                name: elem["name"], maxbomb: elem["maxbomb"],
                cant_lift: elem["cant_lift"], stats: new Stats(elem),
            };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js, json_version) {
        this.selected = js["selected"];
        if (json_version < 10.35) {
            if (this.selected > 2) {
                this.selected++;
            }
        }
    }
    serialize(s) {
        s.PushNum(this.selected);
    }
    deserialize(d) {
        this.selected = d.GetNum();
    }
    GetSelected() {
        return this.selected;
    }
    GetSelectedText() {
        return this.vals[this.selected].name;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].stats.liftbleed;
    }
    GetMaxBomb() {
        return this.vals[this.selected].maxbomb;
    }
    GetCantLift() {
        return this.vals[this.selected].cant_lift;
    }
    PartStats() {
        var s = new Stats();
        s = s.Add(this.vals[this.selected].stats);
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Cockpit extends Part {
    constructor(tl, ul, sl, gl) {
        super();
        this.stats = new Stats();
        this.types = tl;
        this.upgrades = ul;
        this.safety = sl;
        this.gunsights = gl;
        this.selected_type = 0;
        this.selected_upgrades = [...Array(this.upgrades.length).fill(false)];
        this.selected_safety = [...Array(this.safety.length).fill(false)];
        this.selected_gunsights = [...Array(this.gunsights.length).fill(false)];
        this.total_stress = [0, 0];
        this.total_escape = 0;
        this.total_visibility = 0;
        this.seat_index = 0;
        this.bombsight = 0;
        this.is_armed = false;
    }
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades,
            safety: this.selected_safety,
            sights: this.selected_gunsights,
            bombsight: this.bombsight,
        };
    }
    fromJSON(js, json_version) {
        this.selected_type = js["type"];
        this.selected_upgrades = BoolArr(js["upgrades"], this.selected_upgrades.length);
        this.selected_safety = BoolArr(js["safety"], this.selected_safety.length);
        this.selected_gunsights = BoolArr(js["sights"], this.selected_gunsights.length);
        if (this.IsPrimary())
            this.selected_upgrades[0] = false;
        if (json_version > 10.35)
            this.bombsight = js["bombsight"];
    }
    serialize(s) {
        s.PushNum(this.selected_type);
        s.PushBoolArr(this.selected_upgrades);
        s.PushBoolArr(this.selected_safety);
        s.PushBoolArr(this.selected_gunsights);
        s.PushNum(this.bombsight);
    }
    deserialize(d) {
        this.selected_type = d.GetNum();
        this.selected_upgrades = d.GetBoolArr(this.selected_upgrades.length);
        this.selected_safety = d.GetBoolArr(this.selected_safety.length);
        this.selected_gunsights = d.GetBoolArr(this.selected_gunsights.length);
        if (this.IsPrimary())
            this.selected_upgrades[0] = false;
        if (d.version > 10.35)
            this.bombsight = d.GetNum();
    }
    GetTypeList() {
        return this.types;
    }
    GetUpgradeList() {
        return this.upgrades;
    }
    GetSafetyList() {
        return this.safety;
    }
    GetGunsightList() {
        return this.gunsights;
    }
    GetType() {
        return this.selected_type;
    }
    SetType(index) {
        if (index >= this.types.length)
            throw "Selected type is not in range of actual types.";
        this.selected_type = index;
        this.CalculateStats();
    }
    GetSelectedUpgrades() {
        return this.selected_upgrades;
    }
    SetUpgrade(index, state) {
        if (index >= this.upgrades.length)
            throw "Selected type is not in range of actual upgrades.";
        this.selected_upgrades[index] = state;
        this.CalculateStats();
    }
    GetSelectedSafety() {
        return this.selected_safety;
    }
    CanSafety() {
        let lst = Array(this.safety.length).fill(true);
        lst[5] = !this.types[this.selected_type].exposed;
        return lst;
    }
    SetSafety(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual safties.";
        this.selected_safety[index] = state;
        this.CalculateStats();
    }
    GetSelectedGunsights() {
        return this.selected_gunsights;
    }
    SetGunsight(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual gunsights.";
        this.selected_gunsights[index] = state;
        this.CalculateStats();
    }
    GetVisibility() {
        if (this.types[this.selected_type].stats.visibility < -10)
            return -1 / 0;
        return this.total_visibility;
    }
    GetFlightStress() {
        return this.total_stress;
    }
    GetEscape() {
        return this.total_escape;
    }
    GetCrash() {
        return this.total_crash;
    }
    GetAttack() {
        var mx = 0;
        for (let i = 0; i < this.gunsights.length; i++) {
            if (this.selected_gunsights[i]) {
                mx = Math.max(mx, this.gunsights[i].attack);
            }
        }
        return mx;
    }
    SetSeatIndex(idx) {
        this.seat_index = idx;
    }
    IsPrimary() {
        return this.seat_index == 0;
    }
    CanUpgrades() {
        var can = [...Array(this.upgrades.length).fill(true)];
        if (this.IsPrimary()) {
            can[0] = false;
        }
        return can;
    }
    IsOpen() {
        return this.types[this.selected_type].name == "Open"
            || this.types[this.selected_type].name == "Windscreen";
    }
    GetBombsightQuality() {
        return this.bombsight;
    }
    SetBombsightQuality(num) {
        if (num != num)
            num = 0;
        if (num == this.bombsight - 1)
            num = this.bombsight - 3;
        if (num == this.bombsight + 1)
            num = this.bombsight + 3;
        if (num < 2)
            num = 0;
        if (num > 0)
            num = num - (num % 3) + 1;
        this.bombsight = num;
        this.CalculateStats();
    }
    SetHasRotary(has) {
        this.has_rotary = has;
    }
    IsElectrics() {
        return this.stats.charge != 0;
    }
    IsCopilot() {
        return this.selected_upgrades[0];
    }
    SetArmed(is) {
        this.is_armed = is;
    }
    GetName() {
        if (this.IsPrimary()) {
            return "Crew Pilot";
        }
        if (this.bombsight > 0) {
            return "Crew Bombadier";
        }
        if (this.IsCopilot()) {
            return "Crew Co-Pilot";
        }
        if (this.is_armed) {
            return "Crew Gunner";
        }
        return "Crew Aircrew";
    }
    PartStats() {
        let stats = new Stats();
        stats.reqsections = 1;
        stats = stats.Add(this.types[this.selected_type].stats);
        for (let i = 0; i < this.selected_upgrades.length; i++) {
            if (this.selected_upgrades[i])
                stats = stats.Add(this.upgrades[i].stats);
        }
        let can = this.CanSafety();
        for (let i = 0; i < this.selected_safety.length; i++) {
            if (!can[i])
                this.selected_safety[i] = false;
            if (this.selected_safety[i])
                stats = stats.Add(this.safety[i].stats);
        }
        for (let i = 0; i < this.selected_gunsights.length; i++) {
            if (this.selected_gunsights[i])
                stats = stats.Add(this.gunsights[i].stats);
        }
        if (this.bombsight > 0) {
            stats.cost += Math.floor(1.0e-6 + 2 + (this.bombsight - 4) / 3);
            stats.warnings.push({
                source: lu("Bombsight"),
                warning: lu("Bombsight Warning 1") + this.bombsight.toString() + lu("Bombsight Warning 2")
            });
            if (this.IsCopilot()) {
                stats.warnings.push({
                    source: lu("Bombadier Controls"),
                    warning: lu("Bombadier Controls Warning"),
                });
            }
        }
        for (let w of stats.warnings) {
            w.source = lu("Seat #", this.seat_index + 1) + " " + w.source;
        }
        this.stats = stats.Clone();
        //Special stuff for co-pilot controls
        if (this.selected_upgrades[0]) {
            stats.flightstress = this.upgrades[0].stats.flightstress;
            this.stats.flightstress -= stats.flightstress;
        }
        else {
            stats.flightstress = 0;
        }
        return stats;
    }
    CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash) {
        this.total_escape = this.stats.escape + escape;
        let ncp_stress = this.stats.flightstress;
        let cp_stress = this.stats.flightstress;
        if (this.IsPrimary() || this.selected_upgrades[0]) {
            ncp_stress += controlstress;
            cp_stress += controlstress - copilots * 2;
        }
        ncp_stress = Math.max(0, ncp_stress);
        cp_stress = Math.max(0, cp_stress);
        ncp_stress += rumblestress;
        cp_stress += rumblestress;
        if (this.IsOpen() && this.has_rotary) { //Is open and has rotary
            ncp_stress += 1;
            cp_stress += 1;
        }
        ncp_stress = Math.max(0, ncp_stress);
        cp_stress = Math.max(0, cp_stress);
        this.total_stress = [ncp_stress, cp_stress];
        this.total_visibility = this.stats.visibility + visibility;
        this.total_crash = this.stats.crashsafety + crash;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Cockpit.ts" />
class Cockpits extends Part {
    constructor(js) {
        super();
        this.positions = [];
        this.types = [];
        //Add all the cockpit types
        for (let elem of js["options"]) {
            let opt = { name: elem["name"], exposed: elem["exposed"], stats: new Stats(elem) };
            this.types.push(opt);
        }
        this.upgrades = [];
        //Add all the upgrades
        for (let elem of js["upgrades"]) {
            let upg = { name: elem["name"], stats: new Stats(elem) };
            this.upgrades.push(upg);
        }
        this.safety = [];
        //Add all the safety
        for (let elem of js["safety"]) {
            let sft = { name: elem["name"], stats: new Stats(elem) };
            this.safety.push(sft);
        }
        this.gunsights = [];
        //Add all the gunsights
        for (let elem of js["gunsights"]) {
            let gun = { name: elem["name"], attack: elem["attack"], stats: new Stats(elem) };
            this.gunsights.push(gun);
        }
    }
    toJSON() {
        var lst = [];
        for (let cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }
    fromJSON(js, json_version) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.fromJSON(elem, json_version);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    serialize(s) {
        s.PushNum(this.positions.length);
        for (let cp of this.positions) {
            cp.serialize(s);
        }
    }
    deserialize(d) {
        var len = d.GetNum();
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
        var lst = [];
        for (let c of this.positions) {
            lst.push(c.GetAttack());
        }
        return lst;
    }
    GetVisibilityList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }
    GetStressList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }
    GetEscapeList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }
    GetCrashList() {
        var lst = [];
        for (let p of this.positions) {
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
        for (let c of this.positions) {
            c.SetHasRotary(has);
        }
    }
    IsElectrics() {
        for (let c of this.positions) {
            if (c.IsElectrics())
                return true;
        }
        return false;
    }
    PartStats() {
        var s = new Stats();
        for (let cp of this.positions) {
            s = s.Add(cp.PartStats());
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
        for (let cp of this.positions) {
            if (cp.IsCopilot()) {
                copilots += 1;
            }
        }
        for (let cp of this.positions) {
            cp.CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Passengers extends Part {
    constructor(js) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }
    toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }
    fromJSON(js, json_version) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }
    serialize(s) {
        s.PushNum(this.seats);
        s.PushNum(this.beds);
        s.PushBool(this.connected);
    }
    deserialize(d) {
        this.seats = d.GetNum();
        this.beds = d.GetNum();
        this.connected = d.GetBool();
    }
    GetSeats() {
        return this.seats;
    }
    SetSeats(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.seats = num;
        this.CalculateStats();
    }
    GetBeds() {
        return this.beds;
    }
    SetBeds(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.beds = num;
        this.CalculateStats();
    }
    PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }
    GetConnected() {
        return this.connected;
    }
    SetConnected(sel) {
        this.connected = sel;
        this.CalculateStats();
    }
    PartStats() {
        var stats = new Stats();
        stats.reqsections = 2 * Math.ceil(-1.0e-6 + (this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            stats.mass = 1;
        }
        stats.bomb_mass += this.seats + this.beds;
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        if (this.seats + this.beds > 0) {
            stats.warnings.push({
                source: lu("Passengers Section Title"),
                warning: lu("Passengers Count", this.seats, this.beds),
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
class Engine extends Part {
    constructor(ml, cl) {
        super();
        this.elist_idx = "Custom";
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(0);
        this.etype_inputs = engine_list.get(this.elist_idx).get(0);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.selected_mount = 0;
        this.intake_fan = false;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.cowl_list = cl;
        this.cowl_sel = 0;
        this.use_ds = false;
        this.outboard_prop = false;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        this.is_generator = false;
        this.has_alternator = false;
        if (engine_list.get(this.elist_idx).length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            selected_inputs: this.etype_inputs.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.selected_mount,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
            is_generator: this.is_generator,
            has_alternator: this.has_alternator,
            intake_fan: this.intake_fan,
            outboard_prop: this.outboard_prop,
        };
    }
    oldJSON(js, json_version) {
        var stats = js["selected_stats"];
        this.etype_stats.fromJSON(stats, json_version);
        this.etype_inputs = new EngineInputs();
        if (this.etype_stats.pulsejet && stats["input_pj"]) {
            this.etype_inputs = new EngineInputs();
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
            var ipj = stats["input_pj"];
            this.etype_inputs.type = ipj["type"];
            this.etype_inputs.power = ipj["power"];
            this.etype_inputs.era_sel = ipj["era_sel"];
            this.etype_inputs.quality_cost = ipj["quality_cost"];
            this.etype_inputs.quality_rely = ipj["quality_rely"];
            this.etype_inputs.starter = ipj["starter"];
        }
        else if (stats["input_eb"]) {
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PROPELLER;
            var ieb = stats["input_eb"];
            this.etype_inputs.displacement = ieb["displacement"];
            this.etype_inputs.compression = ieb["compression"];
            this.etype_inputs.type = ieb["type"];
            this.etype_inputs.cyl_per_row = ieb["cyl_per_row"];
            this.etype_inputs.rows = ieb["rows"];
            this.etype_inputs.RPM_boost = ieb["RPM_boost"];
            this.etype_inputs.era_sel = ieb["era_sel"];
            this.etype_inputs.material_fudge = ieb["material_fudge"];
            this.etype_inputs.quality_fudge = ieb["quality_fudge"];
            this.etype_inputs.upgrades = ieb["upgrades"];
            if (this.etype_inputs.upgrades.length == 6) {
                this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                if (this.etype_inputs.upgrades[0]) {
                    this.etype_inputs.compressor_type = 2;
                    this.etype_inputs.compressor_count = 1;
                }
                if (this.etype_inputs.upgrades[1]) {
                    this.etype_inputs.compressor_type = 3;
                    this.etype_inputs.compressor_count = 1;
                }
                this.etype_inputs.upgrades.splice(0, 2);
            }
            else {
                this.etype_inputs.compressor_type = ieb["compressor_type"];
                this.etype_inputs.compressor_count = ieb["compressor_count"];
                this.etype_inputs.min_IAF = ieb["min_IAF"];
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        return this.etype_inputs;
    }
    fromJSON(js, json_version) {
        var elist_idx = "";
        if (json_version > 10.55) {
            this.etype_stats.fromJSON(js["selected_stats"], json_version);
            var e_inputs = new EngineInputs(js["selected_inputs"]);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        }
        else {
            var e_inputs = this.oldJSON(js, json_version);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }
        this.elist_idx = elist_idx;
        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.selected_mount = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.is_generator = js["is_generator"];
        this.has_alternator = js["has_alternator"];
        this.intake_fan = js["intake_fan"];
        if (json_version >= 12.15) {
            this.outboard_prop = js["outboard_prop"];
        }
        else {
            this.outboard_prop = false;
        }
    }
    serialize(s) {
        this.etype_stats.serialize(s);
        this.etype_inputs.serialize(s);
        s.PushNum(this.cooling_count);
        s.PushNum(this.radiator_index);
        s.PushNum(this.selected_mount);
        s.PushBool(this.use_pp);
        s.PushBool(this.torque_to_struct);
        s.PushBool(this.use_ds);
        s.PushNum(this.gp_count);
        s.PushNum(this.gpr_count);
        s.PushNum(this.cowl_sel);
        s.PushBool(this.is_generator);
        s.PushBool(this.has_alternator);
        s.PushBool(this.intake_fan);
        s.PushBool(this.outboard_prop);
    }
    oldDeserialize(d) {
        this.etype_stats.name = d.GetString();
        this.etype_stats.overspeed = d.GetNum();
        this.etype_stats.altitude = d.GetNum();
        this.etype_stats.torque = d.GetNum();
        this.etype_stats.rumble = d.GetNum();
        this.etype_stats.oiltank = d.GetBool();
        this.etype_stats.pulsejet = d.GetBool();
        this.etype_inputs = new EngineInputs();
        if (d.version > 10.45) {
            this.etype_inputs.name = this.etype_stats.name;
            if (this.etype_stats.pulsejet) {
                this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
                this.etype_inputs.power = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.quality_cost = d.GetNum();
                this.etype_inputs.quality_rely = d.GetNum();
                this.etype_inputs.starter = d.GetBool();
            }
            else {
                this.etype_inputs.displacement = d.GetNum();
                this.etype_inputs.compression = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.cyl_per_row = d.GetNum();
                this.etype_inputs.rows = d.GetNum();
                this.etype_inputs.RPM_boost = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.material_fudge = d.GetNum();
                this.etype_inputs.quality_fudge = d.GetNum();
                this.etype_inputs.upgrades = d.GetBoolArr(0); //Put 0, because we don't have a minimum, and below checks the actual length to decide which version
                if (this.etype_inputs.upgrades.length == 6) {
                    this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                    if (this.etype_inputs.upgrades[0]) {
                        this.etype_inputs.compressor_type = 2;
                        this.etype_inputs.compressor_count = 1;
                    }
                    if (this.etype_inputs.upgrades[1]) {
                        this.etype_inputs.compressor_type = 3;
                        this.etype_inputs.compressor_count = 1;
                    }
                    this.etype_inputs.upgrades.splice(0, 2);
                }
                else {
                    this.etype_inputs.compressor_type = d.GetNum();
                    this.etype_inputs.compressor_count = d.GetNum();
                    this.etype_inputs.min_IAF = d.GetNum();
                }
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        this.etype_stats.stats.deserialize(d);
        return this.etype_inputs;
    }
    deserialize(d) {
        var elist_idx = "";
        if (d.version > 10.55) {
            this.etype_stats.deserialize(d);
            var e_inputs = new EngineInputs();
            e_inputs.deserialize(d);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        }
        else {
            var e_inputs = this.oldDeserialize(d);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }
        this.cooling_count = d.GetNum();
        this.radiator_index = d.GetNum();
        this.selected_mount = d.GetNum();
        this.use_pp = d.GetBool();
        this.torque_to_struct = d.GetBool();
        this.use_ds = d.GetBool();
        this.gp_count = d.GetNum();
        this.gpr_count = d.GetNum();
        this.cowl_sel = d.GetNum();
        this.is_generator = d.GetBool();
        this.has_alternator = d.GetBool();
        this.intake_fan = d.GetBool();
        if (d.version >= 12.15) {
            this.outboard_prop = d.GetBool();
        }
        else {
            this.outboard_prop = false;
        }
        this.elist_idx = elist_idx;
    }
    GetMaxAltitude() {
        return this.GetMinIAF() + this.etype_stats.altitude;
    }
    GetMinIAF() {
        return this.etype_inputs.min_IAF;
    }
    CanSelectIndex() {
        var elist_temp = engine_list.get(this.elist_idx);
        var can = [...Array(elist_temp.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < elist_temp.length; i++) {
                if (elist_temp.get(i).engine_type == ENGINE_TYPE.PULSEJET)
                    can[i] = false;
            }
        }
        return can;
    }
    SetSelectedIndex(num) {
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(num);
        this.etype_inputs = engine_list.get(this.elist_idx).get(num);
        if (this.use_pp)
            this.cooling_count = 2 * this.etype_stats.stats.cooling;
        else
            this.cooling_count = this.etype_stats.stats.cooling;
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return engine_list.get(this.elist_idx).find_name(this.etype_stats.name);
    }
    GetCurrentStats() {
        return this.etype_stats.Clone();
    }
    NeedCooling() {
        return this.etype_stats.stats.cooling > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.cooling_count = num;
        if (this.NeedCooling()) {
            this.cooling_count = Math.max(1, this.cooling_count);
        }
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
    }
    GetMaxCooling() {
        if (this.use_pp)
            return 2 * this.etype_stats.stats.cooling;
        return this.etype_stats.stats.cooling;
    }
    SetNumRadiators(num) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }
    GetNumRadiators() {
        return this.num_radiators;
    }
    SetRadiator(num) {
        this.radiator_index = num;
        this.CalculateStats();
    }
    GetRadiator() {
        return this.radiator_index;
    }
    CanIntakeFan() {
        return this.IsAirCooled();
    }
    SetIntakeFan(use) {
        this.intake_fan = use;
        this.CalculateStats();
    }
    GetIntakeFan() {
        return this.intake_fan;
    }
    CanOutboardProp() {
        return this.use_ds && (this.IsTractor() || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull");
    }
    GetOutboardProp() {
        return this.outboard_prop;
    }
    SetOutboardProp(use) {
        if (use && this.use_ds) {
            this.outboard_prop = true;
        }
        else {
            this.outboard_prop = false;
        }
        this.CalculateStats();
    }
    SetSelectedList(n) {
        if (n != this.elist_idx) {
            this.elist_idx = n;
            this.SetSelectedIndex(0); //This calls CalculateStats
        }
    }
    GetSelectedList() {
        return this.elist_idx;
    }
    GetListOfEngines() {
        return engine_list.get(this.elist_idx);
    }
    RequiresExtendedDriveshafts() {
        if (this.is_internal)
            return false;
        return this.mount_list[this.selected_mount].reqED;
    }
    SetTailMods(forb, swr, canard) {
        if (this.mount_list[this.selected_mount].reqTail && !(forb || swr) && !this.GetGenerator())
            this.use_ds = true;
        if (this.mount_list[this.selected_mount].reqED && !this.GetGenerator() && !(canard && (forb || swr)))
            this.use_ds = true;
    }
    CanMountIndex() {
        var can = [...Array(this.mount_list.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].helicopter;
            }
        }
        else if (this.use_pp) {
            for (let i = 0; i < can.length; ++i) {
                if (this.mount_list[i].mount_type == "fuselage"
                    && this.mount_list[i].name != "Fuselage Push-Pull") {
                    can[i] = false;
                }
            }
        }
        else {
            for (let i = 0; i < can.length; ++i) {
                if (this.mount_list[i].name == "Fuselage Push-Pull") {
                    can[i] = false;
                }
            }
        }
        return can;
    }
    SetMountIndex(num) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.selected_mount = num;
        if (this.mount_list[this.selected_mount].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }
    GetMountIndex() {
        if (this.GetIsPulsejet())
            return -1;
        return this.selected_mount;
    }
    CanUsePushPull() {
        return !(this.is_generator || (this.GetNumPropellers() == 0) || this.is_internal);
    }
    SetUsePushPull(use) {
        this.use_pp = use;
        if (use) {
            this.cooling_count *= 2;
            if (this.mount_list[this.selected_mount].mount_type == "fuselage") {
                this.selected_mount = 8;
            }
        }
        else {
            this.cooling_count = Math.floor(1.0e-6 + this.cooling_count / 2);
            if (this.mount_list[this.selected_mount].name == "Fuselage Push-Pull") {
                this.selected_mount = 0;
            }
        }
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    CanUseExtendedDriveshaft() {
        return !((this.GetNumPropellers() == 0) || this.is_internal || this.GetGenerator());
    }
    SetUseExtendedDriveshaft(use) {
        if (this.GetGenerator() || this.is_internal) {
            this.use_ds = false;
        }
        else {
            this.use_ds = use;
        }
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    CanUseGears() {
        return !((this.GetNumPropellers() == 0) || this.GetGenerator());
    }
    SetGearCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }
    GetGearReliability() {
        return this.gpr_count;
    }
    SetTorqueToStruct(use) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }
    GetTorqueToStruct() {
        return this.torque_to_struct;
    }
    CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0;
    }
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        this.total_reliability += this.cowl_list[this.cowl_sel].stats.reliability;
        if (this.NeedCooling()) {
            this.total_reliability -= (this.GetMaxCooling() - this.cooling_count);
        }
        if (this.GetIntakeFan()) {
            this.total_reliability += 6;
        }
        this.total_reliability += num;
    }
    GetReliability() {
        if (this.use_pp) {
            if (this.outboard_prop) {
                return this.total_reliability.toString() + '/' + (this.total_reliability - 2).toString();
            }
            return this.total_reliability.toString() + '/' + this.total_reliability.toString();
        }
        //else
        if (this.outboard_prop) {
            return (this.total_reliability - 2).toString();
        }
        return this.total_reliability.toString();
    }
    GetOverspeed() {
        if (this.is_generator)
            return 100;
        return this.etype_stats.overspeed + Math.floor(1.0e-6 + this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            this.has_alternator = false;
            this.is_generator = false;
            this.cowl_sel = 0;
            if (this.mount_list[this.selected_mount].mount_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].mount_type != "fuselage")
                        break;
                }
            }
        }
    }
    GetIsTurbine() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY;
    }
    GetIsTurboprop() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY && this.etype_inputs.type == 3;
    }
    TurbineCheck() {
        if (this.GetIsTurbine()) {
            if (this.GetNumPropellers() == 0) {
                this.use_ds = false;
                this.gp_count = 0;
                this.gpr_count = 0;
                this.selected_mount = 5;
            }
            this.use_pp = false;
            this.cooling_count = 0;
            this.cowl_sel = 0;
        }
    }
    GetNumPropellers() {
        if (!(this.GetIsPulsejet() || this.GetIsTurbine() || this.GetGenerator()) || this.GetIsTurboprop() || this.is_internal) {
            if (this.use_pp) {
                return 2;
            }
            return 1;
        }
        return 0;
    }
    GetIsTractorNacelle() {
        if (this.GetNumPropellers() > 0
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].powerfactor == 0.8
            && !this.is_internal)
            return true;
        return false;
    }
    IsLiquidCooled() {
        return this.NeedCooling();
    }
    IsRotary() {
        return this.etype_stats.oiltank;
    }
    IsContraRotary() {
        if (!this.GetIsPulsejet()) {
            if (this.elist_idx != ""
                && this.etype_inputs.type == 3) {
                return true;
            }
        }
        return false;
    }
    IsAirCooled() {
        return !this.GetIsPulsejet() && !this.GetIsTurbine() && !this.IsLiquidCooled() && !this.IsRotary();
    }
    GetCowlList() {
        return this.cowl_list;
    }
    GetCowl() {
        return this.cowl_sel;
    }
    GetCowlEnabled() {
        let lst = [];
        for (let c of this.cowl_list) {
            if (this.GetIsPulsejet() || this.GetIsTurbine()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
            }
            else if (this.IsLiquidCooled()) {
                lst.push(c.liquid);
            }
            else if (this.IsRotary()) {
                lst.push(c.rotary);
            }
            else { //Means air cooled
                lst.push(c.air);
            }
        }
        return lst;
    }
    GetHasOilTank() {
        return this.etype_stats.oiltank;
    }
    GetHasOilCooler() {
        return this.etype_stats.stats.cooling > 0;
    }
    GetHasOilPan() {
        return this.IsAirCooled();
    }
    VerifyCowl(num) {
        var can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }
    SetCowl(num) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }
    GetGeneratorEnabled() {
        return !(this.GetIsPulsejet() || this.use_pp);
    }
    GetGenerator() {
        return this.is_generator;
    }
    SetGenerator(use) {
        if (this.GetGeneratorEnabled()) {
            this.is_generator = use;
        }
        else {
            this.is_generator = false;
        }
        if (this.is_generator) {
            this.gp_count = 0;
            this.gpr_count = 0;
            this.use_ds = false;
        }
        this.CalculateStats();
    }
    GetAlternatorEnabled() {
        return !this.GetIsPulsejet() && !this.is_generator;
    }
    GetAlternator() {
        return this.has_alternator;
    }
    SetAlternator(use) {
        if (this.GetAlternatorEnabled()) {
            this.has_alternator = use;
        }
        else {
            this.has_alternator = false;
        }
        this.CalculateStats();
    }
    GetRumble() {
        return this.etype_stats.rumble;
    }
    IsTractor() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.selected_mount].name == "Tractor"
            || this.mount_list[this.selected_mount].name == "Center-Mounted Tractor"
            || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull";
    }
    GetTractorSpinner() {
        return {
            has: this.IsTractor() && !(this.outboard_prop && !this.use_pp),
            spinner: this.GetSpinner()
        };
    }
    IsPusher() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.selected_mount].name == "Rear-Mounted Pusher"
            || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
            || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull";
    }
    GetPusherSpinner() {
        return {
            has: this.IsPusher() && !this.outboard_prop,
            spinner: this.GetSpinner()
        };
    }
    GetSpinner() {
        if (this.gp_count > 0 && !this.GetGenerator() && !this.outboard_prop) {
            if (this.use_ds &&
                (this.mount_list[this.selected_mount].name == "Center-Mounted Tractor"
                    || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
                    || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull")) { //Uses Extended Driveshafts, can be arty, and rotary engine
                return [true, true];
            }
            else if (!this.etype_stats.oiltank) { //Not rotary, so room for gun but not arty.
                return [true, false];
            }
        }
        //No spinner weapons
        return [false, false];
    }
    IsElectrics() {
        return this.has_alternator || this.GetGenerator();
    }
    GetEngineHeight() {
        if (!this.GetGenerator()) {
            if (this.mount_list[this.selected_mount].name == "Pod" || this.etype_stats.pulsejet || this.is_internal || this.outboard_prop)
                return 2;
            else if (this.mount_list[this.selected_mount].name == "Nacelle (Offset)")
                return 1;
            else if (this.mount_list[this.selected_mount].name == "Nacelle (Inside)"
                || this.mount_list[this.selected_mount].name == "Channel Tractor")
                return 0;
            else
                return -1;
        }
        else {
            return 5;
        }
    }
    IsTractorRotary() {
        if (this.GetGenerator())
            return false;
        return this.IsRotary() &&
            (this.mount_list[this.selected_mount].name == "Tractor"
                || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull");
    }
    IsDiesel() {
        return this.etype_inputs.upgrades[3];
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    SetInternal(is) {
        this.is_internal = is;
        if (is) {
            this.use_ds = false;
            if (!this.CanMountIndex()[this.selected_mount])
                this.selected_mount = 1;
        }
    }
    PartStats() {
        this.PulseJetCheck();
        this.TurbineCheck();
        if (!this.CanOutboardProp()) {
            this.outboard_prop = false;
        }
        let stats = new Stats;
        stats = stats.Add(this.etype_stats.stats);
        stats.upkeep = stats.power / 10;
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        if (this.torque_to_struct)
            stats.structure -= this.etype_stats.torque;
        else {
            if (this.mount_list[this.selected_mount].mount_type == "wing")
                stats.maxstrain -= this.etype_stats.torque;
            else if (this.mount_list[this.selected_mount].mount_type == "fuselage")
                stats.latstab -= this.etype_stats.torque;
        }
        //ContraRotary Engines need geared propellers to function.
        if (this.IsContraRotary()) {
            this.gp_count = Math.max(1, this.gp_count);
        }
        stats.cost += this.gp_count + this.gpr_count;
        if (this.gp_count > 0) {
            stats.era.push({ name: "Propeller Gearing", era: "WWI" });
        }
        if (this.gpr_count > 0) {
            stats.era.push({ name: "Reliable Gearing", era: "Roaring 20s" });
        }
        //Extended Driveshafts
        if (this.use_ds) {
            stats.mass += 1;
        }
        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].ed);
        //Push-pull
        if (this.use_pp) {
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.upkeep *= 2;
            stats.reqsections *= 2;
            stats.power = Math.floor(1.0e-6 + this.mount_list[this.selected_mount].powerfactor * stats.power);
        }
        //If there is a cowl, and it's a pusher (or push-pull), add the engineering cost
        if (this.cowl_sel != 0 &&
            (this.mount_list[this.selected_mount].name == "Rear-Mounted Pusher" ||
                this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
                || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull")) {
            stats.cost += 2;
        }
        //Air Cooling Fan (only 1 / push-pull)
        if (this.IsAirCooled() && this.intake_fan) {
            stats.mass += 3;
            //Double Effect of Torque
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.cost += 4;
            stats.era.push({ name: "Air Cooling Fan", era: "WWII" });
        }
        else {
            this.intake_fan = false;
        }
        //Move here so it doesn't get affected by cowl.
        if (this.GetHasOilCooler()) {
            stats.drag += Math.floor(stats.power / 15);
        }
        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!(this.GetIsPulsejet())) {
            stats = stats.Add(this.mount_list[this.selected_mount].stats);
            stats.maxstrain -= Math.floor(1.0e-6 + this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(1.0e-6 + this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }
        // Power Generation
        if (this.is_generator) {
            stats.charge = Math.floor(1.0e-6 + 2 * stats.power / 10) + 2;
            stats.power = 0;
        }
        else if (this.has_alternator) {
            stats.charge = Math.floor(1.0e-6 + stats.power / 10) + 1;
            stats.mass += 1;
            stats.cost += 2;
        }
        if (this.outboard_prop) {
            stats.drag += 3;
            if (this.use_pp) {
                stats.escape += 2;
            }
        }
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Radiator extends Part {
    constructor(tl, ml, cl) {
        super();
        this.need_cool = 0;
        this.idx_type = 1;
        this.idx_mount = 1;
        this.idx_coolant = 0;
        this.metal_area = 0;
        this.engine_count = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
        this.harden_cool = false;
    }
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant,
            harden_cool: this.harden_cool,
        };
    }
    fromJSON(js, json_version) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
        if (json_version > 10.85) {
            this.harden_cool = js["harden_cool"];
        }
    }
    serialize(s) {
        s.PushNum(this.idx_type);
        s.PushNum(this.idx_mount);
        s.PushNum(this.idx_coolant);
        s.PushBool(this.harden_cool);
    }
    derserialize(d) {
        this.idx_type = d.GetNum();
        this.idx_mount = d.GetNum();
        this.idx_coolant = d.GetNum();
        if (d.version > 10.85) {
            this.harden_cool = d.GetBool();
        }
    }
    GetTypeList() {
        return this.type_list;
    }
    GetMountList() {
        return this.mount_list;
    }
    GetCoolantList() {
        return this.coolant_list;
    }
    CanType() {
        var can = [...Array(this.type_list.length).fill(true)];
        for (let i = 0; i < this.type_list.length; i++) {
            if (this.type_list[i].name == "Evaporation" && this.metal_area < this.engine_count * 5)
                can[i] = false;
        }
        return can;
    }
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetParasol(has) {
        this.has_parasol = has;
        if (!this.CanMount()[this.idx_mount])
            this.idx_mount = 0;
    }
    CanMount() {
        var can = [...Array(this.mount_list.length).fill(true)];
        for (let i = 0; i < this.mount_list.length; i++) {
            if (this.mount_list[i].name == "High Offset" && !this.has_parasol)
                can[i] = false;
        }
        return can;
    }
    SetMountIndex(num) {
        if (this.CanMount()[num]) {
            this.idx_mount = num;
            this.CalculateStats();
        }
    }
    GetMountIndex() {
        return this.idx_mount;
    }
    SetCoolantIndex(num) {
        this.idx_coolant = num;
        this.CalculateStats();
    }
    GetCoolantIndex() {
        return this.idx_coolant;
    }
    SetNeedCool(num, engnum) {
        this.need_cool = num;
        this.engine_count = engnum;
    }
    SetMetalArea(num) {
        this.metal_area = num;
        if (!this.CanType()[this.idx_type])
            this.idx_type = 0;
    }
    GetHarden() {
        return this.harden_cool;
    }
    SetHarden(use) {
        this.harden_cool = use;
        this.CalculateStats();
    }
    VerifyHarden() {
        if (this.coolant_list[this.idx_coolant].harden) {
            this.harden_cool = true;
        }
    }
    PartStats() {
        this.VerifyHarden();
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);
        stats.drag += Math.ceil(-1.0e-6 + this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));
        if (this.harden_cool) {
            stats.cost += 2;
        }
        if (this.coolant_list[this.idx_coolant].flammable) {
            stats.warnings.push({
                source: lu("Radiator Fluid"), warning: lu("Radiator Fluid Warning")
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
/// <reference path="./Engine.ts" />
/// <reference path="./Radiator.ts" />
class Engines extends Part {
    constructor(js) {
        super();
        this.engines = [];
        this.radiators = [];
        this.mount_list = [];
        for (let elem of js["mounts"]) {
            let mount = { name: elem["name"], stats: new Stats(elem), strainfactor: elem["strainfactor"], dragfactor: elem["dragfactor"], mount_type: elem["location"], powerfactor: elem["powerfactor"], reqED: false, reqTail: false, helicopter: elem["helicopter"] };
            if (elem["reqED"])
                mount.reqED = true;
            if (elem["reqTail"])
                mount.reqTail = true;
            this.mount_list.push(mount);
        }
        this.is_asymmetric = false;
        this.r_type_list = [];
        for (let elem of js["radiator-type"]) {
            this.r_type_list.push({ name: elem["name"], stats: new Stats(elem), dragpercool: parseFloat(elem["dragpercool"]) });
        }
        this.r_mount_list = [];
        for (let elem of js["radiator-mount"]) {
            this.r_mount_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.r_coolant_list = [];
        for (let elem of js["radiator-coolant"]) {
            this.r_coolant_list.push({ name: elem["name"], harden: elem["harden"], flammable: elem["flammable"], stats: new Stats(elem) });
        }
        this.cowl_list = [];
        for (let elem of js["cowling"]) {
            this.cowl_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                ed: elem["ed"],
                mpd: elem["mpd"],
                air: elem["air"],
                liquid: elem["liquid"],
                rotary: elem["rotary"],
            });
        }
    }
    toJSON() {
        var eng = [];
        for (let en of this.engines) {
            eng.push(en.toJSON());
        }
        var rad = [];
        for (let rd of this.radiators) {
            rad.push(rd.toJSON());
        }
        return {
            engines: eng,
            radiators: rad,
            is_asymmetric: this.is_asymmetric
        };
    }
    fromJSON(js, json_version) {
        this.radiators = [];
        for (let elem of js["radiators"]) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.fromJSON(elem, json_version);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        this.engines = [];
        for (let elem of js["engines"]) {
            let eng = new Engine(this.mount_list, this.cowl_list);
            eng.fromJSON(elem, json_version);
            eng.SetCalculateStats(this.CalculateStats);
            this.engines.push(eng);
            eng.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.is_asymmetric = js["is_asymmetric"];
    }
    serialize(s) {
        s.PushNum(this.engines.length);
        for (let en of this.engines) {
            en.serialize(s);
        }
        s.PushNum(this.radiators.length);
        for (let rd of this.radiators) {
            rd.serialize(s);
        }
        s.PushBool(this.is_asymmetric);
    }
    deserialize(d) {
        var elen = d.GetNum();
        this.engines = [];
        for (let i = 0; i < elen; i++) {
            let eng = new Engine(this.mount_list, this.cowl_list);
            eng.deserialize(d);
            eng.SetCalculateStats(this.CalculateStats);
            this.engines.push(eng);
        }
        var rlen = d.GetNum();
        this.radiators = [];
        for (let i = 0; i < rlen; i++) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.derserialize(d);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        this.is_asymmetric = d.GetBool();
        for (let en of this.engines) {
            en.SetNumRadiators(this.GetNumberOfRadiators());
        }
    }
    GetHasOilTank() {
        for (let e of this.engines) {
            if (e.GetCurrentStats().oiltank)
                return true;
        }
        return false;
    }
    GetReliabilityList() {
        var lst = [];
        for (let e of this.engines) {
            lst.push(e.GetReliability());
        }
        return lst;
    }
    GetMinIAF() {
        var m = 0;
        for (let e of this.engines) {
            m = Math.max(m, e.GetMinIAF());
        }
        return m;
    }
    GetMaxAltitude() {
        var m = 100;
        for (let e of this.engines) {
            m = Math.min(m, e.GetMaxAltitude());
        }
        return m;
    }
    SetNumberOfEngines(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.min(20, num);
        while (this.engines.length > num) {
            this.engines.pop();
        }
        var js = null;
        if (this.engines.length > 0) {
            js = JSON.stringify(this.engines[this.engines.length - 1].toJSON());
        }
        while (this.engines.length < num) {
            let en = new Engine(this.mount_list, this.cowl_list);
            en.SetCalculateStats(this.CalculateStats);
            if (js)
                en.fromJSON(JSON.parse(js), 1000);
            this.engines.push(en);
            en.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.CalculateStats();
    }
    GetNumberOfEngines() {
        var count = 0;
        for (let e of this.engines) {
            if (!e.GetGenerator())
                count++;
        }
        return count;
    }
    GetNumberOfItems() {
        return this.engines.length;
    }
    GetEngine(num) {
        return this.engines[num];
    }
    GetRadiator(num) {
        return this.radiators[num];
    }
    SetNumberOfRadiators(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        while (this.radiators.length > num) {
            this.radiators.pop();
        }
        while (this.radiators.length < num) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        for (let en of this.engines) {
            en.SetNumRadiators(num);
        }
        this.CalculateStats();
    }
    GetNumberOfRadiators() {
        if (this.radiators.length == 0 && this.NeedCooling())
            this.SetNumberOfRadiators(1);
        else if (this.radiators.length > 0 && !this.NeedCooling())
            this.SetNumberOfRadiators(0);
        return this.radiators.length;
    }
    NeedCooling() {
        var need = false;
        for (let elem of this.engines) {
            need = need || elem.NeedCooling();
        }
        return need;
    }
    UpdateReliability(stats) {
        for (let elem of this.engines) {
            let rad_stats = new Stats();
            if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
                rad_stats = this.radiators[elem.GetRadiator()].PartStats();
            }
            elem.UpdateReliability(stats.reliability + rad_stats.reliability);
        }
    }
    SetAsymmetry(use) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }
    GetAsymmetry() {
        return this.is_asymmetric;
    }
    GetNumPropellers() {
        var count = 0;
        for (let e of this.engines) {
            count += e.GetNumPropellers();
        }
        return count;
    }
    GetEngineType() {
        var type = 9999;
        for (let e of this.engines) {
            if (e.GetIsPulsejet()) {
                type = Math.min(type, ENGINE_TYPE.PULSEJET);
            }
            if (e.GetIsTurbine()) {
                type = Math.min(type, ENGINE_TYPE.TURBOMACHINERY);
            }
        }
        if (type == 9999)
            type = ENGINE_TYPE.PROPELLER;
        return type;
    }
    GetOverspeed() {
        var os = 100;
        for (let e of this.engines)
            os = Math.min(os, e.GetOverspeed());
        return os;
    }
    GetRumble() {
        var r = 0;
        for (let e of this.engines)
            r += e.GetRumble();
        return r;
    }
    GetMaxRumble() {
        var r = 0;
        for (let e of this.engines)
            r = Math.max(r, e.GetRumble());
        return r;
    }
    GetTractorSpinner() {
        var ret = { have: false, spin_count: 0, arty_spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetTractorSpinner();
            if (t.has) {
                ret.have = true;
                if (t.spinner[0])
                    ret.spin_count++;
                if (t.spinner[1])
                    ret.arty_spin_count++;
            }
        }
        return ret;
    }
    GetPusherSpinner() {
        var ret = { have: false, spin_count: 0, arty_spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetPusherSpinner();
            if (t.has) {
                ret.have = true;
                if (t.spinner[0])
                    ret.spin_count++;
                if (t.spinner[1])
                    ret.arty_spin_count++;
            }
        }
        return ret;
    }
    IsElectrics() {
        for (let e of this.engines) {
            if (e.IsElectrics())
                return true;
        }
        return false;
    }
    HaveParasol(has) {
        for (let r of this.radiators) {
            r.SetParasol(has);
        }
    }
    SetMetalArea(num) {
        for (let r of this.radiators) {
            r.SetMetalArea(num);
        }
    }
    SetTailMods(forb, swr, canard) {
        for (let e of this.engines)
            e.SetTailMods(forb, swr, canard);
    }
    GetEngineHeight() {
        var min = 2;
        for (let e of this.engines)
            min = Math.min(min, e.GetEngineHeight());
        return min;
    }
    HasTractorRotary() {
        for (let e of this.engines) {
            if (e.IsTractorRotary())
                return true;
        }
        return false;
    }
    SetInternal(is) {
        for (let e of this.engines) {
            e.SetInternal(is);
        }
        if (is) {
            for (let r of this.radiators) {
                r.SetMetalArea(0);
                r.SetParasol(false);
            }
        }
    }
    HasPulsejet() {
        for (let e of this.engines) {
            if (e.GetIsPulsejet())
                return true;
        }
        return false;
    }
    HasTurbineNoProp() {
        for (let e of this.engines) {
            if (e.GetIsTurbine() && e.GetNumPropellers() == 0)
                return true;
        }
        return false;
    }
    HasDiesel() {
        for (let e of this.engines) {
            if (e.IsDiesel())
                return true;
        }
        return false;
    }
    PartStats() {
        var stats = new Stats;
        var needCool = new Array(this.GetNumberOfRadiators()).fill(null).map(() => ({ cool: 0, count: 0 }));
        var ecost = 0;
        //Engine stuff
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling()) {
                needCool[en.GetRadiator()].cool += en.GetCooling();
                needCool[en.GetRadiator()].count += 1;
            }
            ecost += en.GetCurrentStats().stats.cost;
        }
        //Upkeep calc only uses engine costs
        stats.upkeep = Math.floor(1.0e-6 + Math.min(stats.upkeep, ecost));
        //Include radiaators
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i].cool, needCool[i].count);
            stats = stats.Add(rad.PartStats());
        }
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
        if (this.HasPulsejet()) {
            stats.warnings.push({
                source: lu("Pulsejets"), warning: lu("Pulsejet Boost Warning")
            });
        }
        if (this.HasTurbineNoProp()) {
            stats.warnings.push({
                source: lu("Turbine"), warning: lu("Turbine Boost Warning")
            });
        }
        if (this.HasDiesel()) {
            stats.warnings.push({
                source: lu("Diesel"), warning: lu("Diesel Warning")
            });
        }
        var rotationT = 0;
        for (let e of this.engines) {
            if (e.IsRotary()) {
                if (e.GetUsePushPull() && e.GetTorqueToStruct()) {
                    // No change to RotationT
                }
                else if (e.GetUsePushPull() && e.IsTractor()) {
                    rotationT += 2;
                }
                else if (e.IsTractor()) {
                    rotationT++;
                }
                else if (e.IsPusher()) {
                    rotationT--;
                }
            }
        }
        if (rotationT > 0) {
            stats.warnings.push({
                source: lu("Rotary"), warning: lu("Rotary Right Warning")
            });
        }
        else if (rotationT < 0) {
            stats.warnings.push({
                source: lu("Rotary"), warning: lu("Rotary Left Warning")
            });
        }
        //Part local, gets handled in UpdateReliability
        stats.reliability = 0;
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetHasTractorNacelles() {
        let has = 0;
        for (let en of this.engines) {
            if (en.GetIsTractorNacelle())
                has++;
        }
        return has > 1;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Propeller extends Part {
    constructor(json) {
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
    toJSON() {
        return {
            type: this.idx_prop,
            upgrade: this.idx_upg
        };
    }
    fromJSON(js, json_version) {
        this.idx_prop = js["type"];
        if (json_version < 11.35) {
            this.idx_upg = 0;
            if (js["use_variable"])
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2;
                this.idx_prop = 2;
            }
        }
        else {
            this.idx_upg = js["upgrade"];
        }
    }
    serialize(s) {
        s.PushNum(this.idx_prop);
        s.PushNum(this.idx_upg);
    }
    deserialize(d) {
        this.idx_prop = d.GetNum();
        if (d.version < 11.35) {
            this.idx_upg = 0;
            if (d.GetBool())
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2;
                this.idx_prop = 2;
            }
        }
        else {
            this.idx_upg = d.GetNum();
        }
    }
    GetPropList() {
        return this.prop_list;
    }
    GetUpgradeList() {
        return this.upg_list;
    }
    SetPropIndex(num) {
        this.idx_prop = num;
        this.CalculateStats();
    }
    GetPropIndex() {
        return this.idx_prop;
    }
    SetUpgradeIndex(use) {
        this.idx_upg = use;
        this.CalculateStats();
    }
    GetUpgradeIndex() {
        return this.idx_upg;
    }
    SetNumPropeller(have, etype) {
        this.num_propellers = have;
        this.etype = etype;
    }
    GetNumPropellers() {
        return this.num_propellers;
    }
    GetEnergy() {
        if (this.is_heli)
            return 2.5;
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].energy + this.upg_list[this.idx_upg].energy;
        else //Pulsejet, Turbines, Ornithopters
            return 5;
    }
    GetTurn() {
        if (this.is_heli)
            return 6;
        if (this.num_propellers)
            return this.prop_list[this.idx_prop].turn + this.upg_list[this.idx_upg].turn;
        else //Pulsejet, Turbines, Ornithopters
            return 7;
    }
    SetAcftType(type) {
        switch (type) {
            case AIRCRAFT_TYPE.AIRPLANE:
            case AIRCRAFT_TYPE.AUTOGYRO:
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
                this.is_heli = true;
            case AIRCRAFT_TYPE.ORNITHOPTER:
                this.num_propellers = 0;
                break;
        }
    }
    PartStats() {
        var stats = new Stats();
        if (this.num_propellers != 0) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats.Multiply(this.num_propellers));
            stats = stats.Add(this.upg_list[this.idx_upg].stats.Multiply(this.num_propellers));
        }
        else if (this.etype == ENGINE_TYPE.PULSEJET) { //Pulsejet
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        else if (this.etype == ENGINE_TYPE.TURBOMACHINERY) { //Turbojets
            stats.pitchboost = 0.2;
            stats.pitchspeed = 1.3;
        }
        else {
            //Default, no auto pitch
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Frames extends Part {
    constructor(js) {
        super();
        this.frame_list = [];
        for (let elem of js["frames"]) {
            this.frame_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                basestruct: elem["basestructure"],
                basecost: elem["basecost"],
                geodesic: elem["geodesic"]
            });
        }
        this.sel_skin = 0;
        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"],
                dragfactor: elem["dragfactor"],
                massfactor: elem["massfactor"],
            });
        }
        this.farman = false;
        this.boom = false;
        this.has_tractor_nacelles = false;
        this.sel_tail = 2;
        this.tail_list = [];
        for (let elem of js["tail"]) {
            this.tail_list.push({
                name: elem["name"],
                stats: new Stats(elem)
            });
        }
        this.flying_wing = false;
        this.is_tandem = false;
        this.section_list = [];
        this.tail_section_list = [];
        this.SetRequiredSections(1);
    }
    toJSON() {
        return {
            sections: this.section_list,
            tail_sections: this.tail_section_list,
            tail_index: this.sel_tail,
            use_farman: this.farman,
            use_boom: this.boom,
            flying_wing: this.flying_wing,
            sel_skin: this.sel_skin,
        };
    }
    fromJSON(js, json_version) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
        this.flying_wing = js["flying_wing"];
        if (json_version > 10.25)
            this.sel_skin = js["sel_skin"];
    }
    serialize(s) {
        s.PushNum(this.section_list.length);
        for (let i = 0; i < this.section_list.length; i++) {
            var sec = this.section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.tail_section_list.length);
        for (let i = 0; i < this.tail_section_list.length; i++) {
            var sec = this.tail_section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.sel_tail);
        s.PushBool(this.farman);
        s.PushBool(this.boom);
        s.PushBool(this.flying_wing);
        s.PushNum(this.sel_skin);
    }
    deserialize(d) {
        var slen = d.GetNum();
        this.section_list = [];
        for (let i = 0; i < slen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.section_list.push(sec);
        }
        var tlen = d.GetNum();
        this.tail_section_list = [];
        for (let i = 0; i < tlen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.tail_section_list.push(sec);
        }
        this.sel_tail = d.GetNum();
        this.farman = d.GetBool();
        this.boom = d.GetBool();
        this.flying_wing = d.GetBool();
        if (d.version > 10.25)
            this.sel_skin = d.GetNum();
    }
    DuplicateSection(num) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() + this.tail_section_list.length == this.CountInternalBracing()) {
            return;
        }
        this.section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DuplicateTailSection(num) {
        var sec = this.tail_section_list[num];
        var new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
            return;
        }
        this.tail_section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DeleteSection(num) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        this.section_list.splice(num, 1);
        if (this.CountInternalBracing() > this.CountSections() + this.tail_section_list.length) {
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (this.section_list[i].internal_bracing) {
                    this.section_list.splice(i, 1);
                    break;
                }
            }
        }
        this.CalculateStats();
    }
    SetRequiredSections(num) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (!this.section_list[i].internal_bracing) {
                    while (this.required_sections > this.CountSections()) {
                        this.DuplicateSection(i);
                    }
                    return;
                }
            }
        }
    }
    SetRequiredTailSections(num) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            while (num > this.tail_section_list.length) {
                this.DuplicateTailSection(this.tail_section_list.length - 1);
            }
        }
        while (num < this.tail_section_list.length) {
            this.tail_section_list.pop();
        }
        while (this.CountSections() + num < this.CountInternalBracing()) {
            let idx = this.section_list.length - 1;
            for (; idx > 0; idx--) {
                if (this.section_list[idx].internal_bracing)
                    break;
            }
            this.DeleteSection(idx);
        }
        this.CalculateStats();
    }
    CountSections() {
        var count = 0;
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                count++;
        }
        return count;
    }
    GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }
    CountInternalBracing() {
        var count = 0;
        for (let elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }
    BaseType() {
        var hist = [...Array(this.frame_list.length).fill(0)];
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        for (let elem of this.tail_section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i >= 0; i--) {
            if (hist[i] > max) {
                max = hist[i];
                max_index = i;
            }
        }
        return max_index;
    }
    GetFrameList() {
        return this.frame_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetSectionList() {
        return this.section_list;
    }
    SetFrame(num, type) {
        this.section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    // public SetSkin(num: number, type: number) {
    //     this.section_list[num].skin = type;
    //     if (type != 0)
    //         this.section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.section_list[num].monocoque = false;
    //         this.section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing(true)
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing(convert_sec_to_brace = false) {
        var allowed = this.CountSections();
        if (!this.farman)
            allowed += this.tail_section_list.length;
        if (convert_sec_to_brace)
            allowed -= 1;
        return this.CountInternalBracing() + 1 <= allowed;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman;
    }
    PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }
    GetFarmanOrBoom() {
        return this.farman || this.boom;
    }
    SectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        //If it's internal, no skin.
        if (!sec.internal_bracing) {
            stats.drag += 4;
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }
    TailSectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        stats.drag += 4;
        //If it's farman, no skin.
        if (!this.farman) {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }
    CountLiftingBody() {
        var count = 0;
        for (let s of this.section_list) {
            if (s.lifting_body)
                count++;
        }
        for (let s of this.tail_section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }
    SetIsTandem(use) {
        if (this.is_tandem != use) {
            this.is_tandem = use;
            this.SetTailType(this.sel_tail);
        }
    }
    SetTailType(num) {
        if (this.tail_list[num].stats.reqsections == 0 && this.is_tandem)
            num++;
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }
    GetTailType() {
        return this.sel_tail;
    }
    GetTailList() {
        return this.tail_list;
    }
    GetTailSectionList() {
        return this.tail_section_list;
    }
    SetUseFarman(use) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (let sec of this.tail_section_list) {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }
    GetUseFarman() {
        return this.farman;
    }
    SetUseBoom(use) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }
    GetUseBoom() {
        return this.boom;
    }
    SetTailFrame(num, type) {
        this.tail_section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.tail_section_list[num].geodesic = false;
        this.CalculateStats();
    }
    // public SetTailSkin(num: number, type: number) {
    //     this.tail_section_list[num].skin = type;
    //     if (type != 0)
    //         this.tail_section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.tail_section_list[num].monocoque = false;
    //         this.tail_section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = use;
    }
    GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }
    CanFlyingWing() {
        for (let s of this.section_list) {
            if (s.lifting_body)
                return true;
        }
        for (let s of this.tail_section_list) {
            if (s.lifting_body)
                return true;
        }
        return false;
    }
    GetFlyingWing() {
        return this.flying_wing;
    }
    SetFlyingWing(use) {
        if (use && this.CanFlyingWing()) {
            this.flying_wing = true;
        }
        else {
            this.flying_wing = false;
        }
        this.CalculateStats();
    }
    GetIsTailless() {
        return this.tail_section_list.length == 0;
    }
    SetAllFrame(num) {
        for (let s of this.section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        for (let s of this.tail_section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        this.CalculateStats();
    }
    SetAllSkin(num) {
        this.sel_skin = num;
        for (let s of this.section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        for (let s of this.tail_section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        this.CalculateStats();
    }
    GetArmor() {
        if (this.skin_list[this.sel_skin].name == "Dragon Skin")
            return 5;
        return 0;
    }
    GetIsFlammable() {
        if (this.skin_list[this.sel_skin].flammable)
            return true;
        return false;
    }
    GetSkin() {
        return this.sel_skin;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        if (!this.CanFlyingWing())
            this.flying_wing = false;
        var stats = new Stats();
        var base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;
        var is_clinker = this.skin_list[this.sel_skin].monocoque_structure < 0;
        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
        }
        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.TailSectionStats(sec));
            if (!this.farman) {
                is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
            }
        }
        if (is_clinker)
            stats.structure += 30;
        stats = stats.Add(this.tail_list[this.sel_tail].stats);
        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (!this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.0e-6 + 1.5 * tail_stats.drag);
        }
        if (this.farman) {
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
            stats.visibility += this.tail_section_list.length;
            tail_stats.mass = Math.floor(1.0e-6 + 0.5 * tail_stats.mass);
            //Apply factors before tail_stats
            stats = stats.Add(tail_stats);
        }
        else {
            //Apply factors after tail_stats
            stats = stats.Add(tail_stats);
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
        }
        //Lifting Body and Flying Wing
        var lb_count = this.CountLiftingBody();
        stats.cost += lb_count;
        if (this.flying_wing) {
            stats.liftbleed += 5;
        }
        else {
            stats.drag += lb_count;
        }
        stats.structure = Math.floor(1.0e-6 + stats.structure);
        stats.cost = Math.floor(1.0e-6 + stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);
        stats.Round();
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
var WING_DECK;
(function (WING_DECK) {
    WING_DECK[WING_DECK["PARASOL"] = 0] = "PARASOL";
    WING_DECK[WING_DECK["SHOULDER"] = 1] = "SHOULDER";
    WING_DECK[WING_DECK["MID"] = 2] = "MID";
    WING_DECK[WING_DECK["LOW"] = 3] = "LOW";
    WING_DECK[WING_DECK["GEAR"] = 4] = "GEAR";
})(WING_DECK || (WING_DECK = {}));
;
class Wings extends Part {
    constructor(js) {
        super();
        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"], metal: elem["metal"],
                transparent: elem["transparent"],
            });
        }
        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem),
            });
        }
        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem),
            });
        }
        this.long_list = [];
        for (let elem of js["largest"]) {
            this.long_list.push({ dragfactor: elem["dragfactor"], stats: new Stats(elem), });
        }
        this.wing_list = [];
        this.mini_wing_list = [];
        this.wing_stagger = Math.floor(1.0e-6 + this.stagger_list.length / 2);
        this.is_swept = false;
        this.is_closed = false;
    }
    toJSON() {
        return {
            wing_list: this.wing_list,
            mini_wing_list: this.mini_wing_list,
            wing_stagger: this.wing_stagger,
            is_swept: this.is_swept,
            is_closed: this.is_closed
        };
    }
    fromJSON(js, json_version) {
        if (json_version > 11.15) {
            this.wing_list = js["wing_list"];
            this.mini_wing_list = js["mini_wing_list"];
        }
        else {
            var wl = js["wing_list"];
            this.wing_list = this.OldtoNew(wl);
            var mwl = js["mini_wing_list"];
            this.mini_wing_list = this.OldtoNew(mwl);
        }
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
    }
    OldtoNew(wtl) {
        var list = [];
        for (let wt of wtl) {
            list.push({
                surface: wt.surface, area: wt.area, span: wt.span, anhedral: wt.anhedral,
                dihedral: wt.dihedral, gull: false, deck: wt.deck
            });
        }
        return list;
    }
    serialize(s) {
        s.PushNum(this.wing_list.length);
        for (let i = 0; i < this.wing_list.length; i++) {
            var w = this.wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushBool(w.gull);
            s.PushNum(w.deck);
        }
        s.PushNum(this.mini_wing_list.length);
        for (let i = 0; i < this.mini_wing_list.length; i++) {
            var w = this.mini_wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushBool(w.gull);
            s.PushNum(w.deck);
        }
        s.PushNum(this.wing_stagger);
        s.PushBool(this.is_swept);
        s.PushBool(this.is_closed);
    }
    deserialize(d) {
        var wlen = d.GetNum();
        this.wing_list = [];
        for (let i = 0; i < wlen; i++) {
            let wing = { surface: 0, area: 0, span: 0, anhedral: 0, dihedral: 0, gull: false, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            if (d.version > 11.15) {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = d.GetBool();
            }
            else {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = false;
            }
            wing.deck = d.GetNum();
            this.wing_list.push(wing);
        }
        var mlen = d.GetNum();
        this.mini_wing_list = [];
        for (let i = 0; i < mlen; i++) {
            let wing = { surface: 0, area: 0, span: 0, anhedral: 0, dihedral: 0, gull: false, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            if (d.version > 11.15) {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = d.GetBool();
            }
            else {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = false;
            }
            wing.deck = d.GetNum();
            this.mini_wing_list.push(wing);
        }
        this.wing_stagger = d.GetNum();
        this.is_swept = d.GetBool();
        this.is_closed = d.GetBool();
    }
    GetWingList() {
        return this.wing_list;
    }
    GetMiniWingList() {
        return this.mini_wing_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetDeckList() {
        return this.deck_list;
    }
    DeckCountFull() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    DeckCountMini() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.mini_wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    CanStagger() {
        var can = [...Array(this.stagger_list.length).fill(false)];
        if (this.wing_list.length > 1) {
            for (let i = 1; i < this.stagger_list.length; i++)
                can[i] = true;
        }
        if (this.wing_list.length == 1) {
            can[0] = true;
        }
        return can;
    }
    SetStagger(index) {
        this.wing_stagger = index;
        while (this.stagger_list[index].wing_count < this.wing_list.length) {
            this.wing_list.pop();
        }
        if (!this.stagger_list[index].inline) {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        this.CalculateStats();
    }
    GetStagger() {
        if (this.wing_list.length > 0) {
            return this.wing_stagger;
        }
        else {
            return -1;
        }
    }
    CanAddFullWing(deck) {
        if (deck >= this.deck_list.length)
            console.log("Deck out of Bounds");
        // if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
        //     return false;
        if (!this.stagger_list[this.wing_stagger].inline) { //If not tandem...
            //No shoulder with gull parasol
            if (deck == WING_DECK.SHOULDER && this.HasPolishWing())
                return false;
            //Limited numbers of each deck
            var full_count = this.DeckCountFull();
            if (full_count[deck] == WING_DECK.SHOULDER && this.deck_list[deck].limited)
                return false;
        }
        var mini_count = this.DeckCountMini();
        if (mini_count[deck] != 0)
            return false;
        return true;
    }
    CanAddMiniWing(deck) {
        var full_count = this.DeckCountFull();
        var mini_count = this.DeckCountMini();
        if (full_count[deck] != 0 || mini_count[deck] != 0)
            return false;
        return true;
    }
    CanMoveFullWing(idx, deck) {
        var w = this.wing_list[idx];
        this.wing_list.splice(idx, 1);
        var can = this.CanAddFullWing(deck);
        this.wing_list.splice(idx, 0, w);
        return can;
    }
    CanMoveMiniWing(idx, deck) {
        var w = this.mini_wing_list[idx];
        this.mini_wing_list.splice(idx, 1);
        var can = this.CanAddMiniWing(deck);
        this.mini_wing_list.splice(idx, 0, w);
        return can;
    }
    GetWingHeight() {
        var max = 0;
        for (let w of this.wing_list)
            max = Math.max(max, 4 - w.deck);
        return max;
    }
    CanClosed() {
        return this.wing_list.length > 1;
    }
    SetClosed(use) {
        if (this.wing_list.length > 0)
            this.is_closed = use;
        else
            this.is_closed = false;
        this.CalculateStats();
    }
    GetClosed() {
        return this.is_closed;
    }
    CanSwept() {
        return this.wing_list.length > 0;
    }
    SetSwept(use) {
        if (this.wing_list.length > 0)
            this.is_swept = use;
        else
            this.is_swept = false;
        this.CalculateStats();
    }
    GetSwept() {
        return this.is_swept;
    }
    GetTandem() {
        return this.stagger_list[this.wing_stagger].inline && this.wing_list.length > 1;
    }
    GetMonoplane() {
        return this.wing_list.length == 1;
    }
    GetStaggered() {
        return this.stagger_list[this.wing_stagger].stats.liftbleed != 0;
    }
    SetFullWing(idx, w) {
        if (this.wing_list.length != idx) {
            this.wing_list.splice(idx, 1);
        }
        if (w.area != w.area)
            w.area = 3;
        w.area = Math.floor(1.0e-6 + w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(1.0e-6 + w.span);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }
        if (this.wing_list.length > 1 && this.wing_stagger == 0)
            this.wing_stagger = 4;
        else if (this.wing_list.length <= 1)
            this.wing_stagger = 0;
        this.CalculateStats();
    }
    SetMiniWing(idx, w) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 2;
        w.area = Math.floor(1.0e-6 + w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(1.0e-6 + w.span);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    HasNonGullDeck(deck) {
        for (let w of this.wing_list) {
            if (w.deck == deck && !w.gull) //If we have shoulder...
                return true;
        }
        return false;
    }
    CanGull(deck) {
        if (deck == WING_DECK.PARASOL) {
            if (!this.GetTandem() && this.HasNonGullDeck(WING_DECK.SHOULDER))
                return false;
        }
        else if (deck == WING_DECK.SHOULDER) {
            return false;
        }
        else {
            if (!this.GetTandem() && this.HasNonGullDeck(deck - 1))
                return false;
        }
        return true;
    }
    IsFlammable() {
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        return false;
    }
    NeedHStab() {
        return this.stagger_list[this.wing_stagger].hstab;
    }
    NeedTail() {
        return this.NeedHStab() || !this.is_swept;
    }
    GetSpan() {
        var longest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            longest_span = Math.max(longest_span, wspan);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            longest_span = Math.max(longest_span, wspan);
        }
        return longest_span;
    }
    GetArea() {
        var area = 0;
        for (let w of this.wing_list) {
            area += w.area;
        }
        for (let w of this.mini_wing_list) {
            area += w.area;
        }
        return area;
    }
    GetParasol() {
        for (let w of this.wing_list) {
            if (w.deck == WING_DECK.PARASOL) {
                return true;
            }
        }
        for (let w of this.mini_wing_list) {
            if (w.deck == WING_DECK.PARASOL) {
                return true;
            }
        }
        return false;
    }
    GetMetalArea() {
        var area = 0;
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        return area;
    }
    GetWingDrag() {
        var drag = 0;
        var deck_count = this.DeckCountFull();
        var longest_span = 0;
        var longest_drag = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            let warea = w.area;
            longest_span = Math.max(longest_span, wspan);
            if (w.gull)
                warea = Math.floor(1.0e-6 + 1.1 * warea);
            var wdrag = Math.max(1, 6 * warea * warea / (wspan * wspan));
            wdrag = Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
            //Inline wings
            if (this.stagger_list[this.wing_stagger].inline && deck_count[w.deck] > 1) {
                wdrag = Math.floor(1.0e-6 + 0.75 * wdrag);
                wdrag = Math.max(1, wdrag);
            }
            wdrag = Math.floor(1.0e-6 + wdrag);
            if (longest_span == wspan)
                longest_drag = longest_drag;
            drag += wdrag;
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            //Drag is modified by area, span
            var wdrag = Math.max(1, 6 * w.area * w.area / (wspan * wspan));
            wdrag = Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
            wdrag = Math.floor(1.0e-6 + wdrag);
            drag += wdrag;
        }
        //Sesquiplanes!
        var sesp = this.GetIsSesquiplane();
        if ((sesp.is || this.GetMonoplane()) && sesp.deck != -1) {
            drag -= Math.floor(1.0e-6 + (1 - this.long_list[sesp.deck].dragfactor) * longest_drag);
        }
        return drag;
    }
    GetIsFlammable() {
        for (let s of this.wing_list) {
            if (this.skin_list[s.surface].flammable)
                return true;
        }
        for (let s of this.mini_wing_list) {
            if (this.skin_list[s.surface].flammable)
                return true;
        }
        return false;
    }
    SetAircraftMass(plane_mass) {
        this.plane_mass = plane_mass;
    }
    GetPaperMass() {
        var paper = 0;
        for (let w of this.wing_list) {
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.Round();
            if (wStats.mass < 0)
                paper += wStats.mass;
        }
        for (let w of this.mini_wing_list) {
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.Round();
            if (wStats.mass < 0)
                paper += wStats.mass;
        }
        return Math.max(-Math.floor(1.0e-6 + 0.25 * this.plane_mass), paper);
    }
    GetIsSesquiplane() {
        var biggest_area = 0;
        var biggest_deck = -1;
        var biggest_span = 0;
        var smallest_area = 1e100;
        var smallest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            if (w.area > biggest_area) {
                biggest_area = w.area;
                biggest_deck = w.deck;
                biggest_span = w.span;
            }
            else if (w.area == biggest_area) {
                biggest_deck = -1;
            }
            if (smallest_area > w.area) {
                smallest_area = w.area;
                smallest_span = w.span;
            }
        }
        var is = biggest_area >= 2 * smallest_area;
        is = is && !this.GetMonoplane() && !this.GetTandem();
        if (is) {
            var ss = 0.75 * biggest_span >= smallest_span;
            return { is: is, deck: biggest_deck, super_small: ss };
        }
        return { is: false, deck: biggest_deck, super_small: false };
    }
    HasPolishWing() {
        for (let w of this.wing_list) {
            if (w.deck == WING_DECK.PARASOL && w.gull == true) {
                return true;
            }
        }
        return false;
    }
    HasInvertedGull() {
        var ret = -1;
        for (let w of this.wing_list) {
            if (w.gull && w.deck > WING_DECK.SHOULDER) {
                ret = Math.max(ret, w.deck);
            }
        }
        return ret;
    }
    PartStats() {
        if (!this.CanClosed())
            this.is_closed = false;
        if (!this.CanSwept())
            this.is_swept = false;
        var stats = new Stats();
        var have_wing = false;
        var deck_count = this.DeckCountFull();
        var have_mini_wing = false;
        var longest_span = 0;
        var longest_drag = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            longest_span = Math.max(longest_span, w.span);
            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }
            var wStats = new Stats();
            //Actual stats
            wStats = wStats.Add(this.skin_list[w.surface].stats.Multiply(w.area));
            wStats.wingarea = w.area;
            //Wings cannot generate positive max strain
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            if (this.skin_list[w.surface].transparent) {
                wStats.visibility += 1;
            }
            //Drag is modified by area, span, and the leading wing
            let wspan = w.span;
            //Gull Drag modifies wing area
            let warea = w.area;
            if (w.gull)
                warea = Math.floor(1.0e-6 + 1.1 * warea);
            var wdrag = Math.max(1, 6 * warea * warea / (wspan * wspan));
            wStats.drag = wStats.drag + wdrag;
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //Inline wings
            if (this.stagger_list[this.wing_stagger].inline && deck_count[w.deck] > 1) {
                wStats.drag = Math.floor(1.0e-6 + 0.75 * wStats.drag);
                wStats.drag = Math.max(1, wStats.drag);
            }
            //Deck Effects
            stats = stats.Add(this.deck_list[w.deck].stats);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            wStats.Round();
            //Save for Longest Wing Mid bonus later
            if (longest_span == w.span) {
                longest_drag = wStats.drag;
            }
            if (wStats.mass < 0) //Treated paper is applied later
                wStats.mass = 0;
            stats = stats.Add(wStats);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            longest_span = Math.max(longest_span, w.span);
            stats.control += 1;
            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else { //Is not first miniature wing
                stats.liftbleed += 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.wingarea = w.area;
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span
            let wspan = w.span;
            wStats.drag = Math.max(1, wStats.drag + 6 * w.area * w.area / (wspan * wspan));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            wStats.Round();
            if (wStats.mass < 0) //Treated paper is applied later
                wStats.mass = 0;
            stats = stats.Add(wStats);
        }
        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        //Sesquiplanes!
        var sesp = this.GetIsSesquiplane();
        if ((sesp.is || this.GetMonoplane()) && sesp.deck != -1) {
            stats = stats.Add(this.long_list[sesp.deck].stats);
            stats.drag -= Math.floor(1.0e-6 + (1 - this.long_list[sesp.deck].dragfactor) * longest_drag);
        }
        if (sesp.is) {
            stats.liftbleed -= 2;
            stats.control += 2;
        }
        //Inline Wing Shadowing
        if (this.stagger_list[this.wing_stagger].inline) {
            for (let count of deck_count) {
                if (count > 1) {
                    stats.liftbleed += (count - 1) * 3;
                }
            }
        }
        //Gull wing effects (wing bits, drag is already applied)
        if (this.HasPolishWing()) {
            stats.visibility += 1;
            stats.maxstrain += 10;
        }
        switch (this.HasInvertedGull()) {
            case 1: //Shoulder Wing
                //Can't be gull.
                break;
            case 2: //Mid wing
            case 3: //Low wing (same as Mid)
                //Only affects landing gear and bomb capacity
                break;
            case 4: //Gear wing
                stats.maxstrain += 10;
                stats.crashsafety += 1;
                //Also affects landing gear and bomb capacity
                break;
            default:
            //NOTHING...
        }
        if (this.HasInvertedGull() > 0 || this.HasPolishWing()) {
            stats.era.push({ name: "Gull Wing", era: "Coming Storm" });
        }
        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }
        //Closed Wing effects
        if (this.is_closed) {
            var pairs = Math.floor(1.0e-6 + this.wing_list.length / 2.0);
            stats.mass += 1 * pairs;
            stats.control -= 5 * pairs;
            stats.maxstrain += 20 * pairs;
        }
        //Stagger effects, monoplane is nothing.
        if (this.wing_list.length > 1) {
            stats = stats.Add(this.stagger_list[this.wing_stagger].stats);
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Stabilizers extends Part {
    constructor(js) {
        super();
        this.have_tail = true;
        this.is_tandem = false;
        this.is_swept = false;
        this.is_heli = false;
        this.hstab_sel = 0;
        this.hstab_count = 1;
        this.hstab_list = [];
        for (let elem of js["hstab"]) {
            this.hstab_list.push({
                name: elem["name"],
                is_canard: elem["is_canard"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"],
                is_tail: elem["is_tail"]
            });
        }
        this.vstab_sel = 0;
        this.vstab_count = 1;
        this.vstab_list = [];
        for (let elem of js["vstab"]) {
            this.vstab_list.push({
                name: elem["name"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"],
                is_tail: elem["is_tail"]
            });
        }
    }
    toJSON() {
        return {
            hstab_sel: this.hstab_sel,
            hstab_count: this.hstab_count,
            vstab_sel: this.vstab_sel,
            vstab_count: this.vstab_count,
        };
    }
    fromJSON(js, json_version) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
    }
    serialize(s) {
        s.PushNum(this.hstab_sel);
        s.PushNum(this.hstab_count);
        s.PushNum(this.vstab_sel);
        s.PushNum(this.vstab_count);
    }
    deserialize(d) {
        this.hstab_sel = d.GetNum();
        this.hstab_count = d.GetNum();
        this.vstab_sel = d.GetNum();
        this.vstab_count = d.GetNum();
    }
    GetHStabList() {
        return this.hstab_list;
    }
    GetVStabList() {
        return this.vstab_list;
    }
    GetHStabType() {
        return this.hstab_sel;
    }
    SetHStabType(num) {
        if (this.hstab_list[num].name == "The Wings" && !(this.is_tandem || this.is_swept))
            return;
        if (this.hstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.hstab_list[this.hstab_sel].is_vtail) {
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
        this.hstab_sel = num;
        this.SetHStabCount(this.hstab_count);
        this.CalculateStats();
    }
    GetHValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.hstab_list.length).fill(false);
            lst[0] = true;
        }
        else {
            for (let t of this.hstab_list) {
                if ((t.name == "The Wings" || t.name == "Outboard")
                    && !(this.is_tandem || this.is_swept))
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }
    SetVTail() {
        for (let i = 0; i < this.hstab_list.length; i++) {
            if (this.hstab_list[i].is_vtail)
                this.hstab_sel = i;
        }
        for (let i = 0; i < this.vstab_list.length; i++) {
            if (this.vstab_list[i].is_vtail)
                this.vstab_sel = i;
        }
        this.hstab_count = 1;
        this.vstab_count = 0;
    }
    GetVStabType() {
        return this.vstab_sel;
    }
    SetVStabType(num) {
        if (this.vstab_list[num].name == "Outboard" && !this.CanVOutboard())
            return;
        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
            this.vstab_count = 1;
        }
        this.vstab_sel = num;
        this.SetVStabCount(this.vstab_count);
        this.CalculateStats();
    }
    GetVValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.vstab_list.length).fill(false);
            lst[0] = true;
        }
        else {
            for (let t of this.vstab_list) {
                if (t.name == "Outboard" && !this.CanVOutboard())
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }
    GetHStabCount() {
        return this.hstab_count;
    }
    SetHStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.hstab_count = num;
        if (this.hstab_list[this.hstab_sel].increment != 0) {
            while ((this.hstab_count % this.hstab_list[this.hstab_sel].increment) != 0) {
                this.hstab_count++;
            }
        }
        else {
            this.hstab_count = 0;
        }
        this.CalculateStats();
    }
    GetHStabIncrement() {
        if (this.hstab_sel >= 0)
            return this.hstab_list[this.hstab_sel].increment;
        return 1;
    }
    GetVStabCount() {
        return this.vstab_count;
    }
    SetVStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.vstab_count = num;
        if (this.vstab_list[this.vstab_sel].increment != 0) {
            while ((this.vstab_count % this.vstab_list[this.vstab_sel].increment) != 0) {
                this.vstab_count++;
            }
        }
        else {
            this.vstab_count = 0;
        }
        this.CalculateStats();
    }
    GetVStabIncrement() {
        if (this.vstab_sel >= 0)
            return this.vstab_list[this.vstab_sel].increment;
        return 1;
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetIsTandem() {
        return this.is_tandem;
    }
    SetIsTandem(is) {
        this.is_tandem = is;
    }
    SetIsSwept(is) {
        this.is_swept = is;
    }
    CanVOutboard() {
        return this.is_swept || this.is_tandem || (this.hstab_list[this.hstab_sel].is_canard && this.hstab_count > 0);
    }
    GetVOutboard() {
        return this.vstab_list[this.vstab_sel].name == "Outboard";
    }
    GetCanard() {
        return this.hstab_list[this.hstab_sel].is_canard;
    }
    SetLiftingArea(num) {
        this.lifting_area = num;
    }
    SetHaveTail(use) {
        this.have_tail = use;
        if (!use) {
            var hvalid = this.GetHValidList();
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 2;
            }
            var vvalid = this.GetVValidList();
            if (!vvalid[this.vstab_sel]) {
                if (!vvalid[1]) //If it was outboard, set it to canard so we can have outboard vstab.
                    this.hstab_sel = 2;
                this.vstab_sel = 1;
                if (this.vstab_count % 2 != 0)
                    this.vstab_count++;
            }
        }
    }
    SetHelicopter(is) {
        this.is_heli = is;
        if (is) {
            this.have_tail = true;
            this.is_tandem = false;
            this.is_swept = false;
            this.lifting_area = 0;
            this.engine_count = 0;
            this.hstab_sel = 0;
            this.hstab_count = 1;
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var hvalid = this.GetHValidList();
        if (!hvalid[this.hstab_sel]) {
            this.hstab_sel = 0;
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 0;
                this.hstab_count = 0;
            }
        }
        var vvalid = this.GetVValidList();
        if (!vvalid[this.vstab_sel]) {
            this.vstab_sel = 0;
            if (!vvalid[this.vstab_sel]) {
                this.vstab_sel = 0;
                this.vstab_count = 0;
            }
        }
        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            var drag = Math.floor(1.0e-6 + this.wing_drag / 4 * this.hstab_list[this.hstab_sel].dragfactor);
            stats.drag += Math.max(1, drag);
        }
        else if (this.hstab_sel < 0 || this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(1.0e-6 + this.lifting_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            var drag = Math.floor(1.0e-6 + this.wing_drag / 8 * this.vstab_list[this.vstab_sel].dragfactor);
            stats.drag += Math.max(1, drag);
        }
        else if (this.vstab_sel < 0 || (this.vstab_list[this.vstab_sel].increment != 0 || (this.vstab_list[this.vstab_sel].increment == 0 && this.hstab_count == 0))) {
            stats.latstab -= this.lifting_area;
        }
        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));
        //Pairs of stabilizers
        if (this.vstab_sel >= 0 && this.vstab_list[this.vstab_sel].increment != 0) {
            var leftovers = Math.max(0, this.hstab_count - 1);
            var es_pairs = Math.min(this.engine_count - 1, this.vstab_count - 1);
            leftovers += Math.max(0, this.vstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        }
        else {
            var es_pairs = Math.max(0, Math.min(this.engine_count - 1, this.hstab_count - 1));
            leftovers = Math.max(0, this.hstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        }
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = 0;
        this.wing_area = 0;
        this.mp = 0;
        this.is_boom = false;
        this.acft_type = AIRCRAFT_TYPE.AIRPLANE;
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (let elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }
        this.rudder_sel = 0;
        this.rudder_list = [];
        for (let elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.elevator_sel = 0;
        this.elevator_list = [];
        for (let elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.flaps_sel = 0;
        this.flaps_list = [];
        for (let elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }
        this.slats_sel = 0;
        this.slats_list = [];
        for (let elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_list = [];
        for (let elem of js["drag_inducers"]) {
            this.drag_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_sel = [...Array(this.drag_list.length).fill(false)];
    }
    toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }
    fromJSON(js, json_version) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = BoolArr(js["drag_sel"], this.drag_sel.length);
    }
    serialize(s) {
        s.PushNum(this.aileron_sel);
        s.PushNum(this.rudder_sel);
        s.PushNum(this.elevator_sel);
        s.PushNum(this.flaps_sel);
        s.PushNum(this.slats_sel);
        s.PushBoolArr(this.drag_sel);
    }
    deserialize(d) {
        this.aileron_sel = d.GetNum();
        this.rudder_sel = d.GetNum();
        this.elevator_sel = d.GetNum();
        this.flaps_sel = d.GetNum();
        this.slats_sel = d.GetNum();
        this.drag_sel = d.GetBoolArr(this.drag_sel.length);
    }
    GetAileronList() {
        return this.aileron_list;
    }
    CanAileron() {
        var can = [];
        if (this.acft_type != AIRCRAFT_TYPE.ORNITHOPTER) {
            for (let a of this.aileron_list) {
                if (a.warping && this.wing_area == 0)
                    can.push(false);
                else
                    can.push(true);
            }
        }
        else { //Is Ornithopter
            for (let a of this.aileron_list) {
                can.push(a.warping);
            }
        }
        return can;
    }
    GetAileron() {
        return this.aileron_sel;
    }
    SetAileron(num) {
        this.aileron_sel = num;
        this.CalculateStats();
    }
    GetRudderList() {
        return this.rudder_list;
    }
    GetRudder() {
        return this.rudder_sel;
    }
    SetRudder(num) {
        this.rudder_sel = num;
        this.CalculateStats();
    }
    GetElevatorList() {
        return this.elevator_list;
    }
    GetElevator() {
        return this.elevator_sel;
    }
    SetElevator(num) {
        this.elevator_sel = num;
        this.CalculateStats();
    }
    GetFlapsList() {
        return this.flaps_list;
    }
    GetFlaps() {
        return this.flaps_sel;
    }
    SetFlaps(num) {
        this.flaps_sel = num;
        this.CalculateStats();
    }
    GetFlapCost(mp) {
        if (mp)
            this.mp = mp;
        if (this.flaps_list[this.flaps_sel].costfactor > 0)
            return Math.max(1, Math.floor(1.0e-6 + this.flaps_list[this.flaps_sel].costfactor * this.mp));
        else
            return 0;
    }
    GetSlatsList() {
        return this.slats_list;
    }
    GetSlats() {
        return this.slats_sel;
    }
    SetSlats(num) {
        this.slats_sel = num;
        this.CalculateStats();
    }
    GetDragList() {
        return this.drag_list;
    }
    GetDrag() {
        return this.drag_sel;
    }
    SetDrag(num, use) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }
    SetNumCantilever(count) {
        this.is_cantilever = count;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetAcftType(acft_type) {
        this.acft_type = acft_type;
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER) {
            this.aileron_sel = 0;
            this.rudder_sel = 0;
            this.elevator_sel = 0;
            this.flaps_sel = 0;
            this.slats_sel = 0;
            for (let i = 0; i < this.drag_sel.length; i++)
                this.drag_sel[i] = false;
            this.span = 0;
            this.is_cantilever = 0;
            this.wing_area = 0;
        }
        else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER) {
            var can = this.CanAileron();
            this.aileron_sel = can.findIndex((element) => { return element; });
        }
    }
    SetBoomTail(has) {
        this.is_boom = has;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        if (this.aileron_list[this.aileron_sel].warping && this.wing_area == 0) {
            this.aileron_sel = 0;
        }
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);
        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever) {
                stats.cost += 2 * this.is_cantilever;
            }
            if (this.is_boom) {
                stats.pitchstab -= 2;
                stats.latstab -= 2;
                stats.warnings.push({
                    source: lu("Wing Warping"),
                    warning: lu("Wing Warping Warning")
                });
            }
        }
        stats = stats.Add(this.rudder_list[this.rudder_sel].stats);
        stats = stats.Add(this.elevator_list[this.elevator_sel].stats);
        stats = stats.Add(this.flaps_list[this.flaps_sel].stats);
        stats = stats.Add(this.slats_list[this.slats_sel].stats);
        for (let i = 0; i < this.drag_list.length; i++) {
            if (this.drag_sel[i])
                stats = stats.Add(this.drag_list[i].stats);
        }
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Reinforcement extends Part {
    constructor(js) {
        super();
        this.ext_wood_list = [];
        for (let elem of js["external_wood"]) {
            this.ext_wood_list.push({
                name: elem["name"], tension: elem["tension"], config: elem["config"], first: elem["first"], small_sqp: elem["small_sqp"], ornith: elem["ornith"], stats: new Stats(elem)
            });
        }
        this.ext_wood_count = [...Array(this.ext_wood_list.length).fill(0)];
        this.ext_steel_list = [];
        for (let elem of js["external_steel"]) {
            this.ext_steel_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], first: elem["first"], small_sqp: elem["small_sqp"], ornith: elem["ornith"], stats: new Stats(elem) });
        }
        this.ext_steel_count = [...Array(this.ext_steel_list.length).fill(0)];
        this.ext_cabane_list = [];
        for (let elem of js["cabane"]) {
            this.ext_cabane_list.push({ name: elem["name"], tension: elem["tension"], stats: new Stats(elem) });
        }
        this.cabane_sel = 0;
        this.cant_list = [];
        for (let elem of js["cantilever"]) {
            this.cant_list.push({ name: elem["name"], limited: elem["limited"], stats: new Stats(elem) });
        }
        this.cant_count = [...Array(this.cant_list.length).fill(0)];
        this.wires = false;
        this.wing_blades = false;
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.can_external = true;
        this.acft_structure = 0;
        this.cant_lift = 0;
        this.acft_type = AIRCRAFT_TYPE.AIRPLANE;
    }
    toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
            cabane_sel: this.cabane_sel,
            wing_blades: this.wing_blades,
        };
    }
    fromJSON(js, json_version) {
        this.ext_wood_count = NumArr(js["ext_wood_count"], this.ext_wood_count.length);
        this.ext_steel_count = NumArr(js["ext_steel_count"], this.ext_steel_count.length);
        this.cant_count = NumArr(js["cant_count"], this.cant_count.length);
        this.wires = js["wires"];
        this.cabane_sel = js["cabane_sel"];
        if (json_version > 10.25) {
            this.wing_blades = js["wing_blades"];
        }
        else {
            this.wing_blades = false;
        }
        if (json_version < 10.45) {
            this.cant_count[0] *= 2;
            this.cant_count[1] *= 2;
            this.cant_count[2] *= 3;
            this.cant_count[3] *= 2;
        }
    }
    serialize(s) {
        s.PushNumArr(this.ext_wood_count);
        s.PushNumArr(this.ext_steel_count);
        s.PushNumArr(this.cant_count);
        s.PushBool(this.wires);
        s.PushNum(this.cabane_sel);
        s.PushBool(this.wing_blades);
    }
    deserialize(d) {
        this.ext_wood_count = d.GetNumArr(this.ext_wood_count.length);
        this.ext_steel_count = d.GetNumArr(this.ext_steel_count.length);
        this.cant_count = d.GetNumArr(this.cant_count.length);
        this.wires = d.GetBool();
        this.cabane_sel = d.GetNum();
        if (d.version > 10.25) {
            this.wing_blades = d.GetBool();
        }
        else {
            this.wing_blades = false;
        }
        if (d.version < 10.45) {
            this.cant_count[0] *= 2;
            this.cant_count[1] *= 2;
            this.cant_count[2] *= 3;
            this.cant_count[3] *= 2;
        }
    }
    GetExternalList() {
        return this.ext_wood_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    CanExternalWood() {
        var can = [...Array(this.ext_wood_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            if (this.limited_sqp) {
                can[i] = this.ext_wood_list[i].small_sqp;
            }
            if (!this.wires && (this.ext_wood_list[i].name == "Wing Truss" || this.ext_wood_list[i].name == "Wire Root"))
                can[i] = false;
        }
        return can;
    }
    GetExternalWoodCount() {
        return this.ext_wood_count;
    }
    SetExternalWoodCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }
    CanExternalSteel() {
        var can = [...Array(this.ext_steel_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_steel_list.length; i++) {
            if (this.limited_sqp) {
                can[i] = this.ext_steel_list[i].small_sqp;
            }
            if (!this.wires && (this.ext_steel_list[i].name == "Steel Wing Truss" || this.ext_steel_list[i].name == "Steel Wire Root"))
                can[i] = false;
        }
        return can;
    }
    GetExternalSteelCount() {
        return this.ext_steel_count;
    }
    SetExternalSteelCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ext_steel_count[idx] = count;
        this.CalculateStats();
    }
    GetCantileverCount() {
        return this.cant_count;
    }
    GetIsCantilever() {
        var count = 0;
        for (let c of this.cant_count)
            count += c;
        return count > 0;
    }
    SetCantileverCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }
    ImplSCC(idx, count) {
        var diff = count - this.cant_count[idx];
        if (this.cant_list[idx].limited && count > 0) {
            var total_structure = this.TotalStructure();
            for (let i = 0; i < this.cant_list.length; i++) {
                if (this.cant_list[i].limited) {
                    total_structure -= 5 * this.cant_count[i] * this.cant_list[i].stats.mass;
                }
            }
            diff = Math.min(diff, Math.floor(1.0e-6 + total_structure / (5 * this.cant_list[idx].stats.mass)));
        }
        this.cant_count[idx] += diff;
        return diff != 0;
    }
    GetWires() {
        return this.wires;
    }
    SetWires(use) {
        this.wires = use;
        this.CalculateStats();
    }
    SetStaggered(is) {
        this.is_staggered = is;
    }
    SetTandem(is) {
        this.is_tandem = is;
    }
    SetMonoplane(is) {
        this.is_monoplane = is;
    }
    SetCanUseExternal(has) {
        this.can_external = has;
    }
    SetAcftStructure(struct) {
        var oldstruct = this.acft_structure;
        this.acft_structure = struct;
        var recalc = false;
        if (oldstruct > this.acft_structure) {
            for (let i = this.cant_list.length - 1; i >= 0; i--)
                recalc = recalc || this.ImplSCC(i, this.cant_count[i]);
        }
        if (recalc)
            this.CalculateStats();
    }
    TotalStructure() {
        var struct_count = this.ext_cabane_list[this.cabane_sel].stats.structure;
        var first = false;
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_wood_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * this.ext_steel_list[i].stats.structure;
            if (this.ext_wood_count[i] > 0 || this.ext_steel_count[i] > 0)
                first = true;
        }
        if (first)
            struct_count += 5;
        return this.acft_structure + struct_count;
    }
    GetCantileverType() {
        var wood_count = this.cant_count[0] + this.cant_count[4];
        var metal_count = this.cant_count[1] + this.cant_count[2] + this.cant_count[3];
        if (metal_count > 0)
            return 2;
        else if (wood_count > 0)
            return 1;
        else
            return 0;
    }
    GetCabaneList() {
        return this.ext_cabane_list;
    }
    GetCabane() {
        return this.cabane_sel;
    }
    SetCabane(num) {
        this.cabane_sel = num;
        this.CalculateStats();
    }
    SetCantLift(use) {
        this.cant_lift = use;
    }
    CanWingBlade() {
        for (let c of this.ext_wood_count) {
            if (c > 0)
                return false;
        }
        for (let c of this.ext_steel_count) {
            if (c > 0)
                return false;
        }
        return this.cabane_sel == 0 && this.cant_count[2] > 0;
    }
    GetWingBlade() {
        return this.wing_blades;
    }
    SetWingBlade(use) {
        this.wing_blades = use;
        this.CalculateStats();
    }
    SetAircraftType(type) {
        this.acft_type = type;
        if (type == AIRCRAFT_TYPE.HELICOPTER) {
            this.can_external = false;
            this.is_monoplane = false;
            this.is_tandem = false;
            this.is_staggered = false;
        }
    }
    SetSesquiplane(sqp) {
        this.tension_sqp = sqp.is && sqp.super_small;
        this.limited_sqp = sqp.is && !sqp.super_small;
        if (this.limited_sqp) {
            for (let i = 0; i < this.ext_wood_list.length; i++) {
                if (!this.ext_wood_list[i].small_sqp)
                    this.ext_wood_count[i] = 0;
            }
            for (let i = 0; i < this.ext_steel_list.length; i++) {
                if (!this.ext_steel_list[i].small_sqp)
                    this.ext_steel_count[i] = 0;
            }
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        switch (this.acft_type) {
            case AIRCRAFT_TYPE.AIRPLANE:
            case AIRCRAFT_TYPE.AUTOGYRO:
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
            case AIRCRAFT_TYPE.ORNITHOPTER:
                this.cabane_sel = 0;
                break;
        }
        var tension_multiple = 1.0;
        if (this.is_monoplane)
            tension_multiple = 0.6;
        else if (this.is_tandem)
            tension_multiple = 0.8;
        else if (this.is_staggered)
            tension_multiple = 0.9;
        if (this.tension_sqp) {
            tension_multiple -= 0.15;
        }
        if (!this.can_external) {
            for (let i = 0; i < this.ext_wood_count.length; i++) {
                this.ext_wood_count[i] = 0;
            }
            for (let i = 0; i < this.ext_steel_count.length; i++) {
                this.ext_steel_count[i] = 0;
            }
            this.cabane_sel = 0;
            this.wires = false;
        }
        var tension = 0;
        var strut_count = 0;
        var has_valid_first = false;
        //Wood Struts
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            if (this.ext_wood_count[i] > 0) {
                has_valid_first = has_valid_first || this.ext_wood_list[i].first;
                let ts = this.ext_wood_list[i].stats;
                ts = ts.Multiply(this.ext_wood_count[i]);
                stats = stats.Add(ts);
                if (this.ext_wood_list[i].config)
                    tension += tension_multiple * this.ext_wood_list[i].tension * this.ext_wood_count[i];
                else
                    tension += this.ext_wood_list[i].tension * this.ext_wood_count[i];
            }
        }
        //Steel Struts
        for (let i = 0; i < this.ext_steel_list.length; i++) {
            strut_count += this.ext_steel_count[i];
            if (this.ext_steel_count[i] > 0) {
                has_valid_first = has_valid_first || this.ext_wood_list[i].first;
                let ts = this.ext_steel_list[i].stats.Clone();
                ts = ts.Multiply(this.ext_steel_count[i]);
                stats = stats.Add(ts);
                if (this.ext_steel_list[i].config)
                    tension += tension_multiple * this.ext_steel_list[i].tension * this.ext_steel_count[i];
                else
                    tension += this.ext_steel_list[i].tension * this.ext_steel_count[i];
            }
        }
        //First Strut Bonus
        if (has_valid_first) {
            stats.structure += 5;
            stats.maxstrain += 10;
            tension += 10;
        }
        //Cabane Strut
        let ts = this.ext_cabane_list[this.cabane_sel].stats.Clone();
        stats = stats.Add(ts);
        tension += tension_multiple * this.ext_cabane_list[this.cabane_sel].tension;
        if (this.cabane_sel > 0)
            strut_count += 1;
        if (this.wires) {
            stats.maxstrain += Math.floor(1.0e-6 + tension);
            stats.drag += 3 * strut_count;
        }
        var use_cant = false;
        var cant_strain = 0;
        for (let i = 0; i < this.cant_list.length; i++) {
            if (this.cant_count[i] > 0) {
                use_cant = true;
                let ts = this.cant_list[i].stats;
                ts = ts.Multiply(this.cant_count[i]);
                cant_strain += ts.maxstrain;
                stats = stats.Add(ts);
            }
        }
        //Wing Blades need Steel Cantilevers
        if (!this.CanWingBlade()) {
            this.wing_blades = false;
        } //So if we have them and are bladed...
        else if (this.wing_blades) {
            stats.mass *= 2;
            stats.warnings.push({
                source: lu("Wing Blades"),
                warning: lu("Wing Blades Warning"),
            });
        }
        if (use_cant) {
            stats.cost += 5;
            stats.liftbleed -= this.cant_lift;
        }
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Fuel extends Part {
    constructor(js) {
        super();
        this.tank_stats = [];
        this.tank_count = [];
        for (let elem of js["tanks"]) {
            this.tank_stats.push({
                name: elem["name"], stats: new Stats(elem),
                internal: elem["internal"], cantilever: elem["cantilever"]
            });
            this.tank_count.push(0);
        }
        this.self_sealing = false;
        this.is_cantilever = false;
        this.wing_area = -1;
    }
    toJSON() {
        return {
            tank_count: this.tank_count,
            self_sealing: this.self_sealing,
            fire_extinguisher: this.fire_extinguisher,
        };
    }
    fromJSON(js, json_version) {
        this.tank_count = NumArr(js["tank_count"], this.tank_count.length);
        this.self_sealing = js["self_sealing"];
        this.fire_extinguisher = js["fire_extinguisher"];
        this.wing_area = -1;
    }
    serialize(s) {
        s.PushNumArr(this.tank_count);
        s.PushBool(this.self_sealing);
        s.PushBool(this.fire_extinguisher);
    }
    deserialize(d) {
        this.tank_count = d.GetNumArr(this.tank_count.length);
        this.self_sealing = d.GetBool();
        this.fire_extinguisher = d.GetBool();
        this.wing_area = -1;
    }
    GetTankList() {
        return this.tank_stats;
    }
    GetTankEnabled() {
        var lst = [];
        for (let e of this.tank_stats) {
            if (!this.is_cantilever && e.cantilever)
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetTankCount() {
        return this.tank_count;
    }
    SetTankCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.tank_count[idx] = count;
        this.VerifyOK();
        this.CalculateStats();
    }
    SetCantilever(is) {
        if (this.is_cantilever && !is) {
            this.is_cantilever = is;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.is_cantilever = is;
    }
    SetArea(num) {
        if (this.wing_area > num) {
            this.wing_area = num;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.wing_area = num;
    }
    VerifyOK() {
        if (this.wing_area != -1) {
            //Count cantilever dependent tanks.
            var ccount = 0;
            for (let i = 0; i < this.tank_count.length; i++) {
                if (this.tank_stats[i].cantilever)
                    ccount += this.tank_count[i];
            }
            //How many can you have?
            var allowed = Math.floor(1.0e-6 + this.wing_area / 10);
            if (!this.is_cantilever)
                allowed = 0;
            //Do you have more than the allowed?
            var diff = ccount - allowed;
            var mod = diff > 0;
            //Loop over and reduce by one until you don't.
            while (diff > 0) {
                for (let i = this.tank_count.length - 1; i >= 0; i--) {
                    if (this.tank_stats[i].cantilever) {
                        this.tank_count[i]--;
                        diff--;
                        break;
                    }
                }
            }
            //Limit microtanks to 4
            for (let i = 0; i < this.tank_count.length; i++) {
                if (this.tank_stats[i].stats.wetmass == 0) {
                    this.tank_count[i] = Math.min(4, this.tank_count[i]);
                }
            }
            return mod;
        }
        return false;
    }
    GetSealingEnabled() {
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        return internal_count > 0;
    }
    GetSelfSealing() {
        return this.self_sealing;
    }
    SetSelfSealing(is) {
        this.self_sealing = is;
        this.CalculateStats();
    }
    GetExtinguisher() {
        return this.fire_extinguisher;
    }
    SetExtinguisher(is) {
        this.fire_extinguisher = is;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            let ts = this.tank_stats[i].stats.Clone();
            ts = ts.Multiply(this.tank_count[i]);
            stats = stats.Add(ts);
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);
        if (this.self_sealing) {
            stats.mass += internal_count;
            stats.cost += 2 * internal_count;
            stats.era.push({ name: "Self-Sealing Gas Tank", era: "Roaring 20s" });
            stats.warnings.push({
                source: lu("Self-Sealing Gas Tank"),
                warning: lu("Self-Sealing Gas Tank Warning")
            });
        }
        if (this.fire_extinguisher) {
            stats.mass += 2;
            stats.cost += 3;
            stats.era.push({ name: "Remote Fire Extinguisher", era: "WWII" });
            stats.warnings.push({
                source: lu("Remote Fire Extinguisher"),
                warning: lu("Remote Fire Extinguisher Warning")
            });
        }
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Munitions extends Part {
    constructor() {
        super();
        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js, json_version) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
        if (json_version > 10.75) {
            this.rocket_count = js["rocket_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
        s.PushNum(this.rocket_count);
    }
    deserialize(d) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
        if (d.version > 10.75) {
            this.rocket_count = d.GetNum();
        }
    }
    GetRocketCount() {
        return this.rocket_count;
    }
    GetBombCount() {
        return this.bomb_count;
    }
    GetInternalBombCount() {
        var ibc = 10 * this.internal_bay_count;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                //Double Internal Count
                ibc *= 2;
                if (this.internal_bay_2) {
                    //Double Internal Count Again
                    ibc *= 2;
                }
            }
        }
        return ibc;
    }
    GetMaxBombSize() {
        var sz = 0;
        var ibc = this.GetInternalBombCount();
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                if (this.internal_bay_2) {
                    sz = Math.floor(1.0e-6 + ibc);
                }
                else {
                    sz = Math.floor(1.0e-6 + ibc / 2);
                }
            }
            else {
                sz = Math.floor(1.0e-6 + ibc / 4);
            }
        }
        return sz;
    }
    SetRocketCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.rocket_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    SetBombCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.bomb_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    GetBayCount() {
        return this.internal_bay_count;
    }
    GetBay1() {
        return this.internal_bay_1;
    }
    GetBay2() {
        return this.internal_bay_2;
    }
    SetBayCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.internal_bay_count = count;
        this.CalculateStats();
    }
    SetUseBays(bay1, bay2) {
        this.internal_bay_1 = bay1;
        this.internal_bay_2 = bay2;
        if (!this.internal_bay_1 && this.internal_bay_2) {
            this.internal_bay_1 = true;
            this.internal_bay_2 = false;
        }
        this.CalculateStats();
    }
    LimitMass() {
        var reduce = false;
        var allowed_internal = Math.min(this.GetInternalBombCount(), Math.floor(1.0e-6 + 3 * this.acft_struct * this.maxbomb));
        var ib = 0;
        var ir = 0;
        var eb = 0;
        var er = 0;
        if (this.bomb_count > allowed_internal) {
            ib = allowed_internal;
        }
        else {
            ib = this.bomb_count;
        }
        if (this.rocket_count + ib > allowed_internal) {
            ir = allowed_internal - ib;
        }
        else {
            ir = this.rocket_count;
        }
        eb = this.bomb_count - ib;
        er = this.rocket_count - ir;
        var allowed_external = Math.floor(1.0e-6 + this.acft_struct * this.maxbomb - (ib + ir) / 3) * this.gull_factor;
        while (eb + er > allowed_external) {
            if (er > 0) {
                er--;
            }
            else {
                eb--;
            }
        }
        if (this.bomb_count > ib + eb) {
            reduce = true;
            this.bomb_count = ib + eb;
        }
        if (this.rocket_count > ir + er) {
            reduce = true;
            this.rocket_count = ir + er;
        }
        return reduce;
    }
    GetExternalMass() {
        var ext_bomb_count = this.bomb_count + this.rocket_count;
        return Math.max(0, ext_bomb_count - this.GetInternalBombCount());
    }
    SetAcftParameters(struct, maxbomb, gull_deck) {
        this.acft_struct = struct;
        this.maxbomb = maxbomb;
        switch (gull_deck) {
            //Parasol and Shoulder do nothing
            case 2: //Mid
            case 3: //Low
                this.gull_factor = 1.1;
                break;
            case 4: //Gear
                this.gull_factor = 1.2;
                break;
            default:
                this.gull_factor = 1;
        }
        if (this.LimitMass()) {
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var ext_bomb_count = this.GetExternalMass();
        stats.reqsections += this.internal_bay_count;
        if (this.internal_bay_count > 0) {
            var count = stats.reqsections;
            if (this.internal_bay_1) {
                stats.reqsections += count;
                if (this.internal_bay_2) {
                    stats.reqsections += count;
                }
            }
        }
        var rack_mass = Math.ceil(-1.0e-6 + ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.drag += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;
        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class CargoAndPassengers extends Part {
    constructor(js) {
        super();
        this.cargo_list = [];
        for (let elem of js["spaces"]) {
            this.cargo_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cargo_sel = 0;
    }
    toJSON() {
        return {
            space_sel: this.cargo_sel,
        };
    }
    fromJSON(js, json_version) {
        this.cargo_sel = js["space_sel"];
    }
    serialize(s) {
        s.PushNum(this.cargo_sel);
    }
    deserialize(d) {
        this.cargo_sel = d.GetNum();
    }
    GetSpaceList() {
        return this.cargo_list;
    }
    GetSpace() {
        return this.cargo_sel;
    }
    SetSpace(num) {
        this.cargo_sel = num;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.cargo_list[this.cargo_sel].stats);
        stats.bomb_mass += stats.reqsections * 3;
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class LandingGear extends Part {
    constructor(js) {
        super();
        this.gear_list = [];
        this.gear_sel = 0;
        this.retract = false;
        for (let elem of js["gear"]) {
            this.gear_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                DpLMP: elem["DpLMP"],
                SpLMP: elem["SpLMP"],
                can_retract: elem["can_retract"]
            });
        }
        this.extra_list = [];
        for (let elem of js["extras"]) {
            this.extra_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                MpLMP: elem["MpLMP"]
            });
        }
        this.extra_sel = [...Array(this.extra_list.length).fill(false)];
    }
    toJSON() {
        return {
            gear_sel: this.gear_sel,
            retract: this.retract,
            extra_sel: this.extra_sel,
        };
    }
    fromJSON(js, json_version) {
        this.gear_sel = js["gear_sel"];
        this.retract = js["retract"];
        this.extra_sel = BoolArr(js["extra_sel"], this.extra_sel.length);
    }
    serialize(s) {
        s.PushNum(this.gear_sel);
        s.PushBool(this.retract);
        s.PushBoolArr(this.extra_sel);
    }
    deserialize(d) {
        this.gear_sel = d.GetNum();
        this.retract = d.GetBool();
        this.extra_sel = d.GetBoolArr(this.extra_sel.length);
    }
    GetGearName() {
        if (this.retract && this.gear_list[this.gear_sel].name == "Boat Hull") {
            return lu("Retractable Gear + Boat Hull");
        }
        if (this.retract)
            return lu("Retractable ") + lu(this.gear_list[this.gear_sel].name);
        else
            return lu(this.gear_list[this.gear_sel].name);
    }
    GetGearList() {
        return this.gear_list;
    }
    CanGear() {
        var count = [...Array(this.gear_list.length).fill(true)];
        for (let i = 0; i < this.gear_list.length; i++) {
            let g = this.gear_list[i];
            if (g.name == "Boat Hull" && !this.can_boat)
                count[i] = false;
        }
        return count;
    }
    GetGear() {
        return this.gear_sel;
    }
    SetGear(num) {
        if (this.CanGear()[num])
            this.gear_sel = num;
        this.CalculateStats();
    }
    CanRetract() {
        return this.gear_list[this.gear_sel].can_retract
            || this.gear_list[this.gear_sel].name == "Boat Hull";
    }
    GetRetract() {
        return this.retract;
    }
    SetRetract(is) {
        this.retract = is && this.CanRetract();
        this.CalculateStats();
    }
    GetExtraList() {
        return this.extra_list;
    }
    GetExtraSelected() {
        return this.extra_sel;
    }
    SetExtraSelected(idx, is) {
        this.extra_sel[idx] = is;
        this.CalculateStats();
    }
    SetLoadedMass(mass) {
        this.loadedMP = Math.floor(1.0e-6 + mass / 5);
    }
    CanBoat(engine_height, wing_height) {
        if (engine_height == 2)
            this.can_boat = true;
        else if (engine_height == 1 && wing_height >= 3)
            this.can_boat = true;
        else if (engine_height == 0 && wing_height >= 4)
            this.can_boat = true;
        else
            this.can_boat = false;
    }
    SetGull(deck) {
        this.gull_deck = deck;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    IsVital() {
        return true;
    }
    PartStats() {
        var stats = new Stats();
        if (!this.CanGear()[this.gear_sel])
            this.gear_sel = 0;
        stats = stats.Add(this.gear_list[this.gear_sel].stats);
        var pdrag = this.gear_list[this.gear_sel].DpLMP * this.loadedMP;
        //Retractable gear with Boat Hull adds normal hull drag,
        // plus the mass and cost of normal retrctable gear
        if (this.gear_list[this.gear_sel].name == "Boat Hull" && this.retract) {
            stats.drag += pdrag;
            pdrag = this.gear_list[0].DpLMP * this.loadedMP;
        }
        //Gull wings don't affect Boat Hulls, but do affect the normal gear you get
        //if you put retract on your boat hull.  Since the hull is already applied,
        //we can just modify here.
        if (this.gear_list[this.gear_sel].name != "Boat Hull" || this.retract) {
            switch (this.gull_deck) {
                case 1: //Shoulder
                    pdrag -= Math.floor(1.0e-6 + 0.1 * pdrag);
                    break;
                case 2: //Mid
                case 3: //Low
                    pdrag -= Math.floor(1.0e-6 + 0.15 * pdrag);
                    break;
                case 4: //Gear
                    pdrag -= Math.floor(1.0e-6 + 0.25 * pdrag);
                    break;
                default:
                //No change
            }
        }
        if (this.retract) {
            stats.mass += Math.floor(1.0e-6 + pdrag / 2);
            stats.cost += Math.floor(1.0e-6 + pdrag / 2);
        }
        else {
            stats.drag += pdrag;
        }
        stats.structure += this.gear_list[this.gear_sel].SpLMP * this.loadedMP;
        for (let i = 0; i < this.extra_list.length; i++) {
            if (this.extra_sel[i]) {
                stats = stats.Add(this.extra_list[i].stats);
                stats.mass += Math.floor(1.0e-6 + this.extra_list[i].MpLMP * this.loadedMP);
            }
        }
        stats.Round();
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Accessories extends Part {
    constructor(js) {
        super();
        this.armour_coverage = [...Array(8).fill(0)];
        this.acft_power = 0;
        this.acft_rad = false;
        this.skin_armour = 0;
        this.electric_list = [];
        for (let elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10s: elem["cp10s"]
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];
        this.radio_list = [];
        this.radio_sel = 0;
        for (let elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.recon_list = [];
        for (let elem of js["recon"]) {
            this.recon_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.recon_sel = Array(this.recon_list.length).fill(0);
        this.visi_list = [];
        for (let elem of js["visibility"]) {
            this.visi_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.visi_sel = [...Array(this.visi_list.length).fill(false)];
        this.clim_list = [];
        for (let elem of js["climate"]) {
            this.clim_list.push({ name: elem["name"], stats: new Stats(elem), req_radiator: elem["req_radiator"] });
        }
        this.clim_sel = [...Array(this.clim_list.length).fill(false)];
        this.auto_list = [];
        this.auto_sel = 0;
        for (let elem of js["autopilots"]) {
            this.auto_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cont_list = [];
        this.cont_sel = 0;
        for (let elem of js["control"]) {
            this.cont_list.push({ name: elem["name"], max_mass_stress: elem["max_mass_stress"], max_total_stress: elem["max_total_stress"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            v: 2,
            armour_coverage: this.armour_coverage,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            recon_sel: this.recon_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }
    fromJSON(js, json_version) {
        if (js["v"] == 2) {
            this.armour_coverage = js["armour_coverage"];
        }
        if (json_version < 11.85) {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        }
        else {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length);
        }
        this.radio_sel = js["radio_sel"];
        if (json_version < 12.05) {
            let old_info = BoolArr(js["info_sel"], 2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        }
        else {
            this.recon_sel = NumArr(js["recon_sel"], this.recon_sel.length);
        }
        this.visi_sel = BoolArr(js["visi_sel"], this.visi_sel.length);
        this.clim_sel = BoolArr(js["clim_sel"], this.clim_sel.length);
        if (json_version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }
    serialize(s) {
        s.PushNumArr(this.armour_coverage);
        s.PushNumArr(this.electrical_count);
        s.PushNum(this.radio_sel);
        s.PushNumArr(this.recon_sel);
        s.PushBoolArr(this.visi_sel);
        s.PushBoolArr(this.clim_sel);
        s.PushNum(this.auto_sel);
        s.PushNum(this.cont_sel);
    }
    deserialize(d) {
        this.armour_coverage = d.GetNumArr(this.armour_coverage.length);
        if (d.version < 11.85) {
            this.electrical_count = d.GetNumArr(this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        }
        else {
            this.electrical_count = d.GetNumArr(this.electrical_count.length);
        }
        this.radio_sel = d.GetNum();
        if (d.version < 12.05) {
            let old_info = d.GetBoolArr(2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        }
        else {
            this.recon_sel = d.GetNumArr(this.recon_sel.length);
        }
        this.visi_sel = d.GetBoolArr(this.visi_sel.length);
        this.clim_sel = d.GetBoolArr(this.clim_sel.length);
        if (d.version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = d.GetNum();
        this.cont_sel = d.GetNum();
    }
    GetCommunicationName() {
        return lu(this.radio_list[this.radio_sel].name);
    }
    GetArmourCoverage() {
        return this.armour_coverage;
    }
    GetEffectiveCoverage() {
        var arr = [];
        var vital_adj = Math.max(0, Math.floor((this.vital_parts - 8) / 2));
        for (let i = 0; i < this.armour_coverage.length; i++) {
            arr.push(Math.max(0, this.armour_coverage[i]));
        }
        var sum = 0;
        for (let r = this.armour_coverage.length - 1; r >= 0; r--) {
            sum += arr[r];
            arr[r] = sum - vital_adj;
        }
        return arr;
    }
    SetArmourCoverage(idx, num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.armour_coverage[idx] = num;
        this.NormalizeCoverage();
        this.CalculateStats();
    }
    NormalizeCoverage() {
        var coverage = -8 + Math.min(0, -Math.floor(1.0e-6 + (this.vital_parts - 8) / 2));
        for (let i = this.armour_coverage.length - 1; i >= 0; i--) {
            if (i == 1) {
                coverage += this.skin_armour;
            }
            this.armour_coverage[i] = Math.max(0, Math.min(Math.abs(coverage), this.armour_coverage[i]));
            coverage += this.armour_coverage[i];
        }
    }
    GetElectricalList() {
        return this.electric_list;
    }
    GetElectricalCount() {
        return this.electrical_count;
    }
    SetElectricalCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        count = Math.min(count, 50);
        this.electrical_count[idx] = count;
        this.CalculateStats();
    }
    GetRadioList() {
        return this.radio_list;
    }
    GetRadioSel() {
        return this.radio_sel;
    }
    SetRadioSel(num) {
        this.radio_sel = num;
        this.CalculateStats();
    }
    GetReconList() {
        return this.recon_list;
    }
    GetReconSel() {
        return this.recon_sel;
    }
    SetReconSel(idx, num) {
        num = Math.trunc(num);
        if (num != num || num < 0)
            num = 0;
        this.recon_sel[idx] = num;
        this.CalculateStats();
    }
    GetVisibilityList() {
        return this.visi_list;
    }
    GetVisibilitySel() {
        return this.visi_sel;
    }
    SetVisibilitySel(idx, use) {
        this.visi_sel[idx] = use;
        this.CalculateStats();
    }
    GetClimateList() {
        return this.clim_list;
    }
    GetClimateSel() {
        return this.clim_sel;
    }
    GetClimateEnable() {
        var can = [];
        for (let c of this.clim_list) {
            if (!this.acft_rad && c.req_radiator)
                can.push(false);
            else
                can.push(true);
        }
        return can;
    }
    SetClimateSel(idx, use) {
        this.clim_sel[idx] = use;
        this.CalculateStats();
    }
    GetAutopilotList() {
        return this.auto_list;
    }
    GetAutopilotSel() {
        return this.auto_sel;
    }
    SetAutopilotSel(num) {
        this.auto_sel = num;
        this.CalculateStats();
    }
    GetControlList() {
        return this.cont_list;
    }
    GetControlSel() {
        return this.cont_sel;
    }
    SetControlSel(num) {
        this.cont_sel = num;
        this.CalculateStats();
    }
    SetAcftPower(pwr) {
        this.acft_power = pwr;
    }
    SetAcftRadiator(have) {
        this.acft_rad = have;
    }
    IsElectrics() {
        for (let e of this.electrical_count) {
            if (e > 0)
                return true;
        }
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && this.clim_list[i].stats.charge != 0)
                return true;
        }
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i] && this.visi_list[i].stats.charge != 0)
                return true;
        }
        if (this.radio_list[this.radio_sel].stats.charge != 0)
            return true;
        if (this.auto_list[this.auto_sel].stats.charge != 0)
            return true;
        return false;
    }
    SetSkinArmor(num) {
        if (num < this.skin_armour)
            this.armour_coverage[1] += num - this.skin_armour;
        this.skin_armour = num;
        this.armour_coverage[1] = Math.max(this.armour_coverage[1], this.skin_armour);
    }
    SetVitalParts(num) {
        this.vital_parts = num;
        this.NormalizeCoverage();
    }
    GetMaxMassStress() {
        return this.cont_list[this.cont_sel].max_mass_stress;
    }
    GetMaxTotalStress() {
        return this.cont_list[this.cont_sel].max_total_stress;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetStorage() {
        return 5 * this.electrical_count[2]
            + 5 * this.electrical_count[3];
    }
    GetWindmill() {
        var production = 0;
        for (let i = 0; i < this.electrical_count.length; i++) {
            production += this.electric_list[i].cp10s * this.electrical_count[i];
        }
        return production;
    }
    PartStats() {
        var stats = new Stats();
        this.armour_coverage[1] = Math.max(this.armour_coverage[1], this.skin_armour);
        var armour_str = "";
        //Armour
        var eff_armour = this.GetEffectiveCoverage();
        for (let i = 0; i < this.armour_coverage.length; i++) {
            let AP = i + 1;
            var count = this.armour_coverage[i];
            if (AP == 2) {
                count -= this.skin_armour;
            }
            stats.mass += count * Math.pow(2, AP - 1);
            stats.cost += Math.floor(1.0e-6 + count * AP / 3);
            stats.toughness += this.armour_coverage[i] * AP;
            if (eff_armour[i] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                armour_str += AP.toString() + "/" + (11 - eff_armour[i]).toString() + "+";
            }
        }
        if (armour_str != "") {
            stats.warnings.push({
                source: lu("Armour"), warning: armour_str
            });
        }
        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            if (this.electrical_count[i] > 0) {
                let ts = this.electric_list[i].stats.Clone();
                ts = ts.Multiply(this.electrical_count[i]);
                stats = stats.Add(ts);
            }
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);
        //Information
        for (let i = 0; i < this.recon_list.length; i++) {
            if (this.recon_sel[i] > 0) {
                let ts = this.recon_list[i].stats.Clone();
                ts = ts.Multiply(this.recon_sel[i]);
                stats = stats.Add(ts);
            }
        }
        //Visibility
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i])
                stats = stats.Add(this.visi_list[i].stats);
        }
        //Climate
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && (!this.clim_list[i].req_radiator || this.acft_rad))
                stats = stats.Add(this.clim_list[i].stats);
        }
        //Control
        stats = stats.Add(this.auto_list[this.auto_sel].stats);
        stats = stats.Add(this.cont_list[this.cont_sel].stats);
        stats.Round();
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Optimization extends Part {
    constructor() {
        super();
        this.free_dots = 0;
        this.cost = 0;
        this.bleed = 0;
        this.escape = 0;
        this.mass = 0;
        this.toughness = 0;
        this.maxstrain = 0;
        this.reliability = 0;
        this.drag = 0;
        this.acft_stats = new Stats;
    }
    toJSON() {
        return {
            free_dots: this.free_dots,
            cost: this.cost,
            bleed: this.bleed,
            escape: this.escape,
            mass: this.mass,
            toughness: this.toughness,
            maxstrain: this.maxstrain,
            reliability: this.reliability,
            drag: this.drag,
        };
    }
    fromJSON(js, json_version) {
        this.free_dots = js["free_dots"];
        this.cost = js["cost"];
        this.bleed = js["bleed"];
        this.escape = js["escape"];
        this.mass = js["mass"];
        this.toughness = js["toughness"];
        this.maxstrain = js["maxstrain"];
        this.reliability = js["reliability"];
        this.drag = js["drag"];
    }
    serialize(s) {
        s.PushNum(this.free_dots);
        s.PushNum(this.cost);
        s.PushNum(this.bleed);
        s.PushNum(this.escape);
        s.PushNum(this.mass);
        s.PushNum(this.toughness);
        s.PushNum(this.maxstrain);
        s.PushNum(this.reliability);
        s.PushNum(this.drag);
    }
    deserialize(d) {
        this.free_dots = d.GetNum();
        this.cost = d.GetNum();
        this.bleed = d.GetNum();
        this.escape = d.GetNum();
        this.mass = d.GetNum();
        this.toughness = d.GetNum();
        this.maxstrain = d.GetNum();
        this.reliability = d.GetNum();
        this.drag = d.GetNum();
    }
    GetUnassignedCount() {
        return this.free_dots - this.cost - this.bleed
            - this.escape - this.mass - this.toughness - this.maxstrain
            - this.reliability - this.drag;
    }
    ReduceDots() {
        var diff = -this.GetUnassignedCount();
        if (diff > 0) {
            let d = Math.min(diff, this.drag);
            d = Math.max(d, 0);
            this.drag -= d;
            diff -= d;
            d = Math.min(diff, this.reliability);
            d = Math.max(d, 0);
            this.reliability -= d;
            diff -= d;
            d = Math.min(diff, this.maxstrain);
            d = Math.max(d, 0);
            this.maxstrain -= d;
            diff -= d;
            d = Math.min(diff, this.toughness);
            d = Math.max(d, 0);
            this.toughness -= d;
            diff -= d;
            d = Math.min(diff, this.mass);
            d = Math.max(d, 0);
            this.mass -= d;
            diff -= d;
            d = Math.min(diff, this.escape);
            d = Math.max(d, 0);
            this.escape -= d;
            diff -= d;
            d = Math.min(diff, this.bleed);
            d = Math.max(d, 0);
            this.bleed -= d;
            diff -= d;
            d = Math.min(diff, this.cost);
            d = Math.max(d, 0);
            this.cost -= d;
            diff -= d;
        }
    }
    GetFreeDots() {
        return this.free_dots;
    }
    SetFreeDots(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, 0);
        this.free_dots = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetCost() {
        return this.cost;
    }
    SetCost(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.cost = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetBleed() {
        return this.bleed;
    }
    SetBleed(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.bleed = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetEscape() {
        return this.escape;
    }
    SetEscape(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.escape = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMass() {
        return this.mass;
    }
    SetMass(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.mass = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetToughness() {
        return this.toughness;
    }
    SetToughness(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.toughness = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMaxStrain() {
        return this.maxstrain;
    }
    SetMaxStrain(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.maxstrain = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetReliabiilty() {
        return this.reliability;
    }
    SetReliability(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.reliability = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetDrag() {
        return this.drag;
    }
    SetDrag(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.drag = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    SetAcftStats(stats) {
        this.acft_stats = stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats.cost = Math.floor(1.0e-6 + -(this.cost * this.acft_stats.cost / 10));
        stats.liftbleed = Math.floor(1.0e-6 + -this.bleed * 3);
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = Math.floor(1.0e-6 + -(this.mass * this.acft_stats.mass / 10));
        stats.toughness = Math.floor(1.0e-6 + this.toughness * this.acft_stats.toughness / 4);
        //This Gets applied later, in derived stats.
        // stats.maxstrain = Math.floor(1.0e-6 + this.maxstrain * 1.5 * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = Math.floor(1.0e-6 + -(this.drag * this.acft_stats.drag / 10));
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
var SynchronizationType;
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
(function (SynchronizationType) {
    SynchronizationType[SynchronizationType["NONE"] = -1] = "NONE";
    SynchronizationType[SynchronizationType["INTERRUPT"] = 0] = "INTERRUPT";
    SynchronizationType[SynchronizationType["SYNCH"] = 1] = "SYNCH";
    SynchronizationType[SynchronizationType["SPINNER"] = 2] = "SPINNER";
    SynchronizationType[SynchronizationType["DEFLECT"] = 3] = "DEFLECT";
    SynchronizationType[SynchronizationType["NO_INTERFERENCE"] = 4] = "NO_INTERFERENCE";
    SynchronizationType[SynchronizationType["ENUM_MAX"] = 5] = "ENUM_MAX";
})(SynchronizationType || (SynchronizationType = {}));
var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["BULLETS"] = 0] = "BULLETS";
    ProjectileType[ProjectileType["HEATRAY"] = 1] = "HEATRAY";
    ProjectileType[ProjectileType["PNEUMATIC"] = 2] = "PNEUMATIC";
    ProjectileType[ProjectileType["ENUM_MAX"] = 3] = "ENUM_MAX";
    ProjectileType[ProjectileType["GYROJETS"] = 4] = "GYROJETS";
})(ProjectileType || (ProjectileType = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["STANDARD"] = 0] = "STANDARD";
    ActionType[ActionType["MECHANICAL"] = 1] = "MECHANICAL";
    ActionType[ActionType["GAST"] = 2] = "GAST";
    ActionType[ActionType["ROTARY"] = 3] = "ROTARY";
    ActionType[ActionType["ENUM_MAX"] = 4] = "ENUM_MAX";
})(ActionType || (ActionType = {}));
class Weapon extends Part {
    constructor(weapon_type, action, projectile, fixed = false) {
        super();
        this.weapon_type = weapon_type;
        this.fixed = fixed;
        this.wing = true;
        this.covered = false;
        this.accessible = false;
        this.free_accessible = false;
        if (fixed)
            this.synchronization = SynchronizationType.NONE;
        else
            this.synchronization = SynchronizationType.INTERRUPT;
        this.w_count = 1;
        this.repeating = false;
        this.wing_reinforcement = false;
    }
    toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            w_count: this.w_count,
        };
    }
    fromJSON(js, json_version) {
        this.fixed = js["fixed"];
        this.wing = js["wing"];
        this.covered = js["covered"];
        this.accessible = js["accessible"];
        this.free_accessible = js["free_accessible"];
        this.synchronization = js["synchronization"];
        this.w_count = js["w_count"];
        if (json_version < 10.95)
            this.repeating = js["repeating"];
    }
    serialize(s) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushNum(this.w_count);
    }
    deserialize(d) {
        this.fixed = d.GetBool();
        this.wing = d.GetBool();
        this.covered = d.GetBool();
        this.accessible = d.GetBool();
        this.free_accessible = d.GetBool();
        this.synchronization = d.GetNum();
        this.w_count = d.GetNum();
        if (d.version < 10.95)
            this.repeating = d.GetBool();
    }
    SetWeaponType(weapon_type, action, projectile) {
        this.weapon_type = weapon_type;
        this.action = action;
        if (this.weapon_type.size == 16) {
            this.w_count = 1;
        }
        this.SetCount(this.w_count); //Triggers Calculate Stats
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        if (use != this.fixed) {
            if (use) {
                this.fixed = true;
            }
            else {
                this.fixed = false;
                this.synchronization = SynchronizationType.NONE;
            }
            this.CalculateStats();
        }
    }
    GetWing() {
        return this.wing;
    }
    CanWing() {
        return this.weapon_type.size <= 16;
    }
    SetWing(use) {
        if (use && this.CanWing()) {
            this.wing = true;
            this.free_accessible = false;
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.wing = false;
        }
        this.CalculateStats();
    }
    CanCovered() {
        if (this.wing)
            return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
        else
            return !(this.GetArty() && !this.fixed);
    }
    GetCovered() {
        return this.covered;
    }
    SetCovered(use) {
        this.covered = use;
        this.CalculateStats();
    }
    GetAccessible() {
        return this.accessible || this.free_accessible;
    }
    SetAccessible(use) {
        if (use && this.free_accessible)
            use = false;
        this.accessible = use;
        this.CalculateStats();
    }
    GetFreeAccessible() {
        return this.free_accessible;
    }
    SetFreeAccessible(use) {
        if (use && !this.wing && this.can_free_accessible) {
            this.free_accessible = true;
            this.accessible = false;
        }
        else {
            this.free_accessible = false;
        }
        this.CalculateStats();
    }
    CanSynchronization() {
        var lst = [];
        for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
            lst.push(this.CanSynch(i));
        }
        return lst;
    }
    CanSynch(num) {
        if (!this.fixed && !this.wing) {
            if (num == SynchronizationType.NONE || num == SynchronizationType.DEFLECT || num == SynchronizationType.NO_INTERFERENCE) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        }
        else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }
        if (this.weapon_type.name == "Fliergerflammenwerfer" &&
            !(num == SynchronizationType.NONE || num == SynchronizationType.SPINNER || num == SynchronizationType.NO_INTERFERENCE)) {
            return false;
        }
        if (this.action == ActionType.MECHANICAL && !(num == SynchronizationType.NONE || num == SynchronizationType.SYNCH ||
            (num == SynchronizationType.SPINNER && this.CanSpinner())))
            return false;
        if (this.action == ActionType.GAST && num == SynchronizationType.SPINNER)
            return false;
        if ((num == SynchronizationType.INTERRUPT || num == SynchronizationType.SYNCH)
            && !this.weapon_type.synched) {
            return false;
        }
        else if (num == SynchronizationType.SPINNER && !this.CanSpinner()) {
            return false;
        }
        else if (num == SynchronizationType.DEFLECT && this.GetArty()) {
            return false;
        }
        return true;
    }
    GetSynchronization() {
        return this.synchronization;
    }
    SetSynchronization(use) {
        if (!this.CanSynch(use)) {
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.w_count = 1;
        this.CalculateStats();
    }
    GetCount() {
        return this.w_count;
    }
    SetCount(use) {
        if (use != use) {
            use = 1;
        }
        use = Math.max(1, use);
        if (this.synchronization == SynchronizationType.SPINNER)
            use = 1;
        if (this.weapon_type.name == "Precision Rifle")
            use = 1;
        while (use * this.weapon_type.size > 16) {
            use -= 1;
        }
        this.w_count = use;
        this.CalculateStats();
    }
    CanRepeating() {
        return !this.weapon_type.rapid || this.weapon_type.reload > 0;
    }
    GetRepeating() {
        return this.repeating;
    }
    SetRepeating(use) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else
            this.repeating = false;
        this.CalculateStats();
    }
    ResolveSynch() {
        var use = this.synchronization;
        this.synchronization = SynchronizationType.ENUM_MAX;
        if (!this.CanSynch(use)) {
            for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
                if (this.CanSynch(i)) {
                    this.synchronization = i;
                    break;
                }
            }
            if (this.synchronization == SynchronizationType.ENUM_MAX) {
                //No valid synchronizations
                this.SetWing(true);
            }
        }
        else if (this.action == ActionType.MECHANICAL && use != SynchronizationType.SPINNER) {
            this.synchronization = SynchronizationType.SYNCH;
        }
        else {
            this.synchronization = use;
        }
        if (this.wing)
            this.synchronization = SynchronizationType.NONE;
        if (this.synchronization == SynchronizationType.SPINNER) {
            this.w_count = 1;
            this.covered = true;
        }
        if (this.IsLightningArc())
            this.synchronization = SynchronizationType.NO_INTERFERENCE;
    }
    GetArty() {
        return this.weapon_type.size == 16;
    }
    CanSpinner() {
        if (this.GetArty())
            return this.can_spinner && this.can_arty_spinner;
        else
            return this.can_spinner;
    }
    GetJam() {
        if (this.weapon_type.rapid) {
            var jams = this.weapon_type.jam.split('/');
            var out = [parseInt(jams[0]), parseInt(jams[1])];
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                out[0]++;
                out[1]++;
            }
            if (this.repeating) {
                out[0]++;
                out[1]++;
            }
            return out;
        }
        else {
            var ret = parseInt(this.weapon_type.jam);
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                ret += 1;
            }
            if (this.repeating) {
                ret += 1;
            }
            return ret;
        }
    }
    IsLightningArc() {
        return this.weapon_type.name == "Lightning Arc";
    }
    SetTurret(is) {
        this.turret = is;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        this.ResolveSynch();
        if (!this.CanCovered() && this.covered)
            this.covered = false;
        if (this.weapon_type.size == 16)
            this.covered = this.fixed;
        var size = 0;
        for (let i = 0; i < this.w_count; i++) {
            stats = stats.Add(this.weapon_type.stats);
            size += this.weapon_type.size;
        }
        //Covered Cost
        if (this.covered) {
            var cost = 0;
            if (this.weapon_type.size <= 1) {
                cost = 0;
            }
            else if (this.weapon_type.size <= 2) {
                cost = 1;
            }
            else if (this.weapon_type.size <= 4) {
                cost = 2;
            }
            else if (this.weapon_type.size <= 8) {
                cost = 5;
            }
            else if (this.weapon_type.size <= 16) {
                cost = 0;
            }
            cost *= this.w_count;
            if (!this.fixed)
                cost *= 2;
            if (this.synchronization != SynchronizationType.SPINNER) {
                stats.cost += cost;
            }
            stats.drag *= 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing && !this.covered)
            stats.drag += this.w_count;
        //Arty size weapon turrets need a section
        //Arty weapons in the fuselage need a section
        if ((this.turret && size > 8) || this.weapon_type.size == 16)
            stats.reqsections += 1;
        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(1.0e-6 + this.w_count / 2));
        }
        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            }
            else if (size <= 4) {
                stats.cost += 1;
            }
            else if (size <= 8) {
                stats.mass += 1;
                stats.cost += 3;
            }
            else if (size <= 16) {
                stats.mass += 2;
                stats.cost += 5;
            }
            else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }
        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += this.w_count * 2;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 2;
            }
            stats.era.push({ name: lu("Interruptor Gear"), era: lu("WWI") });
        }
        else if (this.synchronization == SynchronizationType.SYNCH && this.action != ActionType.MECHANICAL) {
            stats.cost += this.w_count * 3;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 3;
            }
            stats.era.push({ name: lu("Synchronization Gear"), era: lu("Roaring 20s") });
            //synchronization == 2 is spinner and costs nothing.
        }
        else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: lu(this.weapon_type.name),
                warning: lu("Deflector Plate Warning"),
            });
        }
        else if (this.synchronization == SynchronizationType.NO_INTERFERENCE && !this.IsLightningArc()) {
            stats.warnings.push({
                source: lu(this.weapon_type.name) + " " + lu("No Interference"),
                warning: lu("No Interference Warning"),
            });
        }
        if (this.wing_reinforcement)
            stats.mass += 2;
        stats.Round();
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />
class WeaponSystem extends Part {
    constructor(weapon_list, wl_permute) {
        super();
        this.weapon_list = weapon_list;
        this.wl_permute = wl_permute;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.raw_weapon_type = 0;
        this.weapons = [];
        this.action_sel = ActionType.STANDARD;
        this.projectile_sel = ProjectileType.BULLETS;
        this.has_propeller = true;
        this.sticky_guns = 0;
        this.repeating = false;
        this.seat = 0;
        this.final_weapon = {
            name: "", abrv: "", era: "", size: 0, stats: new Stats(),
            damage: 0, hits: 0, ammo: 0,
            ap: 0, jam: "", reload: 0,
            rapid: false, synched: false, shells: false,
            can_action: false, can_projectile: false, deflection: 0,
        };
        this.MakeFinalWeapon();
        this.SWC(1);
    }
    toJSON() {
        var wlist = [];
        for (let w of this.weapons) {
            wlist.push(w.toJSON());
        }
        return {
            weapon_type: this.raw_weapon_type,
            fixed: this.fixed,
            directions: this.directions,
            weapons: wlist,
            ammo: this.ammo,
            action: this.action_sel,
            projectile: this.projectile_sel,
            repeating: this.repeating,
            seat: this.seat,
        };
    }
    fromJSON(js, json_version) {
        this.raw_weapon_type = js["weapon_type"];
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = js["fixed"];
        this.directions = BoolArr(js["directions"], this.directions.length);
        this.weapons = [];
        this.ammo = js["ammo"];
        if (this.ammo == null)
            this.ammo = 1;
        if (json_version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = ProjectileType.BULLETS;
        }
        else {
            this.action_sel = js["action"];
            this.projectile_sel = js["projectile"];
        }
        if (json_version < 11.75) {
            if (this.projectile_sel == ProjectileType.PNEUMATIC) {
                this.projectile_sel = ProjectileType.BULLETS;
            }
            else if (this.projectile_sel == ProjectileType.ENUM_MAX) {
                this.projectile_sel = ProjectileType.PNEUMATIC;
            }
        }
        this.MakeFinalWeapon();
        for (let elem of js["weapons"]) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem, json_version);
            this.weapons.push(w);
        }
        //Repeating has been moved from Weapon to WeaponSystem
        if (json_version < 10.95) {
            this.repeating = false;
            for (let w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        }
        else {
            this.repeating = js["repeating"];
        }
        if (json_version > 11.65) {
            this.seat = js["seat"];
        }
        else {
            this.seat = 0;
        }
        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }
    serialize(s) {
        s.PushNum(this.raw_weapon_type);
        s.PushBool(this.fixed);
        s.PushBoolArr(this.directions);
        s.PushNum(this.ammo);
        s.PushNum(this.weapons.length);
        for (let w of this.weapons) {
            w.serialize(s);
        }
        s.PushNum(this.action_sel);
        s.PushNum(this.projectile_sel);
        s.PushBool(this.repeating);
        s.PushNum(this.seat);
    }
    deserialize(d) {
        this.raw_weapon_type = d.GetNum();
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = d.GetBool();
        this.directions = d.GetBoolArr(this.directions.length);
        this.ammo = d.GetNum();
        var wlen = d.GetNum();
        this.weapons = [];
        this.MakeFinalWeapon();
        for (let i = 0; i < wlen; i++) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.deserialize(d);
            this.weapons.push(w);
        }
        if (d.version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = ProjectileType.BULLETS;
        }
        else {
            this.action_sel = d.GetNum();
            this.projectile_sel = d.GetNum();
        }
        if (d.version < 11.75) {
            if (this.projectile_sel == ProjectileType.PNEUMATIC) {
                this.projectile_sel = ProjectileType.BULLETS;
            }
            else if (this.projectile_sel == ProjectileType.ENUM_MAX) {
                this.projectile_sel = ProjectileType.PNEUMATIC;
            }
        }
        //Repeating has been moved from Weapon to WeaponSystem
        if (d.version < 10.95) {
            this.repeating = false;
            for (let w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        }
        else {
            this.repeating = d.GetBool();
        }
        if (d.version > 11.65) {
            this.seat = d.GetNum();
        }
        else {
            this.seat = 0;
        }
        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }
    GetWeaponSelected() {
        return this.weapon_type;
    }
    MakeFinalWeapon() {
        var num = this.weapon_type;
        this.final_weapon.can_action = this.weapon_list[num].can_action;
        this.final_weapon.can_projectile = this.weapon_list[num].can_projectile;
        this.final_weapon.ammo = this.weapon_list[num].ammo;
        this.final_weapon.ap = this.weapon_list[num].ap;
        this.final_weapon.damage = this.weapon_list[num].damage;
        this.final_weapon.era = this.weapon_list[num].era;
        this.final_weapon.name = this.weapon_list[num].name;
        this.final_weapon.abrv = this.weapon_list[num].abrv;
        this.final_weapon.reload = this.weapon_list[num].reload;
        this.final_weapon.shells = this.weapon_list[num].shells;
        this.final_weapon.size = this.weapon_list[num].size;
        this.final_weapon.stats = this.weapon_list[num].stats.Clone();
        this.final_weapon.deflection = this.weapon_list[num].deflection;
        this.final_weapon.jam = this.weapon_list[num].jam;
        this.final_weapon.stats.era = [];
        this.final_weapon.stats.era.push({ name: this.weapon_list[num].name, era: this.weapon_list[num].era });
        if (this.weapon_list[num].hits == 0) {
            if (this.action_sel == ActionType.MECHANICAL) {
                this.action_sel = ActionType.STANDARD;
            }
            if (this.projectile_sel == ProjectileType.GYROJETS || this.projectile_sel == ProjectileType.HEATRAY) {
                this.projectile_sel = ProjectileType.BULLETS;
            }
        }
        if (this.action_sel == ActionType.STANDARD) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.synched = this.weapon_list[num].synched;
        }
        else if (this.action_sel == ActionType.MECHANICAL) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.stats.warnings.push({
                source: lu("Mechanical Action"),
                warning: lu("Mechanical Action Warning"),
            });
            this.final_weapon.jam = "0/0";
            this.final_weapon.rapid = true;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = true;
            this.final_weapon.stats.era.push({ name: lu("Mechanical Action"), era: lu("WWI") });
        }
        else if (this.action_sel == ActionType.GAST) {
            this.final_weapon.hits = 2 * this.weapon_list[num].hits;
            this.final_weapon.ammo = this.weapon_list[num].ammo / 2;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = false;
            this.final_weapon.stats.era.push({ name: lu("Gast Principle"), era: lu("WWI") });
        }
        else if (this.action_sel == ActionType.ROTARY) {
            //rotary conversion
            //3x hits, awkward + 1(don't know if that's easy to do? Otherwise I may reconsider), can only rapid fire, weapon becomes open bolt but can fire down the spinner, +1 jam, +100 % mass, +100 % cost
            this.final_weapon.stats.mass += this.weapon_list[num].stats.mass;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.size += this.weapon_list[num].size;
            this.final_weapon.size = Math.min(16, this.final_weapon.size);
            this.final_weapon.hits = 3 * this.weapon_list[num].hits;
            this.final_weapon.deflection -= 1;
            this.final_weapon.synched = false;
            var jams = this.final_weapon.jam.split('/');
            jams[0] = "9999";
            jams[1] = (parseInt(jams[1]) + 1).toString();
            this.final_weapon.jam = jams.join('/');
            this.final_weapon.stats.era.push({ name: lu("Rotary_Gun"), era: lu("WWI") });
        }
        if (this.repeating) {
            this.final_weapon.reload = 0;
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
        }
        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.MECHANICAL)
            && this.projectile_sel == ProjectileType.HEATRAY) {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        if (this.action_sel == ActionType.ROTARY
            && this.projectile_sel == ProjectileType.PNEUMATIC) {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        if (this.projectile_sel == ProjectileType.HEATRAY) {
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.shells = false;
            this.final_weapon.ammo = 0;
            this.final_weapon.deflection = 0;
            this.final_weapon.ap = Math.max(0, this.final_weapon.ap - 1);
            this.final_weapon.stats.warnings.push({
                source: lu("Heat Ray"),
                warning: lu("Heat Ray Warning"),
            });
            this.final_weapon.stats.era.push({ name: lu("Heat Ray"), era: lu("Himmilgard") });
        }
        else if (this.projectile_sel == ProjectileType.GYROJETS) {
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
            this.final_weapon.shells = false;
            this.final_weapon.damage -= 1;
            this.final_weapon.stats.warnings.push({
                source: lu("Gyrojets"),
                warning: lu("Gyrojets Warning"),
            });
            this.final_weapon.stats.era.push({ name: lu("Gyrojets"), era: lu("Roaring 20s") });
        }
        else if (this.projectile_sel == ProjectileType.PNEUMATIC) {
            this.final_weapon.ammo *= 2;
            this.final_weapon.shells = false;
            if (this.final_weapon.rapid) {
                var jams = this.final_weapon.jam.split('/');
                jams[1] = "9999";
                this.final_weapon.jam = jams.join('/');
                this.final_weapon.stats.warnings.push({
                    source: lu("Pneumatic"),
                    warning: lu("Pneumatic Warning 1"),
                });
                this.final_weapon.stats.era.push({ name: lu("Pneumatic"), era: lu("Pioneer") });
            }
            if (this.final_weapon.hits > 0) {
                this.final_weapon.stats.warnings.push({
                    source: lu("Pneumatic"),
                    warning: lu("Pneumatic Warning 2"),
                });
            }
        }
        if (this.final_weapon.deflection != 0) {
            this.final_weapon.stats.warnings.push({
                source: lu(this.final_weapon.name),
                warning: lu("Deflection Warning", this.final_weapon.deflection),
            });
        }
    }
    SetWeaponSelected(num) {
        var wasLA = this.IsLightningArc();
        this.weapon_type = num;
        this.raw_weapon_type = this.wl_permute.findIndex((value) => { return value == num; });
        if (this.weapon_list[num].size == 16) {
            while (this.weapons.length > 1) {
                this.weapons.pop();
            }
        }
        if (!this.weapon_list[num].can_action) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.weapon_list[num].can_projectile) {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        if (this.weapon_list[num].rapid) {
            this.repeating = false;
        }
        else if (!this.repeating && this.action_sel == ActionType.GAST) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.CanRepeating()) {
            this.repeating = false;
        }
        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            this.SetFixed(true);
            this.directions[0] = true;
            for (let i = 1; i < this.directions.length; i++) {
                this.directions[i] = false;
            }
        }
        if (wasLA && !this.IsLightningArc()) {
            this.weapons[0].SetSynchronization(SynchronizationType.NONE);
        }
        this.CalculateStats();
    }
    CanRepeating() {
        return (!this.weapon_list[this.weapon_type].rapid || this.weapon_list[this.weapon_type].reload > 0)
            && this.weapon_list[this.weapon_type].ammo > 0
            && this.weapon_list[this.weapon_type].name != "Precision Rifle";
    }
    GetRepeating() {
        return this.repeating;
    }
    SetRepeating(use) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else {
            this.repeating = false;
            if (!this.weapon_list[this.weapon_type].rapid && this.action_sel == ActionType.GAST)
                this.action_sel = ActionType.STANDARD;
        }
        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        this.CalculateStats();
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            use = true;
        }
        if (this.fixed != use) {
            this.fixed = use;
            for (let w of this.weapons) {
                w.SetFixed(this.fixed);
            }
            if (use) {
                var good = false;
                for (let i = 0; i < this.directions.length; i++) {
                    if (this.directions[i] && good)
                        this.directions[i] = false;
                    else if (this.directions[i])
                        good = true;
                }
            }
        }
        this.CalculateStats();
    }
    CanDirection() {
        if (this.IsLightningArc()) {
            return [...Array(this.directions.length).fill(false)];
        }
        var directions = [...Array(this.directions.length).fill(true)];
        if (this.weapons[0].GetArty() && this.fixed && !this.weapons[0].GetWing()) {
            var is_spinner = this.weapons[0].GetSynchronization() == SynchronizationType.SPINNER;
            if (this.tractor && !(this.spinner_t || (is_spinner && this.directions[0])))
                directions[0] = false;
            if (this.pusher && !(this.spinner_p || (is_spinner && this.directions[1])))
                directions[1] = false;
        }
        return directions;
    }
    GetDirection() {
        return this.directions;
    }
    SetDirection(num, use) {
        if (this.fixed && this.directions[num] && !use)
            use = true;
        if (this.fixed) {
            this.directions = [...Array(6).fill(false)];
            if (this.weapons[0].GetArty() && !this.weapons[0].GetWing()) {
                if (num == 0 && this.tractor && !this.spinner_t)
                    num = 1;
                if (num == 1 && this.pusher && !this.spinner_p)
                    num = 3;
            }
        }
        this.directions[num] = use;
        this.CalculateStats();
    }
    GetMountingCount() {
        return this.weapons.length;
    }
    GetWeaponCount() {
        var count = 0;
        for (let w of this.weapons) {
            count += w.GetCount();
        }
        return count;
    }
    SWC(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapons.length) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }
    SetMountingCount(num) {
        if (this.final_weapon.size == 16 || this.final_weapon.name == "Precision Rifle")
            num = 1;
        this.SWC(num);
        this.CalculateStats();
    }
    GetWeapons() {
        return this.weapons;
    }
    SetCanFreelyAccessible(use) {
        for (let w of this.weapons) {
            if (!w.GetWing())
                w.can_free_accessible = use;
            else
                w.can_free_accessible = false;
        }
    }
    SetTractorPusher(hasT, can_spinnerT, can_arty_spinnerT, hasP, can_spinnerP, can_arty_spinnerP) {
        this.tractor = hasT;
        this.pusher = hasP;
        this.spinner_t = can_arty_spinnerT;
        this.spinner_p = can_arty_spinnerP;
        if (this.directions[0] && hasT) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                }
                else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
                else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        }
        else if (this.directions[1] && hasP) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                }
                else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
                else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        }
        else {
            for (let w of this.weapons) {
                w.can_synchronize = false;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
    }
    GetHits() {
        var hits = this.final_weapon.hits;
        if (hits != 0) {
            var centerline = 0;
            var wings = 0;
            for (let w of this.weapons) {
                if (w.GetWing() && (w.GetFixed() || this.GetDirectionCount() <= 2)) {
                    wings += w.GetCount() * hits;
                }
                else {
                    centerline += w.GetCount() * hits;
                }
            }
            return [
                centerline + wings,
                Math.floor(1.0e-6 + centerline * 0.75) + Math.floor(1.0e-6 + wings * 0.9),
                Math.floor(1.0e-6 + centerline * 0.5) + Math.floor(1.0e-6 + wings * 0.2),
                Math.floor(1.0e-6 + centerline * 0.25) + Math.floor(1.0e-6 + wings * 0.1)
            ];
        }
        else {
            if (this.IsLightningArc()) {
                return [0, 0, 0, 0];
            }
            else if (this.final_weapon.ammo == 0) { //Fliergerflammenwerfer
                var count = 0;
                for (let w of this.weapons) {
                    count += w.GetCount();
                }
                return [3 * count, 0, 0, 0];
            }
            else { //Scatterguns
                var count = 0;
                for (let w of this.weapons) {
                    count += w.GetCount();
                }
                if (this.action_sel == ActionType.GAST) {
                    count *= 2;
                }
                return [3 * count, 2 * count, 1 * count, 0];
            }
        }
    }
    GetDamage() {
        return this.final_weapon.damage;
    }
    GetAmmo() {
        return this.ammo;
    }
    GetJam() {
        if (this.final_weapon.rapid) {
            var jams = [0, 0];
            for (let w of this.weapons) {
                var t = w.GetJam();
                jams[0] = Math.max(jams[0], t[0] + this.sticky_guns);
                jams[1] = Math.max(jams[1], t[1] + this.sticky_guns);
            }
            return jams[0].toString() + "/" + jams[1].toString();
        }
        else {
            var jam = 0;
            for (let w of this.weapons) {
                jam = Math.max(jam, w.GetJam() + this.sticky_guns);
            }
            return jam.toString();
        }
    }
    IsPlural() {
        return this.weapons.length > 1 || this.weapons[0].GetCount() > 1;
    }
    SetAmmo(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        this.ammo = num;
        this.CalculateStats();
    }
    SetHavePropeller(have) {
        if (this.has_propeller && !have && this.action_sel == ActionType.MECHANICAL) {
            this.has_propeller = have;
            this.SetAction(ActionType.STANDARD);
        }
        this.has_propeller = have;
    }
    GetAction() {
        return this.action_sel;
    }
    GetCanAction() {
        return [true,
            this.has_propeller && this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].hits > 0 && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].rapid
        ];
    }
    SetAction(num) {
        if (this.final_weapon.can_action) {
            this.action_sel = num;
            this.MakeFinalWeapon();
            for (let w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }
        }
        else {
            this.action_sel = ActionType.STANDARD;
        }
        this.CalculateStats();
    }
    GetCanProjectile() {
        return [true,
            this.final_weapon.can_projectile && this.action_sel != ActionType.MECHANICAL && this.action_sel != ActionType.GAST && this.weapon_list[this.weapon_type].hits > 0,
            // this.final_weapon.can_projectile && this.weapon_list[this.weapon_type].hits > 0,
            this.final_weapon.can_projectile && this.action_sel != ActionType.ROTARY];
    }
    GetProjectile() {
        return this.projectile_sel;
    }
    SetProjectile(num) {
        if (this.final_weapon.can_projectile) {
            this.projectile_sel = num;
            this.MakeFinalWeapon();
            for (let w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }
        }
        else {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        this.CalculateStats();
    }
    GetFinalWeapon() {
        return this.final_weapon;
    }
    SetStickyGuns(num) {
        this.sticky_guns = num;
    }
    GetHRCharges() {
        if (this.IsLightningArc()) { //Special Case for Lightning Gun
            return [3];
        }
        var count = 0;
        for (let w of this.weapons) {
            count += w.GetCount();
        }
        if (this.final_weapon.hits > 0) {
            //Calc charges / shot.
            var ammo = this.weapon_list[this.weapon_type].stats.cost;
            if (this.action_sel == ActionType.GAST) {
                ammo *= 2;
            }
            if (this.final_weapon.rapid)
                return [count * ammo, Math.max(count * ammo + 1, Math.floor(1.0e-6 + 1.5 * count * ammo))];
            else
                return [count * ammo];
        }
        else {
            if (this.final_weapon.name == "Scattergun") {
                //4 shot dice, d5, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 5 * 0.5 / 4)];
            }
            else if (this.final_weapon.name == "Punt Gun") {
                //4 shot dice, d10, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 10 * 0.5 / 4)];
            }
        }
    }
    GetShots() {
        return Math.floor(1.0e-6 + this.final_weapon.ammo * this.ammo);
    }
    IsLightningArc() {
        return this.final_weapon.name == "Lightning Arc";
    }
    GetReload() {
        return this.final_weapon.reload;
    }
    GetWingWeight() {
        var sum = 0;
        for (let w of this.weapons) {
            if (w.GetWing()) {
                sum += w.PartStats().mass;
            }
        }
        return sum;
    }
    GetDirectionCount() {
        var count = 0;
        for (let d of this.directions) {
            if (d)
                count++;
        }
        return count;
    }
    SetSeat(num) {
        this.seat = num;
        this.CalculateStats();
    }
    GetSeat() {
        return this.seat;
    }
    GetIsFullyAccessible() {
        for (let w of this.weapons) {
            if (!w.GetAccessible())
                return false;
        }
        return true;
    }
    GetIsPartlyAccessible() {
        for (let w of this.weapons) {
            if (w.GetAccessible())
                return true;
        }
        return false;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (let w of this.weapons) {
            w.SetCalculateStats(callback);
        }
    }
    PartStats() {
        var stats = new Stats();
        var dircount = 0;
        for (let d of this.directions)
            if (d)
                dircount++;
        var count = 0;
        for (let w of this.weapons) {
            w.has_cantilever = this.has_cantilever;
            w.SetTurret(this.GetDirectionCount() > 2);
            stats = stats.Add(w.PartStats());
            count += w.GetCount();
            if (!this.fixed) {
                //Turret direction costs
                if (dircount == 2)
                    stats.cost += 1;
                else if (dircount == 3 || dircount == 4)
                    stats.cost += 2;
                else if (dircount == 5)
                    stats.cost += 3;
                else if (dircount == 6)
                    stats.cost += 4;
                //Turret Size costs handled in Weapon.ts
            }
        }
        if (this.projectile_sel == ProjectileType.HEATRAY || this.IsLightningArc()) {
            //Cant have extra ammo for heatray.
            this.ammo = 1;
        }
        //Ammunition Cost
        stats.mass += (this.ammo - 1) * count;
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./WeaponSystem.ts" />
/// <reference path="./Weapon.ts" />
class Weapons extends Part {
    constructor(js) {
        super();
        this.direction_list = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
        this.synchronization_list = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate", "No Interference"];
        this.action_list = [
            { name: "Standard Action" },
            { name: "Mechanical Action" },
            { name: "Gast Principle" },
            { name: "Rotary_Gun" },
        ];
        this.projectile_list = [
            { name: "Standard" },
            { name: "Heat Ray" },
            // { name: "Gyrojets" },
            { name: "Pneumatic" },
        ];
        this.weapon_list = [];
        for (let elem of js["weapons"]) {
            var weap = {
                name: elem["name"],
                abrv: elem["abrv"],
                era: elem["era"],
                size: elem["size"],
                stats: new Stats(elem),
                damage: elem["damage"],
                hits: elem["hits"],
                ammo: elem["ammo"],
                ap: elem["ap"],
                jam: elem["jam"],
                reload: elem["reload"],
                rapid: elem["rapid"],
                synched: elem["synched"],
                shells: elem["shells"],
                can_action: elem["can_action"],
                can_projectile: elem["can_projectile"],
                deflection: elem["deflection"],
            };
            this.weapon_list.push(weap);
        }
        var pred = (a, b) => {
            var cvt2num = (l, r) => {
                if (l < r)
                    return -1;
                if (r < l)
                    return 1;
                return 0;
            };
            if (a.size != b.size)
                return cvt2num(a.size, b.size);
            else if (a.era != b.era)
                return cvt2num(era2numHh(a.era), era2numHh(b.era));
            else if (a.damage != b.damage)
                return cvt2num(a.damage, b.damage);
            else
                return cvt2num(a.name, b.name);
        };
        this.wl_permute = Array.from(Array(this.weapon_list.length).keys())
            .sort((a, b) => { return pred(this.weapon_list[a], this.weapon_list[b]); });
        var p2 = [];
        for (let i = 0; i < this.wl_permute.length; i++) {
            p2.push(this.wl_permute.findIndex((value) => { return value == i; }));
        }
        this.wl_permute = p2;
        this.weapon_list = this.weapon_list.sort(pred);
        this.weapon_sets = [];
        this.brace_count = 0;
    }
    toJSON() {
        var lst = [];
        for (let ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            weapon_systems: lst,
            brace_count: this.brace_count,
        };
    }
    fromJSON(js, json_version) {
        this.weapon_sets = [];
        var lst = js["weapon_systems"];
        for (let wsj of lst) {
            var ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.fromJSON(wsj, json_version);
            this.weapon_sets.push(ws);
        }
        if (json_version > 10.35) {
            this.brace_count = js["brace_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.weapon_sets.length);
        for (let ws of this.weapon_sets) {
            ws.serialize(s);
        }
        s.PushNum(this.brace_count);
    }
    deserialize(d) {
        this.weapon_sets = [];
        var wlen = d.GetNum();
        for (let i = 0; i < wlen; i++) {
            var ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.deserialize(d);
            this.weapon_sets.push(ws);
        }
        if (d.version > 10.35)
            this.brace_count = d.GetNum();
    }
    GetWeaponList() {
        return this.weapon_list;
    }
    GetDirectionList() {
        return this.direction_list;
    }
    GetSynchronizationList() {
        return this.synchronization_list;
    }
    SetWeaponSetCount(num) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapon_sets.length) {
            var w = new WeaponSystem(this.weapon_list, this.wl_permute);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        this.CalculateStats();
    }
    GetWeaponSets() {
        return this.weapon_sets;
    }
    CountTractorSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyTractorSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountPusherSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyPusherSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CleanFreelyAccessible() {
        var has_fa = Array(this.cockpit_count).fill(false);
        for (let ws of this.weapon_sets) {
            let seat = ws.GetSeat();
            for (let w of ws.GetWeapons()) {
                if (w.GetFreeAccessible() && has_fa[seat]) {
                    w.SetFreeAccessible(false);
                }
                else if (w.GetFreeAccessible()) {
                    has_fa[seat] = true;
                }
            }
        }
        for (let ws of this.weapon_sets) {
            let seat = ws.GetSeat();
            for (let w of ws.GetWeapons()) {
                if ((has_fa[seat] && !w.GetFreeAccessible()) || w.GetWing()) {
                    w.can_free_accessible = false;
                }
                else {
                    w.can_free_accessible = true;
                }
            }
        }
    }
    RemoveOneTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    RemoveOnePusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyPusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    CanTractorSpinner() {
        return this.CountTractorSpinner() + this.CountArtyTractorSpinner() < this.tractor_spinner_count;
    }
    CanArtyTractorSpinner() {
        return this.CountArtyTractorSpinner() < this.tractor_arty_spinner_count;
    }
    CanPusherSpinner() {
        return this.CountPusherSpinner() + this.CountArtyTractorSpinner() < this.pusher_spinner_count;
    }
    CanArtyPusherSpinner() {
        return this.CountArtyPusherSpinner() < this.pusher_arty_spinner_count;
    }
    SetTractorInfo(info) {
        this.has_tractor = info.have;
        this.tractor_spinner_count = info.spin_count;
        this.tractor_arty_spinner_count = info.arty_spin_count;
    }
    SetPusherInfo(info) {
        this.has_pusher = info.have;
        this.pusher_spinner_count = info.spin_count;
        this.pusher_arty_spinner_count = info.arty_spin_count;
    }
    GetActionList() {
        return this.action_list;
    }
    GetProjectileList() {
        return this.projectile_list;
    }
    GetBraceCount() {
        return this.brace_count;
    }
    SetBraceCount(num) {
        if (num < 0 || num != num)
            num = 0;
        num -= num % 3;
        this.brace_count = num;
        this.CalculateStats();
    }
    SetHavePropeller(have) {
        for (let ws of this.weapon_sets) {
            ws.SetHavePropeller(have);
        }
    }
    SetStickyGuns(num) {
        for (let ws of this.weapon_sets) {
            ws.SetStickyGuns(num);
        }
    }
    GetWingWeight() {
        var sum = 0;
        for (let w of this.weapon_sets) {
            sum += w.GetWingWeight();
        }
        return sum;
    }
    GetSeatList() {
        var lst = [];
        for (let i = 0; i < this.cockpit_count; i++) {
            lst.push(lu("Seat #", i + 1));
        }
        return lst;
    }
    GetArmedSeats() {
        var lst = Array(this.cockpit_count).fill(false);
        for (let ws of this.weapon_sets) {
            lst[ws.GetSeat()] = true;
        }
        return lst;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (let set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }
    SetNumberOfCockpits(num) {
        this.cockpit_count = num;
    }
    PartStats() {
        var stats = new Stats();
        //Update Freely Accessible state.
        // while (this.CountFreelyAccessible() > this.cockpit_count) {
        //     this.RemoveOneFreelyAccessible();
        // }
        this.CleanFreelyAccessible();
        while (this.CountArtyTractorSpinner() > this.tractor_arty_spinner_count) {
            this.RemoveOneArtyTractorSpinner();
        }
        while (this.CountTractorSpinner() > this.tractor_spinner_count) {
            this.RemoveOneTractorSpinner();
        }
        while (this.CountArtyPusherSpinner() > this.pusher_arty_spinner_count) {
            this.RemoveOneArtyPusherSpinner();
        }
        while (this.CountPusherSpinner() > this.pusher_spinner_count) {
            this.RemoveOnePusherSpinner();
        }
        //Wing reinforcement. Do this so it gets included in parts display.
        var wing_size = 0;
        if (this.cant_type == 0)
            wing_size = 4;
        else if (this.cant_type == 1)
            wing_size = 8;
        else
            wing_size = 16;
        //Create list of every weapon size and a ref to the weapon
        var slist = [];
        for (let ws of this.weapon_sets) {
            for (let w of ws.GetWeapons()) {
                w.wing_reinforcement = false;
                var s = { s: 0, w: w };
                if (w.GetWing()) {
                    if (this.weapon_list[ws.GetWeaponSelected()].size == wing_size) {
                        w.wing_reinforcement = true;
                    }
                    else {
                        s.s = (w.GetCount() * this.weapon_list[ws.GetWeaponSelected()].size);
                        slist.push(s);
                    }
                }
            }
        }
        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.s - b.s; });
        for (let s of slist) {
            if (wing_size > 0) {
                wing_size -= s.s;
                if (wing_size < 0) {
                    s.w.wing_reinforcement = true;
                }
            }
        }
        for (let ws of this.weapon_sets) {
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.CanArtyTractorSpinner(), this.has_pusher, this.CanPusherSpinner(), this.CanArtyPusherSpinner());
            ws.has_cantilever = this.cant_type > 0;
            stats = stats.Add(ws.PartStats());
        }
        //Weapon braces cost 1/3.  Should always be multiple of 3
        stats.cost += this.brace_count / 3;
        //Wing-tip weight: -1 control for every 5 mass
        stats.control -= Math.floor(1.0e-6 + this.GetWingWeight() / 5);
        return stats;
    }
}
/// <reference path="./Part.ts" />
class Used extends Part {
    constructor() {
        super();
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
    }
    GetEnabled() {
        var total = Math.abs(this.burnt_out) +
            Math.abs(this.ragged) +
            Math.abs(this.hefty) +
            Math.abs(this.sticky_guns) +
            Math.abs(this.weak) +
            Math.abs(this.fragile) +
            Math.abs(this.leaky) +
            Math.abs(this.sluggish);
        return total != 0;
    }
    SetEnabled(use) {
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
        this.CalculateStats();
    }
    toJSON() {
        return {
            enabled: true,
            burnt_out: this.burnt_out,
            ragged: this.ragged,
            hefty: this.hefty,
            sticky_guns: this.sticky_guns,
            weak: this.weak,
            fragile: this.fragile,
            leaky: this.leaky,
            sluggish: this.sluggish,
        };
    }
    fromJSON(js, json_version) {
        this.burnt_out = js["burnt_out"];
        this.ragged = js["ragged"];
        this.hefty = js["hefty"];
        this.sticky_guns = js["sticky_guns"];
        this.weak = js["weak"];
        this.fragile = js["fragile"];
        this.leaky = js["leaky"];
        this.sluggish = js["sluggish"];
    }
    serialize(s) {
        s.PushBool(true);
        s.PushNum(this.burnt_out);
        s.PushNum(this.ragged);
        s.PushNum(this.hefty);
        s.PushNum(this.sticky_guns);
        s.PushNum(this.weak);
        s.PushNum(this.fragile);
        s.PushNum(this.leaky);
        s.PushNum(this.sluggish);
    }
    deserialize(d) {
        d.GetBool();
        this.burnt_out = d.GetNum();
        this.ragged = d.GetNum();
        this.hefty = d.GetNum();
        this.sticky_guns = d.GetNum();
        this.weak = d.GetNum();
        this.fragile = d.GetNum();
        this.leaky = d.GetNum();
        this.sluggish = d.GetNum();
    }
    Normalize(num) {
        if (num != num) {
            num = 0;
        }
        num = Math.floor(1.0e-6 + num);
        num = Math.min(1, num);
        num = Math.max(-1, num);
        return num;
    }
    PartStats() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        return new Stats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    TriggerCS() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        this.CalculateStats();
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
var AIRCRAFT_TYPE;
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
(function (AIRCRAFT_TYPE) {
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AIRPLANE"] = 0] = "AIRPLANE";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["HELICOPTER"] = 1] = "HELICOPTER";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AUTOGYRO"] = 2] = "AUTOGYRO";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER"] = 3] = "ORNITHOPTER";
})(AIRCRAFT_TYPE || (AIRCRAFT_TYPE = {}));
var ROTOR_BLADE_COUNT;
(function (ROTOR_BLADE_COUNT) {
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Two"] = 2] = "Two";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Three"] = 3] = "Three";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Four"] = 4] = "Four";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Five"] = 5] = "Five";
})(ROTOR_BLADE_COUNT || (ROTOR_BLADE_COUNT = {}));
class Rotor extends Part {
    constructor(js) {
        super();
        this.type = AIRCRAFT_TYPE.AIRPLANE;
        this.rotor_count = 0;
        this.rotor_span = 0;
        this.wing_area = 0;
        this.is_tandem = false;
        this.dryMP = 0;
        this.sizing_span = 0;
        this.cant_idx = 0;
        this.accessory = false;
        this.blade_idx = 0;
        this.blade_list = [];
        for (let elem of js["blade_count"]) {
            this.blade_list.push({ name: elem["name"], rotor_bleed: elem["rotor_bleed"], sizing: elem["sizing"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            type: this.type,
            rotor_count: this.rotor_count,
            rotor_span: this.rotor_span,
            rotor_mat: this.cant_idx,
            is_tandem: this.is_tandem,
            accessory: this.accessory,
            blade_idx: this.blade_idx,
        };
    }
    fromJSON(js, json_version) {
        this.type = js["type"];
        this.rotor_count = js["rotor_count"];
        this.rotor_span = js["rotor_span"];
        this.cant_idx = js["rotor_mat"];
        this.is_tandem = js["is_tandem"];
        this.accessory = js["accessory"];
        if (json_version > 11.55) {
            this.blade_idx = js["blade_idx"];
        }
    }
    serialize(s) {
        s.PushNum(this.type);
        s.PushNum(this.rotor_count);
        s.PushNum(this.rotor_span);
        s.PushNum(this.cant_idx);
        s.PushBool(this.is_tandem);
        s.PushBool(this.accessory);
        s.PushNum(this.blade_idx);
    }
    deserialise(d) {
        this.type = d.GetNum();
        this.rotor_count = d.GetNum();
        this.rotor_span = d.GetNum();
        this.cant_idx = d.GetNum();
        this.is_tandem = d.GetBool();
        this.accessory = d.GetBool();
        if (d.version > 11.55) {
            this.blade_idx = d.GetNum();
        }
    }
    SetCantileverList(cant_list) {
        this.cant_list = cant_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    SetCantilever(num) {
        this.cant_idx = num;
        this.CalculateStats();
    }
    GetCantilever() {
        return this.cant_idx;
    }
    SetType(new_type) {
        if (this.type != new_type) {
            this.accessory = false;
            this.cant_idx = 0;
            this.is_tandem = false;
            this.rotor_count = 1;
            this.type = new_type;
            this.VerifySizes();
            this.rotor_span = this.sizing_span;
        }
    }
    CanRotorCount() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }
    SetRotorCount(num) {
        if (num < 1)
            num = 1;
        if (num >= 2) {
            if (num % 2 == 1) {
                if (num == this.rotor_count + 1) {
                    num = num + 1;
                }
                else {
                    num = num - 1;
                }
            }
        }
        this.rotor_count = num;
        if (this.rotor_count < 2)
            this.is_tandem = false;
        this.CalculateStats();
    }
    GetRotorCount() {
        return this.rotor_count;
    }
    CanRotorSpan() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }
    SetRotorSpan(num) {
        if (num < 2)
            num = 2;
        this.rotor_span = num;
        this.CalculateStats();
    }
    GetRotorSpan() {
        return this.rotor_span;
    }
    CanTandem() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count > 1;
    }
    SetTandem(tan) {
        this.is_tandem = tan;
        this.CalculateStats();
    }
    GetTandem() {
        return this.is_tandem;
    }
    SetBladeCount(idx) {
        this.blade_idx = idx;
        this.VerifySizes();
        this.CalculateStats();
    }
    SetWingArea(num) {
        this.wing_area = num;
        this.VerifySizes();
    }
    GetSizingSpan() {
        return this.sizing_span;
    }
    SetMP(mp) {
        if (mp != this.dryMP) {
            this.dryMP = mp;
            this.VerifySizes();
            this.CalculateStats();
        }
    }
    GetRotorStrain() {
        var area = (Math.PI / 8) * this.rotor_span * this.rotor_span;
        return this.rotor_count * Math.max(1, 2 * this.rotor_span + area - 10);
    }
    GetRotorDrag() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER || this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            var area = (Math.PI / 8) * this.rotor_span * this.rotor_span;
            if (this.rotor_count == 1) {
                return Math.floor(1.0e-6 + 6 * area * area / (this.rotor_span * this.rotor_span));
            }
            else {
                return Math.floor(1.0e-6 + 0.75 * this.rotor_count * Math.floor(1.0e-6 + 6 * area * area / (this.rotor_span * this.rotor_span)));
            }
        }
        return 0;
    }
    GetType() {
        return this.type;
    }
    GetAccessory() {
        return this.accessory;
    }
    SetAccessory(use) {
        this.accessory = use;
        this.CalculateStats();
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetTailRotor() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && !this.is_tandem;
    }
    GetBladeList() {
        return this.blade_list;
    }
    GetRotorBleed() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            return this.blade_list[this.blade_idx].rotor_bleed;
        }
        return 0;
    }
    GetBladeCountIdx() {
        return this.blade_idx;
    }
    VerifySizes() {
        if (this.type == AIRCRAFT_TYPE.AIRPLANE) {
            this.rotor_count = 0;
            this.rotor_span = 0;
            this.is_tandem = false;
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor_count = 1;
            this.sizing_span = Math.ceil(-1.0e-6 + Math.sqrt((0.6 * this.wing_area) / (Math.PI / 8)));
            this.rotor_span = Math.max(this.rotor_span, this.sizing_span);
            this.is_tandem = false;
        }
        else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            this.rotor_count = Math.max(1, this.rotor_count);
            if (this.rotor_count > 1 && this.rotor_count % 2 == 1)
                this.rotor_count = this.rotor_count - 1;
            if (this.rotor_count == 1) {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 5 * this.blade_list[this.blade_idx].sizing);
            }
            else {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 4 * this.blade_list[this.blade_idx].sizing);
            }
            this.sizing_span = Math.min(100, this.sizing_span);
            this.rotor_span = Math.max(this.rotor_span, Math.floor(1.0e-6 + this.sizing_span / 2));
        }
    }
    PartStats() {
        this.VerifySizes();
        var stats = new Stats();
        var area = (Math.PI / 9) * this.rotor_span * this.rotor_span;
        stats.wingarea += Math.floor(1.0e-6 + area);
        stats.drag = this.GetRotorDrag();
        var strain = this.GetRotorStrain();
        var ts = this.cant_list[this.cant_idx].stats.Clone();
        var count = Math.ceil(-1.0e-6 + strain / ts.maxstrain);
        ts = ts.Multiply(count);
        ts.maxstrain = 0;
        ts.toughness = 0;
        stats = stats.Add(ts);
        if (this.rotor_count > 2)
            this.is_tandem = true;
        if (this.is_tandem) {
            stats.pitchstab = 4;
        }
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.reliability = 2 * Math.min(0, this.rotor_span - this.sizing_span);
            stats = stats.Add(this.blade_list[this.blade_idx].stats);
        }
        if (this.accessory) {
            if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
                stats.cost += 2;
                stats.mass += 2;
            }
            else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
                stats.mass += this.rotor_count * this.engine_count;
            }
        }
        //Warnings
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.warnings.push({
                source: lu("Helicopter Flight"),
                warning: lu("Helicopter Flight Warning")
            });
            stats.warnings.push({
                source: lu("Helicopter Landing"),
                warning: lu("Helicopter Landing Warning")
            });
            stats.warnings.push({
                source: lu("Helicopter Descent"),
                warning: lu("Helicopter Descent Warning")
            });
            stats.warnings.push({
                source: lu("Helicopter Stall"),
                warning: lu("Helicopter Stall Warning")
            });
            if (stats.reliability < 0) {
                stats.warnings.push({
                    source: lu("Rotor Span"),
                    warning: lu("Rotor Span Warning"),
                });
            }
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            stats.warnings.push({
                source: lu("Autogyro Stall"),
                warning: lu("Autogyro Stall Warning")
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Localization.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineList.ts"/>
/// <reference path="./Era.ts" />
/// <reference path="./Cockpits.ts" />
/// <reference path="./Passengers.ts" />
/// <reference path="./Engines.ts" />
/// <reference path="./Propeller.ts" />
/// <reference path="./Frames.ts" />
/// <reference path="./Wings.ts" />
/// <reference path="./Stabilizers.ts" />
/// <reference path="./ControlSurfaces.ts" />
/// <reference path="./Reinforcement.ts" />
/// <reference path="./Fuel.ts" />
/// <reference path="./Munitions.ts" />
/// <reference path="./CargoAndPassengers.ts" />
/// <reference path="./LandingGear.ts" />
/// <reference path="./Accessories.ts" />
/// <reference path="./Optimization.ts" />
/// <reference path="./Weapons.ts" />
/// <reference path="./Used.ts" />
/// <reference path="./Rotor.ts" />
class Aircraft {
    constructor(js, weapon_json, storage) {
        this.use_storage = false;
        this.reset_json = String.raw `{"version":"11.3","name":"Basic Biplane","aircraft_type":0,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":0},{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false}],"brace_count":0},"used":{"enabled":false,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":0,"rotor_count":0,"rotor_span":0,"rotor_mat":0,"is_tandem":false,"accessory":false}}`;
        this.freeze_calculation = true;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers(js["cargo"]);
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);
        this.used = new Used();
        this.rotor = new Rotor(js["rotor"]);
        this.alter = new AlterStats();
        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.controlsurfaces.SetCalculateStats(() => { this.CalculateStats(); });
        this.reinforcements.SetCalculateStats(() => { this.CalculateStats(); });
        this.fuel.SetCalculateStats(() => { this.CalculateStats(); });
        this.munitions.SetCalculateStats(() => { this.CalculateStats(); });
        this.cargo.SetCalculateStats(() => { this.CalculateStats(); });
        this.gear.SetCalculateStats(() => { this.CalculateStats(); });
        this.accessories.SetCalculateStats(() => { this.CalculateStats(); });
        this.optimization.SetCalculateStats(() => { this.CalculateStats(); });
        this.weapons.SetCalculateStats(() => { this.CalculateStats(); });
        this.used.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCalculateStats(() => { this.CalculateStats(); });
        this.alter.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCantileverList(this.reinforcements.GetCantileverList());
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
        this.updated_stats = false;
        this.freeze_calculation = false;
        this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
        this.Reset();
    }
    toJSON() {
        return {
            version: this.version,
            name: this.name,
            aircraft_type: this.aircraft_type,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            wings: this.wings.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            controlsurfaces: this.controlsurfaces.toJSON(),
            reinforcements: this.reinforcements.toJSON(),
            fuel: this.fuel.toJSON(),
            munitions: this.munitions.toJSON(),
            cargo: this.cargo.toJSON(),
            gear: this.gear.toJSON(),
            accessories: this.accessories.toJSON(),
            optimization: this.optimization.toJSON(),
            weapons: this.weapons.toJSON(),
            used: this.used.toJSON(),
            rotor: this.rotor.toJSON(),
            alter: this.alter.toJSON(),
        };
    }
    fromJSON(js, disp = true) {
        this.freeze_calculation = true;
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        var json_version = parseFloat(js["version"]);
        this.name = js["name"];
        if (json_version > 11.05) {
            this.aircraft_type = js["aircraft_type"];
            this.rotor.SetType(js["aircraft_type"]);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        this.era.fromJSON(js["era"], json_version);
        this.cockpits.fromJSON(js["cockpits"], json_version);
        this.passengers.fromJSON(js["passengers"], json_version);
        this.engines.fromJSON(js["engines"], json_version);
        this.propeller.fromJSON(js["propeller"], json_version);
        this.frames.fromJSON(js["frames"], json_version);
        this.wings.fromJSON(js["wings"], json_version);
        this.stabilizers.fromJSON(js["stabilizers"], json_version);
        this.controlsurfaces.fromJSON(js["controlsurfaces"], json_version);
        this.reinforcements.fromJSON(js["reinforcements"], json_version);
        this.fuel.fromJSON(js["fuel"], json_version);
        this.munitions.fromJSON(js["munitions"], json_version);
        this.cargo.fromJSON(js["cargo"], json_version);
        this.gear.fromJSON(js["gear"], json_version);
        this.accessories.fromJSON(js["accessories"], json_version);
        this.optimization.fromJSON(js["optimization"], json_version);
        this.weapons.fromJSON(js["weapons"], json_version);
        if (json_version > 10.65) {
            this.used.fromJSON(js["used"], json_version);
        }
        if (json_version > 11.05) {
            this.rotor.fromJSON(js["rotor"], json_version);
        }
        if (json_version > 12.25) {
            this.alter.fromJSON(js["alter"], json_version);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
        return true;
    }
    serialize(s) {
        s.PushString(this.version);
        s.PushString(this.name);
        this.era.serialize(s);
        this.cockpits.serialize(s);
        this.passengers.serialize(s);
        this.engines.serialize(s);
        this.propeller.serialize(s);
        this.frames.serialize(s);
        this.wings.serialize(s);
        this.stabilizers.serialize(s);
        this.controlsurfaces.serialize(s);
        this.reinforcements.serialize(s);
        this.fuel.serialize(s);
        this.munitions.serialize(s);
        this.cargo.serialize(s);
        this.gear.serialize(s);
        this.accessories.serialize(s);
        this.optimization.serialize(s);
        this.weapons.serialize(s);
        this.used.serialize(s);
        this.rotor.serialize(s);
        s.PushNum(this.aircraft_type);
        this.alter.serialize(s);
    }
    deserialize(d) {
        this.freeze_calculation = true;
        d.version = parseFloat(d.GetString());
        console.log(d.version);
        this.name = d.GetString();
        this.era.deserialize(d);
        this.cockpits.deserialize(d);
        this.passengers.deserialize(d);
        this.engines.deserialize(d);
        this.propeller.deserialize(d);
        this.frames.deserialize(d);
        this.wings.deserialize(d);
        this.stabilizers.deserialize(d);
        this.controlsurfaces.deserialize(d);
        this.reinforcements.deserialize(d);
        this.fuel.deserialize(d);
        this.munitions.deserialize(d);
        this.cargo.deserialize(d);
        this.gear.deserialize(d);
        this.accessories.deserialize(d);
        this.optimization.deserialize(d);
        this.weapons.deserialize(d);
        if (d.version > 10.65) {
            this.used.deserialize(d);
        }
        if (d.version > 11.05) {
            this.rotor.deserialise(d);
            this.aircraft_type = d.GetNum();
            this.rotor.SetType(this.aircraft_type);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        if (d.version > 12.25) {
            this.alter.deserialize(d);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
    }
    SetType(type) {
        this.aircraft_type = type;
        this.rotor.SetType(type);
        this.CalculateStats();
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        if (this.freeze_calculation) {
            return;
        }
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        this.engines.SetTailMods(this.frames.GetFarmanOrBoom(), this.wings.GetSwept() && this.stabilizers.GetVOutboard(), this.stabilizers.GetCanard());
        this.engines.SetInternal(this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER || this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER);
        this.engines.SetMetalArea(this.wings.GetMetalArea());
        this.engines.HaveParasol(this.wings.GetParasol());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetNumPropeller(this.engines.GetNumPropellers(), this.engines.GetEngineType());
        this.propeller.SetAcftType(this.aircraft_type);
        stats = stats.Add(this.propeller.PartStats());
        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        //Weapons go here, because they make sections.
        this.weapons.SetNumberOfCockpits(this.cockpits.GetNumberOfCockpits());
        this.weapons.SetTractorInfo(this.engines.GetTractorSpinner());
        this.weapons.SetPusherInfo(this.engines.GetPusherSpinner());
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        this.weapons.SetHavePropeller(this.engines.GetNumPropellers() > 0);
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());
        //If there are wings...
        stats = stats.Add(this.wings.PartStats());
        this.rotor.SetWingArea(stats.wingarea);
        //If there is a rotor...
        if (this.aircraft_type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor.SetEngineCount(this.engines.GetNumberOfEngines());
            stats = stats.Add(this.rotor.PartStats());
        }
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetBoomTail(this.frames.GetUseBoom());
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        this.controlsurfaces.SetAcftType(this.aircraft_type);
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        this.reinforcements.SetCanUseExternal(this.wings.GetArea() > 0);
        this.reinforcements.SetSesquiplane(this.wings.GetIsSesquiplane());
        this.reinforcements.SetAircraftType(this.aircraft_type);
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        stats = stats.Add(this.reinforcements.PartStats());
        if (this.rotor.GetTailRotor()) {
            stats.power = Math.floor(1.0e-6 + 0.9 * stats.power);
        }
        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        this.accessories.SetVitalParts(this.VitalComponentList().length);
        stats = stats.Add(this.accessories.PartStats());
        //You know what, frames go last, because lots of things make sections.
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.wings.GetTandem());
        stats = stats.Add(this.frames.PartStats());
        //Depends on Lifting area.
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetHelicopter(false);
        this.stabilizers.SetLiftingArea(stats.wingarea);
        this.stabilizers.wing_drag = this.wings.GetWingDrag() + this.rotor.GetRotorDrag();
        stats = stats.Add(this.stabilizers.PartStats());
        //Treated Paper needs to apply near to last
        this.wings.SetAircraftMass(stats.mass);
        stats.mass += this.wings.GetPaperMass();
        //Because treated paper brings mass down.
        stats.mass = Math.max(1, stats.mass);
        //Gear go last, because they need total mass.
        this.gear.SetGull(this.wings.HasInvertedGull());
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());
        //Add toughness here so it gets optimized properly.
        stats.toughness += Math.floor(1.0e-6 + stats.structure / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        //Has flight stress from open cockpit + tractor rotary.
        this.cockpits.SetHasRotary(this.engines.HasTractorRotary());
        stats = stats.Add(this.alter.PartStats());
        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();
        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;
            var derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);
            //Used: burnt_out
            stats.reliability -= this.used.burnt_out;
            //Used: sticky_guns  (Just needs to happen before display)
            this.weapons.SetStickyGuns(this.used.sticky_guns);
            //Update Part Local stuff
            this.cockpits.SetArmed(this.weapons.GetArmedSeats());
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.ControlStress, derived.RumbleStress, this.stats.visibility, this.stats.crashsafety);
            //Check Flight Stress for warnings
            let stress_reduction = 0;
            for (let s of this.cockpits.GetStressList()) {
                stress_reduction = Math.max(stress_reduction, s[0] - s[1]);
            }
            if (stress_reduction != 0 && this.stats.warnings.findIndex((value) => { return value.source == lu("Co-Pilot Controls"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Co-Pilot Controls"),
                    warning: lu("Co-Pilot Warning", stress_reduction)
                });
            }
            if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER) {
                stats.reliability -= 2;
            }
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftParameters(stats.structure, this.era.GetMaxBomb(), this.wings.HasInvertedGull());
            //Airplanes always cost 1
            this.stats.cost = Math.max(1, this.stats.cost);
            //Always have at least 1 liftbleed
            this.stats.liftbleed = Math.max(1, this.stats.liftbleed);
            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: lu("Stat Rumble"),
                    warning: lu("Rumble Warning")
                });
            }
            if (this.DisplayCallback && !this.freeze_calculation)
                this.DisplayCallback();
            if (this.use_storage)
                window.localStorage.aircraft = JSON.stringify(this);
        }
    }
    GetDerivedStats() {
        var DryMP = Math.floor(1.0e-6 + this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        var WetMP = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        var WetMPwBombs = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        var DPEmpty = Math.floor(1.0e-6 + (this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        var DPFull = DPEmpty; //Based on advice from Discord.
        var DPwBombs = Math.floor(1.0e-6 + (this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        var MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9))));
        var MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9))));
        var MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9))));
        // Supersonic Tests
        // var MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPEmpty * 9))));
        // var MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPFull * 9))));
        // var MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPwBombs * 9))));
        var StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFullwBombs = Math.max(Math.floor(1.0e-6 + this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea)));
        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(1.0e-6 + this.stats.power / DryMP);
        var BoostFull = Math.floor(1.0e-6 + this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(1.0e-6 + this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(1.0e-6 + this.stats.pitchboost * MaxSpeedEmpty);
        //Used: Ragged
        // Comes after Dropoff so Used only affects the one number, not multiple.
        MaxSpeedEmpty = Math.floor(1.0e-6 + MaxSpeedEmpty * (1 - 0.1 * this.used.ragged));
        MaxSpeedFull = Math.floor(1.0e-6 + MaxSpeedFull * (1 - 0.1 * this.used.ragged));
        MaxSpeedwBombs = Math.floor(1.0e-6 + MaxSpeedwBombs * (1 - 0.1 * this.used.ragged));
        var Stability = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stability += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stability -= 2;
        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stability > 10 || Stability < -10) {
            HandlingEmpty = -1 / 0;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Stability"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Stability"), warning: lu("Stability Warning")
                });
            }
        }
        else if (Stability == 10)
            HandlingEmpty -= 4;
        else if (Stability > 6)
            HandlingEmpty -= 3;
        else if (Stability > 3)
            HandlingEmpty -= 2;
        else if (Stability > 0)
            HandlingEmpty -= 1;
        else if (Stability == 0)
            HandlingEmpty += 0;
        else if (Stability > -4)
            HandlingEmpty += 1;
        else if (Stability > -7)
            HandlingEmpty += 2;
        else if (Stability > -10)
            HandlingEmpty += 3;
        else if (Stability == -10)
            HandlingEmpty += 4;
        var HandlingFull = HandlingEmpty + DryMP - WetMP;
        var HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;
        //Used: Sluggish
        HandlingEmpty = Math.floor(1.0e-6 + HandlingEmpty - 5 * this.used.sluggish);
        HandlingFull = Math.floor(1.0e-6 + HandlingFull - 5 * this.used.sluggish);
        HandlingFullwBombs = Math.floor(1.0e-6 + HandlingFullwBombs - 5 * this.used.sluggish);
        var MaxStrain = 1 / 0;
        if (this.wings.GetWingList().length > 0 || this.wings.GetMiniWingList().length > 0) {
            MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        }
        else {
            MaxStrain = Math.min(this.stats.structure + this.stats.maxstrain, this.stats.structure);
        }
        //And store the results so they can be displayed
        this.optimization.final_ms = Math.floor(1.0e-6 + this.optimization.GetMaxStrain() * 1.5 * MaxStrain / 10);
        MaxStrain += this.optimization.final_ms;
        //Used: Fragile
        MaxStrain = Math.floor(1.0e-6 + MaxStrain * (1 - 0.2 * this.used.fragile));
        if (MaxStrain < 10 && this.stats.warnings.findIndex((value) => { return value.source == lu("Stat Max Strain"); }) == -1) {
            this.stats.warnings.push({
                source: lu("Stat Max Strain"), warning: lu("Max Strain Warning")
            });
        }
        var Toughness = this.stats.toughness;
        //Used: Weak
        Toughness = Math.floor(1.0e-6 + Toughness * (1 - 0.5 * this.used.weak));
        var Structure = this.stats.structure;
        var EnergyLoss = Math.ceil(-1.0e-6 + DPEmpty / this.propeller.GetEnergy());
        var EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        var TurnBleed = Math.ceil(-1.0e-6 + Math.floor(1.0e-6 + (StallSpeedEmpty + StallSpeedFull) / 2) / this.propeller.GetTurn());
        if (this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER) {
            TurnBleed = Math.max(1, Math.floor(1.0e-6 + DryMP / 2)) + this.rotor.GetRotorBleed();
            EnergyLoss = Math.max(1, Math.floor(1.0e-6 + DPEmpty / 7));
            StallSpeedEmpty = 0;
            StallSpeedFull = 0;
            StallSpeedFullwBombs = 0;
            MaxSpeedEmpty = Math.min(37, MaxSpeedEmpty);
            MaxSpeedFull = Math.min(37, MaxSpeedFull);
            MaxSpeedwBombs = Math.min(37, MaxSpeedwBombs);
        }
        TurnBleed = Math.max(TurnBleed, 1);
        var TurnBleedwBombs = TurnBleed + 1;
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);
        //Used: Hefty
        // Comes after Turnbleed so Used only affects the one number, not multiple.
        StallSpeedEmpty = Math.floor(1.0e-6 + StallSpeedEmpty * (1 + 0.2 * this.used.hefty));
        StallSpeedFull = Math.floor(1.0e-6 + StallSpeedFull * (1 + 0.2 * this.used.hefty));
        StallSpeedFullwBombs = Math.floor(1.0e-6 + StallSpeedFullwBombs * (1 + 0.2 * this.used.hefty));
        if (MaxSpeedwBombs <= StallSpeedFullwBombs || MaxSpeedFull <= StallSpeedFull) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Stall Speed"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Stall Speed"), warning: lu("Stall Speed Warning")
                });
            }
        }
        var FuelUses = Math.floor(1.0e-6 + this.stats.fuel / this.stats.fuelconsumption);
        //Used: Leaky
        FuelUses = Math.floor(1.0e-6 + FuelUses * (1 - 0.2 * this.used.leaky));
        if (!isFinite(FuelUses)) {
            FuelUses = 0;
        }
        if (FuelUses < 6) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Fuel Uses"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Fuel Uses"), warning: lu("Fuel Uses Warning")
                });
            }
        }
        var ControlStress = 1;
        if (Stability > 3 || Stability < -3)
            ControlStress++;
        //Flight Stress from Rumble.
        var RumbleStress = 0;
        ControlStress += Math.min(this.accessories.GetMaxMassStress(), Math.floor(1.0e-6 + DryMP / 10));
        var MaxStress = this.accessories.GetMaxTotalStress();
        ControlStress = Math.min(MaxStress, ControlStress);
        if (this.engines.GetMaxRumble() > 0) {
            RumbleStress += Math.max(1, this.engines.GetMaxRumble());
            RumbleStress = Math.floor(1.0e-6 + RumbleStress);
        }
        if (MaxStress == 0) {
            RumbleStress = 0;
        }
        var RateOfClimbEmpty = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / DryMP) * (23.0 / this.stats.pitchspeed) / DPEmpty));
        var RateOfClimbFull = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMP) * (23.0 / this.stats.pitchspeed) / DPFull));
        var RateOfClimbwBombs = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMPwBombs) * (23.0 / this.stats.pitchspeed) / DPwBombs));
        if (!isFinite(RateOfClimbEmpty)) {
            RateOfClimbEmpty = 0;
            RateOfClimbFull = 0;
            RateOfClimbwBombs = 0;
        }
        //Ornithopter Stuff
        if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER) {
            HandlingEmpty += this.stats.power;
            HandlingFull += this.stats.power;
            HandlingFullwBombs += this.stats.power;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Ornithopter Stall"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Ornithopter Stall"), warning: lu("Ornithopter Stall Warning")
                });
            }
            Overspeed = MaxStrain;
        }
        return {
            DryMP: DryMP,
            WetMP: WetMP,
            WetMPwBombs: WetMPwBombs,
            DPEmpty: DPEmpty,
            DPFull: DPFull,
            DPwBombs: DPwBombs,
            MaxSpeedEmpty: MaxSpeedEmpty,
            MaxSpeedFull: MaxSpeedFull,
            MaxSpeedwBombs: MaxSpeedwBombs,
            StallSpeedEmpty: StallSpeedEmpty,
            StallSpeedFull: StallSpeedFull,
            StallSpeedFullwBombs: StallSpeedFullwBombs,
            Overspeed: Overspeed,
            BoostEmpty: BoostEmpty,
            BoostFull: BoostFull,
            BoostFullwBombs: BoostFullwBombs,
            Dropoff: Dropoff,
            Stabiilty: Stability,
            HandlingEmpty: HandlingEmpty,
            HandlingFull: HandlingFull,
            HandlingFullwBombs: HandlingFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            ControlStress: ControlStress,
            RumbleStress: RumbleStress,
            RateOfClimbFull: RateOfClimbFull,
            RateOfClimbEmpty: RateOfClimbEmpty,
            RateOfClimbwBombs: RateOfClimbwBombs,
        };
    }
    VitalComponentList() {
        var derived = this.GetDerivedStats();
        var vital = [];
        vital.push(lu("Vital Part Controls"));
        for (let i = 0; i < this.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push(lu("Seat #", i + 1) + ": " + lu(this.GetCockpits().GetCockpit(i).GetName()));
        }
        if (derived.FuelUses > 0) {
            vital.push(lu("Vital Part Fuel Tanks"));
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            if (this.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push(lu("Vital Part Engine Pusher", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Pusher", i + 1));
                }
                vital.push(lu("Vital Part Engine Puller", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Puller", i + 1));
                }
            }
            else {
                vital.push(lu("Vital Part Engine", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan", i + 1));
                }
            }
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push(lu("Vital Part Radiator", i + 1));
        }
        if (this.IsElectrics()) {
            vital.push(lu("Vital Part Electrics"));
        }
        var wlist = this.GetWeapons().GetWeaponList();
        for (let i = 0; i < this.GetWeapons().GetWeaponSets().length; i++) {
            vital.push(lu("Vital Part Weapon Set", i + 1, wlist[this.GetWeapons().GetWeaponSets()[i].GetWeaponSelected()].abrv));
        }
        if (this.GetLandingGear().IsVital()) {
            vital.push(lu("Vital Part Landing Gear"));
        }
        if (this.rotor.GetTailRotor()) {
            vital.push(lu("Vital Part Tail Rotor"));
        }
        return vital;
    }
    SetStorage(use) {
        this.use_storage = use;
    }
    Reset() {
        this.fromJSON(JSON.parse(this.reset_json), false);
    }
    GetVersion() {
        return this.version;
    }
    GetCommunicationName() {
        return this.accessories.GetCommunicationName();
    }
    GetAttackList() {
        return this.cockpits.GetAttackList();
    }
    GetVisibilityList() {
        return this.cockpits.GetVisibilityList();
    }
    GetStressList() {
        return this.cockpits.GetStressList();
    }
    GetEscapeList() {
        return this.cockpits.GetEscapeList();
    }
    GetCrashList() {
        return this.cockpits.GetCrashList();
    }
    GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }
    GetMinIAF() {
        return this.engines.GetMinIAF();
    }
    GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }
    GetGearName() {
        return this.gear.GetGearName();
    }
    GetIsFlammable() {
        return this.frames.GetIsFlammable() || this.wings.GetIsFlammable();
    }
    GetAircraftType() {
        return this.aircraft_type;
    }
    GetEra() {
        return this.era;
    }
    GetCockpits() {
        return this.cockpits;
    }
    GetPassengers() {
        return this.passengers;
    }
    GetEngines() {
        return this.engines;
    }
    GetPropeller() {
        return this.propeller;
    }
    GetFrames() {
        return this.frames;
    }
    GetWings() {
        return this.wings;
    }
    GetStabilizers() {
        return this.stabilizers;
    }
    GetControlSurfaces() {
        return this.controlsurfaces;
    }
    GetReinforcements() {
        return this.reinforcements;
    }
    GetFuel() {
        return this.fuel;
    }
    GetMunitions() {
        return this.munitions;
    }
    GetCargoAndPassengers() {
        return this.cargo;
    }
    GetLandingGear() {
        return this.gear;
    }
    GetAccessories() {
        return this.accessories;
    }
    GetOptimization() {
        return this.optimization;
    }
    GetStats() {
        return this.stats;
    }
    GetWeapons() {
        return this.weapons;
    }
    IsElectrics() {
        return this.engines.IsElectrics() || this.accessories.IsElectrics() || this.cockpits.IsElectrics();
    }
    GetUsed() {
        return this.used;
    }
    GetRotor() {
        return this.rotor;
    }
    GetAlter() {
        return this.alter;
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
function CreateTD(row, content) {
    var th = document.createElement("TD");
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}
function CreateInput(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
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
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
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
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
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
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexSelect(txt, sel, fs) {
    var lbl = document.createElement("LABEL");
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}
function CreateCheckbox(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
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
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateText(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var lbl = document.createElement("LABEL");
    elem.id = GenerateID();
    lbl.htmlFor = elem.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    elem.setAttribute("type", "text");
    elem.value = "Default";
    span.appendChild(lbl);
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
    elem.textContent = txt;
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
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
    lbl.id = GenerateID();
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "checkbox");
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    var lbl2 = document.createElement("LABEL");
    var span = document.createElement("SPAN");
    span.appendChild(lbl2);
    span.appendChild(inp);
    fs.div2.appendChild(span);
}
function FlexLabel(txt, div1) {
    var lbl = document.createElement("LABEL");
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
}
function FlexSpace(fs) {
    var lbl = document.createElement("LABEL");
    lbl.textContent = " ";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    var lbl2 = document.createElement("LABEL");
    lbl2.textContent = " ";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}
function insertRow(frag) {
    var row = document.createElement("TR");
    frag.append(row);
    return row;
}
function insertCell(frag) {
    var cell = document.createElement("TD");
    frag.append(cell);
    return cell;
}
function BlinkBad(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_b");
}
function BlinkGood(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_g");
}
function BlinkNeutral(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_n");
}
function BlinkIfChanged(elem, str, positive_good = null) {
    if (enable_anim) {
        if (elem.textContent != str) {
            if (positive_good == null) {
                BlinkNeutral(elem);
            }
            else {
                var positive = parseInt(elem.textContent) < parseInt(str);
                if (positive_good && positive || (!positive_good && !positive)) {
                    BlinkGood(elem);
                }
                else {
                    BlinkBad(elem);
                }
            }
        }
    }
    elem.textContent = str;
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
class Derived_HTML {
    constructor(tbl) {
        var fragment = document.createDocumentFragment();
        var row0 = insertRow(fragment);
        var name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 2;
        this.name_inp = document.createElement("INPUT");
        this.name_inp.defaultValue = lu("Derived Aircraft Name");
        name_cell.appendChild(this.name_inp);
        CreateTH(row0, lu("Stat Cost"));
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        CreateTH(row0, lu("Stat Upkeep"));
        // Aircraft Upkeep
        this.upkeep_cell = row0.insertCell();
        // Rules Version
        CreateTH(row0, lu("Derived Era Report"));
        this.version_cell = row0.insertCell();
        var row1 = insertRow(fragment);
        CreateTH(row1, lu("Derived Mass Variations"));
        CreateTH(row1, lu("Derived Boost"));
        CreateTH(row1, lu("Derived Handling"));
        CreateTH(row1, lu("Derived Rate of Climb"));
        CreateTH(row1, lu("Derived Stall Speed"));
        CreateTH(row1, lu("Derived Top Speed"));
        CreateTH(row1, lu("Derived Vital Components")).colSpan = 2;
        this.bomb_row2 = insertRow(fragment);
        CreateTH(this.bomb_row2, lu("Derived Full Fuel with Bombs"));
        this.boost_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.roc_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.vital_components = this.bomb_row2.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;
        this.bomb_row1 = insertRow(fragment);
        CreateTH(this.bomb_row1, lu("Derived Half Fuel with Bombs"));
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.roc_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.ts_halfwB = this.bomb_row1.insertCell();
        this.full_row = insertRow(fragment);
        CreateTH(this.full_row, lu("Derived Full Fuel"));
        this.boost_full = this.full_row.insertCell();
        this.hand_full = this.full_row.insertCell();
        this.roc_full = this.full_row.insertCell();
        this.ss_full = this.full_row.insertCell();
        this.ts_full = this.full_row.insertCell();
        var half = insertRow(fragment);
        CreateTH(half, lu("Derived Half Fuel"));
        this.boost_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.roc_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.ts_half = half.insertCell();
        var empty = insertRow(fragment);
        CreateTH(empty, lu("Derived Empty Fuel"));
        this.boost_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.roc_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.ts_empty = empty.insertCell();
        var row7 = insertRow(fragment);
        CreateTH(row7, lu("Derived Propulsion")).colSpan = 2;
        CreateTH(row7, lu("Derived Aerodynamics")).colSpan = 2;
        CreateTH(row7, lu("Derived Survivability")).colSpan = 2;
        CreateTH(row7, lu("Derived Crew Members")).colSpan = 2;
        var row8 = insertRow(fragment);
        CreateTH(row8, lu("Derived Dropoff"));
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Stability"));
        this.stability_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crash Safety"));
        this.crashsafety_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crew/Passengers"));
        this.crew_cell = row8.insertCell();
        var row9 = insertRow(fragment);
        CreateTH(row9, lu("Derived Overspeed"));
        this.overspeed_cell = row9.insertCell();
        CreateTH(row9, lu("Derived Energy Loss"));
        this.eloss_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Toughness"));
        this.toughness_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Visibility"));
        this.visibility_cell = row9.insertCell();
        var row10 = insertRow(fragment);
        CreateTH(row10, lu("Derived Fuel Uses"));
        this.maxfuel_cell = row10.insertCell();
        this.turnbleed_label = CreateTH(row10, lu("Derived Turn Bleed"));
        this.turnbleed_cell = row10.insertCell();
        CreateTH(row10, lu("Stat Max Strain"));
        this.mxstrain_cell = row10.insertCell();
        CreateTH(row10, lu("Derived Attack Modifier"));
        this.attack_cell = row10.insertCell();
        var row11 = insertRow(fragment);
        CreateTH(row11, lu("Stat Reliability"));
        this.reliability_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Landing Gear"));
        this.landing_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Communications"));
        this.communications_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Escape"));
        this.escape_cell = row11.insertCell();
        var row12 = insertRow(fragment);
        CreateTH(row12, lu("Derived Ideal Engine Altitude"));
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, lu("Derived Is Flammable Question"));
        this.flammable_cell = row12.insertCell();
        CreateTH(row12, lu("Derived Electrics"));
        this.electric_cell = row12.insertCell();
        CreateTH(row12, lu("Stat Flight Stress"));
        this.flightstress_cell = row12.insertCell();
        this.weapon_head = CreateTH(insertRow(fragment), lu("Derived Weapon Systems"));
        this.weapon_head.colSpan = 8;
        this.weapon_cell = insertRow(fragment).insertCell();
        this.weapon_cell.colSpan = 8;
        this.warning_head = CreateTH(insertRow(fragment), lu("Derived Special Rules"));
        this.warning_head.colSpan = 8;
        this.warning_cell = insertRow(fragment).insertCell();
        this.warning_cell.colSpan = 8;
        tbl.appendChild(fragment);
        this.tbl = tbl;
    }
    UpdateDisplay(acft, stats, derived) {
        this.name_inp.value = acft.name;
        while (this.version_cell.children.length > 0) {
            this.version_cell.removeChild(this.version_cell.children[0]);
        }
        this.version_cell.className = "tooltip";
        var era_t_div = document.createElement("DIV");
        era_t_div.className = "tooltiptext";
        let div_text = document.createElement("P");
        div_text.textContent = lu("Derived Problematic Parts");
        era_t_div.appendChild(div_text);
        var plane_era = era2numHl(acft.GetEra().GetSelectedText());
        var era_break = 0;
        for (let part of stats.era) {
            var part_era = era2numHl(part.era);
            if (part_era > plane_era) {
                era_break += part_era - plane_era;
                let part_text = document.createElement("P");
                part_text.textContent = part.name + ": " + part.era;
                era_t_div.appendChild(part_text);
            }
        }
        if (era_break == 0) {
            let part_text = document.createElement("P");
            part_text.textContent = lu("None");
            era_t_div.appendChild(part_text);
        }
        var era_p_elem = document.createElement("P");
        era_p_elem.textContent = lu(acft.GetEra().GetSelectedText());
        if (era_break == 0)
            era_p_elem.className = "green";
        else if (era_break > 2)
            era_p_elem.className = "red";
        else
            era_p_elem.className = "yellow";
        this.version_cell.appendChild(era_p_elem);
        this.version_cell.appendChild(era_t_div);
        this.cost_cell.textContent = stats.cost.toString() + "þ ";
        if (acft.GetUsed().GetEnabled()) {
            this.cost_cell.textContent += " (" + Math.floor(1.0e-6 + stats.cost / 2).toString() + "þ " + lu("Price Word Used") + ")";
        }
        this.upkeep_cell.textContent = stats.upkeep.toString() + "þ";
        //Empty
        // this.ts_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedEmpty).toString();
        // this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        // this.hand_empty.textContent = derived.HandlingEmpty.toString();
        // this.boost_empty.textContent = derived.BoostEmpty.toString();
        // this.roc_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull - derived.StallSpeedFull + derived.BoostFull).toString();
        this.ts_empty.textContent = (0).toString();
        this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        this.hand_empty.textContent = derived.HandlingEmpty.toString();
        this.boost_empty.textContent = (0).toString();
        this.roc_empty.textContent = (0).toString();
        //Half
        this.ts_half.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.roc_half.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2).toString();
        //Full
        this.ts_full.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull).toString();
        this.ss_full.textContent = derived.StallSpeedFull.toString();
        this.hand_full.textContent = derived.HandlingFull.toString();
        this.boost_full.textContent = derived.BoostFull.toString();
        this.roc_full.textContent = derived.RateOfClimbFull.toString();
        if (stats.bomb_mass > 0 || this.show_bombs) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            this.bomb_row2.appendChild(this.vital_components);
            this.vital_components.rowSpan = 5;
            //Half
            this.ts_halfwB.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.roc_halfwB.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2).toString();
            //Full
            this.ts_fullwB.textContent = Math.floor(1.0e-6 + derived.MaxSpeedwBombs).toString();
            this.ss_fullwB.textContent = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.textContent = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.textContent = derived.BoostFullwBombs.toString();
            this.roc_fullwB.textContent = derived.RateOfClimbwBombs.toString();
            //Turn Bleed
            this.turnbleed_label.textContent = lu("Derived Turn Bleed wB");
            this.turnbleed_cell.textContent = StringFmt.Format("{0} ({1})", derived.TurnBleed, derived.TurnBleedwBombs);
        }
        else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.full_row.appendChild(this.vital_components);
            this.vital_components.rowSpan = 3;
            //Turn Bleed
            this.turnbleed_label.textContent = lu("Derived Turn Bleed");
            this.turnbleed_cell.textContent = StringFmt.Format("{0}", derived.TurnBleed);
        }
        this.dropoff_cell.textContent = derived.Dropoff.toString();
        this.overspeed_cell.textContent = derived.Overspeed.toString();
        this.maxfuel_cell.textContent = (Math.floor(1.0e-6 + derived.FuelUses * 10) / 10).toString();
        if (acft.GetIsFlammable())
            this.flammable_cell.textContent = lu("Yes");
        else
            this.flammable_cell.textContent = lu("No");
        this.stability_cell.textContent = derived.Stabiilty.toString();
        this.eloss_cell.textContent = derived.EnergyLoss.toString();
        //Turn bleed done in bomb mass section because affected by it.
        this.landing_cell.textContent = acft.GetGearName();
        this.maxalt_cell.textContent = acft.GetMinIAF().toString() + "-" + acft.GetMaxAltitude().toString();
        this.reliability_cell.textContent = StringFmt.Join(", ", acft.GetReliabilityList());
        this.toughness_cell.textContent = derived.Toughness.toString();
        this.mxstrain_cell.textContent = derived.MaxStrain.toString();
        this.escape_cell.textContent = StringFmt.Join(", ", acft.GetEscapeList());
        this.crashsafety_cell.textContent = stats.crashsafety.toString();
        this.crew_cell.textContent = acft.GetCockpits().GetNumberOfCockpits().toString() + "/" + (acft.GetPassengers().GetSeats() + acft.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.textContent = this.Stress2Str(acft.GetStressList());
        this.visibility_cell.textContent = StringFmt.Join(", ", acft.GetVisibilityList());
        this.attack_cell.textContent = StringFmt.Join(", ", acft.GetAttackList());
        this.communications_cell.textContent = acft.GetCommunicationName();
        var wm = acft.GetAccessories().GetWindmill();
        var bat = acft.GetAccessories().GetStorage();
        var electric_str = stats.charge.toString();
        if (wm > 0)
            electric_str += " + " + wm.toString() + lu("Derived Per 10 Speed");
        if (bat > 0)
            electric_str += " + " + bat + " " + lu("Derived Battery word storage");
        this.electric_cell.textContent = electric_str;
        var vital = "";
        var vlist = acft.VitalComponentList();
        for (let v of vlist) {
            vital += v + "<br/>";
        }
        this.vital_components.innerHTML = vital;
        var wlist = acft.GetWeapons().GetWeaponList();
        var dlist = acft.GetWeapons().GetDirectionList();
        var bombs = acft.GetMunitions().GetBombCount();
        var rockets = acft.GetMunitions().GetRocketCount();
        var internal = acft.GetMunitions().GetInternalBombCount();
        var weaphtml = "";
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                weaphtml += lu(" Bomb Mass Internally.", int_bomb);
            if (ext_bomb > 0)
                weaphtml += lu(" Bomb Mass Externally.", ext_bomb);
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, acft.GetMunitions().GetMaxBombSize());
                weaphtml += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            weaphtml += "<br/>";
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                weaphtml += lu(" Rocket Mass Internally.", int_rock);
            if (ext_rock > 0)
                weaphtml += lu(" Rocket Mass Externally.", ext_rock);
            weaphtml += "<br/>";
        }
        for (let w of acft.GetWeapons().GetWeaponSets()) {
            weaphtml += WeaponString(w, wlist, dlist);
            weaphtml += "<br\>";
        }
        this.weapon_cell.innerHTML = weaphtml;
        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
        }
        this.warning_cell.innerHTML = warnhtml;
    }
    GetName() {
        return this.name_inp.value;
    }
    SetName(name) {
        this.name_inp.value = name;
    }
    SetShowBombs(set) {
        this.show_bombs = set;
    }
    Stress2Str(arr) {
        var str = "";
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + "), ";
            }
            else {
                str += arr[i][0].toString() + ", ";
            }
        }
        if (arr.length > 0) {
            var i = arr.length - 1;
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + ")";
            }
            else {
                str += arr[i][0].toString();
            }
        }
        return str;
    }
}
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
// MIT License
// Copyright(c) 2017 Sven Ulrich
// https://github.com/iwt-svenulrich/typescript-string-operations
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
class StringFmt {
    static IsNullOrWhiteSpace(value) {
        try {
            if (value == null || value == 'undefined') {
                return true;
            }
            return value.toString().replace(/\s/g, '').length < 1;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    static Join(delimiter, ...args) {
        try {
            let firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = StringFmt.Empty;
                let count = 0;
                for (let i = 0; i < firstArg.length; i++) {
                    let current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    }
                    else {
                        tempString += current;
                    }
                }
                return tempString;
            }
            else if (typeof firstArg === 'object') {
                let tempString = StringFmt.Empty;
                let objectArg = firstArg;
                let keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += objectArg[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }
            let stringArray = args;
            return StringFmt.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
        }
    }
    static Format(format, ...args) {
        try {
            if (format.match(StringFmt.regexNumber)) {
                return StringFmt.format(StringFmt.regexNumber, format, args);
            }
            if (format.match(StringFmt.regexObject)) {
                return StringFmt.format(StringFmt.regexObject, format, args, true);
            }
            return format;
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
        }
    }
    static format(regex, format, args, parseByObject = false) {
        return format.replace(regex, function (match, x) {
            let s = match.split(':');
            if (s.length > 1) {
                x = s[0].replace('{', '');
                match = s[1].replace('}', ''); //U
            }
            let arg;
            if (parseByObject) {
                arg = args[0][x];
            }
            else {
                arg = args[x];
            }
            if (arg == null || arg == undefined || match.match(/{\d+}/)) {
                return arg;
            }
            arg = StringFmt.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : StringFmt.Empty;
        });
    }
    static parsePattern(match, arg) {
        switch (match) {
            case 'L': {
                arg = arg.toLocaleLowerCase();
                return arg;
            }
            case 'U': {
                arg = arg.toLocaleUpperCase();
                return arg;
            }
            case 'd': {
                if (typeof (arg) === 'string') {
                    return StringFmt.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return StringFmt.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            }
            case 'n': { //Tausender Trennzeichen
                if (typeof (arg) !== "string")
                    arg = arg.toString();
                let replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }
                let numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;
                if (numberparts.length > 1) {
                    parts = [StringFmt.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }
                let integer = parts[0];
                var mod = integer.length % 3;
                var output = (mod > 0 ? (integer.substring(0, mod)) : StringFmt.Empty);
                var firstGroup = output;
                var remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + StringFmt.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            }
            case 'x': {
                return this.decimalToHexString(arg);
            }
            case 'X': {
                return this.decimalToHexString(arg, true);
            }
            default: {
                break;
            }
        }
        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !StringFmt.IsNullOrWhiteSpace(arg)) {
            return StringFmt.formatNumber(arg, match);
        }
        return arg;
    }
    static decimalToHexString(value, upperCase = false) {
        const parsed = parseFloat(value);
        const hexNumber = parsed.toString(16);
        return upperCase ? hexNumber.toLocaleUpperCase() : hexNumber;
    }
    static getDisplayDateFromString(input) {
        let splitted;
        splitted = input.split('-');
        if (splitted.length <= 1) {
            return input;
        }
        let day = splitted[splitted.length - 1];
        let month = splitted[splitted.length - 2];
        let year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];
        return `${day}.${month}.${year}`;
    }
    static getSortableDateFromString(input) {
        let splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }
        let times = splitted[splitted.length - 1].split(' ');
        let time = StringFmt.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }
        let year = splitted[splitted.length - 1].split(' ')[0];
        let month = splitted[splitted.length - 2];
        let day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`;
        if (!StringFmt.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += `T${time}`;
        }
        else {
            result += "T00:00:00";
        }
        return result;
    }
    static formatNumber(input, formatTemplate) {
        let count = formatTemplate.length;
        let stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }
        let remainingCount = count - stringValue.length;
        remainingCount += 1; //Array must have an extra entry
        return new Array(remainingCount).join('0') + stringValue;
    }
    static join(delimiter, ...args) {
        let temp = StringFmt.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && StringFmt.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }
            let arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (StringFmt.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }
                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }
        return temp;
    }
}
StringFmt.regexNumber = /{(\d+(:\w*)?)}/g;
StringFmt.regexObject = /{(\w+(:\w*)?)}/g;
StringFmt.Empty = '';
class StringBuilder {
    constructor(value) {
        this.Values = [];
        if (!StringFmt.IsNullOrWhiteSpace(value)) {
            this.Values = new Array(value);
        }
    }
    ToString() {
        return this.Values.join('');
    }
    Append(value) {
        this.Values.push(value);
    }
    AppendLine(value) {
        this.Values.push('\r\n' + value);
    }
    AppendFormat(format, ...args) {
        this.Values.push(StringFmt.Format(format, ...args));
    }
    AppendLineFormat(format, ...args) {
        this.Values.push("\r\n" + StringFmt.Format(format, ...args));
    }
    Clear() {
        this.Values = [];
    }
}
// MIT License
function scrollToFragment(options = {}) {
    unmount();
    getElement = options.getElement || getElementById;
    scrollIntoView = options.scrollIntoView || defaultScrollIntoView;
    mount();
}
function mount() {
    documentObserver = new MutationObserver(handleDomMutation);
    addEventListener("click", handleDocumentClick);
    unlistenHistory = undefined;
    startObserving();
}
function unmount() {
    stopObserving();
    removeEventListener("click", handleDocumentClick);
    if (unlistenHistory)
        unlistenHistory();
    unlistenHistory = undefined;
    documentObserver = undefined;
}
function startObserving() {
    stopObserving();
    if (!getLocation().hash)
        return;
    STOP_EVENTS.forEach(addStopListener);
    documentObserver === null || documentObserver === void 0 ? void 0 : documentObserver.observe(document, OBSERVER_CONFIG);
    adjustScrollPosition();
    observeTimeout = setTimeout(stopObserving, OBSERVE_TIMEOUT_MS);
}
function stopObserving() {
    clearTimeout(observeTimeout);
    cancelAnimationFrame(throttleRequestId);
    documentObserver === null || documentObserver === void 0 ? void 0 : documentObserver.disconnect();
    STOP_EVENTS.forEach(removeStopListener);
}
function addStopListener(eventName) {
    document.addEventListener(eventName, stopObserving);
}
function removeStopListener(eventName) {
    document.removeEventListener(eventName, stopObserving);
}
function handleDocumentClick(event) {
    if (event.defaultPrevented)
        return;
    const anchor = closestAIncludingSelf(event.target);
    if (!anchor || !anchor.hash)
        return;
    if (anchor.pathname === getLocation().pathname)
        throttle(startObserving);
}
function closestAIncludingSelf(element) {
    let target = element;
    while (target && target.nodeName !== "A")
        target = target.parentElement;
    return target;
}
function handleDomMutation() {
    throttle(adjustScrollPosition);
}
function adjustScrollPosition() {
    const hash = getLocation().hash;
    if (!hash)
        return;
    const fragmentId = decodeURIComponent(hash.substring(1));
    const element = getElement.call(null, fragmentId);
    if (element)
        scrollIntoView.call(null, element);
}
function getLocation() {
    return location;
}
function getElementById(id) {
    return document.getElementById(id);
}
function defaultScrollIntoView(element) {
    element.scrollIntoView();
}
function throttle(callback) {
    cancelAnimationFrame(throttleRequestId);
    throttleRequestId = requestAnimationFrame(callback);
}
let getElement;
let scrollIntoView;
let unlistenHistory;
let documentObserver;
let observeTimeout;
let throttleRequestId;
const OBSERVER_CONFIG = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
};
const OBSERVE_TIMEOUT_MS = 10000;
const STOP_EVENTS = ["selectstart", "touchend", "wheel"];
/**
*
* CSVJSON.json2csv(data, options)
*
* Converts JSON to CSV
*
* Available options:
*  - separator: Character which acts as separator. For CSV use a comma (,).
*               For TSV use a tab (\t).
*  - flatten: Boolean indicating whether to flatten nested arrays or not.
*             Optional. Default false.
*  - output_csvjson_variant: Boolean indicating whether to output objects and
*             arrays as is as per the CSVJSON format variant. Default is false.
*
* The MIT License (MIT)
*
* Copyright (c) 2014 Martin Drapeau
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
class JSON2CSV {
    constructor() {
        this.errorMissingSeparator = 'Missing separator option.';
        this.errorEmpty = 'JSON is empty.';
        this.errorEmptyHeader = 'Could not detect header. Ensure first row contains your column headers.';
        this.errorNotAnArray = 'Your JSON must be an array or an object.';
        this.errorItemNotAnObject = 'Item in array is not an object: {0}';
    }
    flattenArray(array, ancestors = []) {
        function combineKeys(a, b) {
            let result = a.slice(0);
            if (!Array.isArray(b))
                return result;
            for (let i = 0; i < b.length; i++)
                if (result.indexOf(b[i]) === -1)
                    result.push(b[i]);
            return result;
        }
        function extend(target, source) {
            target = target || {};
            for (let prop in source) {
                if (typeof source[prop] === 'object') {
                    target[prop] = extend(target[prop], source[prop]);
                }
                else {
                    target[prop] = source[prop];
                }
            }
            return target;
        }
        var rows = [];
        for (let i = 0; i < array.length; i++) {
            let o = array[i];
            let row = {};
            let orows = {};
            let count = 1;
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let value = o[keys[k]], keyChain = combineKeys(ancestors, [keys[k]]), key = keyChain.join('.');
                if (Array.isArray(value)) {
                    orows[key] = this.flattenArray(value, keyChain);
                    count += orows[key].length;
                }
                else {
                    row[key] = value;
                }
            }
            if (count == 1) {
                rows.push(row);
            }
            else {
                let keys = this.getKeys(orows);
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    for (let r = 0; r < orows[key].length; r++) {
                        rows.push(extend(extend({}, row), orows[key][r]));
                    }
                }
            }
        }
        return rows;
    }
    isObject(o) {
        return o && typeof o == 'object';
    }
    getKeys(o) {
        if (!this.isObject(o))
            return [];
        return Object.keys(o);
    }
    convert(data, options) {
        options || (options = {});
        if (!this.isObject(data))
            throw this.errorNotAnArray;
        if (!Array.isArray(data))
            data = [data];
        var separator = options.separator || ',';
        if (!separator)
            throw this.errorMissingSeparator;
        var flatten = options.flatten || false;
        if (flatten)
            data = this.flattenArray(data);
        var allKeys = [];
        var allRows = [];
        for (let i = 0; i < data.length; i++) {
            let o = data[i];
            let row = {};
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let key = keys[k];
                if (allKeys.indexOf(key) === -1)
                    allKeys.push(key);
                let value = o[key];
                if (value === undefined && value === null)
                    continue;
                if (typeof value == 'string') {
                    row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
                    if (options.output_csvjson_variant)
                        row[key] = row[key].replace(/\n/g, '\\n');
                }
                else {
                    row[key] = JSON.stringify(value);
                    if (!options.output_csvjson_variant && (this.isObject(value) || Array.isArray(value)))
                        row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
                }
            }
            allRows.push(row);
        }
        var keyValues = [];
        for (let i = 0; i < allKeys.length; i++) {
            keyValues.push('"' + allKeys[i].replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"');
        }
        var csv = keyValues.join(separator) + '\n';
        for (let r = 0; r < allRows.length; r++) {
            let row = allRows[r];
            let rowArray = [];
            for (let k = 0; k < allKeys.length; k++) {
                let key = allKeys[k];
                rowArray.push(row[key] || (options.output_csvjson_variant ? 'null' : ''));
            }
            csv += rowArray.join(separator) + (r < allRows.length - 1 ? '\n' : '');
        }
        return csv;
    }
}
/// <reference path="../impl/Aircraft.ts" />
/// <reference path="../disp/Tools.ts" />
/// <reference path="../disp/Derived.ts" />
/// <reference path="../lz/lz-string.ts" />
/// <reference path="../string/index.ts" />
/// <reference path="../scroll/scroll.ts" />
/// <reference path="./json2csv.ts" />
const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");
    var jsons = ['/PlaneBuilder/strings.json', '/PlaneBuilder/parts.json', '/PlaneBuilder/engines.json', '/PlaneBuilder/weapons.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(resp => {
        var string_JSON = resp[0];
        parts_JSON = resp[1];
        engine_JSON = resp[2];
        weapon_JSON = resp[3];
        //Strings bit
        local = new Localization(string_JSON);
        if (lang) {
            local.SetLanguages(lang);
        }
        else if (window.localStorage.language) {
            local.SetLanguages(window.localStorage.language);
        }
        //Engine bit
        var nameliststr = window.localStorage.getItem("engines_names");
        var namelist = [];
        if (nameliststr) {
            namelist = JSON.parse(nameliststr);
            for (let n of namelist) {
                n = n.trim();
                n = n.replace(/\s+/g, ' ');
                if (n != "") {
                    engine_list.set(n, new EngineList(n));
                }
            }
        }
        for (let el of engine_JSON["lists"]) {
            if (!engine_list.has(el["name"]))
                engine_list.set(el["name"], new EngineList(el["name"]));
            if (el["name"] != "Custom") {
                engine_list.get(el["name"]).fromJSON(el, true);
                engine_list.get(el["name"]).SetConstant();
            }
            else {
                engine_list.get(el["name"]).fromJSON(el, false);
            }
        }
        InitHTML();
        InitStats();
        LoadFromHangar(0);
    });
};
window.addEventListener("DOMContentLoaded", init);
var engine_list = new Map([["Custom", new EngineList("Custom")]]);
var local;
var acft_builder;
var stats_builder;
var acft_hangar;
var stats_hangar;
var name_builder;
var select_hangar;
var select_acft;
var chosen_hangar;
var list_create;
var list_delete;
var list_input;
var parts_JSON;
var engine_JSON;
var weapon_JSON;
var enable_anim = false;
function InitHTML() {
    chosen_hangar = "Default";
    select_hangar = document.createElement("SELECT");
    select_hangar.onchange = () => {
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
    };
    RefreshHangarSelect(LoadHangarList());
    select_acft = document.createElement("SELECT");
    select_acft.onchange = () => { LoadFromHangar(select_acft.selectedIndex); };
    RefreshAcftSelect(LoadAcftList());
    name_builder = document.createElement("INPUT");
    var load_btn = document.getElementById("btn_load");
    load_btn.onclick = () => {
        acft_builder.fromJSON(JSON.parse(JSON.stringify(acft_hangar.toJSON())));
        acft_builder.CalculateStats();
        stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());
        window.localStorage.aircraft = JSON.stringify(acft_builder.toJSON());
        RefreshDisplay();
        BlinkNeutral(load_btn.parentElement);
    };
    var save_btn = document.getElementById("btn_save");
    save_btn.onclick = () => {
        acft_builder.name = name_builder.value;
        AddToHangar(acft_builder);
        BlinkNeutral(save_btn.parentElement);
    };
    var json_btn = document.getElementById("btn_json");
    json_btn.multiple = false;
    json_btn.accept = "application/JSON";
    json_btn.onchange = (evt) => {
        LoadJSON(json_btn);
        BlinkNeutral(json_btn.parentElement);
    };
    var remove_btn = document.getElementById("btn_remove");
    remove_btn.onclick = () => {
        RemoveFromHangar(acft_hangar.name);
        BlinkNeutral(remove_btn.parentElement);
    };
    var hangar_save = document.getElementById("btn_save_h");
    hangar_save.onclick = () => {
        download(JSON.stringify(LoadAcftList()), chosen_hangar + ".json", "json");
        BlinkNeutral(hangar_save.parentElement);
    };
    var hangar_load = document.getElementById("btn_json_h");
    hangar_load.setAttribute("type", "file");
    hangar_load.multiple = false;
    hangar_load.accept = "application/JSON";
    hangar_load.onchange = (evt) => {
        if (hangar_load.files.length == 0)
            return;
        BlinkNeutral(hangar_load.parentElement);
        var file = hangar_load.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            try {
                var name = file.name.substr(0, file.name.length - 5);
                name = name.trim();
                name = name.replace(/\s+/g, ' ');
                var acft_list;
                acft_list = JSON.parse(reader.result);
                if (acft_list.names.length != acft_list.acft.length) {
                    throw "Bad";
                }
                AddHangar(name);
                window.localStorage.setItem("hangar." + name, reader.result);
                chosen_hangar = name;
                RefreshHangarSelect(LoadHangarList());
                RefreshAcftSelect(LoadAcftList());
            }
            catch {
                BlinkBad(hangar_load.parentElement);
            }
        };
        reader.readAsText(file);
        hangar_load.value = "";
    };
    var list_create = document.getElementById("lbl_create_list");
    var list_input = document.getElementById("btn_create_list");
    list_create.onclick = () => {
        var n = list_input.value;
        n = n.trim();
        n = n.replace(/\s+/g, ' ');
        if (n != "") {
            select_hangar.selectedIndex = AddHangar(n);
            chosen_hangar = n;
            RefreshAcftSelect(LoadAcftList());
            BlinkNeutral(list_create.parentElement);
        }
        list_input.value = "";
    };
    var list_delete = document.getElementById("btn_delete_list");
    list_delete.onclick = () => {
        RemoveHangar(chosen_hangar);
        BlinkNeutral(list_delete.parentElement);
    };
    var to_csv = document.getElementById("btn_to_csv");
    to_csv.onclick = () => {
        var acft_list = LoadAcftList();
        var DerivedStats = [];
        var curr_acft = JSON.stringify(acft_hangar.toJSON());
        for (let acft of acft_list.acft) {
            try {
                var str = LZString.decompressFromEncodedURIComponent(acft);
                var arr = _stringToArrayBuffer(str);
                var des = new Deserialize(arr);
                acft_hangar.deserialize(des);
                acft_hangar.CalculateStats();
            }
            catch (e) {
                console.log("Compressed Query Parameter Failed.");
                console.log(e);
                acft_hangar.Reset();
            }
            let dstats = acft_hangar.GetDerivedStats();
            let entries = Object.entries(dstats);
            entries.splice(0, 0, ["name", acft_hangar.name]);
            let dstatsn = Object.fromEntries(entries);
            DerivedStats.push(dstatsn);
        }
        acft_hangar.fromJSON(JSON.parse(curr_acft));
        var json2csv = new JSON2CSV();
        download(json2csv.convert(DerivedStats, { separator: ',', flatten: true, output_csvjson_variant: false }), chosen_hangar + ".csv", "csv");
    };
}
function InitStats() {
    let acft_data = window.localStorage.aircraft;
    acft_builder = new Aircraft(parts_JSON, weapon_JSON, false);
    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder.fromJSON(JSON.parse(acft_data));
            acft_builder.CalculateStats();
        }
        catch {
            console.log("Saved Data Failed.");
            acft_builder.Reset();
        }
    }
    stats_builder = new Derived_HTML(document.getElementById("table_builder"));
    stats_builder.SetShowBombs(true);
    stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());
    acft_hangar = new Aircraft(parts_JSON, weapon_JSON, false);
    stats_hangar = new Derived_HTML(document.getElementById("table_hangar"));
    stats_hangar.SetShowBombs(true);
}
function LoadHangarList() {
    var hangar_list;
    if (!window.localStorage.getItem("hangar_names")) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
    }
    hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    if (hangar_list.length == 0) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
        hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    }
    return hangar_list;
}
function LoadAcftList() {
    var acft_list;
    if (window.localStorage.getItem("hangar." + chosen_hangar)) {
        acft_list = JSON.parse(window.localStorage.getItem("hangar." + chosen_hangar));
    }
    else {
        acft_list = {
            names: ["Basic Biplane"],
            acft: ["AAEAjGB0DMwLACECGBnAlgYwAQLQBwBskA7AU2AEBLgaAwGhmgUEZpFY+oHQAlACwD2xJFgCyAgC4CATgCMkAVywAtCFgAcABj55gAJGABcYACAaVVuwAQDdpw4B-h8BsAoex8+9BwsZJnySqpgGtq6NGYUAIKQAGaxAAIACQwAkJQA-AABNNm5OfZ2jE6eZhxlAMCeHmXVtdS1NjYeTRxVbKwW1J7tNOld1WmDnCweVBbsA8OsvS7TtnUMs0XzY8AVVLRT1BRde6sHDEA"]
        };
        window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    }
    return acft_list;
}
function LoadFromHangar(idx) {
    var acft_list = LoadAcftList();
    try {
        var str = LZString.decompressFromEncodedURIComponent(acft_list.acft[idx]);
        var arr = _stringToArrayBuffer(str);
        var des = new Deserialize(arr);
        acft_hangar.deserialize(des);
        acft_hangar.CalculateStats();
    }
    catch (e) {
        console.log("Compressed Query Parameter Failed.");
        console.log(e);
        acft_hangar.Reset();
    }
    stats_hangar.UpdateDisplay(acft_hangar, acft_hangar.GetStats(), acft_hangar.GetDerivedStats());
    select_acft.selectedIndex = idx;
    RefreshDisplay();
}
function AddHangar(hangar) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == hangar);
    if (idx == -1) {
        hangar_list.push(hangar);
        idx = hangar_list.length - 1;
        SaveHangarList(hangar_list);
    }
    return idx;
}
function AddToHangar(acft) {
    var s = new Serialize();
    acft.serialize(s);
    var arr = s.FinalArray();
    var str2 = _arrayBufferToString(arr);
    var data = LZString.compressToEncodedURIComponent(str2);
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == acft.name);
    if (idx == -1) {
        acft_list.names.push(acft.name);
        acft_list.acft.push(data);
        idx = acft_list.names.length - 1;
    }
    else {
        acft_list.acft[idx] = data;
    }
    SaveAcftList(acft_list);
    return idx;
}
function RemoveHangar(name) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == name);
    if (idx != -1) {
        hangar_list.splice(idx, 1);
        window.localStorage.removeItem("hangar." + name);
    }
    SaveHangarList(hangar_list);
    chosen_hangar = "Default";
    RefreshHangarSelect(LoadHangarList());
    RefreshAcftSelect(LoadAcftList());
    LoadFromHangar(0);
}
function RemoveFromHangar(name) {
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == name);
    if (idx != -1) {
        acft_list.names.splice(idx, 1);
        acft_list.acft.splice(idx, 1);
    }
    SaveAcftList(acft_list);
    LoadFromHangar(Math.min(acft_list.names.length - 1, idx));
}
function SaveAcftList(acft_list) {
    window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    RefreshAcftSelect(acft_list);
}
function SaveHangarList(hangar_list) {
    window.localStorage.setItem("hangar_names", JSON.stringify(hangar_list));
    RefreshHangarSelect(hangar_list);
}
function RefreshAcftSelect(acft_list) {
    while (select_acft.options.length > 0) {
        select_acft.options.remove(0);
    }
    for (let i = 0; i < acft_list.names.length; i++) {
        let opt = document.createElement("OPTION");
        opt.text = acft_list.names[i];
        select_acft.add(opt);
    }
}
function RefreshHangarSelect(hangar_list) {
    while (select_hangar.options.length > 0) {
        select_hangar.options.remove(0);
    }
    var idx = 0;
    for (let i = 0; i < hangar_list.length; i++) {
        let opt = document.createElement("OPTION");
        opt.text = hangar_list[i];
        select_hangar.add(opt);
        if (hangar_list[i] == chosen_hangar)
            idx = i;
    }
    select_hangar.selectedIndex = idx;
}
function LoadJSON(input) {
    if (input.files.length == 0)
        return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
        try {
            var str = JSON.parse(reader.result);
            var acft = new Aircraft(parts_JSON, weapon_JSON, false);
            if (acft.fromJSON(str)) {
                var idx = AddToHangar(acft);
                LoadFromHangar(idx);
            }
        }
        catch (e) {
            console.error(e, e.stack);
        }
    };
    reader.readAsText(file);
    input.value = "";
}
function RefreshDisplay() {
    var tbl1 = document.getElementById("table_builder");
    var tbl2 = document.getElementById("table_hangar");
    var tbl3 = document.getElementById("table_comp");
    MergeTables(tbl1, tbl2, tbl3);
}
function MergeTables(tbl1, tbl2, tbl3) {
    while (tbl3.children.length) {
        tbl3.children[0].remove();
    }
    console.log(acft_builder.GetStats());
    for (let r = 0; r < tbl1.children.length; r++) {
        var row1 = tbl1.children[r];
        var row2 = tbl2.children[r];
        var row3 = tbl3.insertRow();
        for (let c = 0; c < Math.max(row1.children.length, row2.children.length); c++) {
            if (r == 0 && c == 0) {
                var cell = row3.insertCell();
                cell.colSpan = 2;
                cell.appendChild(name_builder);
                name_builder.value = acft_builder.name;
                var hr = document.createElement("HR");
                hr.className = "dashed";
                cell.appendChild(hr);
                cell.appendChild(select_hangar);
                cell.appendChild(document.createElement("BR"));
                cell.appendChild(select_acft);
                continue;
            }
            var cell1 = row1.children[c];
            var cell2 = row2.children[c];
            if (cell1.nodeName == "TH") {
                row3.appendChild(cell1.cloneNode(true));
            }
            else {
                var clone = cell1.cloneNode(true);
                clone.innerHTML += "<hr class=\"dashed\">" + cell2.innerHTML;
                row3.appendChild(clone);
            }
        }
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class AlterStats extends Part {
    constructor() {
        super();
        var cp_json = JSON.parse(window.localStorage.getItem('CustomParts'));
        if (!cp_json) {
            cp_json = [];
            window.localStorage.setItem('CustomParts', JSON.stringify([]));
        }
        this.custom_parts = [];
        for (let elem of cp_json) {
            this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: 0 });
        }
    }
    toJSON() {
        var plist = [];
        var plist_save = [];
        for (let p of this.custom_parts) {
            plist_save.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
        }
        window.localStorage.setItem('CustomParts', JSON.stringify(plist_save));
        return {
            part_list: plist,
        };
    }
    fromJSON(js, json_version) {
        for (let p of this.custom_parts) {
            p.qty = 0;
        }
        for (let elem of js["part_list"]) {
            var idx = this.custom_parts.findIndex((value) => { return value.name == elem["name"]; });
            if (idx == -1) {
                this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: elem["qty"] });
            }
            else {
                this.custom_parts[idx].qty = elem["qty"];
            }
        }
    }
    serialize(s) {
        var plist = [];
        for (let p of this.custom_parts) {
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats, qty: p.qty });
        }
        s.PushNum(plist.length);
        for (let p of plist) {
            s.PushString(p.name);
            p.stats.serialize(s);
            s.PushNum(p.qty);
        }
    }
    deserialize(d) {
        for (let p of this.custom_parts) {
            p.qty = 0;
        }
        var pcount = d.GetNum();
        for (let i = 0; i < pcount; i++) {
            let name = d.GetString();
            let stats = new Stats();
            stats.deserialize(d);
            let qty = d.GetNum();
            var idx = this.custom_parts.findIndex((value) => { return value.name == name; });
            if (idx == -1) {
                idx = this.custom_parts.length;
                this.custom_parts.push({ name: name, stats: stats, qty: qty });
            }
            else {
                this.custom_parts[idx].qty = qty;
            }
        }
    }
    ClearAll() {
        for (let p of this.custom_parts) {
            p.qty = 0;
        }
    }
    AddPart(name, stats) {
        var sumstats = 0;
        sumstats += Math.abs(stats.drag);
        sumstats += Math.abs(stats.mass);
        sumstats += Math.abs(stats.wetmass);
        sumstats += Math.abs(stats.bomb_mass);
        sumstats += Math.abs(stats.cost);
        sumstats += Math.abs(stats.upkeep);
        sumstats += Math.abs(stats.liftbleed);
        sumstats += Math.abs(stats.wingarea);
        sumstats += Math.abs(stats.control);
        sumstats += Math.abs(stats.pitchstab);
        sumstats += Math.abs(stats.latstab);
        sumstats += Math.abs(stats.maxstrain);
        sumstats += Math.abs(stats.structure);
        sumstats += Math.abs(stats.toughness);
        sumstats += Math.abs(stats.power);
        sumstats += Math.abs(stats.fuelconsumption);
        sumstats += Math.abs(stats.fuel);
        sumstats += Math.abs(stats.charge);
        sumstats += Math.abs(stats.crashsafety);
        sumstats += Math.abs(stats.visibility);
        sumstats += Math.abs(stats.escape);
        sumstats += Math.abs(stats.reliability);
        sumstats += Math.abs(stats.warnings.length);
        if (sumstats == 0) {
            return;
        }
        var idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts[idx].stats = stats;
        }
        else {
            this.custom_parts.push({ name: name, stats: stats, qty: 0 });
        }
        this.custom_parts.sort((a, b) => a.name.localeCompare(b.name));
        this.CalculateStats();
    }
    RemovePart(name) {
        console.log(name);
        console.log(this.custom_parts.length);
        var idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        console.log(idx);
        if (idx != -1) {
            this.custom_parts.splice(idx, 1);
        }
        console.log(this.custom_parts.length);
        this.CalculateStats();
    }
    GetParts() {
        return this.custom_parts;
    }
    SetUsedPart(idx, qty) {
        this.custom_parts[idx].qty = qty;
        this.CalculateStats();
    }
    PartStats() {
        var stats = new Stats();
        for (let part of this.custom_parts) {
            if (part.qty > 0) {
                let pstats = part.stats.Clone();
                pstats = pstats.Multiply(part.qty);
                stats = stats.Add(pstats);
            }
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Tools.ts" />
class Display {
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Accessories.ts" />
class Accessories_HTML extends Display {
    constructor(acc) {
        super();
        this.acc = acc;
        document.getElementById("lbl_accessories").textContent = lu("Accessories Section Title");
        var tbl = document.getElementById("tbl_accessories");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Accessories Climate"));
        CreateTH(row, lu("Accessories Armour Coverage"));
        CreateTH(row, lu("Accessories Visibility"));
        CreateTH(row, lu("Accessories Additional Part Stats"));
        row = insertRow(fragment);
        this.InitClimate(row.insertCell());
        this.InitArmour(row.insertCell());
        this.InitVisibility(row.insertCell());
        this.InitStats(row.insertCell());
        row = insertRow(fragment);
        CreateTH(row, lu("Accessories Information"));
        CreateTH(row, lu("Accessories Electrical"));
        CreateTH(row, lu("Accessories Control"));
        row = insertRow(fragment);
        this.InitInformation(row.insertCell());
        this.InitElectrical(row.insertCell());
        this.InitControl(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitArmour(cell) {
        var fs = CreateFlexSection(cell);
        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        this.a_AP = [];
        var len = this.acc.GetArmourCoverage().length;
        for (let i = 0; i < len; i++)
            this.a_AP.push(document.createElement("INPUT"));
        for (let i = 0; i < len / 2; i++) {
            let AP = i + 1;
            FlexInput("Thickness " + AP.toString(), this.a_AP[i], lfs);
            this.a_AP[i].onchange = () => { this.acc.SetArmourCoverage(i, this.a_AP[i].valueAsNumber); };
            let j = i + len / 2;
            AP = j + 1;
            FlexInput("Thickness " + AP.toString(), this.a_AP[j], rfs);
            this.a_AP[j].onchange = () => { this.acc.SetArmourCoverage(j, this.a_AP[j].valueAsNumber); };
        }
    }
    InitElectrical(cell) {
        var fs = CreateFlexSection(cell);
        this.radio = document.createElement("SELECT");
        FlexSelect(lu("Accessories Radio"), this.radio, fs);
        var rlist = this.acc.GetRadioList();
        for (let i = 0; i < rlist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(rlist[i].name);
            this.radio.add(opt);
        }
        this.radio.onchange = () => { this.acc.SetRadioSel(this.radio.selectedIndex); };
        this.elect = [];
        var elist = this.acc.GetElectricalList();
        for (let i = 0; i < elist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(elist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetElectricalCount(i, inp.valueAsNumber); };
            this.elect.push(inp);
        }
    }
    InitInformation(cell) {
        var fs = CreateFlexSection(cell);
        var rlist = this.acc.GetReconList();
        this.recon = [];
        for (let i = 0; i < rlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(rlist[i].name), inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.acc.SetReconSel(i, inp.valueAsNumber); };
            this.recon.push(inp);
        }
    }
    InitVisibility(cell) {
        var fs = CreateFlexSection(cell);
        var vlist = this.acc.GetVisibilityList();
        this.visi = [];
        for (let i = 0; i < vlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(lu(vlist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetVisibilitySel(i, inp.checked); };
            this.visi.push(inp);
        }
    }
    InitClimate(cell) {
        var fs = CreateFlexSection(cell);
        var clist = this.acc.GetClimateList();
        this.clim = [];
        for (let i = 0; i < clist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(lu(clist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetClimateSel(i, inp.checked); };
            this.clim.push(inp);
        }
    }
    InitControl(cell) {
        var fs = CreateFlexSection(cell);
        this.auto = document.createElement("SELECT");
        var alist = this.acc.GetAutopilotList();
        FlexSelect(lu("Accessories Autopilot"), this.auto, fs);
        for (let i = 0; i < alist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(alist[i].name);
            this.auto.add(opt);
        }
        this.auto.onchange = () => { this.acc.SetAutopilotSel(this.auto.selectedIndex); };
        var clist = this.acc.GetControlList();
        this.cont = document.createElement("SELECT");
        FlexSelect(lu("Accessories Control Aids"), this.cont, fs);
        for (let i = 0; i < clist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(clist[i].name);
            this.cont.add(opt);
        }
        this.cont.onchange = () => { this.acc.SetControlSel(this.cont.selectedIndex); };
    }
    InitStats(stat_cell) {
        stat_cell.rowSpan = 3;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Charge"));
        CreateTH(h2_row, lu("Stat Lift Bleed"));
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_chgh = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Visibility"));
        CreateTH(h3_row, lu("Stat Flight Stress"));
        CreateTH(h3_row, lu("Stat Required Sections"));
        var c3_row = tbl_stat.insertRow();
        this.d_visi = c3_row.insertCell();
        this.d_strs = c3_row.insertCell();
        this.d_rsec = c3_row.insertCell();
    }
    UpdateDisplay() {
        var AP = this.acc.GetArmourCoverage();
        for (let i = 0; i < AP.length; i++) {
            this.a_AP[i].valueAsNumber = AP[i];
        }
        this.radio.selectedIndex = this.acc.GetRadioSel();
        var elist = this.acc.GetElectricalCount();
        for (let i = 0; i < elist.length; i++) {
            this.elect[i].valueAsNumber = elist[i];
        }
        var rlist = this.acc.GetReconSel();
        for (let i = 0; i < rlist.length; i++) {
            this.recon[i].valueAsNumber = rlist[i];
        }
        var vlist = this.acc.GetVisibilitySel();
        for (let i = 0; i < vlist.length; i++) {
            this.visi[i].checked = vlist[i];
        }
        var clist = this.acc.GetClimateSel();
        var cenab = this.acc.GetClimateEnable();
        for (let i = 0; i < vlist.length; i++) {
            this.clim[i].checked = clist[i];
            this.clim[i].disabled = !cenab[i];
        }
        this.auto.selectedIndex = this.acc.GetAutopilotSel();
        this.cont.selectedIndex = this.acc.GetControlSel();
        var stats = this.acc.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_chgh, stats.charge.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_strs, stats.flightstress.toString(), false);
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Era.ts" />
class Era_HTML extends Display {
    constructor(m) {
        super();
        this.model = m;
        document.getElementById("lbl_era").textContent = lu("Era Section Title");
        var tbl = document.getElementById("table_era");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Era Option"));
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Pitch Stability"));
        row = insertRow(fragment);
        var selcell = row.insertCell();
        //Get used elements
        this.select = document.createElement("SELECT");
        selcell.append(this.select);
        this.bleed = row.insertCell();
        this.cost = row.insertCell();
        this.pstab = row.insertCell();
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.select.add(opt);
        }
        tbl.appendChild(fragment);
    }
    UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        var stats = this.model.PartStats();
        BlinkIfChanged(this.bleed, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.cost, stats.cost.toString(), false);
        BlinkIfChanged(this.pstab, stats.pitchstab.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Cockpit.ts" />
class Cockpit_HTML extends Display {
    constructor(r, cp) {
        super();
        this.row = r;
        this.cockpit = cp;
        this.upg_chbxs = [];
        this.sft_chbxs = [];
        this.gun_chbxs = [];
        var fragment = document.createDocumentFragment();
        var option = insertCell(fragment);
        var upgrades = insertCell(fragment);
        var safety = insertCell(fragment);
        var gunsights = insertCell(fragment);
        var stat_cell = insertCell(fragment);
        var tbl = document.createElement("TABLE");
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, "");
        var c2_row = tbl.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_rseq = c2_row.insertCell();
        c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, lu("Stat Flight Stress"));
        CreateTH(h3_row, lu("Stat Escape"));
        CreateTH(h3_row, lu("Stat Visibility"));
        var c3_row = tbl.insertRow();
        this.d_strs = c3_row.insertCell();
        this.d_escp = c3_row.insertCell();
        this.d_visi = c3_row.insertCell();
        stat_cell.appendChild(tbl);
        stat_cell.className = "inner_table";
        tbl.className = "inner_table";
        this.sel_type = document.createElement("SELECT");
        // Visibility and Stress and Escape are cockpit local
        // Mark in table for CSS
        this.d_strs.className = "part_local";
        this.d_visi.className = "part_local";
        this.d_escp.className = "part_local";
        //Add all the cockpit types to the select box
        for (let elem of cp.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);
        var fs = CreateFlexSection(upgrades);
        //Add all the upgrades as checkboxes
        var upglst = cp.GetUpgradeList();
        var can = cp.CanUpgrades();
        for (let i = 0; i < upglst.length; i++) {
            let upg = document.createElement("INPUT");
            if (can[i]) {
                FlexCheckbox(lu(upglst[i].name), upg, fs);
                upg.onchange = () => { this.cockpit.SetUpgrade(i, upg.checked); };
            }
            this.upg_chbxs.push(upg);
        }
        var fs = CreateFlexSection(safety);
        //Add all the safties as checkboxes
        var sft_index = 0;
        for (let elem of cp.GetSafetyList()) {
            let sft = document.createElement("INPUT");
            FlexCheckbox(lu(elem.name), sft, fs);
            let local_index = sft_index;
            sft_index += 1;
            sft.onchange = () => { this.cockpit.SetSafety(local_index, sft.checked); };
            this.sft_chbxs.push(sft);
        }
        var fs = CreateFlexSection(gunsights);
        //Add all the safties as checkboxes
        var gun_index = 0;
        for (let elem of cp.GetGunsightList()) {
            let gun = document.createElement("INPUT");
            FlexCheckbox(lu(elem.name), gun, fs);
            let local_index = gun_index;
            gun_index += 1;
            gun.onchange = () => { this.cockpit.SetGunsight(local_index, gun.checked); };
            this.gun_chbxs.push(gun);
        }
        this.bombsight = document.createElement("INPUT");
        FlexInput(lu("Cockpit Bombsight"), this.bombsight, fs);
        this.bombsight.onchange = () => { this.cockpit.SetBombsightQuality(this.bombsight.valueAsNumber); };
        this.bombsight.min = "0";
        this.bombsight.max = "301";
        this.bombsight.step = "1";
        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };
        this.row.appendChild(fragment);
    }
    UpdateCockpit(cp) {
        this.cockpit = cp;
    }
    UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_rseq, stats.reqsections.toString(), false);
        var fs = this.cockpit.GetFlightStress();
        if (fs[0] != fs[1]) {
            BlinkIfChanged(this.d_strs, StringFmt.Format("{0}", fs[0]));
        }
        else {
            BlinkIfChanged(this.d_strs, StringFmt.Format("{0}", fs[0]));
        }
        BlinkIfChanged(this.d_escp, this.cockpit.GetEscape().toString(), true);
        BlinkIfChanged(this.d_visi, this.cockpit.GetVisibility().toString(), true);
        this.sel_type.selectedIndex = this.cockpit.GetType();
        var upgs = this.cockpit.GetSelectedUpgrades();
        for (let i = 0; i < this.upg_chbxs.length; i++) {
            this.upg_chbxs[i].checked = upgs[i];
        }
        var sfty = this.cockpit.GetSelectedSafety();
        let can = this.cockpit.CanSafety();
        for (let i = 0; i < this.sft_chbxs.length; i++) {
            this.sft_chbxs[i].checked = sfty[i];
            this.sft_chbxs[i].disabled = !can[i];
        }
        var guns = this.cockpit.GetSelectedGunsights();
        for (let i = 0; i < this.gun_chbxs.length; i++) {
            this.gun_chbxs[i].checked = guns[i];
        }
        this.bombsight.valueAsNumber = this.cockpit.GetBombsightQuality();
    }
}
/// <reference path="./Display.ts" />
/// <reference path="./Cockpit.ts" />
/// <reference path="../impl/Cockpits.ts" />
class Cockpits_HTML extends Display {
    constructor(cockpits) {
        super();
        this.cockpits = cockpits;
        document.getElementById("lbl_cockpits").textContent = lu("Cockpit Section Title");
        document.getElementById("lbl_num_cockpits").textContent = lu("Cockpit Num Cockpits");
        this.tbl = document.getElementById("table_cockpit");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Cockpit Option"));
        CreateTH(row, lu("Cockpit Upgrade"));
        CreateTH(row, lu("Cockpit Safety Options"));
        CreateTH(row, lu("Cockpit Gunsights"));
        CreateTH(row, lu("Cockpit Cockpit Stats"));
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.counter.onchange = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
        this.tbl.appendChild(fragment);
    }
    CounterChange() {
        while (this.positions.length > this.counter.valueAsNumber) {
            this.RemoveCockpit();
        }
        while (this.positions.length < this.counter.valueAsNumber) {
            this.AddCockpit(this.positions.length);
        }
    }
    AddCockpit(num) {
        var row = this.tbl.insertRow();
        var cp = new Cockpit_HTML(row, this.cockpits.GetCockpit(num));
        this.positions.push(cp);
    }
    RemoveCockpit() {
        this.positions.pop();
        this.tbl.deleteRow(this.tbl.rows.length - 1);
    }
    UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let i = 0; i < this.positions.length; i++) {
            let pos = this.positions[i];
            pos.UpdateCockpit(this.cockpits.GetCockpit(i));
            pos.UpdateDisplay();
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Passengers.ts" />
class Passengers_HTML extends Display {
    constructor(pass) {
        super();
        this.pass = pass;
        document.getElementById("lbl_passengers").textContent = lu("Passengers Section Title");
        var tbl = document.getElementById("table_passengers");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Passengers Number of Seats"));
        CreateTH(row, lu("Passengers Number of Beds"));
        CreateTH(row, lu("Passengers Upgrade"));
        CreateTH(row, lu("Stat Mass"));
        CreateTH(row, lu("Stat Required Sections"));
        // < tr >
        // <td><input type="number" id = "num_seats" min = "0" value = "0" /> </td>
        // < td > <input type="number" id = "num_beds" min = "0" value = "0" /> </td>
        // < td id = "passenger_upg" > </td>
        // < td id = "passenger_mass" > </td>
        // < td id = "passenger_req_seq" > </td>
        // < /tr>
        row = insertRow(fragment);
        this.nseats = document.createElement("INPUT");
        this.nseats.type = "number";
        this.nseats.min = "0";
        row.insertCell().append(this.nseats);
        this.nbeds = document.createElement("INPUT");
        this.nbeds.type = "number";
        this.nbeds.min = "0";
        row.insertCell().append(this.nbeds);
        var upg_cell = row.insertCell();
        this.connect = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox(lu("Passengers Connectivity"), this.connect, fs);
        this.mass = row.insertCell();
        this.reqseq = row.insertCell();
        this.connect.disabled = true;
        this.nseats.onchange = () => {
            this.pass.SetSeats(this.nseats.valueAsNumber);
        };
        this.nbeds.onchange = () => {
            this.pass.SetBeds(this.nbeds.valueAsNumber);
        };
        this.connect.onchange = () => {
            this.pass.SetConnected(this.connect.checked);
        };
        tbl.appendChild(fragment);
    }
    UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString(), false);
        BlinkIfChanged(this.reqseq, stats.reqsections.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Engine.ts" />
class Engine_HTML extends Display {
    constructor(eng, r) {
        super();
        this.engine = eng;
        var row = r;
        this.InitTypeSelect(row);
        var option_cell = row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE");
        opt_table.className = "inner_table";
        CreateTH(opt_table.insertRow(), lu("Engine Cooling"));
        this.cool_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), lu("Engine Mounting"));
        var mount_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), lu("Engine Upgrades"));
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);
        var option2_cell = row.insertCell();
        option2_cell.className = "inner_table";
        var opt2_table = document.createElement("TABLE");
        opt2_table.className = "inner_table";
        CreateTH(opt2_table.insertRow(), lu("Engine Cowls"));
        var cowl_cell = opt2_table.insertRow().insertCell();
        option2_cell.appendChild(opt2_table);
        CreateTH(opt2_table.insertRow(), lu("Engine Electrical"));
        var elec_cell = opt2_table.insertRow().insertCell();
        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitCowlSelect(cowl_cell);
        this.InitElectricSelect(elec_cell);
        this.InitStatDisplay(row);
        this.intake_fan = document.createElement("INPUT");
        this.intake_fan.onchange = () => { this.engine.SetIntakeFan(this.intake_fan.checked); };
    }
    InitTypeSelect(row) {
        this.e_pwr = document.createElement("LABEL");
        this.e_mass = document.createElement("LABEL");
        this.e_drag = document.createElement("LABEL");
        this.e_rely = document.createElement("LABEL");
        this.e_cool = document.createElement("LABEL");
        this.e_over = document.createElement("LABEL");
        this.e_fuel = document.createElement("LABEL");
        this.e_alti = document.createElement("LABEL");
        this.e_torq = document.createElement("LABEL");
        this.e_rumb = document.createElement("LABEL");
        this.e_cost = document.createElement("LABEL");
        this.cool_count = document.createElement("INPUT");
        this.cool_count.setAttribute("type", "number");
        var tcell = row.insertCell(0);
        //Set up the engine list select box.
        this.e_list_select = document.createElement("SELECT");
        this.e_list_select.required = true;
        tcell.appendChild(this.e_list_select);
        tcell.appendChild(document.createElement("BR"));
        for (let key of engine_list.keys()) {
            let opt = document.createElement("OPTION");
            opt.text = key;
            this.e_list_select.add(opt);
        }
        //Set up the engine select box.
        this.e_select = document.createElement("SELECT");
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        for (let i = 0; i < engine_list.get("Custom").length; i++) {
            let eng = engine_list.get("Custom").get(i);
            let opt = document.createElement("OPTION");
            opt.text = eng.name;
            this.e_select.add(opt);
        }
        var fs = CreateFlexSection(tcell);
        //Set up the individual stat input boxes
        FlexDisplay(lu("Stat Power"), this.e_pwr, fs);
        FlexDisplay(lu("Stat Mass"), this.e_mass, fs);
        FlexDisplay(lu("Stat Drag"), this.e_drag, fs);
        FlexDisplay(lu("Stat Reliability"), this.e_rely, fs);
        FlexDisplay(lu("Stat Cooling"), this.e_cool, fs);
        FlexDisplay(lu("Stat Overspeed"), this.e_over, fs);
        FlexDisplay(lu("Stat Fuel Consumption"), this.e_fuel, fs);
        FlexDisplay(lu("Stat Altitude"), this.e_alti, fs);
        FlexDisplay(lu("Stat Torque"), this.e_torq, fs);
        FlexDisplay(lu("Stat Rumble"), this.e_rumb, fs);
        FlexDisplay(lu("Stat Cost"), this.e_cost, fs);
        //Event Listeners for engine stats
        this.e_list_select.onchange = () => {
            this.engine.SetSelectedList(this.e_list_select.options[this.e_list_select.selectedIndex].text);
        };
        this.e_select.onchange = () => {
            this.engine.SetSelectedIndex(this.e_select.selectedIndex);
        };
    }
    UpdateEngine(en) {
        this.engine = en;
    }
    InitMountSelect(mount_cell) {
        var txtSpan = document.createElement("SPAN");
        txtSpan.textContent = lu("Engine Mounting Location");
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.mount_select.add(opt);
        }
        this.mount_select.required = true;
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.mount_select.onchange = () => { this.engine.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        mount_cell.appendChild(document.createElement("BR"));
        this.pushpull_input = document.createElement("INPUT");
        this.torque_input = document.createElement("INPUT");
        var fs = CreateFlexSection(mount_cell);
        FlexCheckbox(" " + lu("Engine Push Pull"), this.pushpull_input, fs);
        FlexCheckbox(" " + lu("Engine Torque To Structure"), this.torque_input, fs);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }
    InitUpgradeSelect(upg_cell) {
        this.ds_input = document.createElement("INPUT");
        this.op_input = document.createElement("INPUT");
        this.gp_input = document.createElement("INPUT");
        this.gpr_input = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox(lu("Engine Extended Driveshafts"), this.ds_input, fs);
        FlexCheckbox(lu("Engine Outboard Propeller"), this.op_input, fs);
        FlexInput(lu("Engine Geared Propeller"), this.gp_input, fs);
        FlexInput(lu("Engine Negate Reliability Penalty"), this.gpr_input, fs);
        this.gp_input.onchange = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.onchange = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
        this.op_input.onchange = () => { this.engine.SetOutboardProp(this.op_input.checked); };
    }
    InitElectricSelect(cell) {
        var fs = CreateFlexSection(cell);
        this.alternator_input = document.createElement("INPUT");
        this.generator_input = document.createElement("INPUT");
        FlexCheckbox(lu("Engine Alternator"), this.alternator_input, fs);
        FlexCheckbox(lu("Engine Generator"), this.generator_input, fs);
        this.alternator_input.onchange = () => { this.engine.SetAlternator(this.alternator_input.checked); };
        this.generator_input.onchange = () => { this.engine.SetGenerator(this.generator_input.checked); };
    }
    InitStatDisplay(row) {
        var stat_cell = row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Power"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Reliability"));
        CreateTH(h2_row, lu("Stat Visibility"));
        CreateTH(h2_row, lu("Stat Overspeed"));
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Cost"));
        CreateTH(h3_row, lu("Stat Altitude"));
        CreateTH(h3_row, lu("Stat Fuel Consumption"));
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, lu("Stat Pitch Stability"));
        CreateTH(h4_row, lu("Stat Lateral Stability"));
        CreateTH(h4_row, lu("Stat Raw Strain"));
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, lu("Stat Structure"));
        CreateTH(h5_row, lu("Stat Flight Stress"));
        CreateTH(h5_row, lu("Stat Required Sections"));
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
        var h6_row = tbl_stat.insertRow();
        CreateTH(h6_row, lu("Stat Charge"));
        CreateTH(h6_row, "");
        CreateTH(h6_row, "");
        var c6_row = tbl_stat.insertRow();
        this.d_chrg = c6_row.insertCell();
        c6_row.insertCell();
        c6_row.insertCell();
    }
    InitCowlSelect(cell) {
        this.cowl_select = document.createElement("SELECT");
        for (let elem of this.engine.GetCowlList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.cowl_select.add(opt);
        }
        this.cowl_select.required = true;
        this.cowl_select.selectedIndex = this.engine.GetMountIndex();
        this.cowl_select.onchange = () => { this.engine.SetCowl(this.cowl_select.selectedIndex); };
        cell.appendChild(this.cowl_select);
    }
    InitCoolingSelect() {
        while (this.cool_cell.children.length > 0)
            this.cool_cell.removeChild(this.cool_cell.children[0]);
        if (this.engine.IsRotary()) {
            this.e_cool.textContent = "0";
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerText = lu("Engine Rotary Cooling");
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.textContent == "0") {
            var txtSpan = document.createElement("SPAN");
            txtSpan.textContent = lu("Engine Air-Cooled Engine.");
            this.cool_cell.appendChild(txtSpan);
            var fs = CreateFlexSection(this.cool_cell);
            FlexCheckbox(lu("Engine Air Cooling Fan"), this.intake_fan, fs);
            this.intake_fan.disabled = !this.engine.CanIntakeFan();
        }
        else {
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT");
                this.cool_select.required = true;
            }
            var fs = CreateFlexSection(this.cool_cell);
            FlexSelect(lu("Engine Select Radiator"), this.cool_select, fs);
            FlexInput(lu("Engine Cooling Amount"), this.cool_count, fs);
            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(0);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION");
                opt.textContent = lu("Vital Part Radiator", i);
                this.cool_select.add(opt);
            }
            this.cool_select.onchange = () => {
                this.engine.SetRadiator(this.cool_select.selectedIndex);
            };
            this.cool_select.selectedIndex = this.engine.GetRadiator();
            this.cool_count.min = "0";
            this.cool_count.max = this.engine.GetMaxCooling().toString();
            this.cool_count.valueAsNumber = this.engine.GetCooling();
            this.cool_count.onchange = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
        }
    }
    UpdateDisplay() {
        while (this.e_list_select.options.length > 0) {
            this.e_list_select.options.remove(0);
        }
        while (this.e_select.options.length > 0) {
            this.e_select.options.remove(0);
        }
        var list_idx = this.engine.GetSelectedList();
        if (list_idx != "") {
            var found_list = false;
            var sel_list = 0;
            for (let key of engine_list.keys()) {
                let opt = document.createElement("OPTION");
                opt.text = key;
                this.e_list_select.add(opt);
                if (key != list_idx && !found_list) {
                    sel_list -= 1;
                }
                else {
                    sel_list = Math.abs(sel_list);
                    found_list = true;
                }
            }
            this.e_list_select.selectedIndex = sel_list;
            var can_idx = this.engine.CanSelectIndex();
            for (let i = 0; i < engine_list.get(list_idx).length; i++) {
                let eng = engine_list.get(list_idx).get(i);
                let opt = document.createElement("OPTION");
                opt.text = eng.name;
                opt.disabled = !can_idx[i];
                this.e_select.add(opt);
            }
            this.e_select.selectedIndex = this.engine.GetSelectedIndex();
        }
        else {
            for (let key of engine_list.keys()) {
                let opt = document.createElement("OPTION");
                opt.text = key;
                this.e_list_select.add(opt);
            }
            this.e_list_select.selectedIndex = -1;
            let eng = this.engine.GetCurrentStats();
            let opt = document.createElement("OPTION");
            opt.text = eng.name;
            this.e_select.add(opt);
            this.e_select.selectedIndex = 0;
        }
        var e_stats = this.engine.GetCurrentStats();
        var b = this.engine.GetMinIAF();
        var t = b + e_stats.altitude;
        this.e_pwr.textContent = e_stats.stats.power.toString();
        this.e_mass.textContent = e_stats.stats.mass.toString();
        this.e_drag.textContent = e_stats.stats.drag.toString();
        this.e_rely.textContent = e_stats.stats.reliability.toString();
        this.e_cool.textContent = e_stats.stats.cooling.toString();
        this.e_over.textContent = e_stats.overspeed.toString();
        this.e_fuel.textContent = e_stats.stats.fuelconsumption.toString();
        this.e_alti.textContent = b.toString() + "-" + t.toString();
        this.e_torq.textContent = e_stats.torque.toString();
        this.e_rumb.textContent = e_stats.rumble.toString();
        this.e_cost.textContent = e_stats.stats.cost.toString();
        this.InitCoolingSelect();
        this.intake_fan.checked = this.engine.GetIntakeFan();
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.disabled = !this.engine.CanUsePushPull();
        this.torque_input.checked = this.engine.GetTorqueToStruct();
        this.torque_input.checked = this.engine.GetTorqueToStruct();
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
        this.ds_input.disabled = !this.engine.CanUseExtendedDriveshaft();
        this.op_input.checked = this.engine.GetOutboardProp();
        this.op_input.disabled = !this.engine.CanOutboardProp();
        this.gp_input.valueAsNumber = this.engine.GetGearCount();
        this.gp_input.disabled = !this.engine.CanUseGears();
        this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
        this.gpr_input.disabled = !this.engine.CanUseGears();
        if (e_stats.pulsejet) {
            this.mount_select.disabled = true;
            this.mount_select.selectedIndex = -1;
            for (let i = 0; i < this.mount_select.options.length; i++) {
                if (this.mount_select.options[i].value == "fuselage") {
                    this.mount_select.options[i].disabled = true;
                }
            }
            this.cowl_select.disabled = true;
            this.alternator_input.disabled = true;
            this.generator_input.disabled = true;
        }
        else {
            this.mount_select.disabled = false;
            var can_mount = this.engine.CanMountIndex();
            for (let i = 0; i < this.mount_select.options.length; i++) {
                this.mount_select.options[i].disabled = !can_mount[i];
            }
            this.cowl_select.disabled = false;
            this.alternator_input.disabled = false;
            this.generator_input.disabled = false;
        }
        this.cowl_select.selectedIndex = this.engine.GetCowl();
        var cowl_enable = this.engine.GetCowlEnabled();
        for (let i = 0; i < cowl_enable.length; i++) {
            this.cowl_select.options[i].disabled = !cowl_enable[i];
        }
        this.generator_input.checked = this.engine.GetGenerator();
        this.generator_input.disabled = !this.engine.GetGeneratorEnabled();
        this.alternator_input.checked = this.engine.GetAlternator();
        this.alternator_input.disabled = !this.engine.GetAlternatorEnabled();
        var full_stats = this.engine.PartStats();
        BlinkIfChanged(this.d_powr, full_stats.power.toString(), true);
        BlinkIfChanged(this.d_mass, full_stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, full_stats.drag.toString(), false);
        BlinkIfChanged(this.d_rely, this.engine.GetReliability().toString(), true);
        BlinkIfChanged(this.d_visi, full_stats.visibility.toString(), true);
        BlinkIfChanged(this.d_over, this.engine.GetOverspeed().toString(), true);
        BlinkIfChanged(this.d_cost, full_stats.cost.toString(), false);
        BlinkIfChanged(this.d_alti, b.toString() + "-" + t.toString());
        BlinkIfChanged(this.d_fuel, full_stats.fuelconsumption.toString(), false);
        BlinkIfChanged(this.d_pstb, full_stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, full_stats.latstab.toString(), true);
        BlinkIfChanged(this.d_maxs, full_stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_strc, full_stats.structure.toString(), true);
        BlinkIfChanged(this.d_fstr, full_stats.flightstress.toString(), false);
        BlinkIfChanged(this.d_sect, full_stats.reqsections.toString(), false);
        BlinkIfChanged(this.d_chrg, full_stats.charge.toString(), true);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Radiator.ts" />
class Radiator_HTML extends Display {
    constructor(row, rad) {
        super();
        this.radiator = rad;
        var type_cell = row.insertCell();
        //Radiator Type
        this.type_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);
        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        var cool_cell = row.insertCell();
        //Special Coolant
        this.coolant_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex); };
        cool_cell.appendChild(this.coolant_select);
        cool_cell.appendChild(document.createElement("BR"));
        this.harden_input = document.createElement("INPUT");
        var fs = CreateFlexSection(cool_cell);
        FlexCheckbox(lu("Radiators Harden Radiator"), this.harden_input, fs);
        this.harden_input.onchange = () => { this.radiator.SetHarden(this.harden_input.checked); };
        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE");
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Reliability"));
        CreateTH(h1_row, lu("Stat Lateral Stability"));
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }
    UpdateRadiator(rad) {
        this.radiator = rad;
    }
    UpdateDisplay() {
        var tcan = this.radiator.CanType();
        for (let i = 0; i < tcan.length; i++) {
            this.type_select.options[i].disabled = !tcan[i];
        }
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        var mcan = this.radiator.CanMount();
        for (let i = 0; i < mcan.length; i++) {
            this.mount_select.options[i].disabled = !mcan[i];
        }
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        this.harden_input.checked = this.radiator.GetHarden();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.c_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.c_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.c_rely, stats.reliability.toString(), true);
        BlinkIfChanged(this.c_lstb, stats.latstab.toString(), true);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="./Engine.ts" />
/// <reference path="./Radiator.ts" />
/// <reference path="../impl/Engines.ts" />
class Engines_HTML extends Display {
    constructor(eng) {
        super();
        this.eng = eng;
        this.engines = [];
        this.radiators = [];
        document.getElementById("lbl_engines").textContent = lu("Engines Section Title");
        this.tbl = document.getElementById("table_engine");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Engines Engine Type"));
        CreateTH(row, lu("Engines Options"));
        CreateTH(row, lu("Engines Options 2"));
        CreateTH(row, lu("Engines Engine Stats"));
        this.tbl.appendChild(fragment);
        fragment = document.createDocumentFragment();
        this.tblR = document.getElementById("table_radiator");
        row = insertRow(fragment);
        CreateTH(row, lu("Radiators Radiator Type"));
        CreateTH(row, lu("Radiators Mounting"));
        CreateTH(row, lu("Radiators Coolant"));
        CreateTH(row, lu("Radiators Radiator Stats"));
        this.tblR.appendChild(fragment);
        document.getElementById("lbl_num_engines").textContent = lu("Engines Num Engines");
        this.num_engines = document.getElementById("num_engines");
        this.num_engines.onchange = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfItems();
        document.getElementById("lbl_num_radiators").textContent = lu("Engines Num Radiators");
        this.num_radiators = document.getElementById("num_radiators");
        this.num_radiators.onchange = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();
        document.getElementById("lbl_asymmetric").textContent = lu("Engines Asymmetric Plane");
        this.is_asymmetric = document.getElementById("asymmetric");
        this.is_asymmetric.onchange = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }
    UpdateDisplay() {
        var num = this.eng.GetNumberOfItems();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        var fragment = document.createDocumentFragment();
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, insertRow(fragment));
            this.engines.push(en);
        }
        this.tbl.appendChild(fragment);
        for (let i = 0; i < num; i++) {
            this.engines[i].UpdateEngine(this.eng.GetEngine(i));
        }
        var rad = this.eng.GetNumberOfRadiators();
        this.num_radiators.valueAsNumber = rad;
        if (rad == 0) {
            this.tblR.style.display = "none";
            this.num_radiators.disabled = true;
        }
        else {
            this.tblR.style.display = "";
            this.num_radiators.disabled = false;
        }
        while (this.radiators.length > rad) {
            this.radiators.pop();
            this.tblR.deleteRow(this.radiators.length + 1);
        }
        fragment = document.createDocumentFragment();
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(insertRow(fragment), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }
        this.tblR.appendChild(fragment);
        for (let i = 0; i < rad; i++) {
            this.radiators[i].UpdateRadiator(this.eng.GetRadiator(i));
        }
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
        for (let elem of this.engines) {
            elem.UpdateDisplay();
        }
        for (let elem of this.radiators) {
            elem.UpdateDisplay();
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Propeller.ts" />
class Propeller_HTML extends Display {
    constructor(prop) {
        super();
        this.prop = prop;
        document.getElementById("lbl_propeller").textContent = lu("Propeller Section Title");
        document.getElementById("lbl_propeller_pitch").textContent = lu("Propeller Propeller Pitch");
        this.select_prop = document.getElementById("propeller_pitch");
        for (let elem of prop.GetPropList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.select_prop.add(opt);
        }
        this.select_prop.onchange = () => { this.prop.SetPropIndex(this.select_prop.selectedIndex); };
        document.getElementById("lbl_propeller_upgrade").textContent = lu("Propeller Propeller Upgrades:");
        this.select_upgrade = document.getElementById("propeller_upgrade");
        for (let elem of prop.GetUpgradeList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.select_upgrade.add(opt);
        }
        this.select_upgrade.onchange = () => { this.prop.SetUpgradeIndex(this.select_upgrade.selectedIndex); };
    }
    UpdateDisplay() {
        this.select_upgrade.selectedIndex = this.prop.GetUpgradeIndex();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();
        if (this.prop.GetNumPropellers() == 0) {
            this.select_upgrade.disabled = true;
            this.select_prop.disabled = true;
            this.select_prop.selectedIndex = -1;
        }
        else {
            this.select_prop.disabled = false;
            this.select_upgrade.disabled = false;
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Frames.ts" />
class Frames_HTML extends Display {
    constructor(frames) {
        super();
        this.c_sec = [];
        this.t_sec = [];
        this.frames = frames;
        //Translate Section title
        document.getElementById("lbl_frames").textContent = lu("Frames Frames and Covering");
        var table = document.getElementById("table_frames");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        this.all_frame = document.createElement("SELECT");
        this.all_skin = document.createElement("SELECT");
        CreateTH(row, lu("Frames Frame Type")).append(document.createElement("BR"), this.all_frame);
        CreateTH(row, lu("Frames Skin Type")).append(document.createElement("BR"), this.all_skin);
        CreateTH(row, lu("Frames Frame Options"));
        CreateTH(row, lu("Frames Frame Stats"));
        row = insertRow(fragment);
        this.c_frame = row.insertCell();
        this.c_skin = row.insertCell();
        this.c_options = row.insertCell();
        this.c_stats = row.insertCell();
        this.c_stats.className = "inner_table";
        this.c_stats.rowSpan = 0;
        var tbl = document.createElement("TABLE");
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Toughness"));
        CreateTH(h2_row, lu("Stat Visibility"));
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, lu("Stat Wing Area"));
        CreateTH(h3_row, lu("Derived Is Flammable Question"));
        CreateTH(h3_row, lu("Stat Pitch Stability"));
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pstb = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        CreateTH(h4_row, lu("Stat Raw Strain"));
        CreateTH(h4_row, lu("Stat Lift Bleed"));
        CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strn = c4_row.insertCell();
        this.d_lift = c4_row.insertCell();
        c4_row.insertCell();
        this.c_stats.appendChild(tbl);
        var row3 = insertRow(fragment);
        CreateTH(row3, lu("Frames Tail Frame Type"));
        CreateTH(row3, lu("Frames Tail Skin Type"));
        CreateTH(row3, lu("Frames Tail Frame Options"));
        var row4 = insertRow(fragment);
        this.t_frame = row4.insertCell();
        this.t_skin = row4.insertCell();
        this.t_options = row4.insertCell();
        document.getElementById("lbl_tail").textContent = lu("Frames Tail Section Title");
        document.getElementById("lbl_tail_type").textContent = lu("Frames Tail Type");
        this.t_select = document.getElementById("tail_type");
        document.getElementById("lbl_tail_farman").textContent = lu("Frames Tail Farman");
        this.t_farman = document.getElementById("tail_farman");
        document.getElementById("lbl_tail_boom").textContent = lu("Frames Tail Boom");
        this.t_boom = document.getElementById("tail_boom");
        document.getElementById("lbl_flying_wing").textContent = lu("Frames Flying Wing");
        this.t_fwing = document.getElementById("flying_wing");
        var spar_list = this.frames.GetFrameList();
        for (let spar of spar_list) {
            let opt = document.createElement("OPTION");
            opt.text = lu(spar.name);
            if (spar.basestruct <= 0) {
                opt.disabled = true;
            }
            this.all_frame.add(opt);
        }
        this.all_frame.onchange = () => { this.frames.SetAllFrame(this.all_frame.selectedIndex); };
        var skin_list = this.frames.GetSkinList();
        for (let skin of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = lu(skin.name);
            this.all_skin.add(opt);
        }
        this.all_skin.onchange = () => { this.frames.SetAllSkin(this.all_skin.selectedIndex); };
        for (let elem of this.frames.GetTailList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.t_select.add(opt);
        }
        this.t_select.onchange = () => { this.frames.SetTailType(this.t_select.selectedIndex); };
        this.t_farman.onchange = () => { this.frames.SetUseFarman(this.t_farman.checked); };
        this.t_boom.onchange = () => { this.frames.SetUseBoom(this.t_boom.checked); };
        this.t_fwing.onchange = () => { this.frames.SetFlyingWing(this.t_fwing.checked); };
        table.appendChild(fragment);
    }
    UpdateDisplay() {
        var section_list = this.frames.GetSectionList();
        var tail_section_list = this.frames.GetTailSectionList();
        while (section_list.length > this.c_sec.length) {
            let i = this.c_sec.length;
            this.CreateSection(i, section_list[i]);
        }
        while (section_list.length < this.c_sec.length) {
            this.RemoveSection();
        }
        while (tail_section_list.length > this.t_sec.length) {
            let i = this.t_sec.length;
            this.CreateTailSection(i, tail_section_list[i]);
        }
        while (tail_section_list.length < this.t_sec.length) {
            this.RemoveTailSection();
        }
        var skin_list = this.frames.GetSkinList();
        var is_flammable = skin_list[this.frames.GetSkin()].flammable;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            this.UpdateSection(i, sec);
        }
        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom() || this.frames.GetIsTailless();
        this.t_farman.checked = this.frames.GetUseFarman();
        this.t_boom.disabled = this.frames.GetUseFarman() || this.frames.GetIsTailless();
        this.t_boom.checked = this.frames.GetUseBoom();
        this.t_fwing.disabled = !this.frames.CanFlyingWing();
        this.t_fwing.checked = this.frames.GetFlyingWing();
        this.all_frame.selectedIndex = -1;
        this.all_skin.selectedIndex = this.frames.GetSkin();
        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            this.UpdateTailSection(i, sec);
        }
        if (is_flammable)
            BlinkIfChanged(this.d_flammable, lu("Yes"));
        else
            BlinkIfChanged(this.d_flammable, lu("No"));
        var stats = this.frames.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_strn, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
    }
    CreateSection(i, sec) {
        var fsec = {
            fspan: document.createElement("SPAN"),
            rem: document.createElement("BUTTON"),
            add: document.createElement("BUTTON"),
            fsel: document.createElement("SELECT"),
            sspan: document.createElement("SPAN"),
            ssel: document.createElement("LABEL"),
            ospan: document.createElement("SPAN"),
            geo: document.createElement("INPUT"),
            mono: document.createElement("INPUT"),
            int: document.createElement("INPUT"),
            lb: document.createElement("INPUT"),
        };
        fsec.rem.textContent = "-";
        fsec.rem.onclick = () => { this.frames.DeleteSection(i); };
        fsec.add.textContent = "+";
        fsec.add.onclick = () => { this.frames.DuplicateSection(i); };
        var frame_list = this.frames.GetFrameList();
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = lu(ft.name);
            fsec.fsel.add(opt);
        }
        fsec.fsel.onchange = () => { this.frames.SetFrame(i, fsec.fsel.selectedIndex); };
        fsec.fspan.appendChild(fsec.rem);
        fsec.fspan.appendChild(fsec.add);
        fsec.fspan.appendChild(fsec.fsel);
        fsec.fspan.appendChild(document.createElement("BR"));
        this.c_frame.appendChild(fsec.fspan);
        fsec.sspan.appendChild(fsec.ssel);
        fsec.sspan.appendChild(document.createElement("BR"));
        this.c_skin.appendChild(fsec.sspan);
        CreateCheckbox(lu("Frames Geodesic"), fsec.geo, fsec.ospan, false);
        fsec.geo.onchange = () => { this.frames.SetGeodesic(i, fsec.geo.checked); };
        CreateCheckbox(lu("Frames Monocoque"), fsec.mono, fsec.ospan, false);
        fsec.mono.onchange = () => { this.frames.SetMonocoque(i, fsec.mono.checked); };
        CreateCheckbox(lu("Frames Internal Bracing"), fsec.int, fsec.ospan, false);
        fsec.int.onchange = () => { this.frames.SetInternalBracing(i, fsec.int.checked); };
        CreateCheckbox(lu("Frames Lifting Body"), fsec.lb, fsec.ospan, true);
        fsec.lb.onchange = () => { this.frames.SetLiftingBody(i, fsec.lb.checked); };
        this.c_options.appendChild(fsec.ospan);
        this.c_sec.push(fsec);
        this.UpdateSection(i, sec);
    }
    RemoveSection() {
        var sec = this.c_sec.pop();
        this.c_frame.removeChild(sec.fspan);
        this.c_skin.removeChild(sec.sspan);
        this.c_options.removeChild(sec.ospan);
    }
    UpdateSection(i, sec) {
        var fsec = this.c_sec[i];
        fsec.rem.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
        fsec.add.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();
        var frame_list = this.frames.GetFrameList();
        for (let j = 0; j < frame_list.length; j++) {
            let ft = frame_list[j];
            let opt = fsec.fsel.options[j];
            opt.text = lu(ft.name);
            opt.disabled = false;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
        }
        fsec.fsel.selectedIndex = sec.frame;
        if (sec.internal_bracing) {
            fsec.ssel.textContent = lu("Frames No Skin");
        }
        else {
            var skin_list = this.frames.GetSkinList();
            fsec.ssel.textContent = lu(skin_list[this.frames.GetSkin()].name);
        }
        fsec.geo.checked = sec.geodesic;
        fsec.geo.disabled = !this.frames.PossibleGeodesic(i);
        fsec.mono.checked = sec.monocoque;
        fsec.mono.disabled = !this.frames.PossibleMonocoque(i);
        fsec.int.checked = sec.internal_bracing;
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing(true) || !this.frames.PossibleRemoveSections()))
            fsec.int.disabled = true;
        else
            fsec.int.disabled = false;
        fsec.lb.checked = sec.lifting_body;
        fsec.lb.disabled = !this.frames.PossibleMonocoque(i);
    }
    CreateTailSection(i, sec) {
        var tsec = {
            fspan: document.createElement("SPAN"),
            fsel: document.createElement("SELECT"),
            sspan: document.createElement("SPAN"),
            ssel: document.createElement("LABEL"),
            ospan: document.createElement("SPAN"),
            geo: document.createElement("INPUT"),
            mono: document.createElement("INPUT"),
            lb: document.createElement("INPUT"),
        };
        var frame_list = this.frames.GetFrameList();
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = lu(ft.name);
            tsec.fsel.add(opt);
        }
        tsec.fsel.onchange = () => { this.frames.SetTailFrame(i, tsec.fsel.selectedIndex); };
        tsec.fspan.appendChild(tsec.fsel);
        tsec.fspan.appendChild(document.createElement("BR"));
        this.t_frame.appendChild(tsec.fspan);
        tsec.sspan.appendChild(tsec.ssel);
        tsec.sspan.appendChild(document.createElement("BR"));
        this.t_skin.appendChild(tsec.sspan);
        CreateCheckbox(lu("Frames Geodesic"), tsec.geo, tsec.ospan, false);
        tsec.geo.onchange = () => { this.frames.SetTailGeodesic(i, tsec.geo.checked); };
        CreateCheckbox(lu("Frames Monocoque"), tsec.mono, tsec.ospan, false);
        tsec.mono.onchange = () => { this.frames.SetTailMonocoque(i, tsec.mono.checked); };
        CreateCheckbox(lu("Frames Lifting Body"), tsec.lb, tsec.ospan, true);
        tsec.lb.onchange = () => { this.frames.SetTailLiftingBody(i, tsec.lb.checked); };
        this.t_options.appendChild(tsec.ospan);
        this.t_sec.push(tsec);
        this.UpdateTailSection(i, sec);
    }
    RemoveTailSection() {
        var sec = this.t_sec.pop();
        this.t_frame.removeChild(sec.fspan);
        this.t_skin.removeChild(sec.sspan);
        this.t_options.removeChild(sec.ospan);
    }
    UpdateTailSection(i, sec) {
        var tsec = this.t_sec[i];
        var frame_list = this.frames.GetFrameList();
        for (let j = 0; j < frame_list.length; j++) {
            let ft = frame_list[j];
            let opt = tsec.fsel.options[j];
            opt.text = lu(ft.name);
            opt.disabled = false;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
        }
        tsec.fsel.selectedIndex = sec.frame;
        var skin_list = this.frames.GetSkinList();
        var idx = this.frames.GetSkin();
        if (this.frames.GetUseFarman())
            idx = 0;
        tsec.ssel.textContent = lu(skin_list[idx].name);
        tsec.geo.checked = sec.geodesic;
        tsec.geo.disabled = !this.frames.PossibleTailGeodesic(i);
        tsec.mono.checked = sec.monocoque;
        tsec.mono.disabled = !this.frames.PossibleTailMonocoque(i);
        tsec.lb.checked = sec.lifting_body;
        tsec.lb.disabled = !this.frames.PossibleTailMonocoque(i);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Wings.ts" />
class Wings_HTML extends Display {
    constructor(w) {
        super();
        this.wings = w;
        this.fw_list = [];
        this.mw_list = [];
        document.getElementById("lbl_wings").textContent = lu("Wings Section Title");
        document.getElementById("lbl_wing_stagger").textContent = lu("Wings Wing Stagger");
        this.stagger = document.getElementById("wing_stagger");
        document.getElementById("lbl_wing_closed").textContent = lu("Wings Closed Wing");
        this.closed = document.getElementById("wing_closed");
        document.getElementById("lbl_wing_swept").textContent = lu("Wings Swept Wing");
        this.swept = document.getElementById("wing_swept");
        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = lu(s.name);
            this.stagger.append(opt);
        }
        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };
        var tbl = document.getElementById("wing_table");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Wings Wing Type"));
        CreateTH(row, lu("Wings Wing Options"));
        CreateTH(row, lu("Wings Wing Stats"));
        var full_row = insertRow(fragment);
        CreateTH(full_row, lu("Wings Full Wings"));
        var mini_row = insertRow(fragment);
        CreateTH(mini_row, lu("Wings Miniature Wings"));
        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        var stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
        tbl.appendChild(fragment);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Wing Area"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        var c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Raw Strain"));
        CreateTH(h3_row, lu("Stat Crash Safety"));
        CreateTH(h3_row, lu("Stat Lift Bleed"));
        var c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, lu("Stat Cost"));
        CreateTH(h4_row, lu("Stat Visibility"));
        CreateTH(h4_row, lu("Stat Charge"));
        var c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_visi = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, "");
        CreateTH(h5_row, lu("Wings Sesquiplane"));
        CreateTH(h5_row, lu("Derived Is Flammable Question"));
        var c5_row = tbl_stat.insertRow();
        c5_row.insertCell();
        this.d_sesq = c5_row.insertCell();
        this.d_flam = c5_row.insertCell();
    }
    UpdateDisplay() {
        var cans = this.wings.CanStagger();
        for (let i = 0; i < cans.length; i++) {
            this.stagger.options[i].disabled = !cans[i];
        }
        this.stagger.selectedIndex = this.wings.GetStagger();
        this.closed.checked = this.wings.GetClosed();
        this.closed.disabled = !this.wings.CanClosed();
        this.swept.checked = this.wings.GetSwept();
        this.swept.disabled = !this.wings.CanSwept();
        if (this.fw_add)
            this.full_cell.removeChild(this.fw_add);
        if (this.mw_add)
            this.mini_cell.removeChild(this.mw_add);
        var wl = this.wings.GetWingList();
        for (let i = 0; i < wl.length; i++) {
            if (this.fw_list.length == i)
                this.AddFullWing();
            this.UpdateFullWing(this.fw_list[i], i, wl[i]);
        }
        while (this.fw_list.length > wl.length) {
            this.PopFullWing();
        }
        var mwl = this.wings.GetMiniWingList();
        for (let i = 0; i < mwl.length; i++) {
            if (this.mw_list.length == i)
                this.AddMiniWing();
            this.UpdateMiniWing(this.mw_list[i], i, mwl[i]);
        }
        while (this.mw_list.length > mwl.length) {
            this.PopMiniWing();
        }
        this.CreateFWAdd(wl.length);
        this.CreateMWAdd(mwl.length);
        var stats = this.wings.PartStats();
        BlinkIfChanged(this.d_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mass, (stats.mass + this.wings.GetPaperMass()).toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_chrg, stats.charge.toString(), true);
        if (this.wings.GetIsSesquiplane().is)
            BlinkIfChanged(this.d_sesq, lu("Yes"));
        else
            BlinkIfChanged(this.d_sesq, lu("No"));
        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, lu("Yes"));
        else
            BlinkIfChanged(this.d_flam, lu("No"));
    }
    AddFullWing() {
        var wing = {
            span: document.createElement("SPAN"),
            deck: document.createElement("SELECT"),
            skin: document.createElement("SELECT"),
            area: document.createElement("INPUT"),
            wspan: document.createElement("INPUT"),
            gull: document.createElement("INPUT"),
            dihedral: document.createElement("INPUT"),
            anhedral: document.createElement("INPUT"),
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = lu("Wings No Wing");
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = lu(d.name);
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = lu(s.name);
            wing.skin.append(opt);
        }
        CreateInput(lu("Wings Area"), wing.area, wing.span, false);
        wing.area.min = "3";
        CreateInput(lu("Wings Span"), wing.wspan, wing.span, false);
        wing.wspan.min = "1";
        CreateCheckbox(lu("Wings Gull"), wing.gull, wing.span, false);
        CreateInput(lu("Wings Dihedral"), wing.dihedral, wing.span, false);
        wing.dihedral.min = "0";
        CreateInput(lu("Wings Anhedral"), wing.anhedral, wing.span, false);
        wing.anhedral.min = "0";
        this.full_cell.appendChild(wing.span);
        this.full_cell.appendChild(wing.br);
        this.fw_list.push(wing);
    }
    PopFullWing() {
        var wing = this.fw_list.pop();
        this.full_cell.removeChild(wing.span);
        this.full_cell.removeChild(wing.br);
    }
    UpdateFullWing(ht, idx, wing) {
        for (let i = 1; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != (i - 1) && !this.wings.CanAddFullWing(i - 1) && !this.wings.CanMoveFullWing(idx, i - 1))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.onchange = () => {
            let w = { ...wing };
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.onchange = () => {
            let w = { ...wing };
            w.surface = ht.skin.selectedIndex;
            this.wings.SetFullWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = { ...wing };
            w.area = ht.area.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = { ...wing };
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
        ht.gull.onchange = () => {
            let w = { ...wing };
            w.gull = ht.gull.checked;
            this.wings.SetFullWing(idx, w);
        };
        ht.gull.checked = wing.gull;
        ht.gull.disabled = !this.wings.CanGull(wing.deck);
        ht.dihedral.onchange = () => {
            let w = { ...wing };
            w.dihedral = ht.dihedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.dihedral.max = (wing.span - wing.anhedral - 1).toString();
        ht.dihedral.valueAsNumber = wing.dihedral;
        ht.anhedral.onchange = () => {
            let w = { ...wing };
            w.anhedral = ht.anhedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.anhedral.max = (wing.span - wing.dihedral - 1).toString();
        ht.anhedral.valueAsNumber = wing.anhedral;
    }
    AddMiniWing() {
        var wing = {
            span: document.createElement("SPAN"),
            deck: document.createElement("SELECT"),
            skin: document.createElement("SELECT"),
            area: document.createElement("INPUT"),
            wspan: document.createElement("INPUT"),
            gull: undefined,
            dihedral: undefined,
            anhedral: undefined,
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = lu("Wings No Wing");
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = lu(d.name);
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = lu(s.name);
            wing.skin.append(opt);
        }
        CreateInput(lu("Wings Area"), wing.area, wing.span, false);
        wing.area.min = "1";
        wing.area.max = "2";
        CreateInput(lu("Wings Span"), wing.wspan, wing.span, false);
        wing.wspan.min = "1";
        this.mini_cell.appendChild(wing.span);
        this.mini_cell.appendChild(wing.br);
        this.mw_list.push(wing);
    }
    UpdateMiniWing(ht, idx, wing) {
        for (let i = 1; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != i && !this.wings.CanAddMiniWing(i - 1) && !this.wings.CanMoveMiniWing(idx, i - 1))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.onchange = () => {
            let w = { ...wing };
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.onchange = () => {
            let w = { ...wing };
            w.surface = ht.skin.selectedIndex;
            this.wings.SetMiniWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = { ...wing };
            w.area = ht.area.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = { ...wing };
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
    }
    PopMiniWing() {
        var wing = this.mw_list.pop();
        this.mini_cell.removeChild(wing.span);
        this.mini_cell.removeChild(wing.br);
    }
    CreateFWAdd(idx) {
        this.fw_add = document.createElement("SELECT");
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = lu("Wings No Wing");
        this.fw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = lu(d.name);
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.fw_add.append(opt);
        }
        this.fw_add.onchange = () => {
            let w = { surface: 0, area: 10, span: 5, gull: false, dihedral: 0, anhedral: 0, deck: this.fw_add.selectedIndex - 1 };
            this.wings.SetFullWing(idx, w);
        };
        this.fw_add.selectedIndex = 0;
        this.fw_add.disabled = !can;
        this.full_cell.appendChild(this.fw_add);
    }
    CreateMWAdd(idx) {
        this.mw_add = document.createElement("SELECT");
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = lu("Wings No Wing");
        this.mw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = lu(d.name);
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.mw_add.append(opt);
        }
        this.mw_add.onchange = () => {
            let w = { surface: 0, area: 2, span: 2, gull: false, dihedral: 0, anhedral: 0, deck: this.mw_add.selectedIndex - 1 };
            this.wings.SetMiniWing(idx, w);
        };
        this.mw_add.selectedIndex = 0;
        this.mw_add.disabled = !can;
        this.mini_cell.appendChild(this.mw_add);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Stabilizers.ts" />
class Stabilizers_HTML extends Display {
    constructor(s) {
        super();
        this.stab = s;
        document.getElementById("lbl_stab").textContent = lu("Stabilizers Section Title");
        var tbl = document.getElementById("stab_table");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Stabilizers Horizontal Stabilizers"));
        CreateTH(row, lu("Stabilizers Vertical Stabilizers"));
        CreateTH(row, lu("Stabilizers Stabilizer Stats"));
        row = insertRow(fragment);
        var hcell = row.insertCell();
        var vcell = row.insertCell();
        this.h_type = document.createElement("SELECT");
        this.h_count = document.createElement("INPUT");
        hcell.appendChild(this.h_type);
        hcell.append(document.createElement("BR"));
        CreateInput(lu("Stabilizers # of Stabilizers"), this.h_count, hcell);
        this.h_count.min = "0";
        this.h_count.max = "20";
        this.h_count.onchange = () => { this.stab.SetHStabCount(this.h_count.valueAsNumber); };
        this.h_type.onchange = () => { this.stab.SetHStabType(this.h_type.selectedIndex); };
        for (let elem of s.GetHStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.h_type.add(opt);
        }
        this.v_type = document.createElement("SELECT");
        this.v_count = document.createElement("INPUT");
        vcell.appendChild(this.v_type);
        vcell.appendChild(document.createElement("BR"));
        CreateInput(lu("Stabilizers # of Stabilizers"), this.v_count, vcell);
        this.v_count.min = "0";
        this.v_count.max = "20";
        this.v_count.onchange = () => { this.stab.SetVStabCount(this.v_count.valueAsNumber); };
        this.v_type.onchange = () => { this.stab.SetVStabType(this.v_type.selectedIndex); };
        for (let elem of s.GetVStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.v_type.add(opt);
        }
        var stat_cell = row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
        tbl.appendChild(fragment);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Control"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        CreateTH(h2_row, lu("Stat Lift Bleed"));
        var c2_row = tbl_stat.insertRow();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.h_type.selectedIndex = this.stab.GetHStabType();
        this.v_type.selectedIndex = this.stab.GetVStabType();
        var valid = this.stab.GetHValidList();
        for (let i = 0; i < valid.length; i++) {
            this.h_type.options[i].disabled = !valid[i];
        }
        valid = this.stab.GetVValidList();
        for (let i = 0; i < valid.length; i++) {
            this.v_type.options[i].disabled = !valid[i];
        }
        this.h_count.valueAsNumber = this.stab.GetHStabCount();
        this.h_count.step = this.stab.GetHStabIncrement().toString();
        this.v_count.valueAsNumber = this.stab.GetVStabCount();
        this.v_count.step = this.stab.GetVStabIncrement().toString();
        var stats = this.stab.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/ControlSurfaces.ts" />
class ControlSurfaces_HTML extends Display {
    constructor(cs) {
        super();
        this.cs = cs;
        document.getElementById("lbl_control_surfaces").textContent = lu("Control Surfaces Section Title");
        var tbl = document.getElementById("tbl_control_surfaces");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Control Surfaces Control Surfaces"));
        CreateTH(row, lu("Control Surfaces Drag Inducers"));
        CreateTH(row, lu("Control Surfaces Stats"));
        row = insertRow(fragment);
        var cs_cell = row.insertCell();
        this.aileron_select = document.createElement("SELECT");
        for (let a of cs.GetAileronList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.aileron_select.add(opt);
        }
        this.aileron_select.onchange = () => { this.cs.SetAileron(this.aileron_select.selectedIndex); };
        this.rudder_select = document.createElement("SELECT");
        for (let a of cs.GetRudderList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.rudder_select.add(opt);
        }
        this.rudder_select.onchange = () => { this.cs.SetRudder(this.rudder_select.selectedIndex); };
        this.elevator_select = document.createElement("SELECT");
        for (let a of cs.GetElevatorList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.elevator_select.add(opt);
        }
        this.elevator_select.onchange = () => { this.cs.SetElevator(this.elevator_select.selectedIndex); };
        this.flaps_select = document.createElement("SELECT");
        for (let a of cs.GetFlapsList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.flaps_select.add(opt);
        }
        this.flaps_select.onchange = () => { this.cs.SetFlaps(this.flaps_select.selectedIndex); };
        this.slats_select = document.createElement("SELECT");
        for (let a of cs.GetSlatsList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.slats_select.add(opt);
        }
        this.slats_select.onchange = () => { this.cs.SetSlats(this.slats_select.selectedIndex); };
        var fs = CreateFlexSection(cs_cell);
        FlexSelect(lu("Control Surfaces Ailerons"), this.aileron_select, fs);
        FlexSelect(lu("Control Surfaces Rudders"), this.rudder_select, fs);
        FlexSelect(lu("Control Surfaces Elevators"), this.elevator_select, fs);
        FlexSelect(lu("Control Surfaces Flaps"), this.flaps_select, fs);
        FlexSelect(lu("Control Surfaces Slats"), this.slats_select, fs);
        var drag_cell = row.insertCell();
        var fs2 = CreateFlexSection(drag_cell);
        this.drag_chbx = [];
        var dlist = cs.GetDragList();
        for (let i = 0; i < dlist.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lu(dlist[i].name), cbx, fs2);
            cbx.onchange = () => { this.cs.SetDrag(i, cbx.checked); };
            this.drag_chbx.push(cbx);
        }
        this.InitStatDisplay(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Lift Bleed"));
        CreateTH(h3_row, lu("Stat Crash Safety"));
        CreateTH(h3_row, " ");
        var c3_row = tbl_stat.insertRow();
        this.d_lift = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_none = c3_row.insertCell();
    }
    UpdateDisplay() {
        var can_aileron = this.cs.CanAileron();
        for (let i = 0; i < can_aileron.length; i++) {
            this.aileron_select.options[i].disabled = !can_aileron[i];
        }
        this.aileron_select.selectedIndex = this.cs.GetAileron();
        this.rudder_select.selectedIndex = this.cs.GetRudder();
        this.elevator_select.selectedIndex = this.cs.GetElevator();
        this.flaps_select.selectedIndex = this.cs.GetFlaps();
        this.slats_select.selectedIndex = this.cs.GetSlats();
        var drag = this.cs.GetDrag();
        for (let i = 0; i < this.drag_chbx.length; i++) {
            this.drag_chbx[i].checked = drag[i];
        }
        var stats = this.cs.PartStats();
        var cost = stats.cost + this.cs.GetFlapCost();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, cost.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Reinforcement.ts" />
class Reinforcement_HTML extends Display {
    constructor(acft, rf) {
        super();
        this.acft = acft;
        this.rf = rf;
        this.ext_wood_inp = [];
        this.ext_steel_inp = [];
        this.cant_inp = [];
        document.getElementById("lbl_reinforcements").textContent = lu("Reinforcement Section Title");
        var tbl = document.getElementById("tbl_reinforcements");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Reinforcement External Reinforcements"));
        CreateTH(row, lu("Reinforcement Internal Reinforcements"));
        CreateTH(row, lu("Reinforcement Reinforcement Stats"));
        row = insertRow(fragment);
        this.InitExternal(row.insertCell());
        this.InitInternal(row.insertCell());
        this.InitStatDisplay(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitExternal(cell) {
        var fs = CreateFlexSection(cell);
        var fsr = CreateFlexSection(fs.div2);
        var fs_wood = CreateFlexSection(fsr.div1);
        var fs_steel = CreateFlexSection(fsr.div2);
        var lst = this.rf.GetExternalList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let w_inp = document.createElement("INPUT");
            let s_inp = document.createElement("INPUT");
            FlexLabel(lu(elem.name), fs.div1);
            FlexInput(lu("Reinforcement Wood"), w_inp, fs_wood);
            FlexInput(lu("Reinforcement Steel"), s_inp, fs_steel);
            w_inp.min = "0";
            s_inp.min = "0";
            w_inp.onchange = () => { this.rf.SetExternalWoodCount(i, w_inp.valueAsNumber); };
            s_inp.onchange = () => { this.rf.SetExternalSteelCount(i, s_inp.valueAsNumber); };
            this.ext_wood_inp.push(w_inp);
            this.ext_steel_inp.push(s_inp);
        }
        this.cabane = document.createElement("SELECT");
        FlexSelect(lu("Reinforcement Cabane"), this.cabane, fs);
        for (let o of this.rf.GetCabaneList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(o.name);
            this.cabane.add(opt);
        }
        this.cabane.onchange = () => { this.rf.SetCabane(this.cabane.selectedIndex); };
        this.cabane.selectedIndex = 0;
        this.wires = document.createElement("INPUT");
        FlexCheckbox(lu("Reinforcement Wires"), this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
    }
    InitInternal(cell) {
        var fs = CreateFlexSection(cell);
        var lst = this.rf.GetCantileverList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let inp = document.createElement("INPUT");
            FlexInput(lu(elem.name), inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.rf.SetCantileverCount(i, inp.valueAsNumber); };
            this.cant_inp.push(inp);
        }
        this.wing_blades = document.createElement("INPUT");
        FlexCheckbox(lu("Reinforcement Wing Blades"), this.wing_blades, fs);
        this.wing_blades.onchange = () => { this.rf.SetWingBlade(this.wing_blades.checked); };
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Raw Strain"));
        CreateTH(h2_row, lu("Reinforcement Aircraft Max Strain"));
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_maxs = c2_row.insertCell();
        this.d_amax = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.cabane.selectedIndex = this.rf.GetCabane();
        this.wires.checked = this.rf.GetWires();
        var w_count = this.rf.GetExternalWoodCount();
        var w_can = this.rf.CanExternalWood();
        for (let i = 0; i < w_count.length; i++) {
            this.ext_wood_inp[i].valueAsNumber = w_count[i];
            this.ext_wood_inp[i].disabled = !w_can[i];
        }
        var s_count = this.rf.GetExternalSteelCount();
        var s_can = this.rf.CanExternalWood();
        for (let i = 0; i < s_count.length; i++) {
            this.ext_steel_inp[i].valueAsNumber = s_count[i];
            this.ext_steel_inp[i].disabled = !s_can[i];
        }
        var c_count = this.rf.GetCantileverCount();
        for (let i = 0; i < c_count.length; i++) {
            this.cant_inp[i].valueAsNumber = c_count[i];
        }
        this.wing_blades.disabled = !this.rf.CanWingBlade();
        this.wing_blades.checked = this.rf.GetWingBlade();
        var stats = this.rf.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
    }
    UpdateMaxStrain(strain) {
        BlinkIfChanged(this.d_amax, strain.toString(), true);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Fuel.ts" />
/// <reference path="../impl/Munitions.ts" />
/// <reference path="../impl/CargoAndPassengers.ts" />
class Load_HTML extends Display {
    constructor(fuel, boom, cargo) {
        super();
        this.fuel = fuel;
        this.boom = boom;
        this.cargo = cargo;
        this.fuel_list = [];
        document.getElementById("lbl_load").textContent = lu("Load Section Title");
        var tbl = document.getElementById("tbl_load");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Load Fuel"));
        CreateTH(row, lu("Load Munitions"));
        CreateTH(row, lu("Load Cargo and Passengers"));
        CreateTH(row, lu("Load Load Stats"));
        row = insertRow(fragment);
        this.InitFuel(row.insertCell());
        this.InitMunitions(row.insertCell());
        this.InitCargoAndPassengers(row.insertCell());
        this.InitStats(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitFuel(cell) {
        var lst = this.fuel.GetTankList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(lst[i].name), inp, fs);
            inp.onchange = () => { this.fuel.SetTankCount(i, inp.valueAsNumber); };
            this.fuel_list.push(inp);
        }
        this.seal = document.createElement("INPUT");
        FlexCheckbox(lu("Load Self-Sealing Gas Tank"), this.seal, fs);
        this.seal.onchange = () => { this.fuel.SetSelfSealing(this.seal.checked); };
        this.extinguish = document.createElement("INPUT");
        FlexCheckbox(lu("Load Remote Fire Extinguisher"), this.extinguish, fs);
        this.extinguish.onchange = () => { this.fuel.SetExtinguisher(this.extinguish.checked); };
    }
    InitMunitions(cell) {
        var fs = CreateFlexSection(cell);
        this.bombs = document.createElement("INPUT");
        FlexInput(lu("Load Bombs"), this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.rockets = document.createElement("INPUT");
        FlexInput(lu("Load Rockets"), this.rockets, fs);
        this.rockets.onchange = () => { this.boom.SetRocketCount(this.rockets.valueAsNumber); };
        this.bay_count = document.createElement("INPUT");
        FlexInput(lu("Load Internal Bay Count"), this.bay_count, fs);
        this.bay_count.onchange = () => { this.boom.SetBayCount(this.bay_count.valueAsNumber); };
        this.bay1 = document.createElement("INPUT");
        FlexCheckbox(lu("Load Widen Internal Bay 1"), this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
        this.bay2 = document.createElement("INPUT");
        FlexCheckbox(lu("Load Widen Internal Bay 2"), this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }
    InitCargoAndPassengers(cell) {
        // var fs = CreateFlexSection(cell);
        this.carg = document.createElement("SELECT");
        // FlexSelect(lu("Load Cargo"), this.carg, fs);
        cell.appendChild(this.carg);
        var lst = this.cargo.GetSpaceList();
        for (let l of lst) {
            let opt = document.createElement("OPTION");
            opt.text = lu(l.name);
            this.carg.add(opt);
        }
        this.carg.onchange = () => { this.cargo.SetSpace(this.carg.selectedIndex); };
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Wet Mass"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_wmas = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Stat Fuel"));
        CreateTH(h2_row, lu("Stat Cost"));
        var c2_row = tbl_stat.insertRow();
        this.d_rsec = c2_row.insertCell();
        this.d_fuel = c2_row.insertCell();
        this.d_cost = c2_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "");
        CreateTH(h2_row, lu("Derived Fuel Uses"));
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        c2_row.insertCell();
        this.d_fuse = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateFuelUses(uses) {
        var value = Math.floor(1.0e-6 + uses * 10) / 10;
        if (!isFinite(value)) {
            value = 0;
        }
        BlinkIfChanged(this.d_fuse, (value).toString(), false);
    }
    UpdateDisplay() {
        var fl = this.fuel.GetTankCount();
        var fe = this.fuel.GetTankEnabled();
        for (let i = 0; i < fl.length; i++) {
            this.fuel_list[i].valueAsNumber = fl[i];
            this.fuel_list[i].disabled = !fe[i];
        }
        this.seal.checked = this.fuel.GetSelfSealing();
        this.seal.disabled = !this.fuel.GetSealingEnabled();
        this.extinguish.checked = this.fuel.GetExtinguisher();
        this.bombs.valueAsNumber = this.boom.GetBombCount();
        this.rockets.valueAsNumber = this.boom.GetRocketCount();
        this.bay_count.valueAsNumber = this.boom.GetBayCount();
        this.bay1.checked = this.boom.GetBay1();
        this.bay2.checked = this.boom.GetBay2();
        if (this.boom.GetBayCount() > 0) {
            this.bay1.disabled = false;
            if (this.bay1.checked)
                this.bay2.disabled = false;
            else
                this.bay2.disabled = true;
        }
        else {
            this.bay1.disabled = true;
            this.bay2.disabled = true;
        }
        this.carg.selectedIndex = this.cargo.GetSpace();
        var stats = this.fuel.PartStats();
        stats = stats.Add(this.boom.PartStats());
        stats = stats.Add(this.cargo.PartStats());
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString(), false);
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString(), false);
        BlinkIfChanged(this.d_fuel, stats.fuel.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/LandingGear.ts" />
class LandingGear_HTML extends Display {
    constructor(gear) {
        super();
        this.gear = gear;
        document.getElementById("lbl_landing_gear").textContent = lu("Landing Gear Section Title");
        var tbl = document.getElementById("tbl_gear");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Landing Gear Landing Gear"));
        CreateTH(row, lu("Landing Gear Extras"));
        CreateTH(row, lu("Landing Gear Gear Stats"));
        row = insertRow(fragment);
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitGear(cell) {
        var lst = this.gear.GetGearList();
        var fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT");
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(lst[i].name);
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };
        this.retract = document.createElement("INPUT");
        FlexCheckbox(lu("Landing Gear Retractable"), this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }
    InitExtras(cell) {
        this.extras = [];
        var lst = this.gear.GetExtraList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lu(lst[i].name), cbx, fs);
            cbx.onchange = () => { this.gear.SetExtraSelected(i, cbx.checked); };
            this.extras.push(cbx);
        }
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Crash Safety"));
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        var gcan = this.gear.CanGear();
        for (let i = 0; i < gcan.length; i++)
            this.sel.options[i].disabled = !gcan[i];
        this.retract.checked = this.gear.GetRetract();
        this.retract.disabled = !this.gear.CanRetract();
        var lst = this.gear.GetExtraSelected();
        for (let i = 0; i < lst.length; i++) {
            this.extras[i].checked = lst[i];
        }
        var stats = this.gear.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Optimization.ts" />
class Optimization_HTML extends Display {
    constructor(opt) {
        super();
        this.opt = opt;
        document.getElementById("lbl_optimization").textContent = lu("Optimization Section Title");
        document.getElementById("lbl_num_opt").textContent = lu("Optimization Num Free Optimizations");
        this.free_inp = document.getElementById("num_opt");
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };
        var tbl = document.getElementById("tbl_optimization");
        var fragment = document.createDocumentFragment();
        var row0 = insertRow(fragment);
        CreateTH(row0, lu("Optimization Negative"));
        CreateTH(row0, lu("Optimization Effect"));
        CreateTH(row0, lu("Optimization Positive"));
        CreateTH(row0, lu("Optimization Optimization Stats"));
        // <th>Negative < /th>
        // < th > Effect < /th>
        // < th > Positive < /th>
        // < th > Optimization Stats < /th>
        var row1 = insertRow(fragment);
        this.cost_cbx = this.InitRow(row1, lu("Optimization Cost"), (num) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(insertRow(fragment), lu("Optimization Lift Bleed"), (num) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(insertRow(fragment), lu("Optimization Leg Room"), (num) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(insertRow(fragment), lu("Optimization Mass"), (num) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(insertRow(fragment), lu("Optimization Toughness"), (num) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(insertRow(fragment), lu("Optimization Max Strain"), (num) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(insertRow(fragment), lu("Optimization Reliability"), (num) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(insertRow(fragment), lu("Optimization Drag"), (num) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
        tbl.appendChild(fragment);
    }
    InitRow(row, txt, call) {
        var cbxs = [];
        for (let i = 0; i < 6; i++) {
            cbxs.push(document.createElement("INPUT"));
            cbxs[i].setAttribute("type", "checkbox");
            if (i < 3)
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 3);
                    else
                        call(i - 2);
                };
            else
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 2);
                    else
                        call(i - 3);
                };
        }
        var ncell = row.insertCell();
        var ecell = row.insertCell();
        var pcell = row.insertCell();
        ncell.appendChild(cbxs[0]);
        ncell.appendChild(cbxs[1]);
        ncell.appendChild(cbxs[2]);
        ecell.textContent = txt;
        pcell.appendChild(cbxs[3]);
        pcell.appendChild(cbxs[4]);
        pcell.appendChild(cbxs[5]);
        return cbxs;
    }
    InitStatDisplay(stat_cell) {
        stat_cell.rowSpan = 0;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Cost"));
        CreateTH(h1_row, lu("Stat Lift Bleed"));
        CreateTH(h1_row, lu("Stat Escape"));
        var c1_row = tbl_stat.insertRow();
        this.d_cost = c1_row.insertCell();
        this.d_lift = c1_row.insertCell();
        this.d_escp = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Visibility"));
        CreateTH(h2_row, lu("Stat Mass"));
        CreateTH(h2_row, lu("Stat Toughness"));
        var c2_row = tbl_stat.insertRow();
        this.d_visi = c2_row.insertCell();
        this.d_mass = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Max Strain"));
        CreateTH(h3_row, lu("Stat Reliability"));
        CreateTH(h3_row, lu("Stat Drag"));
        var c3_row = tbl_stat.insertRow();
        this.d_mstr = c3_row.insertCell();
        this.d_reli = c3_row.insertCell();
        this.d_drag = c3_row.insertCell();
    }
    UpdateChecked(num, lst) {
        for (let i = 0; i < lst.length; i++)
            lst[i].checked = false;
        if (num < 0) {
            lst[2].checked = true;
            if (num < -1) {
                lst[1].checked = true;
                if (num < -2)
                    lst[0].checked = true;
            }
        }
        else if (num > 0) {
            lst[3].checked = true;
            if (num > 1) {
                lst[4].checked = true;
                if (num > 2)
                    lst[5].checked = true;
            }
        }
    }
    UpdateEnabled(num, lst) {
        var free = 0;
        for (let i = 3; i < lst.length; i++) {
            if (!lst[i].checked)
                free++;
            lst[i].disabled = free > num;
        }
    }
    UpdateDisplay() {
        this.free_inp.valueAsNumber = this.opt.GetFreeDots();
        //Update Checked
        this.UpdateChecked(this.opt.GetCost(), this.cost_cbx);
        this.UpdateChecked(this.opt.GetBleed(), this.bleed_cbx);
        this.UpdateChecked(this.opt.GetEscape(), this.escape_cbx);
        this.UpdateChecked(this.opt.GetMass(), this.mass_cbx);
        this.UpdateChecked(this.opt.GetToughness(), this.toughness_cbx);
        this.UpdateChecked(this.opt.GetMaxStrain(), this.maxstrain_cbx);
        this.UpdateChecked(this.opt.GetReliabiilty(), this.reliability_cbx);
        this.UpdateChecked(this.opt.GetDrag(), this.drag_cbx);
        //Update Enabled
        var can_dot = this.opt.GetUnassignedCount();
        this.UpdateEnabled(can_dot, this.cost_cbx);
        this.UpdateEnabled(can_dot, this.bleed_cbx);
        this.UpdateEnabled(can_dot, this.escape_cbx);
        this.UpdateEnabled(can_dot, this.mass_cbx);
        this.UpdateEnabled(can_dot, this.toughness_cbx);
        this.UpdateEnabled(can_dot, this.maxstrain_cbx);
        this.UpdateEnabled(can_dot, this.reliability_cbx);
        this.UpdateEnabled(can_dot, this.drag_cbx);
        //Update Stats
        var stats = this.opt.PartStats();
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_escp, stats.escape.toString(), true);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_mstr, this.opt.final_ms.toString(), true);
        BlinkIfChanged(this.d_reli, stats.reliability.toString(), true);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />
class Weapons_HTML extends Display {
    constructor(weap) {
        super();
        this.weap = weap;
        document.getElementById("lbl_weapons").textContent = lu("Weapons Section Title");
        document.getElementById("lbl_num_wsets").textContent = lu("Weapons Number of Weapon Sets");
        this.inp_w_count = document.getElementById("num_wsets");
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };
        document.getElementById("lbl_num_wbraces").textContent = lu("Weapons Number of Weapon Braces");
        this.inp_w_brace = document.getElementById("num_wbraces");
        this.inp_w_brace.onchange = () => { this.weap.SetBraceCount(this.inp_w_brace.valueAsNumber); };
        this.tbl = document.getElementById("table_weapons");
        var row = this.tbl.insertRow();
        CreateTH(row, lu("Weapons Weapon Set"));
        CreateTH(row, lu("Weapons Weapons"));
        CreateTH(row, lu("Weapons Weapon Stats"));
        this.wrow = [];
    }
    CreateWSetRow() {
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        var setcell = row.insertCell();
        var fs = CreateFlexSection(setcell);
        var type = {
            type: document.createElement("SELECT"),
            dirs: [],
            count: document.createElement("INPUT"),
            action: document.createElement("SELECT"),
            projectile: document.createElement("SELECT"),
            fixed: document.createElement("INPUT"),
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT"),
            stats: { mass: null, drag: null, cost: null, sect: null, mounting: null, jams: null, hits: null, damg: null, shots: null, shots_header: null },
            repeating: document.createElement("INPUT"),
            seat: document.createElement("SELECT"),
        };
        var wlist = this.weap.GetWeaponList();
        for (let w of wlist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(w.name) + " (" + lu(w.era) + ")";
            type.type.add(opt);
        }
        type.type.required = true;
        var slist = this.weap.GetSeatList();
        for (let s of slist) {
            let opt = document.createElement("OPTION");
            opt.text = s;
            type.seat.add(opt);
        }
        var alist = this.weap.GetActionList();
        for (let a of alist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            type.action.add(opt);
        }
        type.action.required = true;
        var plist = this.weap.GetProjectileList();
        for (let p of plist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(p.name);
            type.projectile.add(opt);
        }
        type.projectile.required = true;
        FlexSelect(lu("Weapons Type"), type.type, fs);
        FlexSelect(lu("Seat Location"), type.seat, fs);
        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        FlexInput(lu("Weapons Number of Mounts"), type.count, lfs);
        FlexInput(lu("Weapons Ammunition"), type.ammo, rfs);
        FlexSelect(lu("Weapons Action"), type.action, lfs);
        FlexSelect(lu("Weapons Projectile"), type.projectile, rfs);
        FlexCheckbox(lu("Weapons Belt Fed"), type.repeating, lfs);
        FlexSpace(rfs);
        FlexCheckbox(lu("Fixed"), type.fixed, lfs);
        FlexSpace(rfs);
        var dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            var dl = lu(dirlist[i]);
            var cbx = document.createElement("INPUT");
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            var dr = lu(dirlist[i + 1]);
            cbx = document.createElement("INPUT");
            FlexCheckbox(dr, cbx, rfs);
            type.dirs.push(cbx);
        }
        type.wcell = row.insertCell();
        var statcell = row.insertCell();
        statcell.classList.toggle("inner_table");
        var stable = document.createElement("TABLE");
        stable.classList.toggle("inner_table");
        statcell.appendChild(stable);
        var h1_row = stable.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        var h2_row = stable.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Weapons Stat Mounting"));
        CreateTH(h2_row, lu("Weapons Stat Jam"));
        var c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.mounting = c2_row.insertCell();
        type.stats.jams = c2_row.insertCell();
        var h3_row = stable.insertRow();
        CreateTH(h3_row, lu("Weapons Stat Hits"));
        CreateTH(h3_row, lu("Weapons Stat Damage"));
        type.stats.shots_header = CreateTH(h3_row, lu("Weapons Stat Shots"));
        var c3_row = stable.insertRow();
        type.stats.hits = c3_row.insertCell();
        type.stats.damg = c3_row.insertCell();
        type.stats.shots = c3_row.insertCell();
        this.tbl.appendChild(fragment);
        return type;
    }
    CreateWRow(wcell) {
        var w = {
            span: document.createElement("SPAN"),
            wing: document.createElement("INPUT"),
            covered: document.createElement("INPUT"),
            accessible: document.createElement("INPUT"),
            free_access: document.createElement("INPUT"),
            synch: document.createElement("SELECT"),
            count: document.createElement("INPUT"),
        };
        CreateCheckbox(lu("Weapons Wing Mount"), w.wing, w.span, false);
        CreateCheckbox(lu("Weapons Accessible"), w.accessible, w.span, false);
        CreateCheckbox(lu("Weapons Free Accessible"), w.free_access, w.span, false);
        CreateCheckbox(lu("Weapons Covered"), w.covered, w.span, true);
        CreateInput(lu("Weapons # Weapons at Mount"), w.count, w.span, false);
        CreateSelect(lu("Weapons Synchronization"), w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));
        var slist = this.weap.GetSynchronizationList();
        for (let s of slist) {
            var opt = document.createElement("OPTION");
            opt.text = lu(s);
            w.synch.add(opt);
        }
        wcell.appendChild(w.span);
        return w;
    }
    UpdateWSet(set, disp) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };
        var slist = this.weap.GetSeatList();
        if (disp.seat.options.length != slist.length) {
            while (disp.seat.options.length > 0) {
                disp.seat.options.remove(0);
            }
            for (let s of slist) {
                let opt = document.createElement("OPTION");
                opt.text = s;
                disp.seat.add(opt);
            }
        }
        disp.seat.selectedIndex = set.GetSeat();
        disp.seat.onchange = () => { set.SetSeat(disp.seat.selectedIndex); };
        disp.count.valueAsNumber = set.GetMountingCount();
        disp.count.onchange = () => { set.SetMountingCount(disp.count.valueAsNumber); };
        disp.action.selectedIndex = set.GetAction();
        var can_act = set.GetCanAction();
        for (let i = 0; i < can_act.length; i++) {
            disp.action.options[i].disabled = !can_act[i];
        }
        disp.action.onchange = () => { set.SetAction(disp.action.selectedIndex); };
        disp.projectile.selectedIndex = set.GetProjectile();
        var can_proj = set.GetCanProjectile();
        for (let i = 0; i < can_proj.length; i++) {
            disp.projectile.options[i].disabled = !can_proj[i];
        }
        disp.projectile.onchange = () => { set.SetProjectile(disp.projectile.selectedIndex); };
        disp.repeating.checked = set.GetRepeating();
        disp.repeating.onchange = () => { set.SetRepeating(disp.repeating.checked); };
        disp.repeating.disabled = !set.CanRepeating();
        disp.fixed.checked = set.GetFixed();
        disp.fixed.onchange = () => { set.SetFixed(disp.fixed.checked); };
        var dirlist = set.GetDirection();
        var candir = set.CanDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].onchange = () => { set.SetDirection(i, disp.dirs[i].checked); };
            disp.dirs[i].disabled = !candir[i];
        }
        disp.ammo.valueAsNumber = set.GetAmmo();
        disp.ammo.onchange = () => { set.SetAmmo(disp.ammo.valueAsNumber); };
        var wlist = set.GetWeapons();
        while (disp.weaps.length < wlist.length) {
            disp.weaps.push(this.CreateWRow(disp.wcell));
        }
        while (disp.weaps.length > wlist.length) {
            var w = disp.weaps.pop();
            disp.wcell.removeChild(w.span);
        }
        for (let i = 0; i < wlist.length; i++) {
            disp.weaps[i].wing.checked = wlist[i].GetWing();
            disp.weaps[i].wing.onchange = () => { wlist[i].SetWing(disp.weaps[i].wing.checked); };
            disp.weaps[i].wing.disabled = !wlist[i].CanWing();
            disp.weaps[i].covered.checked = wlist[i].GetCovered();
            disp.weaps[i].covered.onchange = () => { wlist[i].SetCovered(disp.weaps[i].covered.checked); };
            disp.weaps[i].covered.disabled = !wlist[i].CanCovered();
            disp.weaps[i].accessible.checked = wlist[i].GetAccessible();
            disp.weaps[i].accessible.onchange = () => { wlist[i].SetAccessible(disp.weaps[i].accessible.checked); };
            disp.weaps[i].free_access.checked = wlist[i].GetFreeAccessible();
            disp.weaps[i].free_access.onchange = () => { wlist[i].SetFreeAccessible(disp.weaps[i].free_access.checked); };
            disp.weaps[i].free_access.disabled = !(wlist[i].can_free_accessible || wlist[i].GetFreeAccessible());
            disp.weaps[i].count.valueAsNumber = wlist[i].GetCount();
            disp.weaps[i].count.onchange = () => { wlist[i].SetCount(disp.weaps[i].count.valueAsNumber); };
            disp.weaps[i].synch.selectedIndex = wlist[i].GetSynchronization() + 1;
            disp.weaps[i].synch.onchange = () => { wlist[i].SetSynchronization(disp.weaps[i].synch.selectedIndex - 1); };
            disp.weaps[i].synch.disabled = !wlist[i].can_synchronize;
            var can = wlist[i].CanSynchronization();
            for (let j = 0; j < can.length; j++) {
                disp.weaps[i].synch.options[j].disabled = !can[j];
            }
        }
        var stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString(), false);
        BlinkIfChanged(disp.stats.drag, stats.drag.toString(), false);
        BlinkIfChanged(disp.stats.cost, stats.cost.toString(), false);
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString(), false);
        var h = set.GetHits();
        var hits = h[0].toString() + "/"
            + h[1].toString() + "/"
            + h[2].toString() + "/"
            + h[3].toString();
        if (set.GetFixed())
            BlinkIfChanged(disp.stats.mounting, lu("Fixed"));
        else if (set.GetDirectionCount() <= 2)
            BlinkIfChanged(disp.stats.mounting, lu("Flexible"));
        else
            BlinkIfChanged(disp.stats.mounting, lu("Turret"));
        BlinkIfChanged(disp.stats.jams, set.GetJam());
        BlinkIfChanged(disp.stats.hits, hits);
        BlinkIfChanged(disp.stats.damg, set.GetDamage().toString());
        if (set.GetProjectile() == ProjectileType.HEATRAY || set.IsLightningArc()) { //Heat Rays or lightning guns
            let chgs = set.GetHRCharges();
            disp.stats.shots_header.textContent = lu("Weapons Stat Charges");
            BlinkIfChanged(disp.stats.shots, StringFmt.Join("/", chgs));
        }
        else {
            disp.stats.shots_header.textContent = lu("Weapons Stat Shots");
            BlinkIfChanged(disp.stats.shots, set.GetShots().toString());
        }
    }
    UpdateWSets() {
        var wsets = this.weap.GetWeaponSets();
        if (wsets.length == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.inp_w_count.valueAsNumber = wsets.length;
        while (wsets.length > this.wrow.length) {
            this.wrow.push(this.CreateWSetRow());
        }
        while (wsets.length < this.wrow.length) {
            this.tbl.deleteRow(this.wrow.length);
            this.wrow.pop();
        }
        for (let i = 0; i < wsets.length; i++) {
            this.UpdateWSet(wsets[i], this.wrow[i]);
        }
    }
    UpdateDisplay() {
        this.UpdateWSets();
        this.inp_w_count.valueAsNumber = this.weap.GetWeaponSets().length;
        this.inp_w_brace.valueAsNumber = this.weap.GetBraceCount();
    }
}
function WeaponName(w, wlist) {
    var ds = w.GetDirection();
    var dircount = 0;
    for (let d of ds) {
        if (d)
            dircount++;
    }
    var name = "";
    if (dircount == 1 && w.GetFixed())
        name += lu("Fixed") + " ";
    else if (dircount <= 2)
        name += lu("Flexible") + " ";
    else
        name += lu("Turreted") + " ";
    if (w.GetAction() == ActionType.MECHANICAL) {
        name += lu("Weapon Tag Mechanical Action") + " ";
    }
    else if (w.GetAction() == ActionType.GAST) {
        name += lu("Weapon Tag Gast Principle") + " ";
    }
    else if (w.GetAction() == ActionType.ROTARY) {
        name += lu("Weapon Tag Rotary") + " ";
    }
    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        name += lu("Weapon Tag Heat Ray") + " ";
    }
    else if (w.GetProjectile() == ProjectileType.GYROJETS) {
        name += lu("Weapon Tag Gyrojet") + " ";
    }
    else if (w.GetProjectile() == ProjectileType.PNEUMATIC) {
        name += lu("Weapon Tag Pneumatic") + " ";
    }
    name += wlist[w.GetWeaponSelected()].abrv;
    return name;
}
function WeaponTags(w) {
    var tags = [lu("Weapon Tag Jam", w.GetJam())];
    let fweap = w.GetFinalWeapon();
    if (w.GetReload() > 0) {
        if (w.GetReload() == 1) {
            tags.push(lu("Weapon Tag Manual"));
        }
        else {
            tags.push(lu("Weapon Tag Reload", w.GetReload()));
        }
    }
    if (fweap.rapid) {
        tags.push(lu("Weapon Tag Rapid Fire"));
    }
    if (fweap.shells) {
        tags.push(lu("Weapon Tag Shells"));
    }
    if (fweap.ap > 0) {
        tags.push(lu("Weapon Tag AP", fweap.ap));
    }
    if (w.GetIsFullyAccessible()) {
        tags.push(lu("Weapon Tag Fully Accessible"));
    }
    else if (w.GetIsPartlyAccessible()) {
        tags.push(lu("Weapon Tag Partly Accessible"));
    }
    else {
        tags.push(lu("Weapon Tag Inaccessible"));
    }
    if (fweap.deflection) {
        tags.push(lu("Weapon Tag Awkward", fweap.deflection));
    }
    return tags;
}
function WeaponString(w, wlist, dlist) {
    var wstring = "";
    var ds = w.GetDirection();
    var dirs = [];
    for (let i = 0; i < dlist.length; i++) {
        if (ds[i])
            dirs.push(lu(dlist[i]));
    }
    let hits = w.GetHits();
    let tags = WeaponTags(w);
    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        let chgs = w.GetHRCharges();
        wstring += lu("Weapon Description Heat Ray", lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), this.WeaponName(w, wlist), StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, StringFmt.Join("/", hits), StringFmt.Join("/", chgs), StringFmt.Join(", ", tags));
    }
    else {
        wstring += lu("Weapon Description", lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), this.WeaponName(w, wlist), StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, StringFmt.Join("/", hits), w.GetShots(), StringFmt.Join(", ", tags));
    }
    return wstring;
}
var ENGINE_TEXT;
(function (ENGINE_TEXT) {
    ENGINE_TEXT[ENGINE_TEXT["SINGLE"] = 0] = "SINGLE";
    ENGINE_TEXT[ENGINE_TEXT["PUSHER"] = 1] = "PUSHER";
    ENGINE_TEXT[ENGINE_TEXT["PULLER"] = 2] = "PULLER";
})(ENGINE_TEXT || (ENGINE_TEXT = {}));
;
class Cards {
    constructor() {
        this.dash_canvas = document.createElement("CANVAS");
        this.dash_canvas.width = 1122;
        this.dash_canvas.height = 786;
        this.dash_image = document.getElementById("dash_img");
        this.dash_image.width = 1122;
        this.dash_image.height = 786;
        // this.dash_image.src = './Cards/Dashboard.png';
        this.weap_canvas = document.createElement("CANVAS");
        this.weap_canvas.width = 483;
        this.weap_canvas.height = 291;
        this.weap_image = document.getElementById("weap_img");
        this.weap_image.width = 483;
        this.weap_image.height = 291;
        // this.weap_image.src = './Cards/Weapon.png';
        this.eng_canvas = document.createElement("CANVAS");
        this.eng_canvas.width = 600;
        this.eng_canvas.height = 360;
        this.eng_image = document.getElementById("eng_img");
        this.eng_image.width = 600;
        this.eng_image.height = 360;
        // this.eng_image.src = './Cards/Engine.png';
        this.rad_canvas = document.createElement("CANVAS");
        this.rad_canvas.width = 479;
        this.rad_canvas.height = 290;
        this.rad_image = document.getElementById("rad_img");
        this.rad_image.width = 479;
        this.rad_image.height = 290;
        // this.rad_image.src = './Cards/Radiator.png';
        this.npc_canvas = document.createElement("CANVAS");
        this.npc_canvas.width = 482;
        this.npc_canvas.height = 290;
        this.npc_image = document.getElementById("npc_img");
        this.npc_image.width = 482;
        this.npc_image.height = 290;
        this.npc_image.src = './Cards/NPC.png';
        this.acft_data = {
            full_bomb_boost: 0,
            half_bomb_boost: 0,
            full_boost: 0,
            half_boost: 0,
            empty_boost: 0,
            full_bomb_hand: 0,
            half_bomb_hand: 0,
            full_hand: 0,
            half_hand: 0,
            empty_hand: 0,
            full_bomb_climb: 0,
            half_bomb_climb: 0,
            full_climb: 0,
            half_climb: 0,
            empty_climb: 0,
            full_bomb_stall: 0,
            half_bomb_stall: 0,
            full_stall: 0,
            half_stall: 0,
            empty_stall: 0,
            full_bomb_speed: 0,
            half_bomb_speed: 0,
            full_speed: 0,
            half_speed: 0,
            empty_speed: 0,
            fuel: 0,
            dropoff: 0,
            ordinance: [""],
            escape: 0,
            crash: 0,
            visibility: 0,
            energy_loss: 0,
            turn_bleed: 0,
            stability: 0,
            stress: 0,
            toughness: 0,
            max_strain: 0,
            vital_parts: [""],
            armour: [],
            warnings: [{ source: "", warning: "" }],
        };
        this.weap_data = {
            type: "",
            abrv: "",
            ammo: 0,
            ap: 0,
            jam: "",
            hits: [],
            damage: [],
            tags: [],
            reload: 0,
            gyrojet: false,
        };
        this.eng_data = {
            reliability: "0",
            min_IAF: 0,
            altitude: 0,
            overspeed: 0,
            radiator: 0,
            notes: [],
        };
        this.rad_data = {
            mount_type: "",
            coolant_type: "",
        };
    }
    SaveDash() {
        var context = this.dash_canvas.getContext("2d");
        context.clearRect(0, 0, this.dash_canvas.width, this.dash_canvas.height);
        context.textAlign = "center";
        context.drawImage(this.dash_image, 0, 0);
        context.font = "35px Balthazar";
        context.fillText(this.acft_data.full_bomb_boost.toString(), 493, 94, 80);
        context.fillText(this.acft_data.full_bomb_hand.toString(), 493 + 1 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_climb.toString(), 493 + 2 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_stall.toString(), 493 + 3 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_speed.toString(), 493 + 4 * 62, 94, 80);
        context.fillText(this.acft_data.half_bomb_boost.toString(), 493, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_hand.toString(), 493 + 1 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_climb.toString(), 493 + 2 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_stall.toString(), 493 + 3 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_speed.toString(), 493 + 4 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.full_boost.toString(), 493, 94 + 80, 80);
        context.fillText(this.acft_data.full_hand.toString(), 493 + 1 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_climb.toString(), 493 + 2 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_stall.toString(), 493 + 3 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_speed.toString(), 493 + 4 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.half_boost.toString(), 493, 94 + 120, 80);
        context.fillText(this.acft_data.half_hand.toString(), 493 + 1 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_climb.toString(), 493 + 2 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_stall.toString(), 493 + 3 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_speed.toString(), 493 + 4 * 62, 94 + 120, 80);
        context.fillText("0", 493, 94 + 160, 80);
        context.fillText(this.acft_data.empty_hand.toString(), 493 + 1 * 62, 94 + 160, 80);
        context.fillText("0", 493 + 2 * 62, 94 + 160, 80);
        context.fillText(this.acft_data.empty_stall.toString(), 493 + 3 * 62, 94 + 160, 80);
        context.fillText("0", 493 + 4 * 62, 94 + 160, 80);
        context.fillText(Math.floor(this.acft_data.fuel).toString(), 417, 310, 35);
        context.fillText(this.acft_data.dropoff.toString(), 1048, 375, 35);
        context.fillText(this.acft_data.escape.toString(), 85, 640, 35);
        context.fillText(this.acft_data.crash.toString(), 85, 720, 35);
        context.fillText(this.acft_data.visibility.toString(), 135, 460, 35);
        context.fillText(this.acft_data.stability.toString(), 135, 550, 35);
        context.fillText(this.acft_data.energy_loss.toString(), 70, 505, 35);
        context.fillText(this.acft_data.turn_bleed.toString(), 195, 505, 35);
        context.fillText(this.acft_data.stress.toString(), 285, 495, 35);
        context.fillText(this.acft_data.toughness.toString(), 250, 645, 35);
        context.fillText(this.acft_data.max_strain.toString(), 250, 720, 35);
        context.font = "20px Balthazar";
        context.textAlign = "left";
        var rows = Math.min(this.acft_data.ordinance.length, 2);
        var cols = Math.ceil(-1.0e-6 + this.acft_data.ordinance.length / rows);
        var idx = 0;
        for (let r = 0; r < rows; r++) {
            let ypx = 612 + 27 * r;
            let str = "";
            for (let c = 0; c < cols; c++) {
                if (idx < this.acft_data.ordinance.length) {
                    if (c != 0) {
                        str += ", ";
                    }
                    str += this.acft_data.ordinance[idx];
                }
                idx++;
            }
            context.fillText(str, 335, ypx, 370);
        }
        var rows = Math.min(this.acft_data.vital_parts.length, 5);
        var cols = Math.ceil(-1.0e-6 + this.acft_data.vital_parts.length / rows);
        var idx = 0;
        for (let r = 0; r < rows; r++) {
            let ypx = 392 + 27 * r;
            let str = "";
            for (let c = 0; c < cols; c++) {
                if (idx < this.acft_data.vital_parts.length) {
                    if (c != 0) {
                        str += ", ";
                    }
                    str += this.acft_data.vital_parts[idx];
                }
                idx++;
            }
            context.fillText(str, 335, ypx, 370);
        }
        var str = "";
        for (let r = 0; r < this.acft_data.armour.length; ++r) {
            let AP = r + 1;
            if (this.acft_data.armour[r] > 0) {
                if (str != "")
                    str += ", ";
                else
                    str += lu("Armour") + " ";
                str += AP.toString() + "/+" + (11 - this.acft_data.armour[r]).toString();
            }
        }
        context.fillText(str, 335, 558, 375);
        context.font = "14px Balthazar";
        var max_idx = 6;
        var idx = 1;
        for (let r = 0; r < this.acft_data.warnings.length; ++r) {
            if (this.acft_data.warnings[r].source == lu("Armour"))
                continue;
            let str = this.acft_data.warnings[r].source + ": " + this.acft_data.warnings[r].warning;
            if (idx == max_idx && this.acft_data.warnings.length > r + 1) {
                context.fillText(lu("Cards Too Many Warnings Warning"), 335, 673 + idx * 14, 370);
            }
            else if (idx > max_idx) {
            }
            else {
                context.fillText(str, 335, 673 + idx * 14, 370);
            }
            idx++;
        }
        this.download(this.name + "_Dashboard", this.dash_canvas);
    }
    SaveWeapon(weapon_num) {
        weapon_num++;
        var context = this.weap_canvas.getContext("2d");
        context.clearRect(0, 0, this.weap_canvas.width, this.weap_canvas.height);
        context.textAlign = "center";
        context.drawImage(this.weap_image, 0, 0);
        context.font = "25px Balthazar";
        context.fillText(this.weap_data.type, 150, 112, 215);
        context.font = "15px Balthazar";
        var ammo = "";
        if (this.weap_data.reload > 0) {
            ammo += lu("Cards Gun String Reload", (this.weap_data.ammo / this.weap_data.reload).toString(), this.weap_data.reload.toString());
            this.weap_data.tags.push(lu("Weapon Tag Reload", this.weap_data.reload.toString()));
        }
        else {
            ammo += lu("Cards Gun String No Reload", this.weap_data.ammo);
        }
        context.fillText(ammo, 95, 158, 105);
        context.fillText(this.weap_data.ap.toString(), 172, 158, 23);
        context.fillText(this.weap_data.jam, 230, 158, 65);
        context.fillText(this.weap_data.hits[0].toString(), 157, 208, 80);
        context.fillText(this.weap_data.hits[1].toString(), 157 + 80, 208, 80);
        context.fillText(this.weap_data.hits[2].toString(), 157 + 160, 208, 80);
        context.fillText(this.weap_data.hits[3].toString(), 157 + 240, 208, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[0])).toString(), 157, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[1])).toString(), 157 + 80, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[2])).toString(), 157 + 160, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[3])).toString(), 157 + 240, 208 + 23, 80);
        context.textAlign = "left";
        context.fillText(this.weap_data.tags[0], 90, 256, 350);
        var tags = "";
        for (let i = 1; i < this.weap_data.tags.length; i++) {
            if (i != 1)
                tags += ", ";
            tags += this.weap_data.tags[i];
        }
        context.fillText(tags, 90, 276, 350);
        this.download(this.name + "_Weapon_" + weapon_num.toString(), this.weap_canvas);
    }
    SaveEngine(engine_num, text = ENGINE_TEXT.SINGLE) {
        engine_num++;
        var context = this.eng_canvas.getContext("2d");
        context.clearRect(0, 0, this.eng_canvas.width, this.eng_canvas.height);
        context.drawImage(this.eng_image, 0, 0);
        context.textAlign = "center";
        context.font = "18px Balthazar";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.eng_data.reliability, 235, 75, 110);
        var alt_string = this.eng_data.min_IAF.toString() + "-" + (this.eng_data.min_IAF + this.eng_data.altitude).toString();
        context.fillText(alt_string, 347, 75, 110);
        context.fillText(this.eng_data.overspeed.toString(), 480, 75, 110);
        var note_str = "";
        for (let i = 0; i < this.eng_data.notes.length; i++) {
            if (i != 0)
                note_str += ", ";
            note_str += this.eng_data.notes[i];
        }
        context.fillText(note_str, 365, 105, 306);
        if (this.eng_data.radiator >= 0) {
            context.fillText(lu("Cards Uses Radiator", this.eng_data.radiator + 1), 109, 340, 270);
        }
        context.textAlign = "right";
        context.font = "30px Balthazar";
        context.fillStyle = "#fff";
        context.strokeStyle = "#fff";
        context.fillText("#" + engine_num.toString(), 37, 67, 35);
        switch (text) {
            case ENGINE_TEXT.SINGLE:
                this.download(this.name + "_Engine_" + engine_num.toString(), this.eng_canvas);
                break;
            case ENGINE_TEXT.PUSHER:
                this.download(this.name + "_Engine_" + engine_num.toString() + "_Pusher", this.eng_canvas);
                break;
            case ENGINE_TEXT.PULLER:
                this.download(this.name + "_Engine_" + engine_num.toString() + "_Puller", this.eng_canvas);
                break;
        }
    }
    SaveRadiator(radiator_num) {
        radiator_num++;
        var context = this.rad_canvas.getContext("2d");
        context.clearRect(0, 0, this.rad_canvas.width, this.rad_canvas.height);
        context.drawImage(this.rad_image, 0, 0);
        context.textAlign = "center";
        context.font = "25px Balthazar";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.rad_data.mount_type, 162, 141, 230);
        context.fillText(this.rad_data.coolant_type, 162, 217, 230);
        context.textAlign = "right";
        context.font = "25px Balthazar";
        context.fillStyle = "#fff";
        context.strokeStyle = "#fff";
        context.fillText("#" + radiator_num.toString(), 37, 56, 35);
        this.download(this.name + "_Radiator_" + radiator_num.toString(), this.rad_canvas);
    }
    SaveNPC() {
        var context = this.npc_canvas.getContext("2d");
        context.clearRect(0, 0, this.npc_canvas.width, this.npc_canvas.height);
        context.drawImage(this.npc_image, 0, 0);
        context.font = "20px Balthazar";
        context.textAlign = "center";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.name, 100, 100, 145);
        context.fillText("" + this.lowest_overspeed, 70, 158, 40);
        context.fillText("" + this.acft_data.full_speed, 126, 158, 40);
        var combat_speed = Math.floor(1.0e-6 + 0.9 * this.acft_data.full_speed - this.acft_data.turn_bleed);
        context.fillText("" + combat_speed, 187, 158, 40);
        context.fillText("" + this.acft_data.full_stall, 245, 158, 40);
        var structure = this.acft_data.toughness + this.acft_data.max_strain;
        context.fillText("" + structure, 70, 236, 40);
        context.fillText("" + this.acft_data.full_hand, 123, 236, 40);
        var wep;
        if (this.all_weapons[0]) {
            wep = this.all_weapons[0];
            context.font = "12px Avenir";
            context.fillText(wep.abrv, 232, 71, 91);
            context.font = "20px Balthazar";
            var hits = StringFmt.Join("/", [wep.hits[0],
                wep.hits[1],
                wep.hits[2],
                wep.hits[3]]);
            var dam = StringFmt.Join("/", [Math.floor(1.0e-6 + this.weap_data.damage[0]),
                Math.floor(1.0e-6 + this.weap_data.damage[1]),
                Math.floor(1.0e-6 + this.weap_data.damage[2]),
                Math.floor(1.0e-6 + this.weap_data.damage[3])]);
            context.fillText(hits, 320, 71, 80);
            context.fillText(dam, 401, 71, 80);
        }
        if (this.all_weapons[1]) {
            wep = this.all_weapons[1];
            context.font = "12px Avenir";
            context.fillText(wep.abrv, 232, 103, 91);
            context.font = "20px Balthazar";
            var hits = StringFmt.Join("/", [wep.hits[0],
                wep.hits[1],
                wep.hits[2],
                wep.hits[3]]);
            var dam = StringFmt.Join("/", [Math.floor(1.0e-6 + wep.hits[0] * wep.damage),
                Math.floor(1.0e-6 + wep.hits[1] * wep.damage),
                Math.floor(1.0e-6 + wep.hits[2] * wep.damage),
                Math.floor(1.0e-6 + wep.hits[3] * wep.damage)]);
            context.fillText(hits, 320, 103, 80);
            context.fillText(dam, 401, 103, 80);
        }
        this.download(this.name + "_NPC", this.npc_canvas);
    }
    download(filename, canvas) {
        var lnk = document.createElement('a');
        lnk.download = filename + ".png";
        lnk.href = canvas.toDataURL();
        if (document.createEvent) {
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            /// send event            
            lnk.dispatchEvent(e);
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="./Era.ts" />
/// <reference path="./Cockpits.ts" />
/// <reference path="./Passengers.ts" />
/// <reference path="./Engines.ts" />
/// <reference path="./Propeller.ts" />
/// <reference path="./Frames.ts" />
/// <reference path="./Wings.ts" />
/// <reference path="./Stabilizers.ts" />
/// <reference path="./ControlSurfaces.ts" />
/// <reference path="./Reinforcement.ts" />
/// <reference path="./Load.ts" />
/// <reference path="./LandingGear.ts" />
/// <reference path="./Accessories.ts" />
/// <reference path="./Optimization.ts" />
/// <reference path="./Weapons.ts" />
/// <reference path="./Derived.ts" />
/// <reference path="../impl/Aircraft.ts" />
/// <reference path="./Cards.ts"/>
class Aircraft_HTML extends Display {
    constructor(js, aircraft) {
        super();
        this.acft = aircraft;
        this.era = new Era_HTML(this.acft.GetEra());
        this.cockpits = new Cockpits_HTML(aircraft.GetCockpits());
        this.passengers = new Passengers_HTML(aircraft.GetPassengers());
        this.engines = new Engines_HTML(aircraft.GetEngines());
        this.propeller = new Propeller_HTML(aircraft.GetPropeller());
        this.frames = new Frames_HTML(aircraft.GetFrames());
        this.wings = new Wings_HTML(aircraft.GetWings());
        this.stabilizers = new Stabilizers_HTML(aircraft.GetStabilizers());
        this.controlsurfaces = new ControlSurfaces_HTML(aircraft.GetControlSurfaces());
        this.reinforcements = new Reinforcement_HTML(aircraft, aircraft.GetReinforcements());
        this.load = new Load_HTML(aircraft.GetFuel(), aircraft.GetMunitions(), aircraft.GetCargoAndPassengers());
        this.gear = new LandingGear_HTML(aircraft.GetLandingGear());
        this.accessories = new Accessories_HTML(aircraft.GetAccessories());
        this.optimization = new Optimization_HTML(aircraft.GetOptimization());
        this.weapons = new Weapons_HTML(aircraft.GetWeapons());
        this.used = new Used_HTML(aircraft.GetUsed());
        this.rotor = new Rotor_HTML(aircraft.GetRotor());
        this.alter = new AlterStats_HTML(aircraft.GetAlter());
        document.getElementById("lbl_acft_type").textContent = lu("Aircraft Type Section Title");
        this.acft_type = document.getElementById("acft_type");
        for (let type in AIRCRAFT_TYPE) {
            if (isNaN(Number(type))) {
                let opt = document.createElement("OPTION");
                opt.text = lu(type);
                this.acft_type.add(opt);
            }
        }
        this.acft_type.onchange = () => { this.acft.SetType(this.acft_type.selectedIndex); };
        document.getElementById("lbl_stats").textContent = lu("Aircraft Stats Section Title");
        var tbl = document.getElementById("tbl_stats");
        this.InitStats(tbl);
        document.getElementById("lbl_derived").textContent = lu("Aircraft Derived Section Title");
        var tbl2 = document.getElementById("tbl_derived");
        this.InitDerived(tbl2);
        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        document.getElementById("lbl_acft_save_top").textContent = lu("Aircraft Button Save");
        document.getElementById("lbl_acft_save_bot").textContent = lu("Aircraft Button Save");
        var save_button = document.getElementById("acft_save");
        save_button.onclick = () => { this.SaveJSON(); };
        document.getElementById("lbl_acft_load_top").textContent = lu("Aircraft Button Load");
        document.getElementById("lbl_acft_load_bot").textContent = lu("Aircraft Button Load");
        var load_button = document.getElementById("acft_load");
        load_button.multiple = false;
        load_button.accept = "application/JSON";
        load_button.onchange = (evt) => { this.LoadJSON(load_button); };
        var load_text_area = document.getElementById("acft_load_text");
        load_text_area.onchange = () => { this.LoadText(load_text_area); };
        var load_text_area2 = document.getElementById("acft_load_text2");
        load_text_area2.onchange = () => { this.LoadText(load_text_area2); };
        document.getElementById("lbl_acft_save_link_top").textContent = lu("Aircraft Button Copy As Link");
        document.getElementById("lbl_acft_save_link_bot").textContent = lu("Aircraft Button Copy As Link");
        var link_button = document.getElementById("acft_save_link");
        link_button.onclick = () => { this.SaveLink(); };
        this.cards = new Cards();
        document.getElementById("lbl_acft_save_dash_top").textContent = lu("Aircraft Button Save Dashboard");
        document.getElementById("lbl_acft_save_dash_bot").textContent = lu("Aircraft Button Save Dashboard");
        var dash_button = document.getElementById("acft_save_dash");
        dash_button.onclick = () => { this.SaveDash(); };
        document.getElementById("lbl_acft_interactive_dash_top").textContent = lu("Aircraft Button Interactive Dashboard");
        document.getElementById("lbl_acft_interactive_dash_bot").textContent = lu("Aircraft Button Interactive Dashboard");
        var interactive_button = document.getElementById("acft_interactive_dash");
        interactive_button.onclick = () => { this.SaveInteractive(); };
        document.getElementById("lbl_acft_save_npc_top").textContent = lu("Aircraft Button Save NPC");
        document.getElementById("lbl_acft_save_npc_bot").textContent = lu("Aircraft Button Save NPC");
        var npc_button = document.getElementById("acft_save_npc");
        npc_button.onclick = () => { this.SaveNPC(); };
        document.getElementById("lbl_acft_reset_top").textContent = lu("Aircraft Button Default Aircraft");
        document.getElementById("lbl_acft_reset_bot").textContent = lu("Aircraft Button Default Aircraft");
        var reset_button = document.getElementById("acft_reset");
        reset_button.onclick = () => { this.acft.Reset(); this.derived.SetName(this.acft.name); this.acft.CalculateStats(); };
        document.getElementById("lbl_acft_save_cat_top").textContent = lu("Aircraft Button Save Catalog");
        document.getElementById("lbl_acft_save_cat_bot").textContent = lu("Aircraft Button Save Catalog");
        var cat_button = document.getElementById("acft_save_cat");
        cat_button.onclick = () => { this.CatalogStats(); };
    }
    UpdateCard() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        this.cards.name = this.acft.name;
        this.cards.acft_data.armour = this.acft.GetAccessories().GetEffectiveCoverage();
        this.cards.acft_data.crash = stats.crashsafety;
        this.cards.acft_data.dropoff = derived.Dropoff;
        this.cards.acft_data.empty_boost = derived.BoostEmpty;
        this.cards.acft_data.empty_hand = derived.HandlingEmpty;
        this.cards.acft_data.empty_climb = derived.RateOfClimbEmpty;
        this.cards.acft_data.empty_stall = derived.StallSpeedEmpty;
        this.cards.acft_data.empty_speed = Math.floor(1.0e-6 + derived.MaxSpeedEmpty);
        this.cards.acft_data.energy_loss = derived.EnergyLoss;
        this.cards.acft_data.escape = this.acft.GetCockpits().GetEscapeList()[0];
        this.cards.acft_data.fuel = derived.FuelUses;
        this.cards.acft_data.full_bomb_boost = derived.BoostFullwBombs;
        this.cards.acft_data.full_bomb_hand = derived.HandlingFullwBombs;
        this.cards.acft_data.full_bomb_climb = derived.RateOfClimbwBombs;
        this.cards.acft_data.full_bomb_stall = derived.StallSpeedFullwBombs;
        this.cards.acft_data.full_bomb_speed = derived.MaxSpeedwBombs;
        this.cards.acft_data.full_boost = derived.BoostFull;
        this.cards.acft_data.full_hand = derived.HandlingFull;
        this.cards.acft_data.full_climb = derived.RateOfClimbFull;
        this.cards.acft_data.full_stall = derived.StallSpeedFull;
        this.cards.acft_data.full_speed = Math.floor(1.0e-6 + derived.MaxSpeedFull);
        this.cards.acft_data.half_bomb_boost = Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_bomb_hand = Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_bomb_climb = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2);
        this.cards.acft_data.half_bomb_stall = Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.half_bomb_speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2);
        this.cards.acft_data.half_boost = Math.floor((derived.BoostFull + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_hand = Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_climb = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2);
        this.cards.acft_data.half_stall = Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.half_speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2);
        this.cards.acft_data.max_strain = derived.MaxStrain;
        var ordinance = [];
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
                ordinance.push(lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(lu(" Rocket Mass Internally.", int_rock));
            if (ext_rock > 0)
                ordinance.push(lu(" Rocket Mass Externally.", ext_rock));
        }
        this.cards.acft_data.ordinance = ordinance;
        this.cards.acft_data.stability = derived.Stabiilty;
        this.cards.acft_data.stress = this.acft.GetCockpits().GetStressList()[0][0];
        this.cards.acft_data.toughness = derived.Toughness;
        this.cards.acft_data.turn_bleed = derived.TurnBleed;
        this.cards.acft_data.visibility = this.acft.GetCockpits().GetVisibilityList()[0];
        this.cards.acft_data.vital_parts = this.acft.VitalComponentList();
        this.cards.acft_data.warnings = stats.warnings;
    }
    UpdateWeaponCard(w) {
        var wlist = this.acft.GetWeapons().GetWeaponList();
        var dlist = this.acft.GetWeapons().GetDirectionList();
        var name = WeaponName(w, wlist);
        if (w.IsPlural()) {
            name = w.GetWeaponCount().toString() + "x " + name;
        }
        var ds = w.GetDirection();
        var dtag = "";
        dtag += "[";
        for (let i = 0; i < dlist.length; i++) {
            if (ds[i])
                dtag += lu(dlist[i]) + " ";
        }
        dtag = dtag.substr(0, dtag.length - 1);
        dtag += "] ";
        var fweap = w.GetFinalWeapon();
        this.cards.weap_data.ammo = w.GetShots();
        this.cards.weap_data.ap = fweap.ap;
        this.cards.weap_data.hits = w.GetHits();
        if (wlist[w.GetWeaponSelected()].abrv == "PR") {
            this.cards.weap_data.damage = [5, 5, 5, 5];
        }
        else {
            this.cards.weap_data.damage = [
                fweap.damage * this.cards.weap_data.hits[0],
                fweap.damage * this.cards.weap_data.hits[1],
                fweap.damage * this.cards.weap_data.hits[2],
                fweap.damage * this.cards.weap_data.hits[3]
            ];
        }
        this.cards.weap_data.jam = w.GetJam();
        this.cards.weap_data.tags = [dtag];
        this.cards.weap_data.type = name;
        this.cards.weap_data.abrv = fweap.abrv;
        this.cards.weap_data.reload = fweap.reload;
        this.cards.weap_data.tags.concat(WeaponTags(w));
    }
    UpdateEngineCard(e) {
        var estats = e.GetCurrentStats();
        this.cards.eng_data.reliability = e.GetReliability();
        this.cards.eng_data.overspeed = e.GetOverspeed();
        this.cards.eng_data.altitude = estats.altitude;
        if (e.NeedCooling()) {
            this.cards.eng_data.radiator = e.GetRadiator();
        }
        else {
            this.cards.eng_data.radiator = -1;
        }
        this.cards.eng_data.notes = [];
        if (estats.pulsejet) {
            this.cards.eng_data.notes.push(lu("Pulsejet"));
            if (e.GetSelectedList() != "") {
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    this.cards.eng_data.notes.push(lu("Starter"));
                }
            }
        }
        else {
            if (e.IsRotary() && e.IsTractor()) {
                this.cards.eng_data.notes.push(lu("Turns Right"));
            }
            else if (e.IsRotary() && e.IsPusher()) {
                this.cards.eng_data.notes.push(lu("Turns Left"));
            }
            if (e.GetSelectedList() != "") {
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                this.cards.eng_data.min_IAF = inputs.min_IAF;
                if (inputs.upgrades[1]) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power"));
                }
                else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power from altitudes 0-9"));
                }
            }
        }
    }
    UpdateRadiatorCard(r) {
        this.cards.rad_data.mount_type = lu(r.GetMountList()[r.GetMountIndex()].name);
        this.cards.rad_data.coolant_type = lu(r.GetCoolantList()[r.GetCoolantIndex()].name);
    }
    LoadJSON(load_button) {
        if (load_button.files.length == 0)
            return;
        var file = load_button.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            try {
                var str = JSON.parse(reader.result);
                var acft = new Aircraft(parts_JSON, weapon_JSON, false);
                if (acft.fromJSON(str)) {
                    str = JSON.parse(reader.result);
                    console.log(str);
                    this.acft.fromJSON(str);
                    this.derived.SetName(this.acft.name);
                    this.acft.CalculateStats();
                }
            }
            catch (e) {
                console.error(e, e.stack);
            }
        };
        reader.readAsText(file);
        load_button.value = "";
    }
    Stress2Str(arr) {
        var str = "";
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + "), ";
            }
            else {
                str += arr[i][0].toString() + ", ";
            }
        }
        if (arr.length > 0) {
            var i = arr.length - 1;
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + ")";
            }
            else {
                str += arr[i][0].toString();
            }
        }
        return str;
    }
    CatalogStats() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        var catalog_stats = this.MakeLink() + "\n";
        catalog_stats += this.acft.name + "\n";
        catalog_stats += "Insert Nickname Here\n";
        catalog_stats += StringFmt.Format("{0}þ New, {1}þ Used\n", stats.cost, Math.floor(1.0e-6 + stats.cost / 2));
        catalog_stats += StringFmt.Format("{0}þ Upkeep\n\n", stats.upkeep);
        if (stats.bomb_mass > 0) {
            catalog_stats += StringFmt.Format("Full Load\t{0}\t{1}\t{2}\t{3}\t{4}\n", derived.BoostFullwBombs, derived.HandlingFullwBombs, derived.RateOfClimbwBombs, derived.StallSpeedFullwBombs, derived.MaxSpeedwBombs);
            catalog_stats += StringFmt.Format("½, Bombs\t{0}\t{1}\t{2}\t{3}\t{4}\n", Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2), Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2), Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2), Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2), Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2));
        }
        catalog_stats += StringFmt.Format("Full Fuel\t{0}\t{1}\t{2}\t{3}\t{4}\n", derived.BoostFull, derived.HandlingFull, derived.RateOfClimbFull, derived.StallSpeedFull, derived.MaxSpeedFull);
        catalog_stats += StringFmt.Format("Half Fuel\t{0}\t{1}\t{2}\t{3}\t{4}\n", Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2), Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2), Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2), Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2), Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2));
        catalog_stats += StringFmt.Format("Empty\t\t{0}\t{1}\t{2}\t{3}\t{4}\n", "-", derived.HandlingEmpty, "-", derived.StallSpeedEmpty, 0);
        catalog_stats += "\nVital Parts\n";
        catalog_stats += StringFmt.Join(", ", this.acft.VitalComponentList());
        catalog_stats += "\n\n";
        catalog_stats += StringFmt.Format("Dropoff {0}, Reliability {1}, Overspeed {2}, Ideal Alt. {3}, Fuel {4}\n\n", derived.Dropoff, StringFmt.Join("/", this.acft.GetReliabilityList()), derived.Overspeed, this.acft.GetMinIAF().toString() + "-" + this.acft.GetMaxAltitude().toString(), derived.FuelUses);
        if (derived.TurnBleed == derived.TurnBleedwBombs) {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3}\n\n", StringFmt.Join("/", this.acft.GetVisibilityList()), derived.Stabiilty, derived.EnergyLoss, derived.TurnBleed);
        }
        else {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3} ({4})\n\n", StringFmt.Join("/", this.acft.GetVisibilityList()), derived.Stabiilty, derived.EnergyLoss, derived.TurnBleed, derived.TurnBleedwBombs);
        }
        catalog_stats += StringFmt.Format("Toughness {0}, Max Strain {1}, Escape {2}, Crash Safety {3}, Flight Stress {4}\n\n", derived.Toughness, derived.MaxStrain, StringFmt.Join("/", this.acft.GetEscapeList()), StringFmt.Join("/", this.acft.GetCrashList()), this.Stress2Str(this.acft.GetStressList()));
        var wlist = this.acft.GetWeapons().GetWeaponList();
        var dlist = this.acft.GetWeapons().GetDirectionList();
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                catalog_stats += lu(" Bomb Mass Internally.", int_bomb);
            if (ext_bomb > 0)
                catalog_stats += lu(" Bomb Mass Externally.", ext_bomb);
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
                catalog_stats += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            catalog_stats += "\n";
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                catalog_stats += lu(" Rocket Mass Internally.", int_rock);
            if (ext_rock > 0)
                catalog_stats += lu(" Rocket Mass Externally.", ext_rock);
            catalog_stats += "\n";
        }
        var wsets = this.acft.GetWeapons().GetWeaponSets();
        for (let wi = 0; wi < wsets.length; wi++) {
            var w = wsets[wi];
            catalog_stats += WeaponString(w, wlist, dlist) + "\n";
        }
        for (let w of stats.warnings) {
            catalog_stats += w.source + ":  " + w.warning + "\n";
        }
        download(catalog_stats, this.acft.name + "_" + this.acft.GetVersion() + ".txt", "txt");
    }
    LoadText(text_area) {
        try {
            var str = JSON.parse(text_area.value);
            var acft = new Aircraft(parts_JSON, weapon_JSON, false);
            if (acft.fromJSON(str)) {
                this.acft.fromJSON(str);
                this.derived.SetName(this.acft.name);
                this.acft.CalculateStats();
            }
        }
        catch {
            BlinkBad(text_area.parentElement);
        }
        finally {
            text_area.value = "";
        }
    }
    SaveJSON() {
        this.acft.name = this.derived.GetName();
        download(JSON.stringify(this.acft.toJSON()), this.acft.name + "_" + this.acft.GetVersion() + ".json", "json");
    }
    MakeLink() {
        this.acft.name = this.derived.GetName();
        var ser = new Serialize();
        this.acft.serialize(ser);
        var arr = ser.FinalArray();
        var str2 = _arrayBufferToString(arr);
        var txt2 = LZString.compressToEncodedURIComponent(str2);
        var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt2);
        return link;
    }
    SaveLink() {
        copyStringToClipboard(this.MakeLink());
    }
    SaveDash() {
        this.UpdateCard();
        this.cards.SaveDash();
        var wsetlist = this.acft.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.SaveWeapon(i);
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            let e = this.acft.GetEngines().GetEngine(i);
            this.UpdateEngineCard(e);
            if (e.GetUsePushPull()) {
                var rely = this.cards.eng_data.reliability;
                var rely2 = rely.split('/');
                this.cards.eng_data.reliability = rely2[0].toString();
                this.cards.SaveEngine(i, ENGINE_TEXT.PULLER);
                this.cards.eng_data.reliability = rely2[0].toString();
                this.cards.SaveEngine(i, ENGINE_TEXT.PUSHER);
            }
            else {
                this.cards.SaveEngine(i);
            }
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfRadiators(); i++) {
            this.UpdateRadiatorCard(this.acft.GetEngines().GetRadiator(i));
            this.cards.SaveRadiator(i);
        }
    }
    SaveInteractive() {
        var link = ("https://dpierkowski.github.io/flying-circus/index.html?json=" + btoa(this.InteractiveDash()));
        window.open(link, "_blank");
    }
    InteractiveDash() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        var str_vital = this.acft.VitalComponentList();
        var remove = false;
        while (str_vital.length > 10) {
            str_vital.pop();
            remove = true;
        }
        if (remove) {
            str_vital.pop();
            str_vital.push("And More. See Plane Builder for full list.");
        }
        while (str_vital.length < 10) {
            str_vital.push("");
        }
        var coverage = this.acft.GetAccessories().GetEffectiveCoverage();
        var armour_str = "";
        for (let r = 0; r < coverage.length; ++r) {
            let AP = r + 1;
            if (coverage[r] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                else
                    armour_str += lu("Armour") + " ";
                armour_str += AP.toString() + "/+" + (11 - coverage[r]).toString();
            }
        }
        var ordinance = [];
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
        if (bombs > 0 || rockets > 0) {
            ordinance.push("Current load here.");
        }
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
                ordinance.push(lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(lu(" Rocket Mass Internally.", int_rock));
            if (ext_rock > 0)
                ordinance.push(lu(" Rocket Mass Externally.", ext_rock));
        }
        while (ordinance.length < 5) {
            ordinance.push("");
        }
        var warnings = "";
        for (let w of stats.warnings) {
            warnings += w.source + ": " + w.warning + "\n";
        }
        var planeState = {
            "altitude": 0,
            "airspeed": 0,
            "fuel": derived.FuelUses,
            "dropoff": derived.Dropoff,
            "visibility": this.acft.GetCockpits().GetCockpit(0).GetVisibility(),
            "energy_loss": derived.EnergyLoss,
            "turn_bleed": derived.TurnBleed,
            "stability": derived.Stabiilty,
            "stress": this.acft.GetCockpits().GetCockpit(0).GetFlightStress()[0],
            "plane_escape": this.acft.GetCockpits().GetCockpit(0).GetEscape(),
            "crash": this.acft.GetCockpits().GetCockpit(0).GetCrash(),
            "max_toughness": derived.Toughness,
            "current_toughness": derived.Toughness,
            "max_strain": derived.MaxStrain,
            "current_strain": derived.MaxStrain,
            "g_force": 0,
            "kills": 0,
            "full_load_boost": derived.BoostFullwBombs,
            "full_load_handling": derived.HandlingFullwBombs,
            "full_load_climb": derived.RateOfClimbwBombs,
            "full_load_stall": derived.StallSpeedFullwBombs,
            "full_load_speed": derived.MaxSpeedwBombs,
            "half_fuel_bombs_boost": Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2),
            "half_fuel_bombs_handling": Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2),
            "half_fuel_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2),
            "half_fuel_bombs_stall": Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2),
            "half_fuel_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2),
            "full_fuel_no_bombs_boost": derived.BoostFull,
            "full_fuel_no_bombs_handling": derived.HandlingFull,
            "full_fuel_no_bombs_climb": derived.RateOfClimbFull,
            "full_fuel_no_bombs_stall": derived.StallSpeedFull,
            "full_fuel_no_bombs_speed": Math.floor(1.0e-6 + derived.MaxSpeedFull),
            "half_fuel_no_bombs_boost": Math.floor((derived.BoostFull + derived.BoostEmpty) / 2),
            "half_fuel_no_bombs_handling": Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2),
            "half_fuel_no_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2),
            "half_fuel_no_bombs_stall": Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2),
            "half_fuel_no_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2),
            "empty_boost": 0,
            "empty_handling": derived.HandlingEmpty,
            "empty_climb": 0,
            "empty_stall": derived.StallSpeedEmpty,
            "empty_speed": 0,
            "vital_part_1": str_vital[0],
            "vital_part_2": str_vital[1],
            "vital_part_3": str_vital[2],
            "vital_part_4": str_vital[3],
            "vital_part_5": str_vital[4],
            "vital_part_6": str_vital[5],
            "vital_part_7": str_vital[6],
            "vital_part_8": str_vital[7],
            "vital_part_9": str_vital[8],
            "vital_part_10": str_vital[9],
            "armor": armour_str,
            "max_bomb_load": ordinance[0],
            "ordinance_1": ordinance[1],
            "ordinance_2": ordinance[2],
            "ordinance_3": ordinance[3],
            "ordinance_4": ordinance[4],
            "notes": warnings,
            "full_load_selected": true,
            "half_fuel_bombs_selected": false,
            "full_fuel_no_bombs_selected": false,
            "half_fuel_no_bombs_selected": false,
            "empty_selected": false,
            "engines": this.InteractiveEngines(),
            "weapons": this.InteractiveWeapons(),
        };
        return JSON.stringify(planeState);
    }
    InteractiveEngines() {
        var engines = [];
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            let e = this.acft.GetEngines().GetEngine(i);
            let engine_state = {
                "rpm": 0,
                "wear": 0,
                "reliability": e.GetReliability(),
                "ideal_altitide": e.GetMaxAltitude(),
                "overspeed": e.GetOverspeed(),
                "notes": "",
            };
            var estats = e.GetCurrentStats();
            var notes = [];
            if (estats.pulsejet) {
                notes.push(lu("Pulsejet"));
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    notes.push(lu("Starter"));
                }
            }
            else {
                if (e.IsRotary() && e.IsTractor()) {
                    notes.push(lu("Turns Right"));
                }
                else if (e.IsRotary() && e.IsPusher()) {
                    notes.push(lu("Turns Left"));
                }
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.upgrades[1]) {
                    notes.push(lu("War Emergency Power"));
                }
                else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    notes.push(lu("War Emergency Power from altitudes 0-9"));
                }
            }
            engine_state.notes = StringFmt.Join(", ", notes);
            if (e.GetUsePushPull()) {
                var rely = engine_state.reliability;
                var rely2 = rely.split('/');
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
            }
            else {
                engines.push(JSON.stringify(engine_state));
            }
        }
        return engines;
    }
    InteractiveWeapons() {
        var wstates = [];
        for (let w of this.acft.GetWeapons().GetWeaponSets()) {
            var wlist = this.acft.GetWeapons().GetWeaponList();
            var hits = w.GetHits();
            var damage = [];
            if (wlist[w.GetWeaponSelected()].abrv == "PR") {
                damage.push(5);
                damage.push(5);
                damage.push(5);
                damage.push(5);
            }
            else {
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[0]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[1]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[2]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[3]));
            }
            var fweap = w.GetFinalWeapon();
            var tags = [];
            let weaponState = {
                "type": WeaponName(w, wlist),
                "ammo": w.GetShots(),
                "ap": fweap.ap,
                "jam": w.GetJam(),
                "knife_hits": hits[0],
                "close_hits": hits[1],
                "long_hits": hits[2],
                "extreme_hits": hits[3],
                "knife_damage": damage[0],
                "close_damage": damage[1],
                "long_damage": damage[2],
                "extreme_damage": damage[3],
                "tags": "",
            };
            var dlist = this.acft.GetWeapons().GetDirectionList();
            if (w.IsPlural()) {
                weaponState.type = w.GetWeaponCount().toString() + "x " + weaponState.type;
            }
            var ds = w.GetDirection();
            var dtag = "";
            dtag += "[";
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    dtag += lu(dlist[i]) + " ";
            }
            dtag = dtag.substr(0, dtag.length - 1);
            dtag += "]";
            tags.push(dtag);
            tags.concat(WeaponTags(w));
            weaponState.tags = StringFmt.Join(", ", tags);
            wstates.push(JSON.stringify(weaponState));
        }
        return wstates;
    }
    SaveNPC() {
        //update all the aircraft data we need.
        this.UpdateCard();
        //pick the lowest overspeed among all engines, treat that as the overspeed for the plane. 
        this.cards.lowest_overspeed = -1;
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            var engine = this.acft.GetEngines().GetEngine(i);
            if (engine.GetOverspeed() < this.cards.lowest_overspeed || this.cards.lowest_overspeed < 0) {
                this.cards.lowest_overspeed = engine.GetOverspeed();
            }
        }
        //append weapon data to card so we can use it. 
        this.cards.all_weapons = [];
        var wsetlist = this.acft.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.all_weapons.push(Object.assign({}, this.cards.weap_data));
        }
        this.cards.SaveNPC();
    }
    InitStats(tbl) {
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Drag"));
        CreateTH(row, lu("Stat Mass"));
        CreateTH(row, lu("Stat Wet Mass"));
        CreateTH(row, lu("Stat Bomb Mass"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Upkeep"));
        row = insertRow(fragment);
        this.d_lift = row.insertCell();
        this.d_drag = row.insertCell();
        this.d_mass = row.insertCell();
        this.d_wmas = row.insertCell();
        this.d_bmas = row.insertCell();
        this.d_cost = row.insertCell();
        this.d_upkp = row.insertCell();
        row = insertRow(fragment);
        CreateTH(row, lu("Stat Control"));
        CreateTH(row, lu("Stat Pitch Stability"));
        CreateTH(row, lu("Stat Lateral Stability"));
        CreateTH(row, lu("Stat Wing Area"));
        CreateTH(row, lu("Stat Raw Strain"));
        CreateTH(row, lu("Stat Structure"));
        CreateTH(row, lu("Stat Toughness"));
        row = insertRow(fragment);
        this.d_cont = row.insertCell();
        this.d_pstb = row.insertCell();
        this.d_lstb = row.insertCell();
        this.d_wara = row.insertCell();
        this.d_mstr = row.insertCell();
        this.d_strc = row.insertCell();
        this.d_tugh = row.insertCell();
        row = insertRow(fragment);
        CreateTH(row, lu("Stat Power"));
        CreateTH(row, lu("Stat Fuel Consumption"));
        CreateTH(row, lu("Stat Fuel"));
        CreateTH(row, lu("Stat Pitch Speed"));
        CreateTH(row, lu("Stat Pitch Boost"));
        CreateTH(row, lu("Stat Charge"));
        CreateTH(row, lu("Stat Crash Safety"));
        row = insertRow(fragment);
        this.d_powr = row.insertCell();
        this.d_fcom = row.insertCell();
        this.d_fuel = row.insertCell();
        this.d_pspd = row.insertCell();
        this.d_pbst = row.insertCell();
        this.d_chrg = row.insertCell();
        this.d_crsh = row.insertCell();
        tbl.appendChild(fragment);
    }
    InitDerived(tbl) {
        this.derived = new Derived_HTML(tbl);
    }
    UpdateStats(stats) {
        var dragbreak = stats.drag.toString() + " ("
            + ((stats.drag + Math.floor(1.0e-6 + stats.mass / 5)) % 5)
            + "/5)";
        var massbreak = stats.mass.toString() + " ("
            + (stats.mass % 5).toString()
            + "/5)";
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_drag, dragbreak);
        BlinkIfChanged(this.d_mass, massbreak);
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString(), false);
        BlinkIfChanged(this.d_bmas, stats.bomb_mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_upkp, stats.upkeep.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_powr, stats.power.toString(), true);
        BlinkIfChanged(this.d_fcom, stats.fuelconsumption.toString(), false);
        BlinkIfChanged(this.d_fuel, stats.fuel.toString(), true);
        BlinkIfChanged(this.d_pspd, (Math.round(stats.pitchspeed * 10) / 10).toString(), true);
        BlinkIfChanged(this.d_pbst, (Math.round(stats.pitchboost * 10) / 10).toString(), true);
        BlinkIfChanged(this.d_wara, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_chrg, stats.charge.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
    UpdateDerived(stats, derived_stats) {
        if (this.derived.GetName() != lu("Derived Aircraft Name")) {
            this.acft.name = this.derived.GetName();
        }
        this.derived.UpdateDisplay(this.acft, stats, derived_stats);
    }
    UpdateDisplay() {
        var stats = this.acft.GetStats();
        var derived_stats = this.acft.GetDerivedStats();
        this.acft_type.selectedIndex = this.acft.GetAircraftType();
        this.era.UpdateDisplay();
        this.cockpits.UpdateDisplay();
        this.passengers.UpdateDisplay();
        this.engines.UpdateDisplay();
        this.propeller.UpdateDisplay();
        this.frames.UpdateDisplay();
        this.wings.UpdateDisplay();
        this.stabilizers.UpdateDisplay();
        this.controlsurfaces.UpdateDisplay();
        this.reinforcements.UpdateDisplay();
        this.reinforcements.UpdateMaxStrain(derived_stats.MaxStrain);
        this.load.UpdateDisplay();
        this.load.UpdateFuelUses(stats.fuel / stats.fuelconsumption); //Do the calculation here because it's int rounded in derived stats, also no leaky
        this.gear.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.optimization.UpdateDisplay();
        this.weapons.UpdateDisplay();
        this.used.UpdateDisplay();
        this.rotor.UpdateDisplay();
        this.alter.UpdateDisplay();
        this.UpdateStats(stats);
        this.UpdateDerived(stats, derived_stats);
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/AlterStats.ts" />
class AlterStats_HTML extends Display {
    constructor(alter) {
        super();
        this.alter = alter;
        let tbl = window.getElementById("alter_table");
        let row = tbl.insertRow();
        this.add_cell = row.insertCell();
        this.edit_cell = row.insertCell();
        this.InitAddCell();
        this.InitEditCell();
    }
    InitAddCell() {
        this.add_list = [];
        this.add_fs = CreateFlexSection(this.add_cell);
        let lbl_part = document.createElement("LABEL");
        lbl_part.textContent = lu("Alter Select Part");
        this.add_fs.div1.appendChild(lbl_part);
        let lbl_qty = document.createElement("LABEL");
        lbl_qty.textContent = lu("Alter Quantity");
        this.add_fs.div2.appendChild(lbl_qty);
        lbl_part.style.marginLeft = "0.25em";
        lbl_part.style.marginRight = "0.5em";
        lbl_qty.style.marginLeft = "0.25em";
        lbl_qty.style.marginRight = "0.5em";
    }
    InitEditCell() {
        this.name = document.createElement("INPUT");
        this.drag = document.createElement("INPUT");
        this.mass = document.createElement("INPUT");
        this.wmas = document.createElement("INPUT");
        this.bmas = document.createElement("INPUT");
        this.cost = document.createElement("INPUT");
        this.upkp = document.createElement("INPUT");
        this.lfbd = document.createElement("INPUT");
        this.area = document.createElement("INPUT");
        this.ctrl = document.createElement("INPUT");
        this.pstb = document.createElement("INPUT");
        this.lstb = document.createElement("INPUT");
        this.rstn = document.createElement("INPUT");
        this.strc = document.createElement("INPUT");
        this.tugh = document.createElement("INPUT");
        this.powr = document.createElement("INPUT");
        this.fcon = document.createElement("INPUT");
        this.fuel = document.createElement("INPUT");
        this.chrg = document.createElement("INPUT");
        this.sfty = document.createElement("INPUT");
        this.visi = document.createElement("INPUT");
        this.escp = document.createElement("INPUT");
        this.rely = document.createElement("INPUT");
        this.sprl = document.createElement("INPUT");
        var fsabc = CreateFlexSection(this.edit_cell);
        var fsab = CreateFlexSection(fsabc.div1);
        FlexText(lu("Alter Part Name"), this.name, fsab);
        var fs1 = CreateFlexSection(fsab.div1);
        var fs2 = CreateFlexSection(fsab.div2);
        var fs3 = CreateFlexSection(fsabc.div2);
        FlexInput("Cost", this.cost, fs3);
        FlexInput("Mass", this.mass, fs1);
        FlexInput("Wet Mass", this.wmas, fs2);
        FlexInput("Bomb Mass", this.bmas, fs3);
        FlexInput("Drag", this.drag, fs1);
        FlexInput("Lift Bleed", this.lfbd, fs2);
        FlexInput("Wing Area", this.area, fs3);
        FlexInput("Control", this.ctrl, fs1);
        FlexInput("Pitch Stability", this.pstb, fs2);
        FlexInput("Lateral Stability", this.lstb, fs3);
        FlexInput("Raw Strain", this.rstn, fs1);
        FlexInput("Structure", this.strc, fs2);
        FlexInput("Toughness", this.tugh, fs3);
        FlexInput("Power", this.powr, fs1);
        FlexInput("Fuel Consumption", this.fcon, fs2);
        FlexInput("Fuel", this.fuel, fs3);
        FlexInput("Visibility", this.visi, fs1);
        FlexInput("Crash Safety", this.sfty, fs2);
        FlexInput("Escape", this.escp, fs3);
        FlexInput("Charge", this.chrg, fs1);
        FlexInput("Upkeep", this.upkp, fs2);
        FlexInput("Reliability", this.rely, fs3);
        CreateText(lu("Alter Part Special Rules"), this.sprl, this.edit_cell, false);
        this.drag.min = "";
        this.mass.min = "";
        this.wmas.min = "";
        this.bmas.min = "";
        this.cost.min = "";
        this.upkp.min = "";
        this.lfbd.min = "";
        this.area.min = "";
        this.ctrl.min = "";
        this.pstb.min = "";
        this.lstb.min = "";
        this.rstn.min = "";
        this.strc.min = "";
        this.tugh.min = "";
        this.powr.min = "";
        this.fcon.min = "";
        this.fuel.min = "";
        this.chrg.min = "";
        this.sfty.min = "";
        this.visi.min = "";
        this.escp.min = "";
        this.rely.min = "";
        this.sprl.size = 47;
        var span = document.createElement("SPAN");
        this.sel = document.createElement("SELECT");
        span.appendChild(this.sel);
        this.sel.selectedIndex = -1;
        this.add = document.createElement("BUTTON");
        CreateButton("Add Part", this.add, span, false);
        this.rem = document.createElement("BUTTON");
        CreateButton("Remove Part", this.rem, span, false);
        this.edit_cell.appendChild(document.createElement("BR"));
        this.edit_cell.appendChild(span);
        this.add.onclick = () => {
            let stats = new Stats();
            stats.drag = this.drag.valueAsNumber;
            stats.mass = this.mass.valueAsNumber;
            stats.wetmass = this.wmas.valueAsNumber;
            stats.bomb_mass = this.bmas.valueAsNumber;
            stats.cost = this.cost.valueAsNumber;
            stats.upkeep = this.upkp.valueAsNumber;
            stats.liftbleed = this.lfbd.valueAsNumber;
            stats.wingarea = this.area.valueAsNumber;
            stats.control = this.ctrl.valueAsNumber;
            stats.pitchstab = this.pstb.valueAsNumber;
            stats.latstab = this.lstb.valueAsNumber;
            stats.maxstrain = this.rstn.valueAsNumber;
            stats.structure = this.strc.valueAsNumber;
            stats.toughness = this.tugh.valueAsNumber;
            stats.power = this.powr.valueAsNumber;
            stats.fuelconsumption = this.fcon.valueAsNumber;
            stats.fuel = this.fuel.valueAsNumber;
            stats.charge = this.chrg.valueAsNumber;
            stats.crashsafety = this.sfty.valueAsNumber;
            stats.visibility = this.visi.valueAsNumber;
            stats.escape = this.escp.valueAsNumber;
            stats.reliability = this.rely.valueAsNumber;
            this.sprl.value = this.sprl.value.trim();
            if (this.sprl.value.length > 0) {
                stats.warnings.push({ source: this.name.value, warning: this.sprl.value });
            }
            this.alter.AddPart(this.name.value, stats);
            this.UpdateSelect();
            this.sel.selectedIndex = -1;
        };
        this.rem.onclick = () => {
            this.alter.RemovePart(this.name.value);
            this.ResetInputs();
            this.UpdateSelect();
            this.sel.selectedIndex = -1;
        };
        this.sel.onchange = () => {
            let part = this.alter.GetParts()[this.sel.selectedIndex];
            this.name.value = part.name;
            this.drag.valueAsNumber = part.stats.drag;
            this.mass.valueAsNumber = part.stats.mass;
            this.wmas.valueAsNumber = part.stats.wetmass;
            this.bmas.valueAsNumber = part.stats.bomb_mass;
            this.cost.valueAsNumber = part.stats.cost;
            this.upkp.valueAsNumber = part.stats.upkeep;
            this.lfbd.valueAsNumber = part.stats.liftbleed;
            this.area.valueAsNumber = part.stats.wingarea;
            this.ctrl.valueAsNumber = part.stats.control;
            this.pstb.valueAsNumber = part.stats.pitchstab;
            this.lstb.valueAsNumber = part.stats.latstab;
            this.rstn.valueAsNumber = part.stats.maxstrain;
            this.strc.valueAsNumber = part.stats.structure;
            this.tugh.valueAsNumber = part.stats.toughness;
            this.powr.valueAsNumber = part.stats.power;
            this.fcon.valueAsNumber = part.stats.fuelconsumption;
            this.fuel.valueAsNumber = part.stats.fuel;
            this.chrg.valueAsNumber = part.stats.charge;
            this.sfty.valueAsNumber = part.stats.crashsafety;
            this.visi.valueAsNumber = part.stats.visibility;
            this.escp.valueAsNumber = part.stats.escape;
            this.rely.valueAsNumber = part.stats.reliability;
            var text = [];
            for (let warn of part.stats.warnings) {
                text.push(warn.warning);
            }
            this.sprl.value = StringFmt.Join("   ", text);
            this.sel.selectedIndex = -1;
        };
        this.ResetInputs();
        this.UpdateSelect();
    }
    ResetInputs() {
        this.name.value = "Default";
        this.drag.valueAsNumber = 0;
        this.mass.valueAsNumber = 0;
        this.wmas.valueAsNumber = 0;
        this.bmas.valueAsNumber = 0;
        this.cost.valueAsNumber = 0;
        this.upkp.valueAsNumber = 0;
        this.lfbd.valueAsNumber = 0;
        this.area.valueAsNumber = 0;
        this.ctrl.valueAsNumber = 0;
        this.pstb.valueAsNumber = 0;
        this.lstb.valueAsNumber = 0;
        this.rstn.valueAsNumber = 0;
        this.strc.valueAsNumber = 0;
        this.tugh.valueAsNumber = 0;
        this.powr.valueAsNumber = 0;
        this.fcon.valueAsNumber = 0;
        this.fuel.valueAsNumber = 0;
        this.chrg.valueAsNumber = 0;
        this.sfty.valueAsNumber = 0;
        this.visi.valueAsNumber = 0;
        this.escp.valueAsNumber = 0;
        this.rely.valueAsNumber = 0;
        this.sprl.value = "";
    }
    UpdateSelect() {
        while (this.sel.options.length) {
            this.sel.remove(this.sel.options.length - 1);
        }
        var all_parts = this.alter.GetParts();
        for (let p of all_parts) {
            let opt = document.createElement("OPTION");
            opt.textContent = p.name;
            this.sel.add(opt);
        }
        this.sel.selectedIndex = -1;
    }
    UpdateDisplay() {
        this.UpdateSelect();
        var plist = this.alter.GetParts();
        for (let i = 0; i < plist.length; i++) {
            if (this.add_list.length <= i) {
                let item = {
                    lbl: document.createElement("LABEL"),
                    qty: document.createElement("INPUT")
                };
                item.lbl.style.marginLeft = "0.25em";
                item.lbl.style.marginRight = "0.5em";
                item.qty.type = "number";
                item.qty.min = "0";
                item.qty.step = "1";
                item.qty.valueAsNumber = 0;
                item.qty.onchange = () => { this.alter.SetUsedPart(i, item.qty.valueAsNumber); };
                this.add_fs.div1.appendChild(item.lbl);
                this.add_fs.div2.appendChild(item.qty);
                this.add_list.push(item);
            }
            this.add_list[i].lbl.textContent = plist[i].name;
            this.add_list[i].qty.valueAsNumber = plist[i].qty;
        }
        while (this.add_list.length > plist.length) {
            this.add_list[this.add_list.length - 1].lbl.remove();
            this.add_list[this.add_list.length - 1].qty.remove();
            this.add_list.pop();
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Rotor.ts" />
class Rotor_HTML extends Display {
    constructor(r) {
        super();
        this.rotor = r;
        document.getElementById("lbl_rotor").textContent = lu("Rotor Section Title");
        this.div = document.getElementById("Rotors");
        this.wing_div = document.getElementById("Wings");
        this.reinforce_div = document.getElementById("Reinforcements");
        this.control_div = document.getElementById("ControlSurfaces");
        var tbl = document.getElementById("rotor_table");
        var fragment = document.createDocumentFragment();
        this.InitAutogyro(fragment);
        this.InitHelicopter(fragment);
        tbl.appendChild(fragment);
    }
    InitAutogyro(fragment) {
        this.auto_header = insertRow(fragment);
        CreateTH(this.auto_header, lu("Rotor Rotor"));
        CreateTH(this.auto_header, lu("Rotor Material"));
        CreateTH(this.auto_header, lu("Rotor Accessories"));
        CreateTH(this.auto_header, lu("Rotor Stats"));
        this.auto_row = insertRow(fragment);
        var rotor_cell = this.auto_row.insertCell();
        var rotor_fs = CreateFlexSection(rotor_cell);
        this.auto_min = document.createElement("LABEL");
        FlexDisplay(lu("Rotor Minimum Span"), this.auto_min, rotor_fs);
        this.auto_span = document.createElement("INPUT");
        FlexInput(lu("Rotor Span"), this.auto_span, rotor_fs);
        this.auto_span.onchange = () => { this.rotor.SetRotorSpan(this.auto_span.valueAsNumber); };
        var mat_cell = this.auto_row.insertCell();
        var mat_fs = CreateFlexSection(mat_cell);
        this.auto_mat = document.createElement("SELECT");
        FlexSelect(lu("Rotor Material"), this.auto_mat, mat_fs);
        for (let ctype of this.rotor.GetCantileverList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(ctype.name);
            this.auto_mat.add(opt);
        }
        this.auto_mat.onchange = () => { this.rotor.SetCantilever(this.auto_mat.selectedIndex); };
        var acc_cell = this.auto_row.insertCell();
        var acc_fs = CreateFlexSection(acc_cell);
        this.auto_clutch = document.createElement("INPUT");
        FlexCheckbox(lu("Rotor Clutched Rotor"), this.auto_clutch, acc_fs);
        this.auto_clutch.onchange = () => { this.rotor.SetAccessory(this.auto_clutch.checked); };
        this.InitAutogyroStats(this.auto_row.insertCell());
    }
    InitAutogyroStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.a_drag = c1_row.insertCell();
        this.a_mass = c1_row.insertCell();
        this.a_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Rotor Area"));
        CreateTH(h2_row, "");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.a_area = c2_row.insertCell();
        c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateAutogyroStats() {
        this.auto_span.valueAsNumber = this.rotor.GetRotorSpan();
        this.auto_mat.selectedIndex = this.rotor.GetCantilever();
        this.auto_min.innerText = "" + this.rotor.GetSizingSpan();
        this.auto_clutch.checked = this.rotor.GetAccessory();
        var stats = this.rotor.PartStats();
        BlinkIfChanged(this.a_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.a_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.a_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.a_area, stats.wingarea.toString(), true);
    }
    InitHelicopter(fragment) {
        this.heli_header = insertRow(fragment);
        CreateTH(this.heli_header, lu("Rotor Rotor"));
        CreateTH(this.heli_header, lu("Rotor Material"));
        CreateTH(this.heli_header, lu("Rotor Accessories"));
        CreateTH(this.heli_header, lu("Rotor Stats"));
        this.heli_row = insertRow(fragment);
        var rotor_cell = this.heli_row.insertCell();
        var rotor_fs = CreateFlexSection(rotor_cell);
        this.heli_count = document.createElement("INPUT");
        FlexInput(lu("Rotor Number of Rotors"), this.heli_count, rotor_fs);
        this.heli_count.onchange = () => { this.rotor.SetRotorCount(this.heli_count.valueAsNumber); };
        this.heli_min = document.createElement("LABEL");
        FlexDisplay(lu("Rotor Ideal Rotor Span"), this.heli_min, rotor_fs);
        this.heli_span = document.createElement("INPUT");
        FlexInput(lu("Rotor Span"), this.heli_span, rotor_fs);
        this.heli_span.onchange = () => { this.rotor.SetRotorSpan(this.heli_span.valueAsNumber); };
        this.heli_stagger = document.createElement("SELECT");
        FlexSelect(lu("Rotor Stagger"), this.heli_stagger, rotor_fs);
        let opt1 = document.createElement("OPTION");
        opt1.text = lu("Unstaggered");
        this.heli_stagger.add(opt1);
        let opt2 = document.createElement("OPTION");
        opt2.text = lu("Tandem");
        this.heli_stagger.add(opt2);
        this.heli_stagger.onchange = () => { this.rotor.SetTandem(this.heli_stagger.selectedIndex == 1); };
        this.heli_blade_count = document.createElement("SELECT");
        FlexSelect(lu("Rotor Blade Count"), this.heli_blade_count, rotor_fs);
        var blade_list = this.rotor.GetBladeList();
        for (let b of blade_list) {
            let opt = document.createElement("OPTION");
            opt.textContent = b.name;
            this.heli_blade_count.add(opt);
        }
        this.heli_blade_count.onchange = () => { this.rotor.SetBladeCount(this.heli_blade_count.selectedIndex); };
        var mat_cell = this.heli_row.insertCell();
        var mat_fs = CreateFlexSection(mat_cell);
        this.heli_mat = document.createElement("SELECT");
        FlexSelect(lu("Rotor Rotor Material"), this.heli_mat, mat_fs);
        for (let ctype of this.rotor.GetCantileverList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(ctype.name);
            this.heli_mat.add(opt);
        }
        this.heli_mat.onchange = () => { this.rotor.SetCantilever(this.heli_mat.selectedIndex); };
        var acc_cell = this.heli_row.insertCell();
        var acc_fs = CreateFlexSection(acc_cell);
        this.heli_shafts = document.createElement("INPUT");
        FlexCheckbox(lu("Rotor Motor Cross-link"), this.heli_shafts, acc_fs);
        this.heli_shafts.onchange = () => { this.rotor.SetAccessory(this.heli_shafts.checked); };
        this.InitHelicopterStats(this.heli_row.insertCell());
    }
    InitHelicopterStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.h_drag = c1_row.insertCell();
        this.h_mass = c1_row.insertCell();
        this.h_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Rotor Area"));
        CreateTH(h2_row, lu("Stat Reliability"));
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.h_area = c2_row.insertCell();
        this.h_rely = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateHelicopterStats() {
        this.heli_count.valueAsNumber = this.rotor.GetRotorCount();
        if (this.rotor.GetRotorCount() == 1)
            this.heli_count.step = "1";
        else
            this.heli_count.step = "2";
        this.heli_min.innerText = "" + this.rotor.GetSizingSpan();
        this.heli_span.valueAsNumber = this.rotor.GetRotorSpan();
        if (this.rotor.GetRotorCount() > 1)
            this.heli_stagger.disabled = false;
        else
            this.heli_stagger.disabled = true;
        if (this.rotor.GetTandem())
            this.heli_stagger.selectedIndex = 1;
        else
            this.heli_stagger.selectedIndex = 0;
        this.heli_mat.selectedIndex = this.rotor.GetCantilever();
        this.heli_shafts.checked = this.rotor.GetAccessory();
        this.heli_blade_count.selectedIndex = this.rotor.GetBladeCountIdx();
        var stats = this.rotor.PartStats();
        BlinkIfChanged(this.h_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.h_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.h_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.h_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.h_rely, stats.reliability.toString(), true);
    }
    UpdateDisplay() {
        switch (this.rotor.GetType()) {
            case AIRCRAFT_TYPE.AIRPLANE:
                this.div.hidden = true;
                this.wing_div.hidden = false;
                this.reinforce_div.hidden = false;
                this.control_div.hidden = false;
                break;
            case AIRCRAFT_TYPE.AUTOGYRO:
                this.div.hidden = false;
                this.wing_div.hidden = false;
                this.reinforce_div.hidden = false;
                this.control_div.hidden = false;
                this.heli_header.hidden = true;
                this.heli_row.hidden = true;
                this.auto_header.hidden = false;
                this.auto_row.hidden = false;
                this.UpdateAutogyroStats();
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
                this.div.hidden = false;
                this.wing_div.hidden = true;
                this.reinforce_div.hidden = true;
                this.control_div.hidden = true;
                this.auto_header.hidden = true;
                this.auto_row.hidden = true;
                this.heli_header.hidden = false;
                this.heli_row.hidden = false;
                this.UpdateHelicopterStats();
                break;
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Used.ts" />
class Used_HTML extends Display {
    constructor(used) {
        super();
        this.used = used;
        document.getElementById("lbl_used").textContent = lu("Used Section Title");
        this.tbl = document.getElementById("tbl_used");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Used Effect"));
        CreateTH(row, lu("Used Description"));
        CreateTH(row, lu("Used Penalties(+) <br/> Benefits(-)"));
        this.InitTable(fragment);
        this.tbl.appendChild(fragment);
    }
    InitTable(fragment) {
        this.burnt_out = document.createElement("INPUT");
        this.ragged = document.createElement("INPUT");
        this.hefty = document.createElement("INPUT");
        this.sticky_guns = document.createElement("INPUT");
        this.weak = document.createElement("INPUT");
        this.fragile = document.createElement("INPUT");
        this.leaky = document.createElement("INPUT");
        this.sluggish = document.createElement("INPUT");
        var row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Burnt Out");
        row.insertCell().textContent = lu("Used Burnt Out Description");
        var cell = row.insertCell();
        CreateInput("", this.burnt_out, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Ragged");
        row.insertCell().textContent = lu("Used Ragged Description");
        cell = row.insertCell();
        CreateInput("", this.ragged, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Hefty");
        row.insertCell().textContent = lu("Used Hefty Description");
        cell = row.insertCell();
        CreateInput("", this.hefty, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Sticky Guns");
        row.insertCell().textContent = lu("Used Sticky Guns Description");
        cell = row.insertCell();
        CreateInput("", this.sticky_guns, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Weak");
        row.insertCell().textContent = lu("Used Weak Description");
        cell = row.insertCell();
        CreateInput("", this.weak, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Fragile");
        row.insertCell().textContent = lu("Used Fragile Description");
        cell = row.insertCell();
        CreateInput("", this.fragile, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Leaky");
        row.insertCell().textContent = lu("Used Leaky Description");
        cell = row.insertCell();
        CreateInput("", this.leaky, cell, false);
        row = insertRow(fragment);
        row.insertCell().textContent = lu("Used Sluggish");
        row.insertCell().textContent = lu("Used Sluggish Description");
        cell = row.insertCell();
        CreateInput("", this.sluggish, cell, false);
        this.burnt_out.onchange = () => { this.used.burnt_out = this.burnt_out.valueAsNumber; this.used.TriggerCS(); };
        this.ragged.onchange = () => { this.used.ragged = this.ragged.valueAsNumber; this.used.TriggerCS(); };
        this.hefty.onchange = () => { this.used.hefty = this.hefty.valueAsNumber; this.used.TriggerCS(); };
        this.sticky_guns.onchange = () => { this.used.sticky_guns = this.sticky_guns.valueAsNumber; this.used.TriggerCS(); };
        this.weak.onchange = () => { this.used.weak = this.weak.valueAsNumber; this.used.TriggerCS(); };
        this.fragile.onchange = () => { this.used.fragile = this.fragile.valueAsNumber; this.used.TriggerCS(); };
        this.leaky.onchange = () => { this.used.leaky = this.leaky.valueAsNumber; this.used.TriggerCS(); };
        this.sluggish.onchange = () => { this.used.sluggish = this.sluggish.valueAsNumber; this.used.TriggerCS(); };
        this.burnt_out.min = "-1";
        this.burnt_out.max = "1";
        this.ragged.min = "-1";
        this.ragged.max = "1";
        this.hefty.min = "-1";
        this.hefty.max = "1";
        this.sticky_guns.min = "-1";
        this.sticky_guns.max = "1";
        this.weak.min = "-1";
        this.weak.max = "1";
        this.fragile.min = "-1";
        this.fragile.max = "1";
        this.leaky.min = "-1";
        this.leaky.max = "1";
        this.sluggish.min = "-1";
        this.sluggish.max = "1";
    }
    UpdateDisplay() {
        this.burnt_out.valueAsNumber = this.used.burnt_out;
        this.ragged.valueAsNumber = this.used.ragged;
        this.hefty.valueAsNumber = this.used.hefty;
        this.sticky_guns.valueAsNumber = this.used.sticky_guns;
        this.weak.valueAsNumber = this.used.weak;
        this.fragile.valueAsNumber = this.used.fragile;
        this.leaky.valueAsNumber = this.used.leaky;
        this.sluggish.valueAsNumber = this.used.sluggish;
    }
}
