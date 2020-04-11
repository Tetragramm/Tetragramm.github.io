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
        this.pitchspeed = Math.trunc(this.pitchspeed);
        this.pitchboost = Math.trunc(this.pitchboost);
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
/// <reference path="./Stats.ts" />
class Part {
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = { name: elem["name"], value: parseInt(elem["liftbleed"]) };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js) {
        this.selected = js["selected"];
    }
    GetSelected() {
        return this.selected;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].value;
    }
    PartStats() {
        var s = new Stats();
        s.liftbleed = this.GetLiftBleed();
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
        this.total_stress = 0;
        this.total_escape = 0;
        this.total_visibility = 0;
    }
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades,
            safety: this.selected_safety,
        };
    }
    fromJSON(js) {
        this.selected_type = js["type"];
        this.selected_upgrades = js["upgrades"];
        this.selected_safety = js["safety"];
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
        return this.total_visibility;
    }
    GetFlightStress() {
        return this.total_stress;
    }
    GetEscape() {
        return this.total_escape;
    }
    PartStats() {
        this.stats = new Stats();
        this.stats.reqsections = 1;
        this.stats = this.stats.Add(this.types[this.selected_type].stats);
        for (let i = 0; i < this.selected_upgrades.length; i++) {
            if (this.selected_upgrades[i])
                this.stats = this.stats.Add(this.upgrades[i].stats);
        }
        for (let i = 0; i < this.selected_safety.length; i++) {
            if (this.selected_safety[i])
                this.stats = this.stats.Add(this.safety[i].stats);
        }
        for (let i = 0; i < this.selected_gunsights.length; i++) {
            if (this.selected_gunsights[i])
                this.stats = this.stats.Add(this.gunsights[i].stats);
        }
        var stats = new Stats();
        stats = stats.Add(this.stats);
        return stats;
    }
    CrewUpdate(escape, flightstress, visibility) {
        this.total_escape = this.stats.escape + escape;
        this.total_stress = this.stats.flightstress + flightstress;
        this.total_stress = Math.max(0, this.total_stress);
        this.total_visibility = this.stats.visibility + visibility;
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
            let opt = { name: elem["name"], stats: new Stats(elem) };
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
            let gun = { name: elem["name"], stats: new Stats(elem) };
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
    fromJSON(js) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.fromJSON(elem);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    GetAttackList() {
        //TODO: Attack
        var lst = [];
        for (let c of this.positions) {
            lst.push(0);
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
    SetNumberOfCockpits(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
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
    PartStats() {
        var s = new Stats();
        for (let cp of this.positions) {
            s = s.Add(cp.PartStats());
        }
        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0;
        s.flightstress = 0;
        s.visibility = 0;
        return s;
    }
    UpdateCrewStats(escape, flightstress, visibility) {
        for (let cp of this.positions) {
            cp.CrewUpdate(escape, flightstress, visibility);
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
    fromJSON(js) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }
    GetSeats() {
        return this.seats;
    }
    SetSeats(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.seats = num;
        this.CalculateStats();
    }
    GetBeds() {
        return this.beds;
    }
    SetBeds(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
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
        var s = new Stats();
        s.reqsections = 2 * Math.ceil((this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            s.mass = 1;
        }
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
/// <reference path="./Stats.ts" />
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
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
class Engine extends Part {
    constructor(el, ml, ppl, cl) {
        super();
        this.engine_list = el;
        this.selected_index = 0;
        this.etype_stats = this.engine_list[0].Clone();
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.selected_mount = 0;
        this.pp_list = ppl;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.cowl_list = cl;
        this.cowl_sel = 0;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        this.is_generator = false;
        this.has_alternator = false;
        if (el.length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
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
        };
    }
    fromJSON(js) {
        this.etype_stats.fromJSON(js["selected_stats"]);
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
        this.selected_index = -1;
        for (let i = 0; i < this.engine_list.length; i++) {
            if (this.etype_stats.Equal(this.engine_list[i])) {
                this.selected_index = i;
                break;
            }
        }
    }
    GetMaxAltitude() {
        return this.etype_stats.altitude;
    }
    SetSelectedIndex(num) {
        this.selected_index = num;
        this.etype_stats = this.engine_list[this.selected_index].Clone();
        if (num >= this.engine_list.length)
            throw "Index is out of range of engine_list.";
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return this.selected_index;
    }
    SetCustomStats(stats) {
        this.selected_index = -1;
        this.etype_stats = stats;
        this.PulseJetCheck();
        this.cooling_count = Math.min(this.cooling_count, this.etype_stats.stats.cooling);
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }
    GetCurrentStats() {
        let stats = new EngineStats();
        stats = stats.Add(this.etype_stats);
        return stats;
    }
    NeedCooling() {
        return this.cooling_count > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.cooling_count = num;
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
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
    GetListOfEngines() {
        return this.engine_list;
    }
    RequiresExtendedDriveshafts() {
        return this.mount_list[this.selected_mount].reqED;
    }
    RequiresTailMod() {
        if (this.use_ds)
            return false;
        return this.mount_list[this.selected_mount].reqTail;
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
    SetUsePushPull(use) {
        this.use_pp = use;
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    SetUseExtendedDriveshaft(use) {
        this.use_ds = use || this.RequiresExtendedDriveshafts();
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    SetGearCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
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
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.selected_mount].pp_type == "wing";
    }
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        if (this.NeedCooling()) {
            this.total_reliability -= (this.etype_stats.stats.cooling - this.cooling_count);
        }
        this.total_reliability += num;
    }
    GetReliability() {
        return this.total_reliability;
    }
    GetOverspeed() {
        return this.etype_stats.overspeed + Math.floor(this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.etype_stats.stats.cooling = 0;
            this.etype_stats.overspeed = 100;
            this.etype_stats.altitude = 100;
            this.etype_stats.torque = 0;
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            this.has_alternator = false;
            this.is_generator = false;
            if (this.mount_list[this.selected_mount].pp_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].pp_type != "fuselage")
                        break;
                }
            }
        }
        else {
            this.etype_stats.rumble = 0;
        }
    }
    GetHavePropeller() {
        return !this.GetIsPulsejet(); //TODO: Charge and Generators
    }
    GetIsTractorNacelle() {
        if (!this.GetIsPulsejet()
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].pp_type == "wing")
            return true;
        return false;
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
            if (this.GetIsPulsejet()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
            }
            else if (this.NeedCooling()) { //Means air cooled
                lst.push(c.liquid);
            }
            else if (this.etype_stats.oiltank) { //Means rotary
                lst.push(c.rotary);
            }
            else { //Means liquid
                lst.push(c.air);
            }
        }
        return lst;
    }
    VerifyCowl(num) {
        var can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        else if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }
    SetCowl(num) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }
    GetGeneratorEnabled() {
        return !this.GetIsPulsejet();
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        let stats = new Stats;
        if (this.selected_index > 0)
            stats = stats.Add(this.etype_stats.stats);
        else
            stats = stats.Add(this.etype_stats.stats);
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        if (this.mount_list[this.selected_mount].pp_type == "fuselage")
            stats.latstab -= this.etype_stats.torque;
        else if (this.mount_list[this.selected_mount].pp_type == "wing") {
            if (this.torque_to_struct)
                stats.structure -= this.etype_stats.torque;
            else
                stats.maxstrain -= this.etype_stats.torque;
        }
        //Push-pull
        if (this.use_pp) {
            var pp_type = this.mount_list[this.selected_mount].pp_type;
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.power = Math.floor(this.pp_list[pp_type].powerfactor * stats.power);
        }
        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(stats.mass * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(stats.drag * this.cowl_list[this.cowl_sel].ed);
        if (this.cowl_sel != 0 && this.mount_list[this.selected_mount].reqTail)
            stats.cost += 2;
        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!this.etype_stats.pulsejet) {
            stats = stats.Add(this.mount_list[this.selected_mount].stats);
            stats.maxstrain -= Math.floor(this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }
        //Upgrades
        if (this.use_ds) {
            stats.mass += Math.floor(stats.power / 10);
            stats.cost += 2 * Math.floor(stats.power / 10);
        }
        stats.cost += this.gp_count + this.gpr_count;
        if (this.is_generator) {
            stats.charge = Math.floor(2 * stats.power / 10) + 2;
            stats.power = 0;
        }
        else if (this.has_alternator) {
            stats.charge = Math.floor(stats.power / 10) + 1;
            stats.mass += 1;
            stats.cost += 2;
        }
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
/// <reference path="./Engine.ts" />
class Engines extends Part {
    constructor(js, engine_json) {
        super();
        this.engines = [];
        this.engine_stats = [];
        this.radiators = [];
        for (let elem of engine_json["engines"]) {
            this.engine_stats.push(new EngineStats(elem));
        }
        this.mount_list = [];
        for (let elem of js["mounts"]) {
            let mount = { name: elem["name"], stats: new Stats(elem), strainfactor: elem["strainfactor"], dragfactor: elem["dragfactor"], pp_type: elem["push-pull"], reqED: false, reqTail: false };
            if (elem["reqED"])
                mount.reqED = true;
            if (elem["reqTail"])
                mount.reqTail = true;
            this.mount_list.push(mount);
        }
        this.pp_list = [];
        for (let elem of js["push-pull"]) {
            this.pp_list[elem["type"]] = { name: elem["name"], powerfactor: elem["powerfactor"] };
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
            this.r_coolant_list.push({ name: elem["name"], stats: new Stats(elem) });
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
    fromJSON(js) {
        this.radiators = [];
        for (let elem of js["radiators"]) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.fromJSON(elem);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        this.engines = [];
        for (let elem of js["engines"]) {
            let eng = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
            eng.fromJSON(elem);
            eng.SetCalculateStats(this.CalculateStats);
            this.engines.push(eng);
            eng.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.is_asymmetric = js["is_asymmetric"];
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
        num = Math.floor(num);
        num = Math.min(20, num);
        while (this.engines.length > num) {
            this.engines.pop();
        }
        while (this.engines.length < num) {
            let en = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
            en.SetCalculateStats(this.CalculateStats);
            this.engines.push(en);
            en.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.CalculateStats();
    }
    GetNumberOfEngines() {
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
        num = Math.floor(num);
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
    GetHavePropeller() {
        for (let e of this.engines) {
            if (e.GetHavePropeller())
                return true;
        }
        return false;
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
    PartStats() {
        var stats = new Stats;
        var needCool = [...Array(this.radiators.length).fill(0)];
        //Engine stuff
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling())
                needCool[en.GetRadiator()] += en.GetCooling();
        }
        stats.flightstress += this.GetMaxRumble();
        //Upkeep calc only uses engine costs
        stats.upkeep = Math.floor(Math.min(stats.power / 10, stats.cost));
        //Include radiaators
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i]);
            stats = stats.Add(rad.PartStats());
        }
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
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
        this.idx_prop = 2;
        this.use_variable = false;
        this.have_propellers = true;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({ name: elem["name"], stats: new Stats(elem), automatic: elem["automatic"] });
        }
    }
    toJSON() {
        return {
            type: this.idx_prop,
            use_variable: this.use_variable
        };
    }
    fromJSON(js) {
        this.idx_prop = js["type"];
        this.use_variable = js["use_variable"];
    }
    GetPropList() {
        return this.prop_list;
    }
    SetPropIndex(num) {
        this.idx_prop = num;
        if (this.prop_list[num].automatic)
            this.use_variable = false;
        this.CalculateStats();
    }
    GetPropIndex() {
        return this.idx_prop;
    }
    SetVariable(use) {
        if (!this.prop_list[this.idx_prop].automatic)
            this.use_variable = use;
        else
            this.use_variable = false;
        this.CalculateStats();
    }
    GetVariable() {
        return this.use_variable;
    }
    CanBeVariable() {
        return !this.prop_list[this.idx_prop].automatic;
    }
    SetHavePropeller(have) {
        this.have_propellers = have;
    }
    GetHavePropeller() {
        return this.have_propellers;
    }
    PartStats() {
        var stats = new Stats();
        if (this.have_propellers) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats);
            if (this.use_variable)
                stats.cost += 2;
        }
        else {
            stats.pitchboost = 1;
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
        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"]
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
        };
    }
    fromJSON(js) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
        this.flying_wing = js["flying_wing"];
    }
    DuplicateSection(num) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
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
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
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
        this.CalculateStats();
    }
    SetRequiredSections(num) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
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
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
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
    SetSkin(num, type) {
        this.section_list[num].skin = type;
        if (type != 0)
            this.section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing()
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].skin = 0;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing() {
        return this.CountInternalBracing() < this.CountSections() + this.tail_section_list.length;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.section_list[num].skin].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.tail_section_list[num].skin].monocoque;
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
        }
        if (sec.lifting_body) {
            stats.drag += 1;
            stats.wingarea += 3;
        }
        //If it's internal, no skin.
        if (!sec.internal_bracing) {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[sec.skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[sec.skin].stats);
        }
        return stats;
    }
    SetTailType(num) {
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
                sec.skin = 0;
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
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    SetTailSkin(num, type) {
        this.tail_section_list[num].skin = type;
        if (type != 0)
            this.tail_section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.tail_section_list[num].monocoque = false;
            this.tail_section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = true;
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
        var is_clinker = false;
        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        if (is_clinker)
            stats.structure += 30;
        if (this.flying_wing) {
            stats.liftbleed += 5;
            stats.drag = 0;
            tail_stats.drag = 0;
        }
        stats = stats.Add(this.tail_list[this.sel_tail].stats);
        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.5 * tail_stats.drag);
        }
        stats = stats.Add(tail_stats);
        stats.structure = Math.floor(stats.structure);
        stats.cost = Math.floor(stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Wings extends Part {
    constructor(js) {
        super();
        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"]
            });
        }
        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem)
            });
        }
        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem)
            });
        }
        this.wing_list = [];
        this.mini_wing_list = [];
        this.wing_stagger = Math.floor(this.stagger_list.length / 2);
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
    fromJSON(js) {
        this.wing_list = js["wing_list"];
        this.mini_wing_list = js["mini_wing_list"];
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
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
        else {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] == 1 && this.wing_list.length > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        this.CalculateStats();
    }
    GetStagger() {
        return this.wing_stagger;
    }
    CanAddFullWing(deck) {
        if (deck >= this.deck_list.length)
            console.log("Deck out of Bounds");
        if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
            return false;
        var full_count = this.DeckCountFull();
        if (this.stagger_list[this.wing_stagger].inline) {
            if (full_count[deck] == 2)
                return false;
            if (full_count[deck] == 0 && this.wing_list.length > 0)
                return false;
        }
        else if (full_count[deck] == 1 && this.deck_list[deck].limited)
            return false;
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
    CanClosed() {
        return this.wing_list.length > 1 && !this.stagger_list[this.wing_stagger].inline;
    }
    SetClosed(use) {
        this.is_closed = use;
        this.CalculateStats();
    }
    GetClosed() {
        return this.is_closed;
    }
    SetSwept(use) {
        this.is_swept = use;
        this.CalculateStats();
    }
    GetSwept() {
        return this.is_swept;
    }
    GetTandem() {
        return this.stagger_list[this.wing_stagger].wing_count == 2;
    }
    GetMonoplane() {
        return this.wing_list.length == 1;
    }
    GetStaggered() {
        return this.stagger_list[this.wing_stagger].stats.liftbleed != 0;
    }
    SetFullWing(idx, w) {
        if (this.wing_list.length != idx)
            this.wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 3;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            while (w.anhedral + w.dihedral > w.span - 1) {
                if (w.anhedral > w.dihedral) {
                    w.anhedral--;
                }
                else {
                    w.dihedral--;
                }
            }
            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    SetMiniWing(idx, w) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 2;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            w.dihedral = 0;
            w.anhedral = 0;
            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
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
    SetNumFrames(num) {
        this.num_frames = num;
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
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
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
    PartStats() {
        if (!this.CanClosed())
            this.is_closed = false;
        var stats = new Stats();
        var deck_count = this.DeckCountFull();
        var have_wing = false;
        var have_mini_wing = false;
        var longest_span = 0;
        let drag_reduction = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }
            var wStats = new Stats();
            //Deck Stats
            wStats = wStats.Add(this.deck_list[w.deck].stats);
            //Actual stats
            wStats = wStats.Add(this.skin_list[w.surface].stats.Multiply(w.area));
            wStats.wingarea = w.area;
            wStats.maxstrain -= 2 * w.span + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + 2 * w.area - w.span - drag_reduction);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            //If tandem, set leading wing drag reduction
            if (this.stagger_list[this.wing_stagger].inline && drag_reduction == 0)
                drag_reduction = Math.floor(w.area / 2);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else { //Is not first miniature wing
                stats.control += 1;
                stats.liftbleed += 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.maxstrain -= 2 * wspan + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + w.area - wspan);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        stats.latstab += Math.max(0, Math.floor(longest_span / this.num_frames) - 1);
        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }
        //Closed Wing effects
        if (this.is_closed) {
            stats.mass += 1;
            stats.control -= 5;
            stats.maxstrain += 20;
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
    fromJSON(js) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
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
        for (let t of this.hstab_list) {
            if (t.name == "The Wings" && !(this.is_tandem || this.is_swept))
                lst.push(false);
            else if (t.is_tail && !this.have_tail)
                lst.push(false);
            else
                lst.push(true);
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
        if (this.vstab_list[num].name == "Outboard" && !this.GetVOutboard())
            return;
        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
        }
        this.vstab_sel = num;
        this.SetVStabCount(this.vstab_count);
        this.CalculateStats();
    }
    GetVValidList() {
        var lst = [];
        for (let t of this.vstab_list) {
            if (t.name == "Outboard" && !this.GetVOutboard())
                lst.push(false);
            else if (t.is_tail && !this.have_tail)
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetHStabCount() {
        return this.hstab_count;
    }
    SetHStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
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
        return this.hstab_list[this.hstab_sel].increment;
    }
    GetVStabCount() {
        return this.vstab_count;
    }
    SetVStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
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
        return this.vstab_list[this.vstab_sel].increment;
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
    GetVOutboard() {
        return this.is_swept || this.is_tandem || this.hstab_list[this.hstab_sel].is_canard;
    }
    SetWingArea(num) {
        this.wing_area = num;
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var vvalid = this.GetVValidList();
        if (!vvalid[this.vstab_sel])
            this.vstab_sel = 0;
        var hvalid = this.GetHValidList();
        if (!hvalid[this.hstab_sel])
            this.hstab_sel = 0;
        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 5 * this.hstab_list[this.hstab_sel].dragfactor);
        }
        else if (this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(this.wing_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 10 * this.vstab_list[this.vstab_sel].dragfactor);
        }
        else if (this.vstab_list[this.vstab_sel].increment != 0) {
            stats.latstab -= this.wing_area;
        }
        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));
        //Pairs of stabilizers
        var pairs = 0;
        if (this.vstab_list[this.vstab_sel].is_vtail) //V-Tail
            pairs = this.hstab_count;
        else
            pairs = Math.min(this.hstab_count, this.vstab_count);
        var leftovers = Math.max(this.hstab_count, this.vstab_count) - pairs;
        var es_pairs = Math.min(this.engine_count, pairs);
        leftovers += 2 * (pairs - es_pairs);
        stats.control += 3 * es_pairs + leftovers;
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = false;
        this.wing_area = 0;
        this.mp = 0;
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
    fromJSON(js) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = js["drag_sel"];
    }
    GetAileronList() {
        return this.aileron_list;
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
        return Math.floor(this.flaps_list[this.flaps_sel].costfactor * this.mp);
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
    SetIsCantilever(use) {
        this.is_cantilever = use;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);
        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever)
                stats.cost += 2 * this.wing_area;
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
        this.ext_list = [];
        for (let elem of js["external"]) {
            this.ext_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], stats: new Stats(elem) });
        }
        this.ext_wood_count = [...Array(this.ext_list.length).fill(0)];
        this.ext_steel_count = [...Array(this.ext_list.length).fill(0)];
        this.cant_list = [];
        for (let elem of js["cantilever"]) {
            this.cant_list.push({ name: elem["name"], limited: elem["limited"], stats: new Stats(elem) });
        }
        this.cant_count = [...Array(this.cant_list.length).fill(0)];
        this.wires = false;
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.acft_structure = 0;
    }
    toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
        };
    }
    fromJSON(js) {
        this.ext_wood_count = js["ext_wood_count"];
        this.ext_steel_count = js["ext_steel_count"];
        this.cant_count = js["cant_count"];
        this.wires = js["wires"];
    }
    GetExternalList() {
        return this.ext_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    GetExternalWoodCount() {
        return this.ext_wood_count;
    }
    SetExternalWoodCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }
    GetExternalSteelCount() {
        return this.ext_steel_count;
    }
    SetExternalSteelCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
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
        count = Math.floor(count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }
    ImplSCC(idx, count) {
        var diff = count - this.cant_count[idx];
        if (this.cant_list[idx].limited && this.cant_count[idx] > 0) {
            var total_structure = this.TotalStructure();
            for (let i = 0; i < this.cant_list.length; i++) {
                if (this.cant_list[i].limited) {
                    total_structure -= 5 * this.cant_count[i] * this.cant_list[i].stats.mass;
                }
            }
            diff = Math.min(diff, Math.floor(total_structure / (5 * this.cant_list[idx].stats.mass)));
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
        var struct_count = 0;
        for (let i = 0; i < this.ext_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * 2 * this.ext_list[i].stats.structure;
        }
        return this.acft_structure + struct_count;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var tension_multiple = 1.0;
        if (this.is_monoplane)
            tension_multiple = 0.6;
        else if (this.is_tandem)
            tension_multiple = 0.8;
        else if (this.is_staggered)
            tension_multiple = 0.9;
        var tension = 0;
        var strut_count = 0;
        //Wood Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            if (this.ext_wood_count[i] > 0) {
                let ts = this.ext_list[i].stats;
                ts = ts.Multiply(this.ext_wood_count[i]);
                stats = stats.Add(ts);
                if (this.ext_list[i].config)
                    tension += tension_multiple * this.ext_list[i].tension * this.ext_wood_count[i];
                else
                    tension += this.ext_list[i].tension * this.ext_wood_count[i];
            }
        }
        //Steel Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_steel_count[i];
            if (this.ext_steel_count[i] > 0) {
                let ts = this.ext_list[i].stats.Clone();
                ts.structure *= 2;
                ts.cost *= 2;
                ts.maxstrain += 5;
                ts = ts.Multiply(this.ext_steel_count[i]);
                stats = stats.Add(ts);
                if (this.ext_list[i].config)
                    tension += tension_multiple * this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
                else
                    tension += this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
            }
        }
        if (this.wires) {
            stats.maxstrain += Math.floor(tension);
            stats.drag += 3 * strut_count;
        }
        var use_cant = false;
        for (let i = 0; i < this.cant_list.length; i++) {
            if (this.cant_count[i] > 0) {
                use_cant = true;
                let ts = this.cant_list[i].stats;
                ts = ts.Multiply(this.cant_count[i]);
                stats = stats.Add(ts);
            }
        }
        if (use_cant)
            stats.cost += 5;
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
        this.wing_area = 0;
    }
    toJSON() {
        return {
            tank_count: this.tank_count,
            self_sealing: this.self_sealing,
            fire_extinguisher: this.fire_extinguisher,
        };
    }
    fromJSON(js) {
        this.tank_count = js["tank_count"];
        this.self_sealing = js["self_sealing"];
        this.fire_extinguisher = js["fire_extinguisher"];
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
        count = Math.floor(count);
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
        //Count cantilever dependent tanks.
        var ccount = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].cantilever)
                ccount += this.tank_count[i];
        }
        //How many can you have?
        var allowed = Math.floor(this.wing_area / 10);
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
        return mod;
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
        stats.reqsections = Math.ceil(stats.reqsections);
        if (this.self_sealing) {
            stats.mass += internal_count;
            stats.cost += 2 * internal_count;
            stats.warnings.push({ source: "Self-Sealing Gas Tank", warning: "Fuel leak penalty will apply only to the next Fuel Check." });
        }
        if (this.fire_extinguisher) {
            stats.mass += 2;
            stats.cost += 3;
            stats.warnings.push({ source: "Remote Fire Extinguisher", warning: "Spend to put out a fire." });
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
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js) {
        this.bomb_count = js["bomb_count"];
        this.rocket_count = js["rocket_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
    }
    GetBombCount() {
        return this.bomb_count;
    }
    SetBombCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.bomb_count = count;
        this.LimitMass(true);
        this.CalculateStats();
    }
    GetRocketCount() {
        return this.rocket_count;
    }
    SetRocketCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.rocket_count = count;
        this.LimitMass(false);
        this.CalculateStats();
    }
    GetBay1() {
        return this.internal_bay_1;
    }
    GetBay2() {
        return this.internal_bay_2;
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
    LimitMass(bomb) {
        var reduce = false;
        while (this.bomb_count + this.rocket_count > this.acft_struct / 5) {
            reduce = true;
            if ((bomb && this.bomb_count > 0)
                || (!bomb && this.rocket_count == 0)) {
                this.bomb_count--;
            }
            else {
                this.rocket_count--;
            }
        }
        return reduce;
    }
    GetExternalMass() {
        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                ext_bomb_count = 0;
            }
        }
        var ext_mass = ext_bomb_count + this.rocket_count;
        return ext_mass;
    }
    SetAcftStructure(num) {
        this.acft_struct = num;
        if (this.LimitMass(false)) {
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        // stats.wetmass += this.bomb_count;
        // stats.wetmass += this.rocket_count;
        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            stats.reqsections++;
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                stats.reqsections++;
                ext_bomb_count = 0;
            }
        }
        var ext_mass = ext_bomb_count + this.rocket_count;
        var rack_mass = Math.ceil(ext_mass / 5);
        stats.mass += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;
        stats.reqsections = Math.ceil(stats.reqsections);
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class CargoAndPassengers extends Part {
    constructor() {
        super();
        this.mass = 0;
        this.pass = 0;
    }
    toJSON() {
        return {
            mass: this.mass,
            pass: this.pass,
        };
    }
    fromJSON(js) {
        this.mass = js["mass"];
        this.pass = js["pass"];
    }
    GetMass() {
        return this.mass;
    }
    SetMass(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.mass = count;
        this.CalculateStats();
    }
    GetPassengers() {
        return this.pass;
    }
    SetPassengers(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.pass = count;
        this.CalculateStats();
    }
    SetSeats(count) {
        this.seats = count;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats.wetmass += Math.max(this.pass, this.seats);
        //Can be placed in cargo space, if uncomfortably. Takes 3 mass.
        if (this.pass > this.seats) {
            stats.wetmass += 3 * (this.pass - this.seats);
        }
        else {
            //Cargo can be placed in half seats.
            var emptyseat = this.seats - this.pass;
            if (this.mass - emptyseat > 0)
                stats.wetmass += this.mass - emptyseat;
        }
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
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
    fromJSON(js) {
        this.gear_sel = js["gear_sel"];
        this.retract = js["retract"];
        this.extra_sel = js["extra_sel"];
    }
    GetGearName() {
        if (this.retract)
            return "Retractable " + this.gear_list[this.gear_sel].name;
        else
            return this.gear_list[this.gear_sel].name;
    }
    GetGearList() {
        return this.gear_list;
    }
    GetGear() {
        return this.gear_sel;
    }
    SetGear(num) {
        this.gear_sel = num;
        this.CalculateStats();
    }
    CanRetract() {
        return this.gear_list[this.gear_sel].can_retract;
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
        this.loadedMP = Math.floor(mass / 5);
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.gear_list[this.gear_sel].stats);
        var pdrag = this.gear_list[this.gear_sel].DpLMP * this.loadedMP;
        if (this.retract) {
            stats.mass += Math.floor(pdrag / 2);
            stats.cost += Math.floor(pdrag / 2);
        }
        else {
            stats.drag += pdrag;
        }
        stats.structure += this.gear_list[this.gear_sel].SpLMP * this.loadedMP;
        for (let i = 0; i < this.extra_list.length; i++) {
            if (this.extra_sel[i]) {
                stats = stats.Add(this.extra_list[i].stats);
                stats.mass += this.extra_list[i].MpLMP * this.loadedMP;
            }
        }
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Accessories extends Part {
    constructor(js) {
        super();
        this.armour_coverage = 0;
        this.armour_AP = 0;
        this.acft_power = 0;
        this.electric_list = [];
        for (let elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10p: elem["cp10p"]
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];
        this.radio_list = [];
        this.radio_sel = 0;
        for (let elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.info_list = [];
        for (let elem of js["information"]) {
            this.info_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.info_sel = [...Array(this.info_list.length).fill(false)];
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
            this.cont_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            armour_coverage: this.armour_coverage,
            armour_AP: this.armour_AP,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            info_sel: this.info_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }
    fromJSON(js) {
        this.armour_coverage = js["armour_coverage"];
        this.armour_AP = js["armour_AP"];
        this.electrical_count = js["electrical_count"];
        this.radio_sel = js["radio_sel"];
        this.info_sel = js["info_sel"];
        this.visi_sel = js["visi_sel"];
        this.clim_sel = js["clim_sel"];
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }
    GetCommunicationName() {
        return this.radio_list[this.radio_sel].name;
    }
    GetArmourCoverage() {
        return this.armour_coverage;
    }
    SetArmourCoverage(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.armour_coverage = num;
        this.CalculateStats();
    }
    GetArmourAP() {
        return this.armour_AP;
    }
    SetArmourAP(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.armour_AP = num;
        this.CalculateStats();
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
        count = Math.floor(count);
        count = Math.min(count, 5);
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
    GetInfoList() {
        return this.info_list;
    }
    GetInfoSel() {
        return this.info_sel;
    }
    SetInfoSel(idx, use) {
        this.info_sel[idx] = use;
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        //Armour
        stats.mass += this.armour_coverage * this.armour_AP;
        stats.cost += Math.floor(this.armour_coverage * this.armour_AP / 3);
        stats.toughness += this.armour_coverage * this.armour_AP;
        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            let ts = this.electric_list[i].stats.Clone();
            ts = ts.Multiply(this.electrical_count[i]);
            stats = stats.Add(ts);
            stats.charge += Math.floor(this.electrical_count[i] * this.electric_list[i].cp10p * this.acft_power / 10);
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);
        //Information
        for (let i = 0; i < this.info_list.length; i++) {
            if (this.info_sel[i])
                stats = stats.Add(this.info_list[i].stats);
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
    fromJSON(js) {
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        num = Math.floor(num);
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
        stats.cost = -(this.cost * 1.5 * this.acft_stats.cost / 10);
        stats.liftbleed = -this.bleed * 2;
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = -(this.mass * this.acft_stats.mass / 20);
        stats.toughness = (this.toughness * this.acft_stats.toughness / 5);
        stats.maxstrain = (this.maxstrain * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = -(this.drag * this.acft_stats.drag / 20);
        var dot_cost = Math.abs(this.cost) + Math.abs(this.bleed)
            + Math.abs(this.escape) + Math.abs(this.mass)
            + Math.abs(this.toughness) + Math.abs(this.maxstrain)
            + Math.abs(this.reliability) + Math.abs(this.drag) - this.free_dots;
        stats.cost += Math.max(0, dot_cost);
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Weapon extends Part {
    constructor(js) {
        super();
    }
    toJSON() {
        return {};
    }
    fromJSON(js) {
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        if (use) {
            this.fixed = true;
        }
        else {
            this.fixed = false;
            this.synchronization = -1;
        }
        this.CalculateStats();
    }
    GetWing() {
        return this.wing;
    }
    SetWing(use) {
        if (use && this.can_wing) {
            this.wing = true;
            this.synchronization = -1;
        }
        else {
            this.wing = false;
        }
        this.CalculateStats();
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
        if (use && this.can_free_accessible) {
            this.free_accessible = true;
            this.accessible = false;
        }
        else {
            this.free_accessible = false;
        }
        this.CalculateStats();
    }
    GetSynchronization() {
        return this.synchronization;
    }
    SetSynchronization(use) {
        if (use >= 0 && this.weapon_type.synched && this.can_synchronize) {
            if (use == 3 && !this.can_deflector)
                use--;
            if (use == 2 && !this.can_spinner)
                use--;
            this.synchronization = use;
        }
        else {
            this.synchronization = -1;
        }
        this.CalculateStats();
    }
    GetPair() {
        return this.pair;
    }
    SetPair(use) {
        this.pair = use;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.weapon_type.stats);
        if (this.pair)
            stats = stats.Add(this.weapon_type.stats);
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(stats.cost / 2));
        }
        if (this.covered) {
            stats.mass += 1;
            stats.drag = 0;
        }
        //If uncovered add 1, if covered, drag is 1.
        if (this.wing)
            stats.drag += 1;
        //Synchronization == -1 is no synch.
        if (this.synchronization == 0) {
            stats.cost += 2;
            if (this.pair)
                stats.cost += 2;
        }
        else if (this.synchronization == 1) {
            stats.cost += 3;
            if (this.pair)
                stats.cost += 3;
            //synchronization == 2 is spinner and costs nothing.
        }
        else if (this.synchronization == 3) {
            stats.cost += 1;
            stats.warnings.push({
                source: this.weapon_type.name,
                warning: "Deflector Plates inflict 1 Wear every time you roll a natural 5 or less."
            });
        }
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />
class Weapons extends Part {
    constructor(js) {
        super();
        this.weapon_mass = 0;
        this.weapon_drag = 0;
        this.weapon_cost = 0;
    }
    toJSON() {
        return {
            state: "BETA",
            weapon_mass: this.weapon_mass,
            weapon_drag: this.weapon_drag,
            weapon_cost: this.weapon_cost,
        };
    }
    fromJSON(js) {
        if (js && js["state"] == "BETA") {
            this.weapon_cost = js["weapon_cost"];
            this.weapon_drag = js["weapon_drag"];
            this.weapon_mass = js["weapon_mass"];
        }
    }
    GetMass() {
        return this.weapon_mass;
    }
    SetMass(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_mass = num;
        this.CalculateStats();
    }
    GetDrag() {
        return this.weapon_drag;
    }
    SetDrag(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_drag = num;
        this.CalculateStats();
    }
    GetCost() {
        return this.weapon_cost;
    }
    SetCost(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_cost = num;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats.mass = this.weapon_mass;
        stats.drag = this.weapon_drag;
        stats.cost = this.weapon_cost;
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
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
class Aircraft {
    constructor(js, engine_json, storage) {
        this.use_storage = false;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"], engine_json);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers();
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(js["weapons"]);
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
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
    }
    toJSON() {
        return {
            version: this.version,
            name: this.name,
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
        };
    }
    fromJSON(js) {
        console.log(js);
        console.log(js["version"]);
        if (this.version == js["version"]) {
            this.name = js["name"];
            this.era.fromJSON(js["era"]);
            this.cockpits.fromJSON(js["cockpits"]);
            this.passengers.fromJSON(js["passengers"]);
            this.engines.fromJSON(js["engines"]);
            this.propeller.fromJSON(js["propeller"]);
            this.frames.fromJSON(js["frames"]);
            this.wings.fromJSON(js["wings"]);
            this.stabilizers.fromJSON(js["stabilizers"]);
            this.controlsurfaces.fromJSON(js["controlsurfaces"]);
            this.reinforcements.fromJSON(js["reinforcements"]);
            this.fuel.fromJSON(js["fuel"]);
            this.munitions.fromJSON(js["munitions"]);
            this.cargo.fromJSON(js["cargo"]);
            this.gear.fromJSON(js["gear"]);
            this.accessories.fromJSON(js["accessories"]);
            this.optimization.fromJSON(js["optimization"]);
            this.weapons.fromJSON(js["weapons"]);
            this.CalculateStats();
            return true;
        }
        return false;
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.propeller.PartStats());
        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        stats = stats.Add(this.frames.PartStats());
        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetWingArea(stats.wingarea);
        stats = stats.Add(this.stabilizers.PartStats());
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        stats = stats.Add(this.reinforcements.PartStats());
        this.cargo.SetSeats(this.passengers.GetBeds() + this.passengers.GetSeats());
        stats = stats.Add(this.cargo.PartStats());
        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        stats = stats.Add(this.accessories.PartStats());
        stats = stats.Add(this.weapons.PartStats());
        //Gear go last, because they need total mass.
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        stats = stats.Add(this.gear.PartStats());
        stats.toughness += Math.floor(Math.max(0, (stats.structure - stats.maxstrain) / 2) + stats.maxstrain / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();
        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;
            var derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);
            //Update Part Local stuff
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.FlightStress, this.stats.visibility);
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftStructure(stats.structure);
            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: "Rumble",
                    warning: "Rumble requires a minimum structure of Rumble*10 to fly."
                });
            }
            if (this.DisplayCallback)
                this.DisplayCallback();
            if (this.use_storage)
                window.localStorage.aircraft = JSON.stringify(this);
        }
    }
    GetDerivedStats() {
        var DryMP = Math.floor(this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        var WetMP = Math.floor((this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        var WetMPwBombs = Math.floor((this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        var DPEmpty = Math.floor((this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        var DPFull = Math.floor((this.stats.drag + WetMP) / 5);
        DPFull = Math.max(DPFull, 1);
        DPFull = DPEmpty; //Based on advice from Discord.
        var DPwBombs = Math.floor((this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        var MaxSpeedEmpty = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9)));
        var MaxSpeedFull = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9)));
        var MaxSpeedwBombs = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9)));
        var StallSpeedEmpty = Math.floor(this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFull = Math.floor(this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFullwBombs = Math.floor(this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea));
        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(this.stats.power / DryMP);
        var BoostFull = Math.floor(this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(this.stats.pitchboost * MaxSpeedEmpty);
        var Stabiilty = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stabiilty += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stabiilty -= 2;
        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stabiilty > 10)
            HandlingEmpty = -99999;
        else if (Stabiilty == 10)
            HandlingEmpty -= 4;
        else if (Stabiilty > 6)
            HandlingEmpty -= 3;
        else if (Stabiilty > 3)
            HandlingEmpty -= 2;
        else if (Stabiilty > 0)
            HandlingEmpty -= 1;
        else if (Stabiilty == 0)
            HandlingEmpty += 0;
        else if (Stabiilty > -4)
            HandlingEmpty += 1;
        else if (Stabiilty > -7)
            HandlingEmpty += 2;
        else if (Stabiilty > -10)
            HandlingEmpty += 3;
        else if (Stabiilty == -10)
            HandlingEmpty += 4;
        else
            HandlingEmpty = -99999;
        var HandlingFull = HandlingEmpty + DryMP - WetMP;
        var HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;
        var ElevatorsEmpty = Math.max(1, Math.floor(HandlingEmpty / 10));
        var ElevatorsFull = Math.max(1, Math.floor(HandlingFull / 10));
        var ElevatorsFullwBombs = Math.max(1, Math.floor(HandlingFullwBombs / 10));
        var MaxStrain = 1 / 0;
        if (this.wings.GetWingList().length > 0 || this.wings.GetMiniWingList().length > 0)
            MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        var Toughness = this.stats.toughness;
        var Structure = this.stats.structure;
        var EnergyLoss = Math.ceil(DPEmpty / 6);
        var EnergyLosswBombs = EnergyLoss + 1;
        var TurnBleed = Math.ceil((StallSpeedEmpty + StallSpeedFull) / 12);
        var TurnBleedwBombs = TurnBleed + 1;
        var FuelUses = this.stats.fuel / this.stats.fuelconsumption;
        var CruiseRange = FuelUses / 3 * (MaxSpeedFull + MaxSpeedEmpty) / 2 * 10 * 0.7;
        var CruiseRangewBombs = FuelUses / 3 * MaxSpeedwBombs * 10 * 0.7;
        var FlightStress = this.stats.flightstress;
        if (Stabiilty > 3 || Stabiilty < -3)
            FlightStress++;
        FlightStress += Math.floor(DryMP / 10);
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
            Stabiilty: Stabiilty,
            HandlingEmpty: HandlingEmpty,
            HandlingFull: HandlingFull,
            HandlingFullwBombs: HandlingFullwBombs,
            ElevatorsEmpty: ElevatorsEmpty,
            ElevatorsFull: ElevatorsFull,
            ElevatorsFullwBombs: ElevatorsFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            CruiseRange: CruiseRange,
            CruiseRangewBombs: CruiseRangewBombs,
            FlightStress: FlightStress,
        };
    }
    SetStorage(use) {
        this.use_storage = use;
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
    GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }
    GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }
    GetGearName() {
        return this.gear.GetGearName();
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
    fs.div0.classList.add("flex-container");
    fs.div1.classList.add("flex-container");
    fs.div2.classList.add("flex-container");
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
/// <reference path="./Tools.ts" />
class Display {
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Era.ts" />
class Era_HTML extends Display {
    constructor(m) {
        super();
        this.model = m;
        //Get used elements
        this.select = document.getElementById("select_era");
        this.bleed = document.getElementById("liftbleed_era");
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select.add(opt);
        }
    }
    UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        BlinkIfChanged(this.bleed, this.model.GetLiftBleed().toString());
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
        var option = this.row.insertCell();
        var upgrades = this.row.insertCell();
        var safety = this.row.insertCell();
        var gunsights = this.row.insertCell();
        var stat_cell = this.row.insertCell();
        var tbl = document.createElement("TABLE");
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Crash Safety");
        var c2_row = tbl.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_rseq = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, "Flight Stress");
        CreateTH(h3_row, "Escape");
        CreateTH(h3_row, "Visibility");
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
            opt.text = elem.name;
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);
        var fs = CreateFlexSection(upgrades);
        //Add all the upgrades as checkboxes
        var upg_index = 0;
        for (let elem of cp.GetUpgradeList()) {
            let upg = document.createElement("INPUT");
            FlexCheckbox(elem.name, upg, fs);
            let local_index = upg_index;
            upg_index += 1;
            upg.onchange = () => { this.cockpit.SetUpgrade(local_index, upg.checked); };
            this.upg_chbxs.push(upg);
        }
        var fs = CreateFlexSection(safety);
        //Add all the safties as checkboxes
        var sft_index = 0;
        for (let elem of cp.GetSafetyList()) {
            let sft = document.createElement("INPUT");
            FlexCheckbox(elem.name, sft, fs);
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
            FlexCheckbox(elem.name, gun, fs);
            let local_index = gun_index;
            gun_index += 1;
            gun.onchange = () => { this.cockpit.SetGunsight(local_index, gun.checked); };
            this.gun_chbxs.push(gun);
        }
        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };
    }
    UpdateCockpit(cp) {
        this.cockpit = cp;
    }
    UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_rseq, stats.reqsections.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
        BlinkIfChanged(this.d_strs, this.cockpit.GetFlightStress().toString());
        BlinkIfChanged(this.d_escp, this.cockpit.GetEscape().toString());
        BlinkIfChanged(this.d_visi, this.cockpit.GetVisibility().toString());
        this.sel_type.selectedIndex = this.cockpit.GetType();
        var upgs = this.cockpit.GetSelectedUpgrades();
        for (let i = 0; i < this.upg_chbxs.length; i++) {
            this.upg_chbxs[i].checked = upgs[i];
        }
        var sfty = this.cockpit.GetSelectedSafety();
        for (let i = 0; i < this.sft_chbxs.length; i++) {
            this.sft_chbxs[i].checked = sfty[i];
        }
        var guns = this.cockpit.GetSelectedGunsights();
        for (let i = 0; i < this.gun_chbxs.length; i++) {
            this.gun_chbxs[i].checked = guns[i];
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="./Cockpit.ts" />
/// <reference path="../impl/Cockpits.ts" />
class Cockpits_HTML extends Display {
    constructor(cockpits) {
        super();
        this.cockpits = cockpits;
        this.tbl = document.getElementById("table_cockpit");
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.counter.onchange = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
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
        this.nseats = document.getElementById("num_seats");
        this.nbeds = document.getElementById("num_beds");
        this.mass = document.getElementById("passenger_mass");
        this.reqseq = document.getElementById("passenger_req_seq");
        var upg_cell = document.getElementById("passenger_upg");
        this.connect = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Connectivity", this.connect, fs);
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
    }
    UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString());
        BlinkIfChanged(this.reqseq, stats.reqsections.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Engine.ts" />
class Engine_HTML extends Display {
    constructor(eng, r) {
        super();
        this.engine = eng;
        this.engine_list = eng.GetListOfEngines();
        var row = r;
        this.InitTypeSelect(row);
        var option_cell = row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE");
        opt_table.className = "inner_table";
        CreateTH(opt_table.insertRow(), "Cooling");
        this.cool_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Mounting");
        var mount_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Upgrades");
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);
        var option2_cell = row.insertCell();
        option2_cell.className = "inner_table";
        var opt2_table = document.createElement("TABLE");
        opt2_table.className = "inner_table";
        CreateTH(opt2_table.insertRow(), "Cowls");
        var cowl_cell = opt2_table.insertRow().insertCell();
        option2_cell.appendChild(opt2_table);
        CreateTH(opt2_table.insertRow(), "Electrical");
        var elec_cell = opt2_table.insertRow().insertCell();
        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitCowlSelect(cowl_cell);
        this.InitElectricSelect(elec_cell);
        this.InitStatDisplay(row);
    }
    InitTypeSelect(row) {
        this.e_pwr = document.createElement("INPUT");
        this.e_mass = document.createElement("INPUT");
        this.e_drag = document.createElement("INPUT");
        this.e_rely = document.createElement("INPUT");
        this.e_cool = document.createElement("INPUT");
        this.e_over = document.createElement("INPUT");
        this.e_fuel = document.createElement("INPUT");
        this.e_alti = document.createElement("INPUT");
        this.e_torq = document.createElement("INPUT");
        this.e_rumb = document.createElement("INPUT");
        this.e_cost = document.createElement("INPUT");
        this.e_oil = document.createElement("INPUT");
        this.e_pulsejet = document.createElement("INPUT");
        this.cool_count = document.createElement("INPUT");
        this.cool_count.setAttribute("type", "number");
        var tcell = row.insertCell(0);
        //Set up the engine select box.
        this.e_select = document.createElement("SELECT");
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        for (let i = 0; i < this.engine_list.length; i++) {
            let eng = this.engine_list[i];
            let opt = document.createElement("OPTION");
            opt.text = eng.name;
            this.e_select.add(opt);
        }
        let opt = document.createElement("OPTION");
        opt.text = "Custom";
        opt.value = (-1).toString();
        this.e_select.add(opt);
        var fs = CreateFlexSection(tcell);
        //Set up the individual stat input boxes
        FlexInput("Power", this.e_pwr, fs);
        FlexInput("Mass", this.e_mass, fs);
        FlexInput("Drag", this.e_drag, fs);
        FlexInput("Reliability", this.e_rely, fs);
        FlexInput("Cooling", this.e_cool, fs);
        FlexInput("Overspeed", this.e_over, fs);
        FlexInput("Fuel Consumption", this.e_fuel, fs);
        FlexInput("Altitude", this.e_alti, fs);
        FlexInput("Torque", this.e_torq, fs);
        FlexInput("Rumble", this.e_rumb, fs);
        FlexInput("Cost", this.e_cost, fs);
        FlexCheckbox("Oil Tank", this.e_oil, fs);
        FlexCheckbox("Pulsejet", this.e_pulsejet, fs);
        //Event Listeners for engine stats
        this.e_select.onchange = () => {
            if (this.e_select.selectedIndex == this.engine_list.length) {
                this.SetInputDisable(false);
                this.SendCustomStats();
            }
            else {
                this.SetInputDisable(true);
                this.engine.SetSelectedIndex(this.e_select.selectedIndex);
            }
        };
        var trigger = () => { this.SendCustomStats(); };
        this.e_pwr.onchange = trigger;
        this.e_mass.onchange = trigger;
        this.e_drag.onchange = trigger;
        this.e_rely.onchange = trigger;
        this.e_cool.onchange = trigger;
        this.e_over.onchange = trigger;
        this.e_fuel.onchange = trigger;
        this.e_alti.onchange = trigger;
        this.e_torq.onchange = trigger;
        this.e_rumb.onchange = trigger;
        this.e_cost.onchange = trigger;
        this.e_oil.onchange = trigger;
        this.e_pulsejet.onchange = trigger;
    }
    UpdateEngine(en) {
        this.engine = en;
    }
    InitMountSelect(mount_cell) {
        var txtSpan = document.createElement("SPAN");
        txtSpan.innerHTML = "Engine Mounting Location";
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            opt.value = elem.pp_type;
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
        FlexCheckbox(" Push Pull", this.pushpull_input, fs);
        FlexCheckbox(" Torque To Structure", this.torque_input, fs);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }
    InitUpgradeSelect(upg_cell) {
        this.ds_input = document.createElement("INPUT");
        this.gp_input = document.createElement("INPUT");
        this.gpr_input = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Extended Driveshafts", this.ds_input, fs);
        FlexInput("Geared Propeller", this.gp_input, fs);
        FlexInput("Negate Reliability Penalty", this.gpr_input, fs);
        this.gp_input.onchange = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.onchange = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
    }
    InitElectricSelect(cell) {
        var fs = CreateFlexSection(cell);
        this.alternator_input = document.createElement("INPUT");
        this.generator_input = document.createElement("INPUT");
        FlexCheckbox("Alternator", this.alternator_input, fs);
        FlexCheckbox("Generator", this.generator_input, fs);
        this.alternator_input.oninput = () => { this.engine.SetAlternator(this.alternator_input.checked); };
        this.generator_input.oninput = () => { this.engine.SetGenerator(this.generator_input.checked); };
    }
    InitStatDisplay(row) {
        var stat_cell = row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Power");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Reliability");
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Overspeed");
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Cost");
        CreateTH(h3_row, "Altitude");
        CreateTH(h3_row, "Fuel Consumption");
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Pitch Stab");
        CreateTH(h4_row, "Lateral Stab");
        CreateTH(h4_row, "Max Strain");
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, "Structure");
        CreateTH(h5_row, "Flight Stress");
        CreateTH(h5_row, "Frame Sections");
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
        var h6_row = tbl_stat.insertRow();
        CreateTH(h6_row, "Charge");
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
            opt.text = elem.name;
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
        if (this.e_oil.checked) {
            this.e_cool.valueAsNumber = 0;
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Rotary Engines use Oil Tanks.<br/>+1 Mass, Oil Tank is a Vital Component.";
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.valueAsNumber == 0) {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Air-Cooled Engine.<br/>All is well.";
            this.cool_cell.appendChild(txtSpan);
        }
        else {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "    Select Radiator";
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT");
                this.cool_select.required = true;
            }
            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(0);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION");
                opt.innerText = "Radiator #" + i.toString();
                this.cool_select.add(opt);
            }
            this.cool_select.onchange = () => {
                this.engine.SetRadiator(this.cool_select.selectedIndex);
            };
            this.cool_select.selectedIndex = this.engine.GetRadiator();
            this.cool_cell.appendChild(this.cool_select);
            this.cool_cell.appendChild(txtSpan);
            this.cool_cell.appendChild(document.createElement("BR"));
            var txtSpan2 = document.createElement("SPAN");
            txtSpan2.innerHTML = "    Cooling Amount";
            this.cool_count.min = "0";
            this.cool_count.valueAsNumber = this.engine.GetCooling();
            this.cool_count.max = this.engine.GetCurrentStats().stats.cooling.toString();
            if (this.cool_count.valueAsNumber > this.e_cool.valueAsNumber) {
                this.cool_count.valueAsNumber = this.e_cool.valueAsNumber;
            }
            this.cool_count.onchange = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
            this.cool_cell.appendChild(this.cool_count);
            this.cool_cell.appendChild(txtSpan2);
        }
    }
    SendCustomStats() {
        var e_stats = new EngineStats();
        e_stats.stats.power = this.e_pwr.valueAsNumber;
        e_stats.stats.mass = this.e_mass.valueAsNumber;
        e_stats.stats.drag = this.e_drag.valueAsNumber;
        e_stats.stats.reliability = this.e_rely.valueAsNumber;
        e_stats.stats.cooling = this.e_cool.valueAsNumber;
        e_stats.overspeed = this.e_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.e_fuel.valueAsNumber;
        e_stats.altitude = this.e_alti.valueAsNumber;
        e_stats.torque = this.e_torq.valueAsNumber;
        e_stats.rumble = this.e_rumb.valueAsNumber;
        e_stats.stats.cost = this.e_cost.valueAsNumber;
        e_stats.oiltank = this.e_oil.checked;
        e_stats.pulsejet = this.e_pulsejet.checked;
        this.engine.SetCustomStats(e_stats);
    }
    SetInputDisable(b) {
        this.e_pwr.disabled = b;
        this.e_mass.disabled = b;
        this.e_drag.disabled = b;
        this.e_rely.disabled = b;
        this.e_cool.disabled = b;
        this.e_over.disabled = b;
        this.e_fuel.disabled = b;
        this.e_alti.disabled = b;
        this.e_torq.disabled = b;
        this.e_rumb.disabled = b;
        this.e_cost.disabled = b;
        this.e_oil.disabled = b;
        this.e_pulsejet.disabled = b;
    }
    UpdateDisplay() {
        var idx = this.engine.GetSelectedIndex();
        if (idx < 0)
            idx = this.engine_list.length;
        this.e_select.selectedIndex = idx;
        if (this.e_select.selectedIndex == this.engine_list.length) {
            this.SetInputDisable(false);
        }
        else {
            this.SetInputDisable(true);
        }
        var e_stats = this.engine.GetCurrentStats();
        this.e_pwr.valueAsNumber = e_stats.stats.power;
        this.e_mass.valueAsNumber = e_stats.stats.mass;
        this.e_drag.valueAsNumber = e_stats.stats.drag;
        this.e_rely.valueAsNumber = e_stats.stats.reliability;
        this.e_cool.valueAsNumber = e_stats.stats.cooling;
        this.e_over.valueAsNumber = e_stats.overspeed;
        this.e_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.e_alti.valueAsNumber = e_stats.altitude;
        this.e_torq.valueAsNumber = e_stats.torque;
        this.e_rumb.valueAsNumber = e_stats.rumble;
        this.e_cost.valueAsNumber = e_stats.stats.cost;
        this.e_oil.checked = e_stats.oiltank;
        this.e_pulsejet.checked = e_stats.pulsejet;
        this.InitCoolingSelect();
        if (this.mount_select.selectedIndex != this.engine.GetMountIndex()) {
            this.mount_select.selectedIndex = this.engine.GetMountIndex();
        }
        if (this.pushpull_input.checked != this.engine.GetUsePushPull()) {
            this.pushpull_input.checked = this.engine.GetUsePushPull();
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
        }
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        if (this.ds_input.checked != this.engine.GetUseExtendedDriveshaft()) {
            this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
        }
        if (this.gp_input.valueAsNumber != this.engine.GetGearCount()) {
            this.gp_input.valueAsNumber = this.engine.GetGearCount();
        }
        if (this.gpr_input.valueAsNumber != this.engine.GetGearReliability()) {
            this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
        }
        if (e_stats.pulsejet) {
            this.mount_select.disabled = true;
            this.mount_select.selectedIndex = -1;
            this.pushpull_input.disabled = true;
            this.ds_input.disabled = true;
            this.gp_input.disabled = true;
            this.gpr_input.disabled = true;
            for (let i = 0; i < this.mount_select.options.length; i++) {
                let opt = this.mount_select.options[i];
                if (opt.value == "fuselage") {
                    opt.disabled = true;
                }
            }
            this.cowl_select.disabled = true;
            this.alternator_input.disabled = true;
            this.generator_input.disabled = true;
        }
        else {
            this.mount_select.disabled = false;
            this.pushpull_input.disabled = false;
            this.ds_input.disabled = false;
            this.gp_input.disabled = false;
            this.gpr_input.disabled = false;
            for (let i = 0; i < this.mount_select.options.length; i++) {
                let opt = this.mount_select.options[i];
                opt.disabled = false;
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
        BlinkIfChanged(this.d_powr, full_stats.power.toString());
        BlinkIfChanged(this.d_mass, full_stats.mass.toString());
        BlinkIfChanged(this.d_drag, full_stats.drag.toString());
        BlinkIfChanged(this.d_rely, this.engine.GetReliability().toString());
        BlinkIfChanged(this.d_visi, full_stats.visibility.toString());
        BlinkIfChanged(this.d_over, this.engine.GetOverspeed().toString());
        BlinkIfChanged(this.d_cost, full_stats.cost.toString());
        BlinkIfChanged(this.d_alti, e_stats.altitude.toString());
        BlinkIfChanged(this.d_fuel, full_stats.fuelconsumption.toString());
        BlinkIfChanged(this.d_pstb, full_stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, full_stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, full_stats.maxstrain.toString());
        BlinkIfChanged(this.d_strc, full_stats.structure.toString());
        BlinkIfChanged(this.d_fstr, full_stats.flightstress.toString());
        BlinkIfChanged(this.d_sect, full_stats.reqsections.toString());
        BlinkIfChanged(this.d_chrg, full_stats.charge.toString());
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class Radiator extends Part {
    constructor(tl, ml, cl) {
        super();
        this.need_cool = 0;
        this.idx_type = 0;
        this.idx_mount = 0;
        this.idx_coolant = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
    }
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant
        };
    }
    fromJSON(js) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
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
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetMountIndex(num) {
        this.idx_mount = num;
        this.CalculateStats();
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
    SetNeedCool(num) {
        this.need_cool = num;
    }
    PartStats() {
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);
        stats.drag += Math.ceil(this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
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
            opt.text = elem.name;
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);
        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        var cool_cell = row.insertCell();
        //Special Coolant
        this.coolant_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex); };
        cool_cell.appendChild(this.coolant_select);
        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE");
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Reliability");
        CreateTH(h1_row, "Lateral Stab");
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
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString());
        BlinkIfChanged(this.c_cost, stats.cost.toString());
        BlinkIfChanged(this.c_drag, stats.drag.toString());
        BlinkIfChanged(this.c_rely, stats.reliability.toString());
        BlinkIfChanged(this.c_lstb, stats.latstab.toString());
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
        this.tbl = document.getElementById("table_engine");
        this.tblR = document.getElementById("table_radiator");
        this.num_engines = document.getElementById("num_engines");
        this.num_engines.onchange = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfEngines();
        this.num_radiators = document.getElementById("num_radiators");
        this.num_radiators.onchange = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();
        this.is_asymmetric = document.getElementById("asymmetric");
        this.is_asymmetric.oninput = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }
    UpdateDisplay() {
        var num = this.eng.GetNumberOfEngines();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, this.tbl.insertRow());
            this.engines.push(en);
        }
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
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(this.tblR.insertRow(), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }
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
        this.select_prop = document.getElementById("propeller_pitch");
        for (let elem of prop.GetPropList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select_prop.add(opt);
        }
        this.select_prop.onchange = () => { this.prop.SetPropIndex(this.select_prop.selectedIndex); };
        this.input_variable = document.getElementById("propeller_variable");
        this.input_variable.onchange = () => { this.prop.SetVariable(this.input_variable.checked); };
    }
    UpdateDisplay() {
        this.input_variable.checked = this.prop.GetVariable();
        this.input_variable.disabled = !this.prop.CanBeVariable();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();
        this.select_prop.disabled = false;
        if (!this.prop.GetHavePropeller()) {
            this.input_variable.disabled = true;
            this.select_prop.disabled = true;
            this.select_prop.selectedIndex = -1;
        }
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Frames.ts" />
class Frames_HTML extends Display {
    constructor(frames) {
        super();
        this.frames = frames;
        var table = document.getElementById("table_frames");
        var row = table.insertRow();
        this.c_frame = row.insertCell();
        this.c_skin = row.insertCell();
        this.c_options = row.insertCell();
        this.c_stats = row.insertCell();
        this.c_stats.className = "inner_table";
        this.c_stats.rowSpan = 0;
        var tbl = document.createElement("TABLE");
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Toughness");
        CreateTH(h2_row, "Visibility");
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, "Wing Area");
        CreateTH(h3_row, "Flammable");
        CreateTH(h3_row, "Pitch Stability");
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pstb = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        CreateTH(h4_row, "Max Strain");
        CreateTH(h4_row, "Lift Bleed");
        CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strn = c4_row.insertCell();
        this.d_lift = c4_row.insertCell();
        c4_row.insertCell();
        this.c_stats.appendChild(tbl);
        var row3 = table.insertRow();
        CreateTH(row3, "Tail Frame Type");
        CreateTH(row3, "Tail Skin Type");
        CreateTH(row3, "Tail Frame Options");
        var row4 = table.insertRow();
        this.t_frame = row4.insertCell();
        this.t_skin = row4.insertCell();
        this.t_options = row4.insertCell();
        this.t_select = document.getElementById("tail_type");
        this.t_farman = document.getElementById("tail_farman");
        this.t_boom = document.getElementById("tail_boom");
        this.t_fwing = document.getElementById("flying_wing");
        for (let elem of this.frames.GetTailList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.t_select.add(opt);
        }
        this.t_select.onchange = () => { this.frames.SetTailType(this.t_select.selectedIndex); };
        this.t_farman.onchange = () => { this.frames.SetUseFarman(this.t_farman.checked); };
        this.t_boom.onchange = () => { this.frames.SetUseBoom(this.t_boom.checked); };
        this.t_fwing.onchange = () => { this.frames.SetFlyingWing(this.t_fwing.checked); };
    }
    UpdateDisplay() {
        while (this.c_frame.children.length > 0)
            this.c_frame.removeChild(this.c_frame.children[0]);
        while (this.c_skin.children.length > 0)
            this.c_skin.removeChild(this.c_skin.children[0]);
        while (this.c_options.children.length > 0)
            this.c_options.removeChild(this.c_options.children[0]);
        while (this.t_frame.children.length > 0)
            this.t_frame.removeChild(this.t_frame.children[0]);
        while (this.t_skin.children.length > 0)
            this.t_skin.removeChild(this.t_skin.children[0]);
        while (this.t_options.children.length > 0)
            this.t_options.removeChild(this.t_options.children[0]);
        var section_list = this.frames.GetSectionList();
        var tail_section_list = this.frames.GetTailSectionList();
        var skin_list = this.frames.GetSkinList();
        var is_flammable = false;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            this.UpdateSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom() || this.frames.GetIsTailless();
        this.t_farman.checked = this.frames.GetUseFarman();
        this.t_boom.disabled = this.frames.GetUseFarman() || this.frames.GetIsTailless();
        this.t_boom.checked = this.frames.GetUseBoom();
        this.t_fwing.disabled = !this.frames.CanFlyingWing();
        this.t_fwing.checked = this.frames.GetFlyingWing();
        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            this.UpdateTailSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        if (is_flammable)
            BlinkIfChanged(this.d_flammable, "Yes");
        else
            BlinkIfChanged(this.d_flammable, "No");
        var stats = this.frames.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_strn, stats.maxstrain.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
    }
    UpdateSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var type_span = document.createElement("SPAN");
        var rem_button = document.createElement("BUTTON");
        rem_button.textContent = "-";
        rem_button.onclick = () => { this.frames.DeleteSection(i); };
        rem_button.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
        var add_button = document.createElement("BUTTON");
        add_button.textContent = "+";
        add_button.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();
        add_button.onclick = () => { this.frames.DuplicateSection(i); };
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
            frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        type_span.appendChild(rem_button);
        type_span.appendChild(add_button);
        type_span.appendChild(frame_select);
        this.c_frame.appendChild(type_span);
        this.c_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (sec.internal_bracing)
            skin_select.disabled = true;
        skin_select.onchange = () => { this.frames.SetSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        if (sec.internal_bracing)
            skin_select.selectedIndex = -1;
        this.c_skin.appendChild(skin_select);
        this.c_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleGeodesic(i);
        geo_input.onchange = () => { this.frames.SetGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleMonocoque(i);
        mono_input.onchange = () => { this.frames.SetMonocoque(i, mono_input.checked); };
        var int_input = document.createElement("INPUT");
        CreateCheckbox("Internal Bracing", int_input, opt_span, false);
        int_input.checked = sec.internal_bracing;
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing() || !this.frames.PossibleRemoveSections()))
            int_input.disabled = true;
        int_input.onchange = () => { this.frames.SetInternalBracing(i, int_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifting Body", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleMonocoque(i);
        lb_input.onchange = () => { this.frames.SetLiftingBody(i, lb_input.checked); };
        this.c_options.appendChild(opt_span);
        this.c_options.appendChild(document.createElement("BR"));
    }
    UpdateTailSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (ft.basestruct != 0)
                frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetTailFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        this.t_frame.appendChild(frame_select);
        this.t_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (this.frames.GetUseFarman()) {
            skin_select.disabled = true;
        }
        skin_select.onchange = () => { this.frames.SetTailSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        this.t_skin.appendChild(skin_select);
        this.t_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleTailGeodesic(i);
        geo_input.onchange = () => { this.frames.SetTailGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleTailMonocoque(i);
        mono_input.onchange = () => { this.frames.SetTailMonocoque(i, mono_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifting Body", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleTailMonocoque(i);
        lb_input.onchange = () => { this.frames.SetTailLiftingBody(i, lb_input.checked); };
        this.t_options.appendChild(opt_span);
        this.t_options.appendChild(document.createElement("BR"));
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
        this.stagger = document.getElementById("wing_stagger");
        this.closed = document.getElementById("wing_closed");
        this.swept = document.getElementById("wing_swept");
        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            this.stagger.append(opt);
        }
        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };
        var tbl = document.getElementById("wing_table");
        var full_row = tbl.insertRow();
        var mini_row = tbl.insertRow();
        var full_type = document.createElement("TH");
        full_type.textContent = "Full Wings";
        full_row.appendChild(full_type);
        var mini_type = document.createElement("TH");
        mini_type.textContent = "Miniature Wings";
        mini_row.appendChild(mini_type);
        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        var stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Wing Area");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Max Strain");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, "Lift Bleed");
        var c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Cost");
        CreateTH(h4_row, "Charge");
        CreateTH(h4_row, "Flammable");
        var c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        this.d_flam = c4_row.insertCell();
    }
    UpdateDisplay() {
        this.stagger.selectedIndex = this.wings.GetStagger();
        this.closed.checked = this.wings.GetClosed();
        this.closed.disabled = !this.wings.CanClosed();
        this.swept.checked = this.wings.GetSwept();
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
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_chrg, "0"); //stats.charge.toString(); //TODO: Charge
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, "Yes");
        else
            BlinkIfChanged(this.d_flam, "No");
    }
    AddFullWing() {
        var wing = {
            span: document.createElement("SPAN"),
            deck: document.createElement("SELECT"),
            skin: document.createElement("SELECT"),
            area: document.createElement("INPUT"),
            wspan: document.createElement("INPUT"),
            dihedral: document.createElement("INPUT"),
            anhedral: document.createElement("INPUT"),
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        CreateSpace(wing.span);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        CreateSpace(wing.span);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            wing.skin.append(opt);
        }
        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "3";
        CreateInput(" Span ", wing.wspan, wing.span, false);
        wing.wspan.min = "1";
        CreateInput(" Dihedral ", wing.dihedral, wing.span, false);
        wing.dihedral.min = "0";
        CreateInput(" Anhedral ", wing.anhedral, wing.span, false);
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
            if (wing.deck != i && !this.wings.CanAddFullWing(i - 1) && !this.wings.CanMoveFullWing(idx, i - 1))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = ht.skin.selectedIndex;
            this.wings.SetFullWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = Object.assign({}, wing);
            w.area = ht.area.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = Object.assign({}, wing);
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
        ht.dihedral.onchange = () => {
            let w = Object.assign({}, wing);
            w.dihedral = ht.dihedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.dihedral.max = (wing.span - wing.anhedral - 1).toString();
        ht.dihedral.valueAsNumber = wing.dihedral;
        ht.anhedral.onchange = () => {
            let w = Object.assign({}, wing);
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
            dihedral: undefined,
            anhedral: undefined,
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        CreateSpace(wing.span);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        CreateSpace(wing.span);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            wing.skin.append(opt);
        }
        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "1";
        wing.area.max = "2";
        CreateInput(" Span ", wing.wspan, wing.span, false);
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
        ht.deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = ht.skin.selectedIndex;
            this.wings.SetMiniWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = Object.assign({}, wing);
            w.area = ht.area.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = Object.assign({}, wing);
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
        none_opt.textContent = "None";
        this.fw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.fw_add.append(opt);
        }
        this.fw_add.oninput = () => {
            let w = { surface: 0, area: 10, span: 5, dihedral: 0, anhedral: 0, deck: this.fw_add.selectedIndex - 1 };
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
        none_opt.textContent = "None";
        this.mw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.mw_add.append(opt);
        }
        this.mw_add.oninput = () => {
            let w = { surface: 0, area: 2, span: 2, dihedral: 0, anhedral: 0, deck: this.mw_add.selectedIndex - 1 };
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
        var tbl = document.getElementById("stab_table");
        var row = tbl.insertRow();
        var hcell = row.insertCell();
        var vcell = row.insertCell();
        this.h_type = document.createElement("SELECT");
        this.h_count = document.createElement("INPUT");
        hcell.appendChild(this.h_type);
        hcell.append(document.createElement("BR"));
        CreateInput(" Stabilizers", this.h_count, hcell);
        this.h_count.min = "0";
        this.h_count.max = "20";
        this.h_count.onchange = () => { this.stab.SetHStabCount(this.h_count.valueAsNumber); };
        this.h_type.onchange = () => { this.stab.SetHStabType(this.h_type.selectedIndex); };
        for (let elem of s.GetHStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.h_type.add(opt);
        }
        this.v_type = document.createElement("SELECT");
        this.v_count = document.createElement("INPUT");
        vcell.appendChild(this.v_type);
        vcell.appendChild(document.createElement("BR"));
        CreateInput(" Stabilizers", this.v_count, vcell);
        this.v_count.min = "0";
        this.v_count.max = "20";
        this.v_count.onchange = () => { this.stab.SetVStabCount(this.v_count.valueAsNumber); };
        this.v_type.onchange = () => { this.stab.SetVStabType(this.v_type.selectedIndex); };
        for (let elem of s.GetVStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.v_type.add(opt);
        }
        var stat_cell = row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Control");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        CreateTH(h2_row, "Lift Bleed");
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
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/ControlSurfaces.ts" />
class ControlSurfaces_HTML extends Display {
    constructor(cs) {
        super();
        this.cs = cs;
        var tbl = document.getElementById("tbl_control_surfaces");
        var row = tbl.insertRow();
        var cs_cell = row.insertCell();
        this.aileron_select = document.createElement("SELECT");
        for (let a of cs.GetAileronList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.aileron_select.add(opt);
        }
        this.aileron_select.onchange = () => { this.cs.SetAileron(this.aileron_select.selectedIndex); };
        this.rudder_select = document.createElement("SELECT");
        for (let a of cs.GetRudderList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.rudder_select.add(opt);
        }
        this.rudder_select.onchange = () => { this.cs.SetRudder(this.rudder_select.selectedIndex); };
        this.elevator_select = document.createElement("SELECT");
        for (let a of cs.GetElevatorList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.elevator_select.add(opt);
        }
        this.elevator_select.onchange = () => { this.cs.SetElevator(this.elevator_select.selectedIndex); };
        this.flaps_select = document.createElement("SELECT");
        for (let a of cs.GetFlapsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.flaps_select.add(opt);
        }
        this.flaps_select.onchange = () => { this.cs.SetFlaps(this.flaps_select.selectedIndex); };
        this.slats_select = document.createElement("SELECT");
        for (let a of cs.GetSlatsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.slats_select.add(opt);
        }
        this.slats_select.onchange = () => { this.cs.SetSlats(this.slats_select.selectedIndex); };
        var fs = CreateFlexSection(cs_cell);
        FlexSelect("Ailerons", this.aileron_select, fs);
        FlexSelect("Rudders", this.rudder_select, fs);
        FlexSelect("Elevators", this.elevator_select, fs);
        FlexSelect("Flaps", this.flaps_select, fs);
        FlexSelect("Slats", this.slats_select, fs);
        var drag_cell = row.insertCell();
        var fs2 = CreateFlexSection(drag_cell);
        this.drag_chbx = [];
        var dlist = cs.GetDragList();
        for (let i = 0; i < dlist.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(dlist[i].name, cbx, fs2);
            cbx.onchange = () => { this.cs.SetDrag(i, cbx.checked); };
            this.drag_chbx.push(cbx);
        }
        this.InitStatDisplay(row.insertCell());
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Lift Bleed");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, " ");
        var c3_row = tbl_stat.insertRow();
        this.d_lift = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_none = c3_row.insertCell();
    }
    UpdateDisplay() {
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
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Reinforcement.ts" />
class Reinforcement_HTML extends Display {
    constructor(rf) {
        super();
        this.rf = rf;
        this.ext_wood_inp = [];
        this.ext_steel_inp = [];
        this.cant_inp = [];
        var tbl = document.getElementById("tbl_reinforcements");
        var row = tbl.insertRow();
        this.InitExternal(row.insertCell());
        this.InitInternal(row.insertCell());
        this.InitStatDisplay(row.insertCell());
    }
    InitExternal(cell) {
        var fs = CreateFlexSection(cell);
        var div3 = document.createElement("DIV");
        var div4 = document.createElement("DIV");
        var div5 = document.createElement("DIV");
        div3.classList.add("flex-container");
        div4.classList.add("flex-container");
        div5.classList.add("flex-container");
        fs.div0.appendChild(div3);
        fs.div0.appendChild(div4);
        fs.div0.appendChild(div5);
        var fs_wood = { div0: fs.div0, div1: fs.div2, div2: div3 };
        var fs_steel = { div0: fs.div0, div1: div4, div2: div5 };
        var lst = this.rf.GetExternalList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let w_inp = document.createElement("INPUT");
            let s_inp = document.createElement("INPUT");
            FlexLabel(elem.name, fs.div1);
            FlexInput("Wood", w_inp, fs_wood);
            FlexInput("Steel", s_inp, fs_steel);
            w_inp.min = "0";
            s_inp.min = "0";
            w_inp.onchange = () => { this.rf.SetExternalWoodCount(i, w_inp.valueAsNumber); };
            s_inp.onchange = () => { this.rf.SetExternalSteelCount(i, s_inp.valueAsNumber); };
            this.ext_wood_inp.push(w_inp);
            this.ext_steel_inp.push(s_inp);
        }
        this.wires = document.createElement("INPUT");
        FlexCheckbox("Wires", this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
        FlexLabel("", div3);
        FlexLabel("", div4);
        FlexLabel("", div5);
    }
    InitInternal(cell) {
        var fs = CreateFlexSection(cell);
        var lst = this.rf.GetCantileverList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let inp = document.createElement("INPUT");
            FlexInput(elem.name, inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.rf.SetCantileverCount(i, inp.valueAsNumber); };
            this.cant_inp.push(inp);
        }
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Max Strain");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_maxs = c2_row.insertCell();
        this.d_none = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.wires.checked = this.rf.GetWires();
        var w_count = this.rf.GetExternalWoodCount();
        for (let i = 0; i < w_count.length; i++) {
            this.ext_wood_inp[i].valueAsNumber = w_count[i];
        }
        var s_count = this.rf.GetExternalSteelCount();
        for (let i = 0; i < s_count.length; i++) {
            this.ext_steel_inp[i].valueAsNumber = s_count[i];
        }
        var c_count = this.rf.GetCantileverCount();
        for (let i = 0; i < c_count.length; i++) {
            this.cant_inp[i].valueAsNumber = c_count[i];
        }
        var stats = this.rf.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString());
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
        var tbl = document.getElementById("tbl_load");
        var row = tbl.insertRow();
        this.InitFuel(row.insertCell());
        this.InitMunitions(row.insertCell());
        this.InitCargoAndPassengers(row.insertCell());
        this.InitStats(row.insertCell());
    }
    InitFuel(cell) {
        var lst = this.fuel.GetTankList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lst[i].name, inp, fs);
            inp.onchange = () => { this.fuel.SetTankCount(i, inp.valueAsNumber); };
            this.fuel_list.push(inp);
        }
        this.seal = document.createElement("INPUT");
        FlexCheckbox("Self-Sealing Gas Tank", this.seal, fs);
        this.seal.onchange = () => { this.fuel.SetSelfSealing(this.seal.checked); };
        this.extinguish = document.createElement("INPUT");
        FlexCheckbox("Remote Fire Extinguisher", this.extinguish, fs);
        this.extinguish.onchange = () => { this.fuel.SetExtinguisher(this.extinguish.checked); };
    }
    InitMunitions(cell) {
        var fs = CreateFlexSection(cell);
        this.bombs = document.createElement("INPUT");
        FlexInput("Bombs", this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.rockets = document.createElement("INPUT");
        FlexInput("Rockets", this.rockets, fs);
        this.rockets.onchange = () => { this.boom.SetRocketCount(this.rockets.valueAsNumber); };
        this.bay1 = document.createElement("INPUT");
        FlexCheckbox("Internal Bay 1", this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
        this.bay2 = document.createElement("INPUT");
        FlexCheckbox("Internal Bay 2", this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }
    InitCargoAndPassengers(cell) {
        var fs = CreateFlexSection(cell);
        this.carg = document.createElement("INPUT");
        FlexInput("Cargo", this.carg, fs);
        this.carg.onchange = () => { this.cargo.SetMass(this.carg.valueAsNumber); };
        this.pass = document.createElement("INPUT");
        FlexInput("Passengers", this.pass, fs);
        this.pass.onchange = () => { this.cargo.SetPassengers(this.pass.valueAsNumber); };
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Wet Mass");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_wmas = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Fuel");
        CreateTH(h2_row, "Cost");
        var c2_row = tbl_stat.insertRow();
        this.d_rsec = c2_row.insertCell();
        this.d_fuel = c2_row.insertCell();
        this.d_cost = c2_row.insertCell();
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
        this.bay1.checked = this.boom.GetBay1();
        this.bay2.checked = this.boom.GetBay2();
        if (this.boom.GetBombCount() > 0) {
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
        this.carg.valueAsNumber = this.cargo.GetMass();
        this.pass.valueAsNumber = this.cargo.GetPassengers();
        var stats = this.fuel.PartStats();
        stats = stats.Add(this.boom.PartStats());
        stats = stats.Add(this.cargo.PartStats());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString());
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString());
        BlinkIfChanged(this.d_fuel, stats.fuel.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/LandingGear.ts" />
class LandingGear_HTML extends Display {
    constructor(gear) {
        super();
        this.gear = gear;
        var tbl = document.getElementById("tbl_gear");
        var row = tbl.insertRow();
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
    }
    InitGear(cell) {
        var lst = this.gear.GetGearList();
        var fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT");
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lst[i].name;
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };
        this.retract = document.createElement("INPUT");
        FlexCheckbox("Retractable", this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }
    InitExtras(cell) {
        this.extras = [];
        var lst = this.gear.GetExtraList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lst[i].name, cbx, fs);
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
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Crash Safety");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        this.retract.checked = this.gear.GetRetract();
        this.retract.disabled = !this.gear.CanRetract();
        var lst = this.gear.GetExtraSelected();
        for (let i = 0; i < lst.length; i++) {
            this.extras[i].checked = lst[i];
        }
        var stats = this.gear.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Accessories.ts" />
class Accessories_HTML extends Display {
    constructor(acc) {
        super();
        this.acc = acc;
        var tbl = document.getElementById("tbl_accessories");
        var row = tbl.insertRow(1);
        this.InitArmour(row.insertCell());
        this.InitElectrical(row.insertCell());
        this.InitInformation(row.insertCell());
        this.InitStats(row.insertCell());
        row = tbl.insertRow();
        this.InitVisibility(row.insertCell());
        this.InitClimate(row.insertCell());
        this.InitControl(row.insertCell());
    }
    InitArmour(cell) {
        var fs = CreateFlexSection(cell);
        this.a_coverage = document.createElement("INPUT");
        FlexInput("Coverage", this.a_coverage, fs);
        this.a_coverage.onchange = () => { this.acc.SetArmourCoverage(this.a_coverage.valueAsNumber); };
        this.a_AP = document.createElement("INPUT");
        FlexInput("AP", this.a_AP, fs);
        this.a_AP.onchange = () => { this.acc.SetArmourAP(this.a_AP.valueAsNumber); };
    }
    InitElectrical(cell) {
        var fs = CreateFlexSection(cell);
        this.radio = document.createElement("SELECT");
        FlexSelect("Radio", this.radio, fs);
        var rlist = this.acc.GetRadioList();
        for (let i = 0; i < rlist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = rlist[i].name;
            this.radio.add(opt);
        }
        this.radio.onchange = () => { this.acc.SetRadioSel(this.radio.selectedIndex); };
        this.elect = [];
        var elist = this.acc.GetElectricalList();
        for (let i = 0; i < elist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(elist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetElectricalCount(i, inp.valueAsNumber); };
            this.elect.push(inp);
        }
    }
    InitInformation(cell) {
        var fs = CreateFlexSection(cell);
        var ilist = this.acc.GetInfoList();
        this.info = [];
        for (let i = 0; i < ilist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(ilist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetInfoSel(i, inp.checked); };
            this.info.push(inp);
        }
    }
    InitVisibility(cell) {
        var fs = CreateFlexSection(cell);
        var vlist = this.acc.GetVisibilityList();
        this.visi = [];
        for (let i = 0; i < vlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(vlist[i].name, inp, fs);
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
            FlexCheckbox(clist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetClimateSel(i, inp.checked); };
            this.clim.push(inp);
        }
    }
    InitControl(cell) {
        var fs = CreateFlexSection(cell);
        this.auto = document.createElement("SELECT");
        var alist = this.acc.GetAutopilotList();
        FlexSelect("Autopilot", this.auto, fs);
        for (let i = 0; i < alist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = alist[i].name;
            this.auto.add(opt);
        }
        this.auto.onchange = () => { this.acc.SetAutopilotSel(this.auto.selectedIndex); };
        var clist = this.acc.GetControlList();
        this.cont = document.createElement("SELECT");
        FlexSelect("Control Aids", this.cont, fs);
        for (let i = 0; i < clist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = clist[i].name;
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
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Charge");
        CreateTH(h2_row, "Lift Bleed");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_chgh = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Visibility");
        CreateTH(h3_row, "Flight Stress");
        CreateTH(h3_row, "");
        var c3_row = tbl_stat.insertRow();
        this.d_visi = c3_row.insertCell();
        this.d_strs = c3_row.insertCell();
        c3_row.insertCell();
    }
    UpdateDisplay() {
        this.a_coverage.valueAsNumber = this.acc.GetArmourCoverage();
        this.a_AP.valueAsNumber = this.acc.GetArmourAP();
        this.radio.selectedIndex = this.acc.GetRadioSel();
        var elist = this.acc.GetElectricalCount();
        for (let i = 0; i < elist.length; i++) {
            this.elect[i].valueAsNumber = elist[i];
        }
        var ilist = this.acc.GetInfoSel();
        for (let i = 0; i < ilist.length; i++) {
            this.info[i].checked = ilist[i];
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
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_chgh, stats.charge.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_strs, stats.flightstress.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Optimization.ts" />
class Optimization_HTML extends Display {
    constructor(opt) {
        super();
        this.opt = opt;
        this.free_inp = document.getElementById("num_opt");
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };
        var tbl = document.getElementById("tbl_optimization");
        var row1 = tbl.insertRow();
        this.cost_cbx = this.InitRow(row1, "Expense: +/- 10% Cost", (num) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(tbl.insertRow(), "Lift Efficienty: +/- 2 Lift Bleed", (num) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(tbl.insertRow(), "Leg Room: +/- 1 Escape, Visibility", (num) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(tbl.insertRow(), "Mass: +/- 5% Mass", (num) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(tbl.insertRow(), "Redundancy: +/- 20% Toughness ", (num) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(tbl.insertRow(), "Support: +/- 10% Max Strain", (num) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(tbl.insertRow(), "Reliability: +/- 2 Reliability", (num) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(tbl.insertRow(), "Streamlining: +/- 5% Drag", (num) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
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
        ecell.innerHTML = txt;
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
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Lift Bleed");
        CreateTH(h1_row, "Escape");
        var c1_row = tbl_stat.insertRow();
        this.d_cost = c1_row.insertCell();
        this.d_lift = c1_row.insertCell();
        this.d_escp = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Mass");
        CreateTH(h2_row, "Toughness");
        var c2_row = tbl_stat.insertRow();
        this.d_visi = c2_row.insertCell();
        this.d_mass = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Max Strain");
        CreateTH(h3_row, "Reliability");
        CreateTH(h3_row, "Drag");
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
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_escp, stats.escape.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString());
        BlinkIfChanged(this.d_reli, stats.reliability.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
    }
}
/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />
class Weapons_HTML extends Display {
    constructor(weap) {
        super();
        this.weap = weap;
        this.input_mass = document.getElementById("weapon_mass");
        this.input_mass.onchange = () => { this.weap.SetMass(this.input_mass.valueAsNumber); };
        this.input_drag = document.getElementById("weapon_drag");
        this.input_drag.onchange = () => { this.weap.SetDrag(this.input_drag.valueAsNumber); };
        this.input_cost = document.getElementById("weapon_cost");
        this.input_cost.onchange = () => { this.weap.SetCost(this.input_cost.valueAsNumber); };
    }
    UpdateDisplay() {
        this.input_mass.valueAsNumber = this.weap.GetMass();
        this.input_drag.valueAsNumber = this.weap.GetDrag();
        this.input_cost.valueAsNumber = this.weap.GetCost();
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
/// <reference path="../impl/Aircraft.ts" />
/// <reference path="../lz/lz-string.ts" />
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
        this.reinforcements = new Reinforcement_HTML(aircraft.GetReinforcements());
        this.load = new Load_HTML(aircraft.GetFuel(), aircraft.GetMunitions(), aircraft.GetCargoAndPassengers());
        this.gear = new LandingGear_HTML(aircraft.GetLandingGear());
        this.accessories = new Accessories_HTML(aircraft.GetAccessories());
        this.optimization = new Optimization_HTML(aircraft.GetOptimization());
        this.weapons = new Weapons_HTML(aircraft.GetWeapons());
        var tbl = document.getElementById("tbl_stats");
        this.InitStats(tbl);
        var tbl2 = document.getElementById("tbl_derived");
        this.InitDerived(tbl2);
        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        this.UpdateDisplay();
        var save_button = document.getElementById("acft_save");
        save_button.onclick = () => {
            download(JSON.stringify(this.acft.toJSON()), this.acft.name + "_" + this.acft.GetVersion() + ".json", "json");
        };
        var load_button = document.getElementById("acft_load");
        load_button.multiple = false;
        load_button.accept = "application/JSON";
        load_button.onchange = (evt) => {
            if (load_button.files.length == 0)
                return;
            var file = load_button.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var str = JSON.parse(reader.result);
                    var acft = new Aircraft(parts_JSON, engine_json, false);
                    if (acft.fromJSON(str)) {
                        this.acft.fromJSON(str);
                        this.acft.CalculateStats();
                    }
                }
                catch (_a) { }
            };
            reader.readAsText(file);
            load_button.value = "";
        };
        var copy_button = document.getElementById("stats_copy");
        copy_button.onclick = () => { copyStringToClipboard(this.copy_text); };
        var save_text_button = document.getElementById("acft_save_text");
        save_text_button.onclick = () => { copyStringToClipboard(JSON.stringify(this.acft.toJSON())); };
        var load_text_area = document.getElementById("acft_load_text");
        load_text_area.oninput = () => {
            try {
                var str = JSON.parse(load_text_area.value);
                var acft = new Aircraft(parts_JSON, engine_json, false);
                if (acft.fromJSON(str)) {
                    this.acft.fromJSON(str);
                    this.acft.CalculateStats();
                }
            }
            catch (_a) {
                Blink(load_text_area.parentElement);
            }
            finally {
                load_text_area.value = "";
            }
        };
        var load_text_area2 = document.getElementById("acft_load_text2");
        load_text_area2.oninput = () => {
            try {
                var str = JSON.parse(load_text_area2.value);
                var acft = new Aircraft(parts_JSON, engine_json, false);
                if (acft.fromJSON(str)) {
                    this.acft.fromJSON(str);
                    this.acft.CalculateStats();
                }
            }
            catch (_a) {
                Blink(load_text_area2.parentElement);
            }
            finally {
                load_text_area2.value = "";
            }
        };
        var link_button = document.getElementById("acft_save_link");
        link_button.onclick = () => {
            var str = JSON.stringify(this.acft.toJSON());
            var txt = LZString.compressToEncodedURIComponent(str);
            var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt);
            copyStringToClipboard(link);
        };
    }
    InitStats(tbl) {
        var row = tbl.insertRow();
        CreateTH(row, "Lift Bleed");
        CreateTH(row, "Drag");
        CreateTH(row, "Mass");
        CreateTH(row, "Wet Mass");
        CreateTH(row, "Bomb Mass");
        CreateTH(row, "Cost");
        CreateTH(row, "Upkeep");
        row = tbl.insertRow();
        this.d_lift = row.insertCell();
        this.d_drag = row.insertCell();
        this.d_mass = row.insertCell();
        this.d_wmas = row.insertCell();
        this.d_bmas = row.insertCell();
        this.d_cost = row.insertCell();
        this.d_upkp = row.insertCell();
        row = tbl.insertRow();
        CreateTH(row, "Control");
        CreateTH(row, "Pitch Stability");
        CreateTH(row, "Lateral Stability");
        CreateTH(row, "Wing Area");
        CreateTH(row, "Max Strain");
        CreateTH(row, "Structure");
        CreateTH(row, "Toughness");
        row = tbl.insertRow();
        this.d_cont = row.insertCell();
        this.d_pstb = row.insertCell();
        this.d_lstb = row.insertCell();
        this.d_wara = row.insertCell();
        this.d_mstr = row.insertCell();
        this.d_strc = row.insertCell();
        this.d_tugh = row.insertCell();
        row = tbl.insertRow();
        CreateTH(row, "Power");
        CreateTH(row, "Fuel Consumption");
        CreateTH(row, "Fuel");
        CreateTH(row, "Pitch Speed");
        CreateTH(row, "Pitch Boost");
        CreateTH(row, "Charge");
        CreateTH(row, "Crash Safety");
        row = tbl.insertRow();
        this.d_powr = row.insertCell();
        this.d_fcom = row.insertCell();
        this.d_fuel = row.insertCell();
        this.d_pspd = row.insertCell();
        this.d_pbst = row.insertCell();
        this.d_chrg = row.insertCell();
        this.d_crsh = row.insertCell();
    }
    InitDerived(tbl) {
        var row0 = tbl.insertRow();
        var name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 5;
        this.name_inp = document.createElement("INPUT");
        this.name_inp.defaultValue = "Aircraft Name";
        this.name_inp.onchange = () => { this.acft.name = this.name_inp.value; };
        name_cell.appendChild(this.name_inp);
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        // Rules Version
        CreateTH(row0, "Version #");
        this.version_cell = row0.insertCell();
        var row1 = tbl.insertRow();
        CreateTH(row1, "Mass Variations");
        CreateTH(row1, "Top Speed");
        CreateTH(row1, "Stall Speed");
        CreateTH(row1, "Handling");
        CreateTH(row1, "Boost");
        CreateTH(row1, "Vital Components").colSpan = 3;
        var half = tbl.insertRow();
        CreateTH(half, "Empty Mass");
        this.ts_empty = half.insertCell();
        this.ss_empty = half.insertCell();
        this.hand_empty = half.insertCell();
        this.boost_empty = half.insertCell();
        this.vital_components = half.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;
        var half = tbl.insertRow();
        CreateTH(half, "Half Mass");
        this.ts_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.boost_half = half.insertCell();
        var full = tbl.insertRow();
        CreateTH(full, "Full Mass");
        this.ts_full = full.insertCell();
        this.ss_full = full.insertCell();
        this.hand_full = full.insertCell();
        this.boost_full = full.insertCell();
        this.bomb_row1 = tbl.insertRow();
        CreateTH(this.bomb_row1, "Half Mass with Bombs");
        this.ts_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.bomb_row2 = tbl.insertRow();
        CreateTH(this.bomb_row2, "Full Mass with Bombs");
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.boost_fullwB = this.bomb_row2.insertCell();
        var row7 = tbl.insertRow();
        CreateTH(row7, "Propulsion").colSpan = 2;
        CreateTH(row7, "Aerodynamics").colSpan = 2;
        CreateTH(row7, "Survivability").colSpan = 2;
        CreateTH(row7, "Propulsion").colSpan = 2;
        var row8 = tbl.insertRow();
        CreateTH(row8, "Dropoff");
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, "Stability");
        this.stability_cell = row8.insertCell();
        CreateTH(row8, "Reliability");
        this.reliability_cell = row8.insertCell();
        CreateTH(row8, "Flight Stress");
        this.flightstress_cell = row8.insertCell();
        var row9 = tbl.insertRow();
        CreateTH(row9, "Overspeed");
        this.overspeed_cell = row9.insertCell();
        CreateTH(row9, "Energy Loss");
        this.eloss_cell = row9.insertCell();
        CreateTH(row9, "Toughness");
        this.toughness_cell = row9.insertCell();
        CreateTH(row9, "Visibiilty");
        this.visibility_cell = row9.insertCell();
        var row10 = tbl.insertRow();
        CreateTH(row10, "Fuel Uses");
        this.maxfuel_cell = row10.insertCell();
        CreateTH(row10, "Turn Bleed");
        this.turnbleed_cell = row10.insertCell();
        CreateTH(row10, "Max Strain");
        this.mxstrain_cell = row10.insertCell();
        CreateTH(row10, "Attack Modifier");
        this.attack_cell = row10.insertCell();
        var row11 = tbl.insertRow();
        CreateTH(row11, "Cruise Range");
        this.cruiserange_cell = row11.insertCell();
        CreateTH(row11, "Landing Gear");
        this.landing_cell = row11.insertCell();
        CreateTH(row11, "Escape");
        this.escape_cell = row11.insertCell();
        CreateTH(row11, "Communications");
        this.communications_cell = row11.insertCell();
        var row12 = tbl.insertRow();
        CreateTH(row12, "Cruise Range with Bombs");
        this.cruiserangewbomb_cell = row12.insertCell();
        CreateTH(row12, "Flight Ceiling");
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, "Crash Safety");
        this.crashsafety_cell = row12.insertCell();
        CreateTH(row12, "Electrics");
        this.electric_cell = row12.insertCell();
        CreateTH(tbl.insertRow(), "Special Rules").colSpan = 8;
        this.warning_cell = tbl.insertRow().insertCell();
        this.warning_cell.colSpan = 8;
    }
    UpdateStats() {
        var stats = this.acft.GetStats();
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString());
        BlinkIfChanged(this.d_bmas, stats.bomb_mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_upkp, stats.upkeep.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_powr, stats.power.toString());
        BlinkIfChanged(this.d_fcom, stats.fuelconsumption.toString());
        BlinkIfChanged(this.d_fuel, stats.fuel.toString());
        BlinkIfChanged(this.d_pspd, stats.pitchspeed.toString());
        BlinkIfChanged(this.d_pbst, stats.pitchboost.toString());
        BlinkIfChanged(this.d_wara, stats.wingarea.toString());
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_chrg, stats.charge.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
    UpdateDerived() {
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        if (this.acft.name)
            this.name_inp.value = this.acft.name;
        this.copy_text = this.acft.name + "\n";
        this.version_cell.innerText = this.acft.GetVersion();
        this.copy_text += "Version " + this.acft.GetVersion() + "\n";
        this.cost_cell.innerText = stats.cost.toString() + "þ";
        this.copy_text += "Cost " + stats.cost.toString() + "þ\n";
        this.copy_text += "\n";
        this.copy_text += "Mass\t\t\tTop Speed\tStall Speed\tHandling\tBoost\n";
        //Empty
        this.ts_empty.innerText = Math.floor(derived.MaxSpeedEmpty).toString();
        this.ss_empty.innerText = derived.StallSpeedEmpty.toString();
        this.hand_empty.innerText = derived.HandlingEmpty.toString();
        this.boost_empty.innerText = derived.BoostEmpty.toString();
        this.copy_text += "Empty Mass\t\t"
            + this.ts_empty.innerText + "\t\t"
            + this.ss_empty.innerText + "\t\t"
            + this.hand_empty.innerText + "\t\t"
            + this.boost_empty.innerText + "\n";
        //Half
        this.ts_half.innerText = Math.floor((derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.innerText = Math.floor((derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.innerText = Math.floor((derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.innerText = Math.floor((derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.copy_text += "Half Mass\t\t"
            + this.ts_half.innerText + "\t\t"
            + this.ss_half.innerText + "\t\t"
            + this.hand_half.innerText + "\t\t"
            + this.boost_half.innerText + "\n";
        //Full
        this.ts_full.innerText = Math.floor(derived.MaxSpeedFull).toString();
        this.ss_full.innerText = derived.StallSpeedFull.toString();
        this.hand_full.innerText = derived.HandlingFull.toString();
        this.boost_full.innerText = derived.BoostFull.toString();
        this.copy_text += "Full Mass\t\t"
            + this.ts_full.innerText + "\t\t"
            + this.ss_full.innerText + "\t\t"
            + this.hand_full.innerText + "\t\t"
            + this.boost_full.innerText + "\n";
        this.copy_text += "\n";
        if (stats.bomb_mass > 0) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            //Half
            this.ts_halfwB.innerText = Math.floor((derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.innerText = Math.floor((derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.innerText = Math.floor((derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.innerText = Math.floor((derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.copy_text += "Half Mass with Bombs\t"
                + this.ts_halfwB.innerText + "\t\t"
                + this.ss_halfwB.innerText + "\t\t"
                + this.hand_halfwB.innerText + "\t\t"
                + this.boost_halfwB.innerText + "\n";
            //Full
            this.ts_fullwB.innerText = derived.MaxSpeedwBombs.toString();
            this.ss_fullwB.innerText = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.innerText = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.innerText = derived.BoostFullwBombs.toString();
            this.copy_text += "Full Mass with Bombs\t"
                + this.ts_fullwB.innerText + "\t\t"
                + this.ss_fullwB.innerText + "\t\t"
                + this.hand_fullwB.innerText + "\t\t"
                + this.boost_fullwB.innerText + "\n";
            this.copy_text += "\n";
        }
        else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
        }
        this.dropoff_cell.innerText = derived.Dropoff.toString();
        this.overspeed_cell.innerText = derived.Overspeed.toString();
        this.maxfuel_cell.innerText = (Math.round(derived.FuelUses * 10) / 10).toString();
        this.cruiserange_cell.innerText = Math.round(derived.CruiseRange).toString();
        this.cruiserangewbomb_cell.innerText = Math.round(derived.CruiseRangewBombs).toString();
        this.copy_text += "Propulsion\n\t"
            + "Dropoff\t" + this.dropoff_cell.innerText + "\n\t"
            + "Overspeed\t" + this.overspeed_cell.innerText + "\n\t"
            + "Fuel Uses\t" + this.maxfuel_cell.innerText + "\n\t"
            + "Cruise Range\t" + this.cruiserange_cell.innerText + "\n\t"
            + "Cruise Range with Bombs\t" + this.cruiserangewbomb_cell.innerText + "\n";
        this.copy_text += "\n";
        this.stability_cell.innerText = derived.Stabiilty.toString();
        this.eloss_cell.innerText = derived.EnergyLoss.toString();
        this.turnbleed_cell.innerText = derived.TurnBleed.toString();
        this.landing_cell.innerText = this.acft.GetGearName();
        this.maxalt_cell.innerText = this.acft.GetMaxAltitude().toString();
        this.copy_text += "Aerodynamics\n\t"
            + "Stability\t" + this.stability_cell.innerText + "\n\t"
            + "Energy Loss\t" + this.eloss_cell.innerText + "\n\t"
            + "Turn Bleed\t" + this.turnbleed_cell.innerText + "\n\t"
            + "Landing Gear\t" + this.landing_cell.innerText + "\n\t"
            + "Flight Ceiling\t" + this.maxalt_cell.innerText + "\n";
        this.copy_text += "\n";
        this.reliability_cell.innerText = this.acft.GetReliabilityList().toString();
        this.toughness_cell.innerText = derived.Toughness.toString();
        this.mxstrain_cell.innerText = derived.MaxStrain.toString();
        this.escape_cell.innerText = this.acft.GetEscapeList().toString();
        this.crashsafety_cell.innerText = stats.crashsafety.toString();
        this.copy_text += "Survivability\n\t"
            + "Reliability\t" + this.reliability_cell.innerText + "\n\t"
            + "Toughness\t" + this.toughness_cell.innerText + "\n\t"
            + "Max Strain\t" + this.mxstrain_cell.innerText + "\n\t"
            + "Escape\t" + this.escape_cell.innerText + "\n\t"
            + "Crash Safety\t" + this.crashsafety_cell.innerText + "\n";
        this.copy_text += "\n";
        this.flightstress_cell.innerText = this.acft.GetStressList().toString();
        this.visibility_cell.innerText = this.acft.GetVisibilityList().toString();
        this.attack_cell.innerText = this.acft.GetAttackList().toString();
        this.communications_cell.innerText = this.acft.GetCommunicationName();
        this.electric_cell.innerText = stats.charge.toString(); //TODO Windmill
        this.copy_text += "Ergonomics\n\t"
            + "Flight Stress\t" + this.flightstress_cell.innerText + "\n\t"
            + "Visibility\t" + this.visibility_cell.innerText + "\n\t"
            + "Attack Modifier\t" + this.attack_cell.innerText + "\n\t"
            + "Communications\t" + this.communications_cell.innerText + "\n\t"
            + "Electrics\t" + this.electric_cell.innerText + "\n";
        this.copy_text += "\n";
        var vital = "Controls";
        this.copy_text += "Vital Components\n\tControls\n\t";
        if (derived.FuelUses > 0) {
            vital += "<br/>Fuel Tanks";
            this.copy_text += "Fuel Tanks\n\t";
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            vital += "<br/>Engine #" + (i + 1).toString();
            this.copy_text += "Engine #" + (i + 1).toString() + "\n\t";
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfRadiators(); i++) {
            vital += "<br/>Radiator #" + (i + 1).toString();
            this.copy_text += "Radiator #" + (i + 1).toString() + "\n\t";
        }
        if (this.acft.GetEngines().GetHasOilTank()) {
            vital += "<br/>Oil Tank";
            this.copy_text += "Oil Tank\n\t";
        }
        this.vital_components.innerHTML = vital;
        this.copy_text += "\n";
        if (stats.warnings.length > 0)
            this.copy_text += "Special Rules\n\t";
        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
            this.copy_text += w.source + ":  " + w.warning + "\n\t";
        }
        this.warning_cell.innerHTML = warnhtml;
    }
    UpdateDisplay() {
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
        this.load.UpdateDisplay();
        this.gear.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.optimization.UpdateDisplay();
        this.weapons.UpdateDisplay();
        this.UpdateStats();
        this.UpdateDerived();
    }
}
//TODO: Add electrics as critical component
//TODO: Manually Variable Propeller Special Rule
//TODO: Weapons
//TODO: Handle attack bonus
//TODO: High Offset Radiator requires Parasol wing
//TODO: Evaporator Radiator requires Metal wing
//TODO: Center Pusher requires tail or extended driveshafts
//TODO: Fix Armour to have separate coverage per AP
/// <reference path="./impl/Aircraft.ts" />
/// <reference path="./disp/Tools.ts" />
/// <reference path="./disp/Aircraft.ts" />
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
const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var ihash = window.location.hash;
    location.hash = "";
    loadJSON('/PlaneBuilder/parts.json', (part_resp) => {
        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        parts_JSON = JSON.parse(part_resp);
        loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
            engine_json = JSON.parse(engine_resp);
            aircraft_model = new Aircraft(parts_JSON, engine_json, true);
            aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);
            var loaded = false;
            if (qp && !loaded) {
                console.log("Used Query Parameter");
                try {
                    var str = LZString.decompressFromEncodedURIComponent(qp);
                    loaded = aircraft_model.fromJSON(JSON.parse(str));
                }
                catch (_a) { }
                if (!loaded) {
                    try {
                        loaded = aircraft_model.fromJSON(JSON.parse(qp));
                    }
                    catch (_b) { }
                }
            }
            if (acft_data && !loaded) {
                console.log("Used Saved Data");
                try {
                    loaded = aircraft_model.fromJSON(JSON.parse(acft_data));
                }
                catch (_c) { }
            }
            aircraft_model.CalculateStats();
            location.hash = ihash;
            window.onscroll = SetScroll;
        });
    });
};
window.onload = init;
var hash = "";
function SetScroll(ev) {
    var newhash = "";
    var off = window.pageYOffset;
    if (off > document.getElementById("Era").offsetTop) {
        newhash = "Era";
        if (off > document.getElementById("Cockpit").offsetTop) {
            newhash = "Cockpit";
            if (off > document.getElementById("Passengers").offsetTop) {
                newhash = "Passengers";
                if (off > document.getElementById("Engines").offsetTop) {
                    newhash = "Engines";
                    if (off > document.getElementById("Propeller").offsetTop) {
                        newhash = "Propeller";
                        if (off > document.getElementById("Frames").offsetTop) {
                            newhash = "Frames";
                            if (off > document.getElementById("Tail").offsetTop) {
                                newhash = "Tail";
                                if (off > document.getElementById("Wings").offsetTop) {
                                    newhash = "Wings";
                                    if (off > document.getElementById("Stabilizers").offsetTop) {
                                        newhash = "Stabilizers";
                                        if (off > document.getElementById("ControlSurfaces").offsetTop) {
                                            newhash = "ControlSurfaces";
                                            if (off > document.getElementById("Reinforcements").offsetTop) {
                                                newhash = "Reinforcements";
                                                if (off > document.getElementById("Load").offsetTop) {
                                                    newhash = "Load";
                                                    if (off > document.getElementById("Landing_Gear").offsetTop) {
                                                        newhash = "Landing_Gear";
                                                        if (off > document.getElementById("Accessories").offsetTop) {
                                                            newhash = "Accessories";
                                                            if (off > document.getElementById("Optimization").offsetTop) {
                                                                newhash = "Optimization";
                                                                if (off > document.getElementById("Stats").offsetTop) {
                                                                    newhash = "Stats";
                                                                    if (off > document.getElementById("Flight").offsetTop) {
                                                                        newhash = "Flight";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (hash != newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}
var parts_JSON;
var engine_json;
var aircraft_model;
var aircraft_display;
class Alder {
    constructor() {
    }
    static update(adler, array) {
        let s1 = adler & 0xffff;
        let s2 = (adler >>> 16) & 0xffff;
        let len = array.length;
        let tlen;
        let i = 0;
        while (len > 0) {
            tlen = len > Alder.OptimizationParameter ?
                Alder.OptimizationParameter : len;
            len -= tlen;
            do {
                s1 += array[i++];
                s2 += s1;
            } while (--tlen);
            s1 %= 65521;
            s2 %= 65521;
        }
        return ((s2 << 16) | s1) >>> 0;
    }
}
Alder.OptimizationParameter = 1024;
const Adler32 = (array) => {
    return Alder.update(1, array);
};
const USE_TYPEDARRAY = (typeof Uint8Array !== 'undefined') &&
    (typeof Uint16Array !== 'undefined') &&
    (typeof Uint32Array !== 'undefined') &&
    (typeof DataView !== 'undefined');
/// <reference path="./define/typedarray/hybrid.ts" />
class BitStream {
    constructor(buffer, bufferPosition) {
        BitStream.ReverseTable = this.getReverseTable();
        this.index = typeof bufferPosition === 'number' ? bufferPosition : 0;
        this.bitindex = 0;
        this.buffer = buffer instanceof (USE_TYPEDARRAY ? Uint8Array : Array) ?
            buffer :
            new (USE_TYPEDARRAY ? Uint8Array : Array)(BitStream.DefaultBlockSize);
        if (this.buffer.length * 2 <= this.index) {
            throw new Error('invalid index');
        }
        else if (this.buffer.length <= this.index) {
            this.expandBuffer();
        }
    }
    expandBuffer() {
        let oldbuf = this.buffer;
        let i = 0;
        let il = oldbuf.length;
        // copy buffer
        if (USE_TYPEDARRAY) {
            let uint8Buffer = new Uint8Array(il << 1);
            uint8Buffer.set(oldbuf);
            return (this.buffer = uint8Buffer);
        }
        else {
            let arrayBuffer = new Array(il << 1);
            for (i = 0; i < il; ++i) {
                arrayBuffer[i] = oldbuf[i];
            }
            return (this.buffer = arrayBuffer);
        }
    }
    writeBits(number, n, reverse) {
        let buffer = this.buffer;
        let index = this.index;
        let bitindex = this.bitindex;
        let current = buffer[index];
        let i;
        const rev32_ = (num) => {
            return (BitStream.ReverseTable[num & 0xFF] << 24) |
                (BitStream.ReverseTable[num >>> 8 & 0xFF] << 16) |
                (BitStream.ReverseTable[num >>> 16 & 0xFF] << 8) |
                BitStream.ReverseTable[num >>> 24 & 0xFF];
        };
        if (reverse && n > 1) {
            number = n > 8 ?
                rev32_(number) >> (32 - n) :
                BitStream.ReverseTable[number] >> (8 - n);
        }
        if (n + bitindex < 8) {
            current = (current << n) | number;
            bitindex += n;
        }
        else {
            for (i = 0; i < n; ++i) {
                current = (current << 1) | ((number >> n - i - 1) & 1);
                // next byte
                if (++bitindex === 8) {
                    bitindex = 0;
                    buffer[index++] = BitStream.ReverseTable[current];
                    current = 0;
                    // expand
                    if (index === buffer.length) {
                        buffer = this.expandBuffer();
                    }
                }
            }
        }
        buffer[index] = current;
        this.buffer = buffer;
        this.bitindex = bitindex;
        this.index = index;
    }
    finish() {
        let buffer = this.buffer;
        let index = this.index;
        let output = null;
        if (this.bitindex > 0) {
            buffer[index] <<= 8 - this.bitindex;
            buffer[index] = BitStream.ReverseTable[buffer[index]];
            index++;
        }
        // array truncation
        if (USE_TYPEDARRAY) {
            output = buffer.subarray(0, index);
        }
        else {
            buffer.length = index;
            output = buffer;
        }
        return output;
    }
    getReverseTable() {
        let table = new (USE_TYPEDARRAY ? Uint8Array : Array)(256);
        let i = 0;
        for (; i < 256; ++i) {
            table[i] = ((n) => {
                let r = n;
                let s = 7;
                for (n >>>= 1; n; n >>>= 1) {
                    r <<= 1;
                    r |= n & 1;
                    --s;
                }
                return (r << s & 0xff) >>> 0;
            })(i);
        }
        return table;
    }
}
BitStream.DefaultBlockSize = 0x8000;
/// <reference path="./define/typedarray/hybrid.ts" />
let ZLIB_CRC32_COMPACT = false;
class CRC32 {
    constructor() {
    }
    static calc(data, pos, length) {
        return this.update(data, 0, pos, length);
    }
    static single(num, crc) {
        return (CRC32.Table[(num ^ crc) & 0xff] ^ (num >>> 8)) >>> 0;
    }
    ;
    static get Table() {
        if (ZLIB_CRC32_COMPACT) {
            let table = new (USE_TYPEDARRAY ? Uint32Array : Array)(256);
            let c;
            let i;
            let j;
            for (i = 0; i < 256; ++i) {
                c = i;
                for (j = 0; j < 8; ++j) {
                    c = (c & 1) ? (0xedB88320 ^ (c >>> 1)) : (c >>> 1);
                }
                table[i] = c >>> 0;
            }
            return table;
        }
        else if (USE_TYPEDARRAY) {
            return new Uint32Array(CRC32.Table_);
        }
        else {
            return CRC32.Table_;
        }
    }
}
CRC32.update = function (data, crc, pos, length) {
    let table = CRC32.Table;
    let i = (typeof pos === 'number') ? pos : (pos = 0);
    let il = (typeof length === 'number') ? length : data.length;
    crc ^= 0xffffffff;
    // loop unrolling for performance
    for (i = il & 7; i--; ++pos) {
        crc = (crc >>> 8) ^ table[(crc ^ data[pos]) & 0xff];
    }
    for (i = il >> 3; i--; pos += 8) {
        crc = (crc >>> 8) ^ table[(crc ^ data[pos]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 1]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 2]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 3]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 4]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 5]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 6]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 7]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
};
CRC32.Table_ = [
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
    0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
    0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
    0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
    0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
    0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
    0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
    0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
    0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
    0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
    0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
    0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
    0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
    0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
    0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
    0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
    0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
    0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
    0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
    0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
    0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
    0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
    0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
    0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
    0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
    0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
    0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
    0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
    0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
    0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
    0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
    0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
    0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];
/// <reference path="./define/typedarray/hybrid.ts" />
class Heap {
    constructor(length) {
        this.getChild = function (index) {
            return 2 * index + 2;
        };
        this.buffer = new (USE_TYPEDARRAY ? Uint16Array : Array)(length * 2);
        this.length = 0;
    }
    getParent(index) {
        return ((index - 2) / 4 | 0) * 2;
    }
    ;
    push(index, value) {
        let current, parent, heap = this.buffer, swap;
        current = this.length;
        heap[this.length++] = value;
        heap[this.length++] = index;
        while (current > 0) {
            parent = this.getParent(current);
            if (heap[current] > heap[parent]) {
                swap = heap[current];
                heap[current] = heap[parent];
                heap[parent] = swap;
                swap = heap[current + 1];
                heap[current + 1] = heap[parent + 1];
                heap[parent + 1] = swap;
                current = parent;
            }
            else {
                break;
            }
        }
        return this.length;
    }
    pop() {
        let index, value, heap = this.buffer, swap, current, parent;
        value = heap[0];
        index = heap[1];
        this.length -= 2;
        heap[0] = heap[this.length];
        heap[1] = heap[this.length + 1];
        parent = 0;
        while (true) {
            current = this.getChild(parent);
            if (current >= this.length) {
                break;
            }
            if (current + 2 < this.length && heap[current + 2] > heap[current]) {
                current += 2;
            }
            if (heap[current] > heap[parent]) {
                swap = heap[parent];
                heap[parent] = heap[current];
                heap[current] = swap;
                swap = heap[parent + 1];
                heap[parent + 1] = heap[current + 1];
                heap[current + 1] = swap;
            }
            else {
                break;
            }
            parent = current;
        }
        return { index: index, value: value, length: this.length };
    }
}
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./bitstream.ts" />
/// <reference path="./heap.ts" />
var CompressionType;
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./bitstream.ts" />
/// <reference path="./heap.ts" />
(function (CompressionType) {
    CompressionType[CompressionType["NONE"] = 0] = "NONE";
    CompressionType[CompressionType["FIXED"] = 1] = "FIXED";
    CompressionType[CompressionType["DYNAMIC"] = 2] = "DYNAMIC";
    CompressionType[CompressionType["RESERVED"] = 3] = "RESERVED";
})(CompressionType || (CompressionType = {}));
;
class Lz77Match {
    constructor(length, backwardDistance) {
        this.length = length;
        this.backwardDistance = backwardDistance;
    }
    static get LengthCodeTable() {
        const code = (length) => {
            switch (true) {
                case (length === 3):
                    return [257, length - 3, 0];
                    break;
                case (length === 4):
                    return [258, length - 4, 0];
                    break;
                case (length === 5):
                    return [259, length - 5, 0];
                    break;
                case (length === 6):
                    return [260, length - 6, 0];
                    break;
                case (length === 7):
                    return [261, length - 7, 0];
                    break;
                case (length === 8):
                    return [262, length - 8, 0];
                    break;
                case (length === 9):
                    return [263, length - 9, 0];
                    break;
                case (length === 10):
                    return [264, length - 10, 0];
                    break;
                case (length <= 12):
                    return [265, length - 11, 1];
                    break;
                case (length <= 14):
                    return [266, length - 13, 1];
                    break;
                case (length <= 16):
                    return [267, length - 15, 1];
                    break;
                case (length <= 18):
                    return [268, length - 17, 1];
                    break;
                case (length <= 22):
                    return [269, length - 19, 2];
                    break;
                case (length <= 26):
                    return [270, length - 23, 2];
                    break;
                case (length <= 30):
                    return [271, length - 27, 2];
                    break;
                case (length <= 34):
                    return [272, length - 31, 2];
                    break;
                case (length <= 42):
                    return [273, length - 35, 3];
                    break;
                case (length <= 50):
                    return [274, length - 43, 3];
                    break;
                case (length <= 58):
                    return [275, length - 51, 3];
                    break;
                case (length <= 66):
                    return [276, length - 59, 3];
                    break;
                case (length <= 82):
                    return [277, length - 67, 4];
                    break;
                case (length <= 98):
                    return [278, length - 83, 4];
                    break;
                case (length <= 114):
                    return [279, length - 99, 4];
                    break;
                case (length <= 130):
                    return [280, length - 115, 4];
                    break;
                case (length <= 162):
                    return [281, length - 131, 5];
                    break;
                case (length <= 194):
                    return [282, length - 163, 5];
                    break;
                case (length <= 226):
                    return [283, length - 195, 5];
                    break;
                case (length <= 257):
                    return [284, length - 227, 5];
                    break;
                case (length === 258):
                    return [285, length - 258, 0];
                    break;
                default: throw 'invalid length: ' + length;
            }
        };
        let table = [];
        let i = 0;
        let c = [];
        for (i = 3; i <= 258; i++) {
            c = code(i);
            table[i] = (c[2] << 24) | (c[1] << 16) | c[0];
        }
        return USE_TYPEDARRAY ? new Uint32Array(table) : table;
    }
    getDistanceCode_(dist) {
        /** @type {!Array.<number>} distance code table. */
        let r;
        switch (true) {
            case (dist === 1):
                r = [0, dist - 1, 0];
                break;
            case (dist === 2):
                r = [1, dist - 2, 0];
                break;
            case (dist === 3):
                r = [2, dist - 3, 0];
                break;
            case (dist === 4):
                r = [3, dist - 4, 0];
                break;
            case (dist <= 6):
                r = [4, dist - 5, 1];
                break;
            case (dist <= 8):
                r = [5, dist - 7, 1];
                break;
            case (dist <= 12):
                r = [6, dist - 9, 2];
                break;
            case (dist <= 16):
                r = [7, dist - 13, 2];
                break;
            case (dist <= 24):
                r = [8, dist - 17, 3];
                break;
            case (dist <= 32):
                r = [9, dist - 25, 3];
                break;
            case (dist <= 48):
                r = [10, dist - 33, 4];
                break;
            case (dist <= 64):
                r = [11, dist - 49, 4];
                break;
            case (dist <= 96):
                r = [12, dist - 65, 5];
                break;
            case (dist <= 128):
                r = [13, dist - 97, 5];
                break;
            case (dist <= 192):
                r = [14, dist - 129, 6];
                break;
            case (dist <= 256):
                r = [15, dist - 193, 6];
                break;
            case (dist <= 384):
                r = [16, dist - 257, 7];
                break;
            case (dist <= 512):
                r = [17, dist - 385, 7];
                break;
            case (dist <= 768):
                r = [18, dist - 513, 8];
                break;
            case (dist <= 1024):
                r = [19, dist - 769, 8];
                break;
            case (dist <= 1536):
                r = [20, dist - 1025, 9];
                break;
            case (dist <= 2048):
                r = [21, dist - 1537, 9];
                break;
            case (dist <= 3072):
                r = [22, dist - 2049, 10];
                break;
            case (dist <= 4096):
                r = [23, dist - 3073, 10];
                break;
            case (dist <= 6144):
                r = [24, dist - 4097, 11];
                break;
            case (dist <= 8192):
                r = [25, dist - 6145, 11];
                break;
            case (dist <= 12288):
                r = [26, dist - 8193, 12];
                break;
            case (dist <= 16384):
                r = [27, dist - 12289, 12];
                break;
            case (dist <= 24576):
                r = [28, dist - 16385, 13];
                break;
            case (dist <= 32768):
                r = [29, dist - 24577, 13];
                break;
            default: throw 'invalid distance';
        }
        return r;
    }
    toLz77Array() {
        let length = this.length;
        let dist = this.backwardDistance;
        let codeArray = [];
        let pos = 0;
        let code;
        // length
        code = Lz77Match.LengthCodeTable[length];
        codeArray[pos++] = code & 0xffff;
        codeArray[pos++] = (code >> 16) & 0xff;
        codeArray[pos++] = code >> 24;
        // distance
        code = this.getDistanceCode_(dist);
        codeArray[pos++] = code[0];
        codeArray[pos++] = code[1];
        codeArray[pos++] = code[2];
        return codeArray;
    }
}
class RawDeflate {
    constructor(input, opt_params) {
        this.compressionType = CompressionType.DYNAMIC;
        this.lazy = 0;
        this.length = 0;
        this.backwardDistance = 0;
        this.input =
            (USE_TYPEDARRAY && input instanceof Array) ? new Uint8Array(input) : input;
        this.op = 0;
        // option parameters
        if (opt_params) {
            if (opt_params['lazy']) {
                this.lazy = opt_params['lazy'];
            }
            if (typeof opt_params['compressionType'] === 'number') {
                this.compressionType = opt_params['compressionType'];
            }
            if (opt_params['outputBuffer']) {
                this.output =
                    (USE_TYPEDARRAY && opt_params['outputBuffer'] instanceof Array) ?
                        new Uint8Array(opt_params['outputBuffer']) : opt_params['outputBuffer'];
            }
            if (typeof opt_params['outputIndex'] === 'number') {
                this.op = opt_params['outputIndex'];
            }
        }
        if (!this.output) {
            this.output = new (USE_TYPEDARRAY ? Uint8Array : Array)(0x8000);
        }
    }
    static get FixedHuffmanTable() {
        let table = [], i;
        for (i = 0; i < 288; i++) {
            switch (true) {
                case (i <= 143):
                    table.push([i + 0x030, 8]);
                    break;
                case (i <= 255):
                    table.push([i - 144 + 0x190, 9]);
                    break;
                case (i <= 279):
                    table.push([i - 256 + 0x000, 7]);
                    break;
                case (i <= 287):
                    table.push([i - 280 + 0x0C0, 8]);
                    break;
                default:
                    throw 'invalid literal: ' + i;
            }
        }
        return table;
    }
    compress() {
        let blockArray;
        let position;
        let length;
        let input = this.input;
        switch (this.compressionType) {
            case CompressionType.NONE:
                // each 65535-Byte (length header: 16-bit)
                for (position = 0, length = input.length; position < length;) {
                    blockArray = USE_TYPEDARRAY ?
                        input.subarray(position, position + 0xffff) :
                        input.slice(position, position + 0xffff);
                    position += blockArray.length;
                    this.makeNocompressBlock(blockArray, (position === length));
                }
                break;
            case CompressionType.FIXED:
                this.output = this.makeFixedHuffmanBlock(input, true);
                this.op = this.output.length;
                break;
            case CompressionType.DYNAMIC:
                this.output = this.makeDynamicHuffmanBlock(input, true);
                this.op = this.output.length;
                break;
            default:
                throw 'invalid compression type';
        }
        return this.output;
    }
    makeNocompressBlock(blockArray, isFinalBlock) {
        let bfinal;
        let btype;
        let len;
        let nlen;
        let i;
        let il;
        let output = this.output;
        let op = this.op;
        // expand buffer
        if (USE_TYPEDARRAY) {
            output = new Uint8Array(this.output.buffer);
            while (output.length <= op + blockArray.length + 5) {
                output = new Uint8Array(output.length << 1);
            }
            output.set(this.output);
        }
        // header
        bfinal = isFinalBlock ? 1 : 0;
        btype = CompressionType.NONE;
        output[op++] = (bfinal) | (btype << 1);
        // length
        len = blockArray.length;
        nlen = (~len + 0x10000) & 0xffff;
        output[op++] = len & 0xff;
        output[op++] = (len >>> 8) & 0xff;
        output[op++] = nlen & 0xff;
        output[op++] = (nlen >>> 8) & 0xff;
        // copy buffer
        if (USE_TYPEDARRAY) {
            output.set(blockArray, op);
            op += blockArray.length;
            output = output.subarray(0, op);
        }
        else {
            for (i = 0, il = blockArray.length; i < il; ++i) {
                output[op++] = blockArray[i];
            }
            output.length = op;
        }
        this.op = op;
        this.output = output;
        return output;
    }
    makeFixedHuffmanBlock(blockArray, isFinalBlock) {
        /** @type {Zlib.BitStream} */
        let stream = new BitStream(USE_TYPEDARRAY ?
            new Uint8Array(this.output.buffer) : this.output, this.op);
        /** @type {number} */
        let bfinal;
        /** @type {Zlib.RawDeflate.CompressionType} */
        let btype;
        /** @type {!(Array.<number>|Uint16Array)} */
        let data;
        // header
        bfinal = isFinalBlock ? 1 : 0;
        btype = CompressionType.FIXED;
        stream.writeBits(bfinal, 1, true);
        stream.writeBits(btype, 2, true);
        data = this.lz77(blockArray);
        this.fixedHuffman(data, stream);
        return stream.finish();
    }
    makeDynamicHuffmanBlock(blockArray, isFinalBlock) {
        let stream = new BitStream(USE_TYPEDARRAY ?
            new Uint8Array(this.output.buffer) : this.output, this.op);
        let bfinal;
        let btype;
        let data;
        let hlit;
        let hdist;
        let hclen;
        let hclenOrder = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        let litLenLengths;
        let litLenCodes;
        let distLengths;
        let distCodes;
        let treeSymbols;
        let treeLengths;
        let transLengths = new Array(19);
        let treeCodes;
        let code;
        let bitlen;
        let i;
        let il;
        // header
        bfinal = isFinalBlock ? 1 : 0;
        btype = CompressionType.DYNAMIC;
        stream.writeBits(bfinal, 1, true);
        stream.writeBits(btype, 2, true);
        data = this.lz77(blockArray);
        litLenLengths = this.getLengths_(this.freqsLitLen, 15);
        litLenCodes = this.getCodesFromLengths_(litLenLengths);
        distLengths = this.getLengths_(this.freqsDist, 7);
        distCodes = this.getCodesFromLengths_(distLengths);
        for (hlit = 286; hlit > 257 && litLenLengths[hlit - 1] === 0; hlit--) { }
        for (hdist = 30; hdist > 1 && distLengths[hdist - 1] === 0; hdist--) { }
        // HCLEN
        treeSymbols =
            this.getTreeSymbols_(hlit, litLenLengths, hdist, distLengths);
        treeLengths = this.getLengths_(treeSymbols.freqs, 7);
        for (i = 0; i < 19; i++) {
            transLengths[i] = treeLengths[hclenOrder[i]];
        }
        for (hclen = 19; hclen > 4 && transLengths[hclen - 1] === 0; hclen--) { }
        treeCodes = this.getCodesFromLengths_(treeLengths);
        stream.writeBits(hlit - 257, 5, true);
        stream.writeBits(hdist - 1, 5, true);
        stream.writeBits(hclen - 4, 4, true);
        for (i = 0; i < hclen; i++) {
            stream.writeBits(transLengths[i], 3, true);
        }
        for (i = 0, il = treeSymbols.codes.length; i < il; i++) {
            code = treeSymbols.codes[i];
            stream.writeBits(treeCodes[code], treeLengths[code], true);
            // extra bits
            if (code >= 16) {
                i++;
                switch (code) {
                    case 16:
                        bitlen = 2;
                        break;
                    case 17:
                        bitlen = 3;
                        break;
                    case 18:
                        bitlen = 7;
                        break;
                    default:
                        throw 'invalid code: ' + code;
                }
                stream.writeBits(treeSymbols.codes[i], bitlen, true);
            }
        }
        this.dynamicHuffman(data, [litLenCodes, litLenLengths], [distCodes, distLengths], stream);
        return stream.finish();
    }
    dynamicHuffman(dataArray, litLen, dist, stream) {
        let index;
        let length;
        let literal;
        let code;
        let litLenCodes;
        let litLenLengths;
        let distCodes;
        let distLengths;
        litLenCodes = litLen[0];
        litLenLengths = litLen[1];
        distCodes = dist[0];
        distLengths = dist[1];
        // 符号を BitStream に書き込んでいく
        for (index = 0, length = dataArray.length; index < length; ++index) {
            literal = dataArray[index];
            // literal or length
            stream.writeBits(litLenCodes[literal], litLenLengths[literal], true);
            // 長さ・距離符号
            if (literal > 256) {
                // length extra
                stream.writeBits(dataArray[++index], dataArray[++index], true);
                // distance
                code = dataArray[++index];
                stream.writeBits(distCodes[code], distLengths[code], true);
                // distance extra
                stream.writeBits(dataArray[++index], dataArray[++index], true);
                // 終端
            }
            else if (literal === 256) {
                break;
            }
        }
        return stream;
    }
    fixedHuffman(dataArray, stream) {
        let index;
        let length;
        let literal;
        for (index = 0, length = dataArray.length; index < length; index++) {
            literal = dataArray[index];
            BitStream.prototype.writeBits.apply(stream, RawDeflate.FixedHuffmanTable[literal]);
            if (literal > 0x100) {
                stream.writeBits(dataArray[++index], dataArray[++index], true);
                stream.writeBits(dataArray[++index], 5);
                stream.writeBits(dataArray[++index], dataArray[++index], true);
            }
            else if (literal === 0x100) {
                break;
            }
        }
        return stream;
    }
    lz77(dataArray) {
        let position = 0;
        let length = 0;
        let i = 0;
        let il = 0;
        let matchKey = 0;
        let table = {};
        let windowSize = RawDeflate.WindowSize;
        let matchsList = [];
        let longestMatch;
        let prevMatch;
        let lz77buf = USE_TYPEDARRAY ?
            new Uint16Array(dataArray.length * 2) : new Array();
        let pos = 0;
        let skipLength = 0;
        let freqsLitLen = new (USE_TYPEDARRAY ? Uint32Array : Array)(286);
        let freqsDist = new (USE_TYPEDARRAY ? Uint32Array : Array)(30);
        let lazy = this.lazy;
        let tmp;
        if (!USE_TYPEDARRAY) {
            for (i = 0; i <= 285;) {
                freqsLitLen[i++] = 0;
            }
            for (i = 0; i <= 29;) {
                freqsDist[i++] = 0;
            }
        }
        freqsLitLen[256] = 1;
        const writeMatch = (match, offset) => {
            let lz77Array = match.toLz77Array();
            for (i = 0, il = lz77Array.length; i < il; ++i) {
                lz77buf[pos++] = lz77Array[i];
            }
            freqsLitLen[lz77Array[0]]++;
            freqsDist[lz77Array[3]]++;
            skipLength = match.length + offset - 1;
            prevMatch = null;
        };
        for (position = 0, length = dataArray.length; position < length; ++position) {
            for (matchKey = 0, i = 0, il = RawDeflate.Lz77MinLength; i < il; ++i) {
                if (position + i === length) {
                    break;
                }
                matchKey = (matchKey << 8) | dataArray[position + i];
            }
            if (!table[matchKey]) {
                table[matchKey] = [];
                matchsList = table[matchKey];
            }
            else {
                matchsList = table[matchKey];
            }
            if (skipLength-- > 0) {
                matchsList.push(position);
                continue;
            }
            while (matchsList.length > 0 && position - matchsList[0] > windowSize) {
                matchsList.shift();
            }
            if (position + RawDeflate.Lz77MinLength >= length) {
                if (prevMatch) {
                    writeMatch(prevMatch, -1);
                }
                for (i = 0, il = length - position; i < il; ++i) {
                    tmp = dataArray[position + i];
                    lz77buf[pos++] = tmp;
                    ++freqsLitLen[tmp];
                }
                break;
            }
            if (matchsList.length > 0) {
                longestMatch = this.searchLongestMatch_(dataArray, position, matchsList);
                if (prevMatch) {
                    if (prevMatch.length < longestMatch.length) {
                        // write previous literal
                        tmp = dataArray[position - 1];
                        lz77buf[pos++] = tmp;
                        ++freqsLitLen[tmp];
                        // write current match
                        writeMatch(longestMatch, 0);
                    }
                    else {
                        // write previous match
                        writeMatch(prevMatch, -1);
                    }
                }
                else if (longestMatch.length < lazy) {
                    prevMatch = longestMatch;
                }
                else {
                    writeMatch(longestMatch, 0);
                }
            }
            else if (prevMatch) {
                writeMatch(prevMatch, -1);
            }
            else {
                tmp = dataArray[position];
                lz77buf[pos++] = tmp;
                ++freqsLitLen[tmp];
            }
            matchsList.push(position);
        }
        lz77buf[pos++] = 256;
        freqsLitLen[256]++;
        this.freqsLitLen = freqsLitLen;
        this.freqsDist = freqsDist;
        return /** @type {!(Uint16Array|Array.<number>)} */ (USE_TYPEDARRAY ? lz77buf.subarray(0, pos) : lz77buf);
    }
    searchLongestMatch_(data, position, matchList) {
        let match, currentMatch, matchMax = 0, matchLength, i, j, l, dl = data.length;
        permatch: for (i = 0, l = matchList.length; i < l; i++) {
            match = matchList[l - i - 1];
            matchLength = RawDeflate.Lz77MinLength;
            if (matchMax > RawDeflate.Lz77MinLength) {
                for (j = matchMax; j > RawDeflate.Lz77MinLength; j--) {
                    if (data[match + j - 1] !== data[position + j - 1]) {
                        continue permatch;
                    }
                }
                matchLength = matchMax;
            }
            while (matchLength < RawDeflate.Lz77MaxLength &&
                position + matchLength < dl &&
                data[match + matchLength] === data[position + matchLength]) {
                ++matchLength;
            }
            if (matchLength > matchMax) {
                currentMatch = match;
                matchMax = matchLength;
            }
            if (matchLength === RawDeflate.Lz77MaxLength) {
                break;
            }
        }
        return new Lz77Match(matchMax, position - currentMatch);
    }
    getTreeSymbols_(hlit, litlenLengths, hdist, distLengths) {
        let src = new (USE_TYPEDARRAY ? Uint32Array : Array)(hlit + hdist), i, j, runLength, l, result = new (USE_TYPEDARRAY ? Uint32Array : Array)(286 + 30), nResult, rpt, freqs = new (USE_TYPEDARRAY ? Uint8Array : Array)(19);
        j = 0;
        for (i = 0; i < hlit; i++) {
            src[j++] = litlenLengths[i];
        }
        for (i = 0; i < hdist; i++) {
            src[j++] = distLengths[i];
        }
        if (!USE_TYPEDARRAY) {
            for (i = 0, l = freqs.length; i < l; ++i) {
                freqs[i] = 0;
            }
        }
        nResult = 0;
        for (i = 0, l = src.length; i < l; i += j) {
            for (j = 1; i + j < l && src[i + j] === src[i]; ++j) { }
            runLength = j;
            if (src[i] === 0) {
                if (runLength < 3) {
                    while (runLength-- > 0) {
                        result[nResult++] = 0;
                        freqs[0]++;
                    }
                }
                else {
                    while (runLength > 0) {
                        rpt = (runLength < 138 ? runLength : 138);
                        if (rpt > runLength - 3 && rpt < runLength) {
                            rpt = runLength - 3;
                        }
                        if (rpt <= 10) {
                            result[nResult++] = 17;
                            result[nResult++] = rpt - 3;
                            freqs[17]++;
                        }
                        else {
                            result[nResult++] = 18;
                            result[nResult++] = rpt - 11;
                            freqs[18]++;
                        }
                        runLength -= rpt;
                    }
                }
            }
            else {
                result[nResult++] = src[i];
                freqs[src[i]]++;
                runLength--;
                if (runLength < 3) {
                    while (runLength-- > 0) {
                        result[nResult++] = src[i];
                        freqs[src[i]]++;
                    }
                }
                else {
                    while (runLength > 0) {
                        rpt = (runLength < 6 ? runLength : 6);
                        if (rpt > runLength - 3 && rpt < runLength) {
                            rpt = runLength - 3;
                        }
                        result[nResult++] = 16;
                        result[nResult++] = rpt - 3;
                        freqs[16]++;
                        runLength -= rpt;
                    }
                }
            }
        }
        return {
            codes: USE_TYPEDARRAY ? result.subarray(0, nResult) : result.slice(0, nResult),
            freqs: freqs
        };
    }
    getLengths_(freqs, limit) {
        let nSymbols = freqs.length;
        let heap = new Heap(2 * RawDeflate.HUFMAX);
        let length = new (USE_TYPEDARRAY ? Uint8Array : Array)(nSymbols);
        let nodes;
        let values;
        let codeLength;
        let i;
        let il;
        if (!USE_TYPEDARRAY) {
            for (i = 0; i < nSymbols; i++) {
                length[i] = 0;
            }
        }
        for (i = 0; i < nSymbols; ++i) {
            if (freqs[i] > 0) {
                heap.push(i, freqs[i]);
            }
        }
        nodes = new Array(heap.length / 2);
        values = new (USE_TYPEDARRAY ? Uint32Array : Array)(heap.length / 2);
        if (nodes.length === 1) {
            length[heap.pop().index] = 1;
            return length;
        }
        for (i = 0, il = heap.length / 2; i < il; ++i) {
            nodes[i] = heap.pop();
            values[i] = nodes[i].value;
        }
        codeLength = this.reversePackageMerge_(values, values.length, limit);
        for (i = 0, il = nodes.length; i < il; ++i) {
            length[nodes[i].index] = codeLength[i];
        }
        return length;
    }
    reversePackageMerge_(freqs, symbols, limit) {
        let minimumCost = new (USE_TYPEDARRAY ? Uint16Array : Array)(limit);
        let flag = new (USE_TYPEDARRAY ? Uint8Array : Array)(limit);
        let codeLength = new (USE_TYPEDARRAY ? Uint8Array : Array)(symbols);
        let value = new Array(limit);
        let type = new Array(limit);
        let currentPosition = new Array(limit);
        let excess = (1 << limit) - symbols;
        let half = (1 << (limit - 1));
        let i;
        let j;
        let t;
        let weight;
        let next;
        const takePackage = (index) => {
            let x = type[index][currentPosition[index]];
            if (x === symbols) {
                takePackage(index + 1);
                takePackage(index + 1);
            }
            else {
                --codeLength[x];
            }
            ++currentPosition[index];
        };
        minimumCost[limit - 1] = symbols;
        for (j = 0; j < limit; ++j) {
            if (excess < half) {
                flag[j] = 0;
            }
            else {
                flag[j] = 1;
                excess -= half;
            }
            excess <<= 1;
            minimumCost[limit - 2 - j] = (minimumCost[limit - 1 - j] / 2 | 0) + symbols;
        }
        minimumCost[0] = flag[0];
        value[0] = new Array(minimumCost[0]);
        type[0] = new Array(minimumCost[0]);
        for (j = 1; j < limit; ++j) {
            if (minimumCost[j] > 2 * minimumCost[j - 1] + flag[j]) {
                minimumCost[j] = 2 * minimumCost[j - 1] + flag[j];
            }
            value[j] = new Array(minimumCost[j]);
            type[j] = new Array(minimumCost[j]);
        }
        for (i = 0; i < symbols; ++i) {
            codeLength[i] = limit;
        }
        for (t = 0; t < minimumCost[limit - 1]; ++t) {
            value[limit - 1][t] = freqs[t];
            type[limit - 1][t] = t;
        }
        for (i = 0; i < limit; ++i) {
            currentPosition[i] = 0;
        }
        if (flag[limit - 1] === 1) {
            --codeLength[0];
            ++currentPosition[limit - 1];
        }
        for (j = limit - 2; j >= 0; --j) {
            i = 0;
            weight = 0;
            next = currentPosition[j + 1];
            for (t = 0; t < minimumCost[j]; t++) {
                weight = value[j + 1][next] + value[j + 1][next + 1];
                if (weight > freqs[i]) {
                    value[j][t] = weight;
                    type[j][t] = symbols;
                    next += 2;
                }
                else {
                    value[j][t] = freqs[i];
                    type[j][t] = i;
                    ++i;
                }
            }
            currentPosition[j] = 0;
            if (flag[j] === 1) {
                takePackage(j);
            }
        }
        return codeLength;
    }
    getCodesFromLengths_(lengths) {
        let codes = new (USE_TYPEDARRAY ? Uint16Array : Array)(lengths.length);
        let count = [];
        let startCode = [];
        let code = 0, i, il, j, m;
        // Count the codes of each length.
        for (i = 0, il = lengths.length; i < il; i++) {
            count[lengths[i]] = (count[lengths[i]] | 0) + 1;
        }
        // Determine the starting code for each length block.
        for (i = 1, il = RawDeflate.MaxCodeLength; i <= il; i++) {
            startCode[i] = code;
            code += count[i] | 0;
            code <<= 1;
        }
        // Determine the code for each symbol. Mirrored, of course.
        for (i = 0, il = lengths.length; i < il; i++) {
            code = startCode[lengths[i]];
            startCode[lengths[i]] += 1;
            codes[i] = 0;
            for (j = 0, m = lengths[i]; j < m; j++) {
                codes[i] = (codes[i] << 1) | (code & 1);
                code >>>= 1;
            }
        }
        return codes;
    }
}
RawDeflate.Lz77MaxLength = 258;
RawDeflate.WindowSize = 0x8000;
RawDeflate.MaxCodeLength = 16;
RawDeflate.HUFMAX = 286;
RawDeflate.Lz77MinLength = 3;
var CompressionMethod;
(function (CompressionMethod) {
    CompressionMethod[CompressionMethod["STORE"] = 0] = "STORE";
    CompressionMethod[CompressionMethod["DEFLATE"] = 8] = "DEFLATE";
    CompressionMethod[CompressionMethod["RESERVED"] = 15] = "RESERVED";
})(CompressionMethod || (CompressionMethod = {}));
;
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./adler32.ts" />
/// <reference path="./rawdeflate.ts" />
/// <reference path="./define/compress.ts" />
class Deflate {
    constructor(input, opt_params) {
        this.rawDeflateOption = {};
        this.input = input;
        this.output =
            new (USE_TYPEDARRAY ? Uint8Array : Array)(Deflate.DefaultBufferSize);
        this.compressionType = CompressionType.DYNAMIC;
        this.rawDeflateOption = {};
        // option parameters
        if (opt_params) {
            if (typeof opt_params['compressionType'] === 'number') {
                this.compressionType = opt_params['compressionType'];
            }
        }
        // copy options
        if (opt_params) {
            const props = Object.keys(opt_params);
            for (let prop of props) {
                this.rawDeflateOption[prop] = opt_params[prop];
            }
        }
        // set raw-deflate output buffer
        this.rawDeflateOption['outputBuffer'] = this.output;
        this.rawDeflate = new RawDeflate(this.input, this.rawDeflateOption);
    }
    static compress(input, opt_params) {
        return (new Deflate(input, opt_params)).compress();
    }
    compress() {
        /** @type {Zlib.CompressionMethod} */
        let cm;
        /** @type {number} */
        let cinfo;
        /** @type {number} */
        let cmf;
        /** @type {number} */
        let flg;
        /** @type {number} */
        let fcheck;
        /** @type {number} */
        let fdict;
        /** @type {number} */
        let flevel;
        /** @type {number} */
        let adler;
        /** @type {!(Array|Uint8Array)} */
        let output;
        /** @type {number} */
        let pos = 0;
        output = this.output;
        // Compression Method and Flags
        cm = CompressionMethod.DEFLATE;
        switch (cm) {
            case CompressionMethod.DEFLATE:
                cinfo = Math.LOG2E * Math.log(RawDeflate.WindowSize) - 8;
                break;
            default:
                throw new Error('invalid compression method');
        }
        cmf = (cinfo << 4) | cm;
        output[pos++] = cmf;
        // Flags
        fdict = 0;
        switch (cm) {
            case CompressionMethod.DEFLATE:
                switch (this.compressionType) {
                    case CompressionType.NONE:
                        flevel = 0;
                        break;
                    case CompressionType.FIXED:
                        flevel = 1;
                        break;
                    case CompressionType.DYNAMIC:
                        flevel = 2;
                        break;
                    default: throw new Error('unsupported compression type');
                }
                break;
            default:
                throw new Error('invalid compression method');
        }
        flg = (flevel << 6) | (fdict << 5);
        fcheck = 31 - (cmf * 256 + flg) % 31;
        flg |= fcheck;
        output[pos++] = flg;
        // Adler-32 checksum
        adler = Adler32(this.input);
        this.rawDeflate.op = pos;
        output = this.rawDeflate.compress();
        pos = output.length;
        if (USE_TYPEDARRAY) {
            output = new Uint8Array(output.buffer);
            if (output.length <= pos + 4) {
                this.output = new Uint8Array(output.length + 4);
                this.output.set(output);
                output = this.output;
            }
            output = output.subarray(0, pos + 4);
        }
        // adler32
        output[pos++] = (adler >> 24) & 0xff;
        output[pos++] = (adler >> 16) & 0xff;
        output[pos++] = (adler >> 8) & 0xff;
        output[pos++] = (adler) & 0xff;
        return output;
    }
}
Deflate.DefaultBufferSize = 0x8000;
class GunzipMember {
    getName() {
        return this.name;
    }
    getData() {
        return this.data;
    }
    getMtime() {
        return this.mtime;
    }
}
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./rawdeflate.ts" />
var gOperatingSystem;
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./rawdeflate.ts" />
(function (gOperatingSystem) {
    gOperatingSystem[gOperatingSystem["FAT"] = 0] = "FAT";
    gOperatingSystem[gOperatingSystem["AMIGA"] = 1] = "AMIGA";
    gOperatingSystem[gOperatingSystem["VMS"] = 2] = "VMS";
    gOperatingSystem[gOperatingSystem["UNIX"] = 3] = "UNIX";
    gOperatingSystem[gOperatingSystem["VM_CMS"] = 4] = "VM_CMS";
    gOperatingSystem[gOperatingSystem["ATARI_TOS"] = 5] = "ATARI_TOS";
    gOperatingSystem[gOperatingSystem["HPFS"] = 6] = "HPFS";
    gOperatingSystem[gOperatingSystem["MACINTOSH"] = 7] = "MACINTOSH";
    gOperatingSystem[gOperatingSystem["Z_SYSTEM"] = 8] = "Z_SYSTEM";
    gOperatingSystem[gOperatingSystem["CP_M"] = 9] = "CP_M";
    gOperatingSystem[gOperatingSystem["TOPS_20"] = 10] = "TOPS_20";
    gOperatingSystem[gOperatingSystem["NTFS"] = 11] = "NTFS";
    gOperatingSystem[gOperatingSystem["QDOS"] = 12] = "QDOS";
    gOperatingSystem[gOperatingSystem["ACORN_RISCOS"] = 13] = "ACORN_RISCOS";
    gOperatingSystem[gOperatingSystem["UNKNOWN"] = 255] = "UNKNOWN";
})(gOperatingSystem || (gOperatingSystem = {}));
;
var gFlagsMask;
(function (gFlagsMask) {
    gFlagsMask[gFlagsMask["FTEXT"] = 1] = "FTEXT";
    gFlagsMask[gFlagsMask["FHCRC"] = 2] = "FHCRC";
    gFlagsMask[gFlagsMask["FEXTRA"] = 4] = "FEXTRA";
    gFlagsMask[gFlagsMask["FNAME"] = 8] = "FNAME";
    gFlagsMask[gFlagsMask["FCOMMENT"] = 16] = "FCOMMENT";
})(gFlagsMask || (gFlagsMask = {}));
;
class Gzip {
    constructor(input, opt_params) {
        this.input = input;
        this.ip = 0;
        this.op = 0;
        this.flags = {};
        if (opt_params) {
            if (opt_params['flags']) {
                this.flags = opt_params['flags'];
            }
            if (typeof opt_params['filename'] === 'string') {
                this.filename = opt_params['filename'];
            }
            if (typeof opt_params['comment'] === 'string') {
                this.comment = opt_params['comment'];
            }
            if (opt_params['deflateOptions']) {
                this.deflateOptions = opt_params['deflateOptions'];
            }
        }
        if (!this.deflateOptions) {
            this.deflateOptions = {};
        }
    }
    compress() {
        let flg;
        let mtime;
        let crc16;
        let crc32;
        let rawdeflate;
        let c;
        let i;
        let il;
        let output = new (USE_TYPEDARRAY ? Uint8Array : Array)(Gzip.DefaultBufferSize);
        let op = 0;
        let input = this.input;
        let ip = this.ip;
        let filename = this.filename;
        let comment = this.comment;
        // check signature
        output[op++] = 0x1f;
        output[op++] = 0x8b;
        // check compression method
        output[op++] = 8; /* XXX: use Zlib const */
        // flags
        flg = 0;
        if (this.flags['fname']) {
            flg |= Gzip.FlagsMask.FNAME;
        }
        if (this.flags['fcomment']) {
            flg |= Gzip.FlagsMask.FCOMMENT;
        }
        if (this.flags['fhcrc']) {
            flg |= Gzip.FlagsMask.FHCRC;
        }
        output[op++] = flg;
        // modification time
        mtime = (Date.now ? Date.now() : +new Date()) / 1000 | 0;
        output[op++] = mtime & 0xff;
        output[op++] = mtime >>> 8 & 0xff;
        output[op++] = mtime >>> 16 & 0xff;
        output[op++] = mtime >>> 24 & 0xff;
        // extra flags
        output[op++] = 0;
        // operating system
        output[op++] = Gzip.OperatingSystem.UNKNOWN;
        // extra
        /* NOP */
        // fname
        if (this.flags['fname'] !== void 0) {
            for (i = 0, il = filename.length; i < il; ++i) {
                c = filename.charCodeAt(i);
                if (c > 0xff) {
                    output[op++] = (c >>> 8) & 0xff;
                }
                output[op++] = c & 0xff;
            }
            output[op++] = 0; // null termination
        }
        // fcomment
        if (this.flags['comment']) {
            for (i = 0, il = comment.length; i < il; ++i) {
                c = comment.charCodeAt(i);
                if (c > 0xff) {
                    output[op++] = (c >>> 8) & 0xff;
                }
                output[op++] = c & 0xff;
            }
            output[op++] = 0; // null termination
        }
        // fhcrc
        if (this.flags['fhcrc']) {
            crc16 = CRC32.calc(output, 0, op) & 0xffff;
            output[op++] = (crc16) & 0xff;
            output[op++] = (crc16 >>> 8) & 0xff;
        }
        // add compress option
        this.deflateOptions['outputBuffer'] = output;
        this.deflateOptions['outputIndex'] = op;
        // compress
        rawdeflate = new RawDeflate(input, this.deflateOptions);
        output = rawdeflate.compress();
        op = rawdeflate.op;
        // expand buffer
        if (USE_TYPEDARRAY) {
            if (op + 8 > output.buffer.byteLength) {
                this.output = new Uint8Array(op + 8);
                this.output.set(new Uint8Array(output.buffer));
                output = this.output;
            }
            else {
                output = new Uint8Array(output.buffer);
            }
        }
        // crc32
        crc32 = CRC32.calc(input);
        output[op++] = (crc32) & 0xff;
        output[op++] = (crc32 >>> 8) & 0xff;
        output[op++] = (crc32 >>> 16) & 0xff;
        output[op++] = (crc32 >>> 24) & 0xff;
        // input size
        il = input.length;
        output[op++] = (il) & 0xff;
        output[op++] = (il >>> 8) & 0xff;
        output[op++] = (il >>> 16) & 0xff;
        output[op++] = (il >>> 24) & 0xff;
        this.ip = ip;
        if (USE_TYPEDARRAY && op < output.length) {
            this.output = output = output.subarray(0, op);
        }
        return output;
    }
}
Gzip.OperatingSystem = gOperatingSystem;
Gzip.FlagsMask = gFlagsMask;
Gzip.DefaultBufferSize = 0x8000;
/// <reference path="./define/typedarray/hybrid.ts" />
/**
 * build huffman table from length list.
 * @param {!(Array.<number>|Uint8Array)} lengths length list.
 * @return {!Array} huffman table.
 */
class Huffman {
    constructor() {
    }
    static buildHuffmanTable(lengths) {
        let listSize = lengths.length;
        let maxCodeLength = 0;
        let minCodeLength = Number.POSITIVE_INFINITY;
        let size;
        let table;
        let bitLength;
        let code;
        let skip;
        let reversed;
        let rtemp;
        let i;
        let il;
        let j;
        let value;
        for (i = 0, il = listSize; i < il; ++i) {
            if (lengths[i] > maxCodeLength) {
                maxCodeLength = lengths[i];
            }
            if (lengths[i] < minCodeLength) {
                minCodeLength = lengths[i];
            }
        }
        size = 1 << maxCodeLength;
        table = new (USE_TYPEDARRAY ? Uint32Array : Array)(size);
        for (bitLength = 1, code = 0, skip = 2; bitLength <= maxCodeLength;) {
            for (i = 0; i < listSize; ++i) {
                if (lengths[i] === bitLength) {
                    for (reversed = 0, rtemp = code, j = 0; j < bitLength; ++j) {
                        reversed = (reversed << 1) | (rtemp & 1);
                        rtemp >>= 1;
                    }
                    value = (bitLength << 16) | i;
                    for (j = reversed; j < size; j += skip) {
                        table[j] = value;
                    }
                    ++code;
                }
            }
            ++bitLength;
            code <<= 1;
            skip <<= 1;
        }
        return [table, maxCodeLength, minCodeLength];
    }
}
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./huffman.ts" />
var rBufferType;
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./huffman.ts" />
(function (rBufferType) {
    rBufferType[rBufferType["BLOCK"] = 0] = "BLOCK";
    rBufferType[rBufferType["ADAPTIVE"] = 1] = "ADAPTIVE";
})(rBufferType || (rBufferType = {}));
;
class RawInflate {
    constructor(input, opt_params) {
        /** @type {boolean} is final block flag. */
        this.bfinal = false;
        /** @type {Zlib.RawInflate.BufferType} buffer management. */
        this.bufferType = RawInflate.BufferType.ADAPTIVE;
        /** @type {boolean} resize flag for memory size optimization. */
        this.resize = false;
        this.blocks = [];
        this.bufferSize = RawInflate.ZLIB_RAW_INFLATE_BUFFER_SIZE;
        this.totalpos = 0;
        this.ip = 0;
        this.bitsbuf = 0;
        this.bitsbuflen = 0;
        this.input = USE_TYPEDARRAY ? new Uint8Array(input) : input;
        this.bfinal = false;
        this.bufferType = RawInflate.BufferType.ADAPTIVE;
        this.resize = false;
        // option parameters
        if (opt_params) {
            if (opt_params['index']) {
                this.ip = opt_params['index'];
            }
            if (opt_params['bufferSize']) {
                this.bufferSize = opt_params['bufferSize'];
            }
            if (opt_params['bufferType']) {
                this.bufferType = opt_params['bufferType'];
            }
            if (opt_params['resize']) {
                this.resize = opt_params['resize'];
            }
        }
        // initialize
        switch (this.bufferType) {
            case RawInflate.BufferType.BLOCK:
                this.op = RawInflate.MaxBackwardLength;
                this.output =
                    new (USE_TYPEDARRAY ? Uint8Array : Array)(RawInflate.MaxBackwardLength +
                        this.bufferSize +
                        RawInflate.MaxCopyLength);
                break;
            case RawInflate.BufferType.ADAPTIVE:
                this.op = 0;
                this.output = new (USE_TYPEDARRAY ? Uint8Array : Array)(this.bufferSize);
                break;
            default:
                throw new Error('invalid inflate mode');
        }
    }
    decompress() {
        while (!this.bfinal) {
            this.parseBlock();
        }
        switch (this.bufferType) {
            case RawInflate.BufferType.BLOCK:
                return this.concatBufferBlock();
            case RawInflate.BufferType.ADAPTIVE:
                return this.concatBufferDynamic();
            default:
                throw new Error('invalid inflate mode');
        }
    }
    parseBlock() {
        /** @type {number} header */
        let hdr = this.readBits(3);
        // BFINAL
        if (hdr & 0x1) {
            this.bfinal = true;
        }
        // BTYPE
        hdr >>>= 1;
        switch (hdr) {
            // uncompressed
            case 0:
                this.parseUncompressedBlock();
                break;
            // fixed huffman
            case 1:
                console.log("Fixed Block");
                this.parseFixedHuffmanBlock();
                break;
            // dynamic huffman
            case 2:
                console.log("Dynamic Block");
                this.parseDynamicHuffmanBlock();
                break;
            // reserved or other
            default:
                throw new Error('unknown BTYPE: ' + hdr);
        }
    }
    readBits(length) {
        let bitsbuf = this.bitsbuf;
        let bitsbuflen = this.bitsbuflen;
        let input = this.input;
        let ip = this.ip;
        /** @type {number} */
        let inputLength = input.length;
        /** @type {number} input and output byte. */
        let octet;
        // input byte
        if (ip + ((length - bitsbuflen + 7) >> 3) >= inputLength) {
            throw new Error('input buffer is broken');
        }
        // not enough buffer
        while (bitsbuflen < length) {
            bitsbuf |= input[ip++] << bitsbuflen;
            bitsbuflen += 8;
        }
        // output byte
        octet = bitsbuf & /* MASK */ ((1 << length) - 1);
        bitsbuf >>>= length;
        bitsbuflen -= length;
        this.bitsbuf = bitsbuf;
        this.bitsbuflen = bitsbuflen;
        this.ip = ip;
        return octet;
    }
    readCodeByTable(table) {
        let bitsbuf = this.bitsbuf;
        let bitsbuflen = this.bitsbuflen;
        let input = this.input;
        let ip = this.ip;
        /** @type {number} */
        let inputLength = input.length;
        /** @type {!(Array.<number>|Uint8Array)} huffman code table */
        let codeTable = table[0];
        /** @type {number} */
        let maxCodeLength = table[1];
        /** @type {number} code length & code (16bit, 16bit) */
        let codeWithLength;
        /** @type {number} code bits length */
        let codeLength;
        // not enough buffer
        while (bitsbuflen < maxCodeLength) {
            if (ip >= inputLength) {
                break;
            }
            bitsbuf |= input[ip++] << bitsbuflen;
            bitsbuflen += 8;
        }
        // read max length
        codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
        codeLength = codeWithLength >>> 16;
        if (codeLength > bitsbuflen) {
            throw new Error('invalid code length: ' + codeLength);
        }
        this.bitsbuf = bitsbuf >> codeLength;
        this.bitsbuflen = bitsbuflen - codeLength;
        this.ip = ip;
        return codeWithLength & 0xffff;
    }
    parseUncompressedBlock() {
        let input = this.input;
        let ip = this.ip;
        let output = this.output;
        let op = this.op;
        /** @type {number} */
        let inputLength = input.length;
        /** @type {number} block length */
        let len;
        /** @type {number} number for check block length */
        let nlen;
        /** @type {number} output buffer length */
        let olength = output.length;
        /** @type {number} copy counter */
        let preCopy;
        // skip buffered header bits
        this.bitsbuf = 0;
        this.bitsbuflen = 0;
        // len
        if (ip + 1 >= inputLength) {
            throw new Error('invalid uncompressed block header: LEN');
        }
        len = input[ip++] | (input[ip++] << 8);
        // nlen
        if (ip + 1 >= inputLength) {
            throw new Error('invalid uncompressed block header: NLEN');
        }
        nlen = input[ip++] | (input[ip++] << 8);
        // check len & nlen
        if (len === ~nlen) {
            throw new Error('invalid uncompressed block header: length verify');
        }
        // check size
        if (ip + len > input.length) {
            throw new Error('input buffer is broken');
        }
        // expand buffer
        switch (this.bufferType) {
            case RawInflate.BufferType.BLOCK:
                // pre copy
                while (op + len > output.length) {
                    preCopy = olength - op;
                    len -= preCopy;
                    if (USE_TYPEDARRAY) {
                        output.set(input.subarray(ip, ip + preCopy), op);
                        op += preCopy;
                        ip += preCopy;
                    }
                    else {
                        while (preCopy--) {
                            output[op++] = input[ip++];
                        }
                    }
                    this.op = op;
                    output = this.expandBufferBlock();
                    op = this.op;
                }
                break;
            case RawInflate.BufferType.ADAPTIVE:
                while (op + len > output.length) {
                    output = this.expandBufferAdaptive({ fixRatio: 2 });
                }
                break;
            default:
                throw new Error('invalid inflate mode');
        }
        // copy
        if (USE_TYPEDARRAY) {
            output.set(input.subarray(ip, ip + len), op);
            op += len;
            ip += len;
        }
        else {
            while (len--) {
                output[op++] = input[ip++];
            }
        }
        this.ip = ip;
        this.op = op;
        this.output = output;
    }
    parseFixedHuffmanBlock() {
        switch (this.bufferType) {
            case RawInflate.BufferType.ADAPTIVE:
                this.decodeHuffmanAdaptive(RawInflate.FixedLiteralLengthTable, RawInflate.FixedDistanceTable);
                break;
            case RawInflate.BufferType.BLOCK:
                this.decodeHuffmanBlock(RawInflate.FixedLiteralLengthTable, RawInflate.FixedDistanceTable);
                break;
            default:
                throw new Error('invalid inflate mode');
        }
    }
    parseDynamicHuffmanBlock() {
        /** @type {number} number of literal and length codes. */
        let hlit = this.readBits(5) + 257;
        /** @type {number} number of distance codes. */
        let hdist = this.readBits(5) + 1;
        /** @type {number} number of code lengths. */
        let hclen = this.readBits(4) + 4;
        /** @type {!(Uint8Array|Array.<number>)} code lengths. */
        let codeLengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(RawInflate.Order.length);
        /** @type {!Array} code lengths table. */
        let codeLengthsTable;
        /** @type {!(Uint8Array|Array.<number>)} literal and length code table. */
        let litlenTable;
        /** @type {!(Uint8Array|Array.<number>)} distance code table. */
        let distTable;
        /** @type {!(Uint8Array|Array.<number>)} code length table. */
        let lengthTable;
        /** @type {number} */
        let code;
        /** @type {number} */
        let prev;
        /** @type {number} */
        let repeat;
        /** @type {number} loop counter. */
        let i;
        /** @type {number} loop limit. */
        let il;
        // decode code lengths
        for (i = 0; i < hclen; ++i) {
            codeLengths[RawInflate.Order[i]] = this.readBits(3);
        }
        if (!USE_TYPEDARRAY) {
            for (i = hclen, hclen = codeLengths.length; i < hclen; ++i) {
                codeLengths[RawInflate.Order[i]] = 0;
            }
        }
        // decode length table
        codeLengthsTable = RawInflate.buildHuffmanTable(codeLengths);
        lengthTable = new (USE_TYPEDARRAY ? Uint8Array : Array)(hlit + hdist);
        for (i = 0, il = hlit + hdist; i < il;) {
            code = this.readCodeByTable(codeLengthsTable);
            switch (code) {
                case 16:
                    repeat = 3 + this.readBits(2);
                    while (repeat--) {
                        lengthTable[i++] = prev;
                    }
                    break;
                case 17:
                    repeat = 3 + this.readBits(3);
                    while (repeat--) {
                        lengthTable[i++] = 0;
                    }
                    prev = 0;
                    break;
                case 18:
                    repeat = 11 + this.readBits(7);
                    while (repeat--) {
                        lengthTable[i++] = 0;
                    }
                    prev = 0;
                    break;
                default:
                    lengthTable[i++] = code;
                    prev = code;
                    break;
            }
        }
        litlenTable = USE_TYPEDARRAY
            ? RawInflate.buildHuffmanTable(lengthTable.subarray(0, hlit))
            : RawInflate.buildHuffmanTable(lengthTable.slice(0, hlit));
        distTable = USE_TYPEDARRAY
            ? RawInflate.buildHuffmanTable(lengthTable.subarray(hlit))
            : RawInflate.buildHuffmanTable(lengthTable.slice(hlit));
        switch (this.bufferType) {
            case RawInflate.BufferType.ADAPTIVE:
                this.decodeHuffmanAdaptive(litlenTable, distTable);
                break;
            case RawInflate.BufferType.BLOCK:
                this.decodeHuffmanBlock(litlenTable, distTable);
                break;
            default:
                throw new Error('invalid inflate mode');
        }
    }
    decodeHuffmanBlock(litlen, dist) {
        let output = this.output;
        let op = this.op;
        this.currentLitlenTable = litlen;
        let olength = output.length - RawInflate.MaxCopyLength;
        let code;
        let ti;
        let codeDist;
        let codeLength;
        let lengthCodeTable = RawInflate.LengthCodeTable;
        let lengthExtraTable = RawInflate.LengthExtraTable;
        let distCodeTable = RawInflate.DistCodeTable;
        let distExtraTable = RawInflate.DistExtraTable;
        code = this.readCodeByTable(litlen);
        while (code !== 256) {
            // literal
            if (code < 256) {
                if (op >= olength) {
                    this.op = op;
                    output = this.expandBufferBlock();
                    op = this.op;
                }
                output[op++] = code;
                continue;
            }
            // length code
            ti = code - 257;
            codeLength = lengthCodeTable[ti];
            if (lengthExtraTable[ti] > 0) {
                codeLength += this.readBits(lengthExtraTable[ti]);
            }
            // dist code
            code = this.readCodeByTable(dist);
            codeDist = distCodeTable[code];
            if (distExtraTable[code] > 0) {
                codeDist += this.readBits(distExtraTable[code]);
            }
            // lz77 decode
            if (op >= olength) {
                this.op = op;
                output = this.expandBufferBlock();
                op = this.op;
            }
            while (codeLength--) {
                output[op] = output[(op++) - codeDist];
            }
            code = this.readCodeByTable(litlen);
        }
        while (this.bitsbuflen >= 8) {
            this.bitsbuflen -= 8;
            this.ip--;
        }
        this.op = op;
    }
    decodeHuffmanAdaptive(litlen, dist) {
        let output = this.output;
        let op = this.op;
        this.currentLitlenTable = litlen;
        let olength = output.length;
        let code;
        let ti;
        let codeDist;
        let codeLength;
        let lengthCodeTable = RawInflate.LengthCodeTable;
        let lengthExtraTable = RawInflate.LengthExtraTable;
        let distCodeTable = RawInflate.DistCodeTable;
        let distExtraTable = RawInflate.DistExtraTable;
        var testOP = 25;
        while ((code = this.readCodeByTable(litlen)) !== 256) {
            console.log(op.toString());
            console.log(uint8arrayToStringMethod(output.slice(0, op)));
            // literal
            if (code < 256) {
                if (op >= olength) {
                    output = this.expandBufferAdaptive();
                    olength = output.length;
                }
                if (op == testOP)
                    console.log("First");
                output[op++] = code;
                continue;
            }
            // length code
            ti = code - 257;
            codeLength = lengthCodeTable[ti];
            if (lengthExtraTable[ti] > 0) {
                codeLength += this.readBits(lengthExtraTable[ti]);
                if (op == testOP)
                    console.log("Second");
            }
            // dist code
            code = this.readCodeByTable(dist);
            codeDist = distCodeTable[code];
            if (distExtraTable[code] > 0) {
                codeDist += this.readBits(distExtraTable[code]);
                if (op == testOP)
                    console.log("Third");
            }
            // lz77 decode
            if (op + codeLength > olength) {
                output = this.expandBufferAdaptive();
                olength = output.length;
                if (op == testOP)
                    console.log("Fourth");
            }
            while (codeLength--) {
                if (op == testOP)
                    console.log("Loop");
                output[op] = output[(op++) - codeDist];
            }
            code = this.readCodeByTable(litlen);
        }
        while (this.bitsbuflen >= 8) {
            this.bitsbuflen -= 8;
            this.ip--;
        }
        this.op = op;
    }
    expandBufferBlock() {
        let buffer = new (USE_TYPEDARRAY ? Uint8Array : Array)(this.op - RawInflate.MaxBackwardLength);
        let backward = this.op - RawInflate.MaxBackwardLength;
        let i;
        let il;
        let output = this.output;
        // copy to output buffer
        if (USE_TYPEDARRAY) {
            buffer.set(output.subarray(RawInflate.MaxBackwardLength, buffer.length));
        }
        else {
            for (i = 0, il = buffer.length; i < il; ++i) {
                buffer[i] = output[i + RawInflate.MaxBackwardLength];
            }
        }
        this.blocks.push(buffer);
        this.totalpos += buffer.length;
        // copy to backward buffer
        if (USE_TYPEDARRAY) {
            output.set(output.subarray(backward, backward + RawInflate.MaxBackwardLength));
        }
        else {
            for (i = 0; i < RawInflate.MaxBackwardLength; ++i) {
                output[i] = output[backward + i];
            }
        }
        this.op = RawInflate.MaxBackwardLength;
        return output;
    }
    expandBufferAdaptive(opt_param) {
        let buffer;
        let ratio = (this.input.length / this.ip + 1) | 0;
        let maxHuffCode;
        let newSize;
        let maxInflateSize;
        let input = this.input;
        let output = this.output;
        if (opt_param) {
            if (typeof opt_param.fixRatio === 'number') {
                ratio = opt_param.fixRatio;
            }
            if (typeof opt_param.addRatio === 'number') {
                ratio += opt_param.addRatio;
            }
        }
        // calculate new buffer size
        if (ratio < 2) {
            maxHuffCode =
                (input.length - this.ip) / this.currentLitlenTable[2];
            maxInflateSize = (maxHuffCode / 2 * 258) | 0;
            newSize = maxInflateSize < output.length ?
                output.length + maxInflateSize :
                output.length << 1;
        }
        else {
            newSize = output.length * ratio;
        }
        // buffer expantion
        if (USE_TYPEDARRAY) {
            buffer = new Uint8Array(newSize);
            buffer.set(output);
        }
        else {
            buffer = output;
        }
        this.output = buffer;
        return this.output;
    }
    concatBufferBlock() {
        /** @type {number} buffer pointer. */
        let pos = 0;
        /** @type {number} buffer pointer. */
        let limit = this.totalpos + (this.op - RawInflate.MaxBackwardLength);
        /** @type {!(Array.<number>|Uint8Array)} output block array. */
        let output = this.output;
        /** @type {!Array} blocks array. */
        let blocks = this.blocks;
        /** @type {!(Array.<number>|Uint8Array)} output block array. */
        let block;
        /** @type {!(Array.<number>|Uint8Array)} output buffer. */
        let buffer = new (USE_TYPEDARRAY ? Uint8Array : Array)(limit);
        /** @type {number} loop counter. */
        let i;
        /** @type {number} loop limiter. */
        let il;
        /** @type {number} loop counter. */
        let j;
        /** @type {number} loop limiter. */
        let jl;
        // single buffer
        if (blocks.length === 0) {
            return USE_TYPEDARRAY ?
                this.output.subarray(RawInflate.MaxBackwardLength, this.op) :
                this.output.slice(RawInflate.MaxBackwardLength, this.op);
        }
        // copy to buffer
        for (i = 0, il = blocks.length; i < il; ++i) {
            block = blocks[i];
            for (j = 0, jl = block.length; j < jl; ++j) {
                buffer[pos++] = block[j];
            }
        }
        // current buffer
        for (i = RawInflate.MaxBackwardLength, il = this.op; i < il; ++i) {
            buffer[pos++] = output[i];
        }
        this.blocks = [];
        this.buffer = buffer;
        return this.buffer;
    }
    concatBufferDynamic() {
        let buffer;
        let op = this.op;
        if (USE_TYPEDARRAY) {
            if (this.resize) {
                buffer = new Uint8Array(op);
                buffer.set(this.output.subarray(0, op));
            }
            else {
                buffer = this.output.subarray(0, op);
            }
        }
        else {
            if (this.output.length > op) {
                this.output = this.output.slice(0, op - 1);
            }
            buffer = this.output;
        }
        this.buffer = buffer;
        return this.buffer;
    }
}
RawInflate.ZLIB_RAW_INFLATE_BUFFER_SIZE = 0x8000;
RawInflate.buildHuffmanTable = Huffman.buildHuffmanTable;
RawInflate.BufferType = rBufferType;
RawInflate.MaxBackwardLength = 32768;
RawInflate.MaxCopyLength = 258;
RawInflate.Order = (() => {
    const table = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})();
RawInflate.LengthCodeTable = ((table) => {
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})([
    0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009, 0x000a, 0x000b,
    0x000d, 0x000f, 0x0011, 0x0013, 0x0017, 0x001b, 0x001f, 0x0023, 0x002b,
    0x0033, 0x003b, 0x0043, 0x0053, 0x0063, 0x0073, 0x0083, 0x00a3, 0x00c3,
    0x00e3, 0x0102, 0x0102, 0x0102
]);
RawInflate.LengthExtraTable = ((table) => {
    return USE_TYPEDARRAY ? new Uint8Array(table) : table;
})([
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
    5, 5, 0, 0, 0
]);
RawInflate.DistCodeTable = ((table) => {
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})([
    0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d, 0x0011,
    0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1, 0x0101, 0x0181,
    0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01, 0x1001, 0x1801, 0x2001,
    0x3001, 0x4001, 0x6001
]);
RawInflate.DistExtraTable = (() => {
    const table = [
        0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
        11, 12, 12, 13, 13
    ];
    return USE_TYPEDARRAY ? new Uint8Array(table) : table;
})();
RawInflate.FixedLiteralLengthTable = (() => {
    let lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(288);
    let i, il;
    for (i = 0, il = lengths.length; i < il; ++i) {
        lengths[i] =
            (i <= 143) ? 8 :
                (i <= 255) ? 9 :
                    (i <= 279) ? 7 :
                        8;
    }
    return RawInflate.buildHuffmanTable(lengths);
})();
RawInflate.FixedDistanceTable = (() => {
    let lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(30);
    let i, il;
    for (i = 0, il = lengths.length; i < il; ++i) {
        lengths[i] = 5;
    }
    return RawInflate.buildHuffmanTable(lengths);
})();
function uint8arrayToStringMethod(myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr);
}
function StringTouint8arrayMethod(str) {
    var uint = new Uint8Array(str.length);
    for (var i = 0, j = str.length; i < j; ++i) {
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
/// <reference path="./gunzip_member.ts" />
/// <reference path="./gzip.ts" />
/// <reference path="./rawinflate.ts" />
/// <reference path="./define/typedarray/hybrid.ts" />
class Gunzip {
    constructor(input) {
        this.member = [];
        this.input = input;
        this.ip = 0;
        this.member = [];
        this.decompressed = false;
    }
    getMembers() {
        if (!this.decompressed) {
            this.decompress();
        }
        return this.member.slice();
    }
    ;
    decompress() {
        let il = this.input.length;
        while (this.ip < il) {
            this.decodeMember();
        }
        this.decompressed = true;
        return this.concatMember();
    }
    ;
    decodeMember() {
        /** @type {Zlib.GunzipMember} */
        let member = new GunzipMember();
        /** @type {number} */
        let isize;
        /** @type {Zlib.RawInflate} RawInflate implementation. */
        let rawinflate;
        /** @type {!(Array.<number>|Uint8Array)} inflated data. */
        let inflated;
        /** @type {number} inflate size */
        let inflen;
        /** @type {number} character code */
        let c;
        /** @type {number} character index in string. */
        let ci;
        /** @type {Array.<string>} character array. */
        let str;
        /** @type {number} modification time. */
        let mtime;
        /** @type {number} */
        let crc32;
        let input = this.input;
        let ip = this.ip;
        member.id1 = input[ip++];
        member.id2 = input[ip++];
        // check signature
        if (member.id1 !== 0x1f || member.id2 !== 0x8b) {
            throw new Error('invalid file signature:' + member.id1 + ',' + member.id2);
        }
        // check compression method
        member.cm = input[ip++];
        switch (member.cm) {
            case 8: /* XXX: use Zlib const */
                break;
            default:
                throw new Error('unknown compression method: ' + member.cm);
        }
        // flags
        member.flg = input[ip++];
        // modification time
        mtime = (input[ip++]) |
            (input[ip++] << 8) |
            (input[ip++] << 16) |
            (input[ip++] << 24);
        member.mtime = new Date(mtime * 1000);
        // extra flags
        member.xfl = input[ip++];
        // operating system
        member.os = input[ip++];
        // extra
        if ((member.flg & Gzip.FlagsMask.FEXTRA) > 0) {
            member.xlen = input[ip++] | (input[ip++] << 8);
            ip = this.decodeSubField(ip, member.xlen);
        }
        // fname
        if ((member.flg & Gzip.FlagsMask.FNAME) > 0) {
            c = input[ip];
            for (str = [], ci = 0; c > 0;) {
                str[ci++] = String.fromCharCode(c);
                c = input[++ip];
            }
            member.name = str.join('');
        }
        // fcomment
        if ((member.flg & Gzip.FlagsMask.FCOMMENT) > 0) {
            c = input[ip];
            for (str = [], ci = 0; c > 0;) {
                str[ci++] = String.fromCharCode(c);
                c = input[++ip];
            }
            member.comment = str.join('');
        }
        // fhcrc
        if ((member.flg & Gzip.FlagsMask.FHCRC) > 0) {
            member.crc16 = CRC32.calc(input, 0, ip) & 0xffff;
            if (member.crc16 !== (input[ip++] | (input[ip++] << 8))) {
                throw new Error('invalid header crc16');
            }
        }
        // isize を事前に取得すると展開後のサイズが分かるため、
        // inflate処理のバッファサイズが事前に分かり、高速になる
        isize = (input[input.length - 4]) | (input[input.length - 3] << 8) |
            (input[input.length - 2] << 16) | (input[input.length - 1] << 24);
        // isize の妥当性チェック
        // ハフマン符号では最小 2-bit のため、最大で 1/4 になる
        // LZ77 符号では 長さと距離 2-Byte で最大 258-Byte を表現できるため、
        // 1/128 になるとする
        // ここから入力バッファの残りが isize の 512 倍以上だったら
        // サイズ指定のバッファ確保は行わない事とする
        if (input.length - ip - /* CRC-32 */ 4 - /* ISIZE */ 4 < isize * 512) {
            inflen = isize;
        }
        // compressed block
        rawinflate = new RawInflate(input, { 'index': ip, 'bufferSize': inflen });
        member.data = inflated = rawinflate.decompress();
        ip = rawinflate.ip;
        // crc32
        member.crc32 = crc32 =
            ((input[ip++]) | (input[ip++] << 8) |
                (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        if (CRC32.calc(inflated) !== crc32) {
            throw new Error('invalid CRC-32 checksum: 0x' +
                CRC32.calc(inflated).toString(16) + ' / 0x' + crc32.toString(16));
        }
        // input size
        member.isize = isize =
            ((input[ip++]) | (input[ip++] << 8) |
                (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        if ((inflated.length & 0xffffffff) !== isize) {
            throw new Error('invalid input size: ' +
                (inflated.length & 0xffffffff) + ' / ' + isize);
        }
        this.member.push(member);
        this.ip = ip;
    }
    decodeSubField(ip, length) {
        return ip + length;
    }
    ;
    concatMember() {
        /** @type {Array.<Zlib.GunzipMember>} */
        let member = this.member;
        /** @type {number} */
        let i;
        /** @type {number} */
        let il;
        /** @type {number} */
        let p = 0;
        /** @type {number} */
        let size = 0;
        /** @type {!(Array.<number>|Uint8Array)} */
        let buffer;
        for (i = 0, il = member.length; i < il; ++i) {
            size += member[i].data.length;
        }
        if (USE_TYPEDARRAY) {
            buffer = new Uint8Array(size);
            for (i = 0; i < il; ++i) {
                buffer.set(member[i].data, p);
                p += member[i].data.length;
            }
        }
        else {
            buffer = [];
            for (i = 0; i < il; ++i) {
                buffer[i] = member[i].data;
            }
            buffer = Array.prototype.concat.apply([], buffer);
        }
        return buffer;
    }
}
/// <reference path="./gzip.ts" />
/// <reference path="./gunzip.ts" />
/// <reference path="./define/compress.ts" />
/// <reference path="./rawinflate.ts" />
/// <reference path="./adler32.ts" />
class Inflate {
    constructor(input, opt_params) {
        let cmf;
        let flg;
        this.input = input;
        this.ip = 0;
        // option parameters
        if (opt_params) {
            if (opt_params['index']) {
                this.ip = opt_params['index'];
            }
            if (opt_params['verify']) {
                this.verify = opt_params['verify'];
            }
        }
        // Compression Method and Flags
        cmf = input[this.ip++];
        flg = input[this.ip++];
        // compression method
        switch (cmf & 0x0f) {
            case CompressionMethod.DEFLATE:
                this.method = CompressionMethod.DEFLATE;
                break;
            default:
                throw new Error('unsupported compression method');
        }
        // fcheck
        if (((cmf << 8) + flg) % 31 !== 0) {
            throw new Error('invalid fcheck flag:' + ((cmf << 8) + flg) % 31);
        }
        // fdict (not supported)
        if (flg & 0x20) {
            throw new Error('fdict flag is not supported');
        }
        let bufferType = null;
        let bufferSize = null;
        let resize = false;
        // RawInflate
        if (opt_params) {
            bufferType = opt_params['bufferType'] ? opt_params['bufferType'] : null;
            bufferSize = opt_params['bufferSize'] ? opt_params['bufferSize'] : null;
            resize = opt_params['bufferSize'] ? opt_params['bufferSize'] : null;
        }
        this.rawinflate = new RawInflate(input, {
            'index': this.ip,
            'bufferType': bufferType,
            'bufferSize': bufferSize,
            'resize': resize
        });
    }
    decompress() {
        let input = this.input;
        let buffer;
        let adler32;
        buffer = this.rawinflate.decompress();
        this.ip = this.rawinflate.ip;
        // verify adler-32
        if (this.verify) {
            adler32 = (input[this.ip++] << 24 | input[this.ip++] << 16 |
                input[this.ip++] << 8 | input[this.ip++]) >>> 0;
            if (adler32 !== Adler32(buffer)) {
                throw new Error('invalid adler-32 checksum');
            }
        }
        return buffer;
    }
    ;
}
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./huffman.ts" />
const ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE = 0x8000;
var rStatus;
(function (rStatus) {
    rStatus[rStatus["INITIALIZED"] = 0] = "INITIALIZED";
    rStatus[rStatus["BLOCK_HEADER_START"] = 1] = "BLOCK_HEADER_START";
    rStatus[rStatus["BLOCK_HEADER_END"] = 2] = "BLOCK_HEADER_END";
    rStatus[rStatus["BLOCK_BODY_START"] = 3] = "BLOCK_BODY_START";
    rStatus[rStatus["BLOCK_BODY_END"] = 4] = "BLOCK_BODY_END";
    rStatus[rStatus["DECODE_BLOCK_START"] = 5] = "DECODE_BLOCK_START";
    rStatus[rStatus["DECODE_BLOCK_END"] = 6] = "DECODE_BLOCK_END";
})(rStatus || (rStatus = {}));
;
var rBlockType;
(function (rBlockType) {
    rBlockType[rBlockType["UNCOMPRESSED"] = 0] = "UNCOMPRESSED";
    rBlockType[rBlockType["FIXED"] = 1] = "FIXED";
    rBlockType[rBlockType["DYNAMIC"] = 2] = "DYNAMIC";
})(rBlockType || (rBlockType = {}));
;
const buildHuffmanTable = Huffman.buildHuffmanTable;
class RawInflateStream {
    constructor(input, ip, opt_buffersize) {
        this.status = 0;
        /** @type {!Array.<(Array|Uint8Array)>} */
        this.blocks = [];
        /** @type {number} block size. */
        this.bufferSize =
            opt_buffersize ? opt_buffersize : ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE;
        /** @type {!number} total output buffer pointer. */
        this.totalpos = 0;
        /** @type {!number} input buffer pointer. */
        this.ip = ip === void 0 ? 0 : ip;
        /** @type {!number} bit stream reader buffer. */
        this.bitsbuf = 0;
        /** @type {!number} bit stream reader buffer size. */
        this.bitsbuflen = 0;
        /** @type {!(Array|Uint8Array)} input buffer. */
        this.input = USE_TYPEDARRAY ? new Uint8Array(input) : input;
        /** @type {!(Uint8Array|Array)} output buffer. */
        this.output = new (USE_TYPEDARRAY ? Uint8Array : Array)(this.bufferSize);
        /** @type {!number} output buffer pointer. */
        this.op = 0;
        /** @type {boolean} is final block flag. */
        this.bfinal = false;
        /** @type {number} uncompressed block length. */
        this.blockLength = 0;
        /** @type {boolean} resize flag for memory size optimization. */
        this.resize = false;
        /** @type {Array} */
        this.litlenTable = [];
        /** @type {Array} */
        this.distTable = [];
        /** @type {number} */
        this.sp = 0; // stream pointer
        /** @type {RawInflateStream.Status} */
        this.status = RawInflateStream.Status.INITIALIZED;
        /** @type {!number} */
        this.ip_ = 0;
        /** @type {!number} */
        this.bitsbuflen_ = 0;
        /** @type {!number} */
        this.bitsbuf_ = 0;
        this.currentBlockType = RawInflateStream.BlockType.FIXED;
    }
    decompress(newInput, ip) {
        /** @type {boolean} */
        let stop = false;
        if (newInput !== void 0) {
            this.input = newInput;
        }
        if (ip !== void 0) {
            this.ip = ip;
        }
        // decompress
        while (!stop) {
            switch (this.status) {
                // block header
                case RawInflateStream.Status.INITIALIZED:
                case RawInflateStream.Status.BLOCK_HEADER_START:
                    if (this.readBlockHeader() < 0) {
                        stop = true;
                    }
                    break;
                // block body
                case RawInflateStream.Status.BLOCK_HEADER_END: /* FALLTHROUGH */
                case RawInflateStream.Status.BLOCK_BODY_START:
                    switch (this.currentBlockType) {
                        case RawInflateStream.BlockType.UNCOMPRESSED:
                            if (this.readUncompressedBlockHeader() < 0) {
                                stop = true;
                            }
                            break;
                        case RawInflateStream.BlockType.FIXED:
                            if (this.parseFixedHuffmanBlock() < 0) {
                                stop = true;
                            }
                            break;
                        case RawInflateStream.BlockType.DYNAMIC:
                            if (this.parseDynamicHuffmanBlock() < 0) {
                                stop = true;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                // decode data
                case RawInflateStream.Status.BLOCK_BODY_END:
                case RawInflateStream.Status.DECODE_BLOCK_START:
                    switch (this.currentBlockType) {
                        case RawInflateStream.BlockType.UNCOMPRESSED:
                            if (this.parseUncompressedBlock() < 0) {
                                stop = true;
                            }
                            break;
                        case RawInflateStream.BlockType.FIXED: /* FALLTHROUGH */
                        case RawInflateStream.BlockType.DYNAMIC:
                            if (this.decodeHuffman() < 0) {
                                stop = true;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case RawInflateStream.Status.DECODE_BLOCK_END:
                    if (this.bfinal) {
                        stop = true;
                    }
                    else {
                        this.status = RawInflateStream.Status.INITIALIZED;
                    }
                    break;
                default:
                    break;
            }
        }
        return this.concatBuffer();
    }
    readBlockHeader() {
        /** @type {number} header */
        let hdr;
        this.status = RawInflateStream.Status.BLOCK_HEADER_START;
        this.save_();
        hdr = this.readBits(3);
        if (hdr < 0) {
            this.restore_();
            return -1;
        }
        // BFINAL
        if (hdr & 0x1) {
            this.bfinal = true;
        }
        // BTYPE
        hdr >>>= 1;
        switch (hdr) {
            case 0: // uncompressed
                this.currentBlockType = RawInflateStream.BlockType.UNCOMPRESSED;
                break;
            case 1: // fixed huffman
                this.currentBlockType = RawInflateStream.BlockType.FIXED;
                break;
            case 2: // dynamic huffman
                this.currentBlockType = RawInflateStream.BlockType.DYNAMIC;
                break;
            default: // reserved or other
                throw new Error('unknown BTYPE: ' + hdr);
        }
        this.status = RawInflateStream.Status.BLOCK_HEADER_END;
    }
    readBits(length) {
        let bitsbuf = this.bitsbuf;
        let bitsbuflen = this.bitsbuflen;
        let input = this.input;
        let ip = this.ip;
        /** @type {number} input and output byte. */
        let octet;
        // not enough buffer
        while (bitsbuflen < length) {
            // input byte
            if (input.length <= ip) {
                return -1;
            }
            octet = input[ip++];
            // concat octet
            bitsbuf |= octet << bitsbuflen;
            bitsbuflen += 8;
        }
        // output byte
        octet = bitsbuf & /* MASK */ ((1 << length) - 1);
        bitsbuf >>>= length;
        bitsbuflen -= length;
        this.bitsbuf = bitsbuf;
        this.bitsbuflen = bitsbuflen;
        this.ip = ip;
        return octet;
    }
    readCodeByTable(table) {
        let bitsbuf = this.bitsbuf;
        let bitsbuflen = this.bitsbuflen;
        let input = this.input;
        let ip = this.ip;
        /** @type {!(Array|Uint8Array)} huffman code table */
        let codeTable = table[0];
        /** @type {number} */
        let maxCodeLength = table[1];
        /** @type {number} input byte */
        let octet;
        /** @type {number} code length & code (16bit, 16bit) */
        let codeWithLength;
        /** @type {number} code bits length */
        let codeLength;
        // not enough buffer
        while (bitsbuflen < maxCodeLength) {
            if (input.length <= ip) {
                return -1;
            }
            octet = input[ip++];
            bitsbuf |= octet << bitsbuflen;
            bitsbuflen += 8;
        }
        // read max length
        codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
        codeLength = codeWithLength >>> 16;
        if (codeLength > bitsbuflen) {
            throw new Error('invalid code length: ' + codeLength);
        }
        this.bitsbuf = bitsbuf >> codeLength;
        this.bitsbuflen = bitsbuflen - codeLength;
        this.ip = ip;
        return codeWithLength & 0xffff;
    }
    readUncompressedBlockHeader() {
        /** @type {number} block length */
        let len;
        /** @type {number} number for check block length */
        let nlen;
        let input = this.input;
        let ip = this.ip;
        this.status = RawInflateStream.Status.BLOCK_BODY_START;
        if (ip + 4 >= input.length) {
            return -1;
        }
        len = input[ip++] | (input[ip++] << 8);
        nlen = input[ip++] | (input[ip++] << 8);
        // check len & nlen
        if (len === ~nlen) {
            throw new Error('invalid uncompressed block header: length verify');
        }
        // skip buffered header bits
        this.bitsbuf = 0;
        this.bitsbuflen = 0;
        this.ip = ip;
        this.blockLength = len;
        this.status = RawInflateStream.Status.BLOCK_BODY_END;
    }
    parseUncompressedBlock() {
        let input = this.input;
        let ip = this.ip;
        let output = this.output;
        let op = this.op;
        let len = this.blockLength;
        this.status = RawInflateStream.Status.DECODE_BLOCK_START;
        // copy
        // XXX: とりあえず素直にコピー
        while (len--) {
            if (op === output.length) {
                output = this.expandBuffer({ fixRatio: 2 });
            }
            // not enough input buffer
            if (ip >= input.length) {
                this.ip = ip;
                this.op = op;
                this.blockLength = len + 1; // コピーしてないので戻す
                return -1;
            }
            output[op++] = input[ip++];
        }
        if (len < 0) {
            this.status = RawInflateStream.Status.DECODE_BLOCK_END;
        }
        this.ip = ip;
        this.op = op;
        return 0;
    }
    parseFixedHuffmanBlock() {
        this.status = RawInflateStream.Status.BLOCK_BODY_START;
        this.litlenTable = RawInflateStream.FixedLiteralLengthTable;
        this.distTable = RawInflateStream.FixedDistanceTable;
        this.status = RawInflateStream.Status.BLOCK_BODY_END;
        return 0;
    }
    save_() {
        this.ip_ = this.ip;
        this.bitsbuflen_ = this.bitsbuflen;
        this.bitsbuf_ = this.bitsbuf;
    }
    restore_() {
        this.ip = this.ip_;
        this.bitsbuflen = this.bitsbuflen_;
        this.bitsbuf = this.bitsbuf_;
    }
    parseDynamicHuffmanBlock() {
        /** @type {number} number of literal and length codes. */
        let hlit;
        /** @type {number} number of distance codes. */
        let hdist;
        /** @type {number} number of code lengths. */
        let hclen;
        /** @type {!(Uint8Array|Array)} code lengths. */
        let codeLengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(RawInflateStream.Order.length);
        /** @type {!Array} code lengths table. */
        let codeLengthsTable;
        this.status = RawInflateStream.Status.BLOCK_BODY_START;
        this.save_();
        hlit = this.readBits(5) + 257;
        hdist = this.readBits(5) + 1;
        hclen = this.readBits(4) + 4;
        if (hlit < 0 || hdist < 0 || hclen < 0) {
            this.restore_();
            return -1;
        }
        const parseDynamicHuffmanBlockImpl = () => {
            /** @type {number} */
            let bits;
            let code;
            let prev = 0;
            let repeat;
            /** @type {!(Uint8Array|Array.<number>)} code length table. */
            let lengthTable;
            /** @type {number} loop counter. */
            let i;
            /** @type {number} loop limit. */
            let il;
            // decode code lengths
            for (i = 0; i < hclen; ++i) {
                bits = this.readBits(3);
                if ((bits) < 0) {
                    throw new Error('not enough input');
                }
                codeLengths[RawInflateStream.Order[i]] = bits;
            }
            // decode length table
            codeLengthsTable = buildHuffmanTable(codeLengths);
            lengthTable = new (USE_TYPEDARRAY ? Uint8Array : Array)(hlit + hdist);
            for (i = 0, il = hlit + hdist; i < il;) {
                code = this.readCodeByTable(codeLengthsTable);
                if (code < 0) {
                    throw new Error('not enough input');
                }
                switch (code) {
                    case 16:
                        bits = this.readBits(2);
                        if (bits < 0) {
                            throw new Error('not enough input');
                        }
                        repeat = 3 + bits;
                        while (repeat--) {
                            lengthTable[i++] = prev;
                        }
                        break;
                    case 17:
                        bits = this.readBits(3);
                        if (bits < 0) {
                            throw new Error('not enough input');
                        }
                        repeat = 3 + bits;
                        while (repeat--) {
                            lengthTable[i++] = 0;
                        }
                        prev = 0;
                        break;
                    case 18:
                        bits = this.readBits(7);
                        if (bits < 0) {
                            throw new Error('not enough input');
                        }
                        repeat = 11 + bits;
                        while (repeat--) {
                            lengthTable[i++] = 0;
                        }
                        prev = 0;
                        break;
                    default:
                        lengthTable[i++] = code;
                        prev = code;
                        break;
                }
            }
            this.litlenTable = USE_TYPEDARRAY
                ? buildHuffmanTable(lengthTable.subarray(0, hlit))
                : buildHuffmanTable(lengthTable.slice(0, hlit));
            this.distTable = USE_TYPEDARRAY
                ? buildHuffmanTable(lengthTable.subarray(hlit))
                : buildHuffmanTable(lengthTable.slice(hlit));
        };
        try {
            parseDynamicHuffmanBlockImpl();
        }
        catch (e) {
            this.restore_();
            return -1;
        }
        this.status = RawInflateStream.Status.BLOCK_BODY_END;
        return 0;
    }
    decodeHuffman() {
        let output = this.output;
        let op = this.op;
        /** @type {number} huffman code. */
        let code;
        /** @type {number} table index. */
        let ti;
        /** @type {number} huffman code distination. */
        let codeDist;
        /** @type {number} huffman code length. */
        let codeLength;
        let litlen = this.litlenTable;
        let dist = this.distTable;
        let olength = output.length;
        let bits;
        this.status = RawInflateStream.Status.DECODE_BLOCK_START;
        while (true) {
            this.save_();
            code = this.readCodeByTable(litlen);
            if (code < 0) {
                this.op = op;
                this.restore_();
                return -1;
            }
            if (code === 256) {
                break;
            }
            // literal
            if (code < 256) {
                if (op === olength) {
                    output = this.expandBuffer();
                    olength = output.length;
                }
                output[op++] = code;
                continue;
            }
            // length code
            ti = code - 257;
            codeLength = RawInflateStream.LengthCodeTable[ti];
            if (RawInflateStream.LengthExtraTable[ti] > 0) {
                bits = this.readBits(RawInflateStream.LengthExtraTable[ti]);
                if (bits < 0) {
                    this.op = op;
                    this.restore_();
                    return -1;
                }
                codeLength += bits;
            }
            // dist code
            code = this.readCodeByTable(dist);
            if (code < 0) {
                this.op = op;
                this.restore_();
                return -1;
            }
            codeDist = RawInflateStream.DistCodeTable[code];
            if (RawInflateStream.DistExtraTable[code] > 0) {
                bits = this.readBits(RawInflateStream.DistExtraTable[code]);
                if (bits < 0) {
                    this.op = op;
                    this.restore_();
                    return -1;
                }
                codeDist += bits;
            }
            if (op + codeLength >= olength) {
                output = this.expandBuffer();
                olength = output.length;
            }
            while (codeLength--) {
                output[op] = output[(op++) - codeDist];
            }
            if (this.ip === this.input.length) {
                this.op = op;
                return -1;
            }
        }
        while (this.bitsbuflen >= 8) {
            this.bitsbuflen -= 8;
            this.ip--;
        }
        this.op = op;
        this.status = RawInflateStream.Status.DECODE_BLOCK_END;
    }
    expandBuffer(opt_param) {
        /** @type {!(Array|Uint8Array)} store buffer. */
        let buffer;
        /** @type {number} expantion ratio. */
        let ratio = (this.input.length / this.ip + 1) | 0;
        /** @type {number} maximum number of huffman code. */
        let maxHuffCode;
        /** @type {number} new output buffer size. */
        let newSize;
        /** @type {number} max inflate size. */
        let maxInflateSize;
        let input = this.input;
        let output = this.output;
        if (opt_param) {
            if (typeof opt_param.fixRatio === 'number') {
                ratio = opt_param.fixRatio;
            }
            if (typeof opt_param.addRatio === 'number') {
                ratio += opt_param.addRatio;
            }
        }
        // calculate new buffer size
        if (ratio < 2) {
            maxHuffCode =
                (input.length - this.ip) / this.litlenTable[2];
            maxInflateSize = (maxHuffCode / 2 * 258) | 0;
            newSize = maxInflateSize < output.length ?
                output.length + maxInflateSize :
                output.length << 1;
        }
        else {
            newSize = output.length * ratio;
        }
        // buffer expantion
        if (USE_TYPEDARRAY) {
            buffer = new Uint8Array(newSize);
            buffer.set(output);
        }
        else {
            buffer = output;
        }
        this.output = buffer;
        return this.output;
    }
    ;
    concatBuffer() {
        /** @type {!(Array|Uint8Array)} output buffer. */
        let buffer;
        /** @type {number} */
        let op = this.op;
        /** @type {Uint8Array} */
        let tmp;
        if (this.resize) {
            if (USE_TYPEDARRAY) {
                buffer = new Uint8Array(this.output.subarray(this.sp, op));
            }
            else {
                buffer = this.output.slice(this.sp, op);
            }
        }
        else {
            buffer =
                USE_TYPEDARRAY ? this.output.subarray(this.sp, op) : this.output.slice(this.sp, op);
        }
        this.sp = op;
        // compaction
        if (op > RawInflateStream.MaxBackwardLength + this.bufferSize) {
            this.op = this.sp = RawInflateStream.MaxBackwardLength;
            if (USE_TYPEDARRAY) {
                tmp = /** @type {Uint8Array} */ (this.output);
                this.output = new Uint8Array(this.bufferSize + RawInflateStream.MaxBackwardLength);
                this.output.set(tmp.subarray(op - RawInflateStream.MaxBackwardLength, op));
            }
            else {
                this.output = this.output.slice(op - RawInflateStream.MaxBackwardLength);
            }
        }
        return buffer;
    }
}
RawInflateStream.Status = rStatus;
RawInflateStream.BlockType = rBlockType;
RawInflateStream.MaxBackwardLength = 32768;
RawInflateStream.MaxCopyLength = 258;
RawInflateStream.Order = (() => {
    let table = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})();
RawInflateStream.LengthCodeTable = (() => {
    const table = [
        0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009, 0x000a, 0x000b,
        0x000d, 0x000f, 0x0011, 0x0013, 0x0017, 0x001b, 0x001f, 0x0023, 0x002b,
        0x0033, 0x003b, 0x0043, 0x0053, 0x0063, 0x0073, 0x0083, 0x00a3, 0x00c3,
        0x00e3, 0x0102, 0x0102, 0x0102
    ];
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})();
RawInflateStream.LengthExtraTable = (() => {
    const table = [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
        5, 5, 0, 0, 0
    ];
    return USE_TYPEDARRAY ? new Uint8Array(table) : table;
})();
RawInflateStream.DistCodeTable = (() => {
    let table = [
        0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d, 0x0011,
        0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1, 0x0101, 0x0181,
        0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01, 0x1001, 0x1801, 0x2001,
        0x3001, 0x4001, 0x6001
    ];
    return USE_TYPEDARRAY ? new Uint16Array(table) : table;
})();
RawInflateStream.DistExtraTable = (() => {
    const table = [
        0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
        11, 12, 12, 13, 13
    ];
    return USE_TYPEDARRAY ? new Uint8Array(table) : table;
})();
RawInflateStream.FixedLiteralLengthTable = (() => {
    let lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(288);
    let i, il;
    for (i = 0, il = lengths.length; i < il; ++i) {
        lengths[i] =
            (i <= 143) ? 8 :
                (i <= 255) ? 9 :
                    (i <= 279) ? 7 :
                        8;
    }
    return buildHuffmanTable(lengths);
})();
RawInflateStream.FixedDistanceTable = (() => {
    let lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)(30);
    let i, il;
    for (i = 0, il = lengths.length; i < il; ++i) {
        lengths[i] = 5;
    }
    return buildHuffmanTable(lengths);
})();
/// <reference path="./define/compress.ts" />
/// <reference path="./define/typedarray/hybrid.ts" />
/// <reference path="./rawinflate_stream.ts" />
class InflateStream {
    constructor(input) {
        this.input = input === void 0 ? new (USE_TYPEDARRAY ? Uint8Array : Array)(null) : input;
        this.ip = 0;
        this.rawinflate = new RawInflateStream(this.input, this.ip);
        this.output = this.rawinflate.output;
    }
    ;
    decompress(input) {
        let buffer;
        if (input !== void 0) {
            if (USE_TYPEDARRAY) {
                let tmp = new Uint8Array(this.input.length + input.length);
                tmp.set(this.input, 0);
                tmp.set(input, this.input.length);
                this.input = tmp;
            }
            else {
                this.input = (this.input).concat(input);
            }
        }
        if (this.method === void 0) {
            if (this.readHeader() < 0) {
                return new (USE_TYPEDARRAY ? Uint8Array : Array)(null);
            }
        }
        buffer = this.rawinflate.decompress(this.input, this.ip);
        if (this.rawinflate.ip !== 0) {
            this.input = USE_TYPEDARRAY ?
                this.input.subarray(this.rawinflate.ip) :
                this.input.slice(this.rawinflate.ip);
            this.ip = 0;
        }
        return buffer;
    }
    readHeader() {
        let ip = this.ip;
        let input = this.input;
        // Compression Method and Flags
        let cmf = input[ip++];
        let flg = input[ip++];
        if (cmf === void 0 || flg === void 0) {
            return -1;
        }
        // compression method
        switch (cmf & 0x0f) {
            case CompressionMethod.DEFLATE:
                this.method = CompressionMethod.DEFLATE;
                break;
            default:
                throw new Error('unsupported compression method');
        }
        // fcheck
        if (((cmf << 8) + flg) % 31 !== 0) {
            throw new Error('invalid fcheck flag:' + ((cmf << 8) + flg) % 31);
        }
        // fdict (not supported)
        if (flg & 0x20) {
            throw new Error('fdict flag is not supported');
        }
        this.ip = ip;
    }
}
/// <reference path="./rawdeflate.ts" />
/// <reference path="./rawinflate_stream.ts" />
/// <reference path="./rawinflate.ts" />
/// <reference path="./rawdeflate.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./define/typedarray/hybrid.ts" />
var OperatingSystem;
/// <reference path="./rawdeflate.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./define/typedarray/hybrid.ts" />
(function (OperatingSystem) {
    OperatingSystem[OperatingSystem["MSDOS"] = 0] = "MSDOS";
    OperatingSystem[OperatingSystem["UNIX"] = 3] = "UNIX";
    OperatingSystem[OperatingSystem["MACINTOSH"] = 7] = "MACINTOSH";
})(OperatingSystem || (OperatingSystem = {}));
;
var Flags;
(function (Flags) {
    Flags[Flags["ENCRYPT"] = 1] = "ENCRYPT";
    Flags[Flags["DESCRIPTOR"] = 8] = "DESCRIPTOR";
    Flags[Flags["UTF8"] = 2048] = "UTF8";
})(Flags || (Flags = {}));
;
class Zip {
    constructor(opt_params) {
        this.files = [];
        opt_params = opt_params || {};
        this.files = [];
        /** @type {(Array.<number>|Uint8Array)} */
        this.comment = opt_params['comment'];
        /** @type {(Array.<number>|Uint8Array)} */
    }
    addFile(input, opt_params) {
        opt_params = opt_params || {};
        let compressed;
        let size = input.length;
        let crc32 = 0;
        if (USE_TYPEDARRAY && input instanceof Array) {
            input = new Uint8Array(input);
        }
        if (typeof opt_params['compressionMethod'] !== 'number') {
            opt_params['compressionMethod'] = Zip.CompressionMethod.DEFLATE;
        }
        if (opt_params['compress']) {
            switch (opt_params['compressionMethod']) {
                case Zip.CompressionMethod.STORE:
                    break;
                case Zip.CompressionMethod.DEFLATE:
                    crc32 = CRC32.calc(input);
                    input = this.deflateWithOption(input, opt_params);
                    compressed = true;
                    break;
                default:
                    throw new Error('unknown compression method:' + opt_params['compressionMethod']);
            }
        }
        this.files.push({
            buffer: input,
            option: opt_params,
            compressed: compressed,
            encrypted: false,
            size: size,
            crc32: crc32
        });
    }
    setPassword(password) {
        this.password = password;
    }
    compress() {
        let files = this.files;
        let file;
        let output;
        let op1;
        let op2;
        let op3;
        let localFileSize = 0;
        let centralDirectorySize = 0;
        let endOfCentralDirectorySize;
        let offset;
        let needVersion;
        let flags;
        let compressionMethod;
        let date;
        let crc32;
        let size;
        let plainSize;
        let filenameLength;
        let extraFieldLength;
        let commentLength;
        let filename;
        let extraField;
        let comment;
        let buffer;
        let tmp;
        let key;
        let i;
        let il;
        let j;
        let jl;
        for (i = 0, il = files.length; i < il; ++i) {
            file = files[i];
            filenameLength =
                (file.option['filename']) ? file.option['filename'].length : 0;
            extraFieldLength =
                (file.option['extraField']) ? file.option['extraField'].length : 0;
            commentLength =
                (file.option['comment']) ? file.option['comment'].length : 0;
            if (!file.compressed) {
                file.crc32 = CRC32.calc(file.buffer);
                switch (file.option['compressionMethod']) {
                    case Zip.CompressionMethod.STORE:
                        break;
                    case Zip.CompressionMethod.DEFLATE:
                        file.buffer = this.deflateWithOption(file.buffer, file.option);
                        file.compressed = true;
                        break;
                    default:
                        throw new Error('unknown compression method:' + file.option['compressionMethod']);
                }
            }
            // encryption
            if (file.option['password'] !== void 0 || this.password !== void 0) {
                // init encryption
                key = Zip.createEncryptionKey(file.option['password'] || this.password);
                // add header
                buffer = file.buffer;
                if (USE_TYPEDARRAY) {
                    tmp = new Uint8Array(buffer.length + 12);
                    tmp.set(buffer, 12);
                    buffer = tmp;
                }
                else {
                    buffer.unshift(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                }
                for (j = 0; j < 12; ++j) {
                    buffer[j] = this.encode(key, i === 11 ? (file.crc32 & 0xff) : (Math.random() * 256 | 0));
                }
                // data encryption
                for (jl = buffer.length; j < jl; ++j) {
                    buffer[j] = this.encode(key, buffer[j]);
                }
                file.buffer = buffer;
            }
            // 必要バッファサイズの計算
            localFileSize +=
                // local file header
                30 + filenameLength +
                    // file data
                    file.buffer.length;
            centralDirectorySize +=
                // file header
                46 + filenameLength + commentLength;
        }
        // end of central directory
        endOfCentralDirectorySize = 22 + (this.comment ? this.comment.length : 0);
        output = new (USE_TYPEDARRAY ? Uint8Array : Array)(localFileSize + centralDirectorySize + endOfCentralDirectorySize);
        op1 = 0;
        op2 = localFileSize;
        op3 = op2 + centralDirectorySize;
        for (i = 0, il = files.length; i < il; ++i) {
            file = files[i];
            filenameLength =
                file.option['filename'] ? file.option['filename'].length : 0;
            extraFieldLength = 0; // TODO
            commentLength =
                file.option['comment'] ? file.option['comment'].length : 0;
            //-------------------------------------------------------------------------
            // local file header & file header
            //-------------------------------------------------------------------------
            offset = op1;
            // signature
            // local file header
            output[op1++] = Zip.LocalFileHeaderSignature[0];
            output[op1++] = Zip.LocalFileHeaderSignature[1];
            output[op1++] = Zip.LocalFileHeaderSignature[2];
            output[op1++] = Zip.LocalFileHeaderSignature[3];
            // file header
            output[op2++] = Zip.FileHeaderSignature[0];
            output[op2++] = Zip.FileHeaderSignature[1];
            output[op2++] = Zip.FileHeaderSignature[2];
            output[op2++] = Zip.FileHeaderSignature[3];
            // compressor info
            needVersion = 20;
            output[op2++] = needVersion & 0xff;
            output[op2++] =
                /** @type {Zlib.Zip.OperatingSystem} */
                (file.option['os']) ||
                    Zip.OperatingSystem.MSDOS;
            // need version
            output[op1++] = output[op2++] = needVersion & 0xff;
            output[op1++] = output[op2++] = (needVersion >> 8) & 0xff;
            // general purpose bit flag
            flags = 0;
            if (file.option['password'] || this.password) {
                flags |= Zip.Flags.ENCRYPT;
            }
            output[op1++] = output[op2++] = flags & 0xff;
            output[op1++] = output[op2++] = (flags >> 8) & 0xff;
            // compression method
            compressionMethod =
                /** @type {Zlib.Zip.CompressionMethod} */
                (file.option['compressionMethod']);
            output[op1++] = output[op2++] = compressionMethod & 0xff;
            output[op1++] = output[op2++] = (compressionMethod >> 8) & 0xff;
            // date
            date = /** @type {(Date|undefined)} */ (file.option['date']) || new Date();
            output[op1++] = output[op2++] =
                ((date.getMinutes() & 0x7) << 5) |
                    (date.getSeconds() / 2 | 0);
            output[op1++] = output[op2++] =
                (date.getHours() << 3) |
                    (date.getMinutes() >> 3);
            //
            output[op1++] = output[op2++] =
                ((date.getMonth() + 1 & 0x7) << 5) |
                    (date.getDate());
            output[op1++] = output[op2++] =
                ((date.getFullYear() - 1980 & 0x7f) << 1) |
                    (date.getMonth() + 1 >> 3);
            // CRC-32
            crc32 = file.crc32;
            output[op1++] = output[op2++] = crc32 & 0xff;
            output[op1++] = output[op2++] = (crc32 >> 8) & 0xff;
            output[op1++] = output[op2++] = (crc32 >> 16) & 0xff;
            output[op1++] = output[op2++] = (crc32 >> 24) & 0xff;
            // compressed size
            size = file.buffer.length;
            output[op1++] = output[op2++] = size & 0xff;
            output[op1++] = output[op2++] = (size >> 8) & 0xff;
            output[op1++] = output[op2++] = (size >> 16) & 0xff;
            output[op1++] = output[op2++] = (size >> 24) & 0xff;
            // uncompressed size
            plainSize = file.size;
            output[op1++] = output[op2++] = plainSize & 0xff;
            output[op1++] = output[op2++] = (plainSize >> 8) & 0xff;
            output[op1++] = output[op2++] = (plainSize >> 16) & 0xff;
            output[op1++] = output[op2++] = (plainSize >> 24) & 0xff;
            // filename length
            output[op1++] = output[op2++] = filenameLength & 0xff;
            output[op1++] = output[op2++] = (filenameLength >> 8) & 0xff;
            // extra field length
            output[op1++] = output[op2++] = extraFieldLength & 0xff;
            output[op1++] = output[op2++] = (extraFieldLength >> 8) & 0xff;
            // file comment length
            output[op2++] = commentLength & 0xff;
            output[op2++] = (commentLength >> 8) & 0xff;
            // disk number start
            output[op2++] = 0;
            output[op2++] = 0;
            // internal file attributes
            output[op2++] = 0;
            output[op2++] = 0;
            // external file attributes
            output[op2++] = 0;
            output[op2++] = 0;
            output[op2++] = 0;
            output[op2++] = 0;
            // relative offset of local header
            output[op2++] = offset & 0xff;
            output[op2++] = (offset >> 8) & 0xff;
            output[op2++] = (offset >> 16) & 0xff;
            output[op2++] = (offset >> 24) & 0xff;
            // filename
            filename = file.option['filename'];
            if (filename) {
                if (USE_TYPEDARRAY) {
                    output.set(filename, op1);
                    output.set(filename, op2);
                    op1 += filenameLength;
                    op2 += filenameLength;
                }
                else {
                    for (j = 0; j < filenameLength; ++j) {
                        output[op1++] = output[op2++] = filename[j];
                    }
                }
            }
            // extra field
            extraField = file.option['extraField'];
            if (extraField) {
                if (USE_TYPEDARRAY) {
                    output.set(extraField, op1);
                    output.set(extraField, op2);
                    op1 += extraFieldLength;
                    op2 += extraFieldLength;
                }
                else {
                    for (j = 0; j < commentLength; ++j) {
                        output[op1++] = output[op2++] = extraField[j];
                    }
                }
            }
            // comment
            comment = file.option['comment'];
            if (comment) {
                if (USE_TYPEDARRAY) {
                    output.set(comment, op2);
                    op2 += commentLength;
                }
                else {
                    for (j = 0; j < commentLength; ++j) {
                        output[op2++] = comment[j];
                    }
                }
            }
            //-------------------------------------------------------------------------
            // file data
            //-------------------------------------------------------------------------
            if (USE_TYPEDARRAY) {
                output.set(file.buffer, op1);
                op1 += file.buffer.length;
            }
            else {
                for (j = 0, jl = file.buffer.length; j < jl; ++j) {
                    output[op1++] = file.buffer[j];
                }
            }
        }
        //-------------------------------------------------------------------------
        // end of central directory
        //-------------------------------------------------------------------------
        // signature
        output[op3++] = Zip.CentralDirectorySignature[0];
        output[op3++] = Zip.CentralDirectorySignature[1];
        output[op3++] = Zip.CentralDirectorySignature[2];
        output[op3++] = Zip.CentralDirectorySignature[3];
        // number of this disk
        output[op3++] = 0;
        output[op3++] = 0;
        // number of the disk with the start of the central directory
        output[op3++] = 0;
        output[op3++] = 0;
        // total number of entries in the central directory on this disk
        output[op3++] = il & 0xff;
        output[op3++] = (il >> 8) & 0xff;
        // total number of entries in the central directory
        output[op3++] = il & 0xff;
        output[op3++] = (il >> 8) & 0xff;
        // size of the central directory
        output[op3++] = centralDirectorySize & 0xff;
        output[op3++] = (centralDirectorySize >> 8) & 0xff;
        output[op3++] = (centralDirectorySize >> 16) & 0xff;
        output[op3++] = (centralDirectorySize >> 24) & 0xff;
        // offset of start of central directory with respect to the starting disk number
        output[op3++] = localFileSize & 0xff;
        output[op3++] = (localFileSize >> 8) & 0xff;
        output[op3++] = (localFileSize >> 16) & 0xff;
        output[op3++] = (localFileSize >> 24) & 0xff;
        // .ZIP file comment length
        commentLength = this.comment ? this.comment.length : 0;
        output[op3++] = commentLength & 0xff;
        output[op3++] = (commentLength >> 8) & 0xff;
        // .ZIP file comment
        if (this.comment) {
            if (USE_TYPEDARRAY) {
                output.set(this.comment, op3);
                op3 += commentLength;
            }
            else {
                for (j = 0, jl = commentLength; j < jl; ++j) {
                    output[op3++] = this.comment[j];
                }
            }
        }
        return output;
    }
    deflateWithOption(input, opt_params) {
        /** @type {Zlib.RawDeflate} */
        const deflator = new RawDeflate(input, opt_params['deflateOption']);
        return deflator.compress();
    }
    static getByte(key) {
        const tmp = ((key[2] & 0xffff) | 2);
        return ((tmp * (tmp ^ 1)) >> 8) & 0xff;
    }
    ;
    encode(key, n) {
        /** @type {number} */
        const tmp = Zip.getByte(key);
        Zip.updateKeys(key, n);
        return tmp ^ n;
    }
    ;
    static createEncryptionKey(password) {
        /** @type {!(Array.<number>|Uint32Array)} */
        const keyOrigin = [305419896, 591751049, 878082192];
        /** @type {number} */
        let i = 0;
        /** @type {number} */
        let il = password.length;
        let key = USE_TYPEDARRAY ? new Uint32Array(keyOrigin) : keyOrigin;
        for (; i < il; ++i) {
            Zip.updateKeys(key, password[i] & 0xff);
        }
        return key;
    }
}
Zip.CompressionMethod = CompressionMethod;
Zip.OperatingSystem = OperatingSystem;
Zip.Flags = Flags;
Zip.FileHeaderSignature = [0x50, 0x4b, 0x01, 0x02];
Zip.LocalFileHeaderSignature = [0x50, 0x4b, 0x03, 0x04];
Zip.CentralDirectorySignature = [0x50, 0x4b, 0x05, 0x06];
Zip.updateKeys = function (key, n) {
    key[0] = CRC32.single(key[0], n);
    key[1] =
        (((((key[1] + (key[0] & 0xff)) * 20173 >>> 0) * 6681) >>> 0) + 1) >>> 0;
    key[2] = CRC32.single(key[2], key[1] >>> 24);
};
/// <reference path="./zip.ts" />
/// <reference path="./rawinflate.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./define/typedarray/hybrid.ts" />
class FileHeader {
    constructor(input, ip) {
        this.input = input;
        this.offset = ip;
    }
}
FileHeader.Flags = Zip.Flags;
class LocalFileHeader {
    constructor(input, ip) {
        this.input = input;
        this.offset = ip;
    }
}
LocalFileHeader.Flags = Zip.Flags;
class Unzip {
    constructor(input, opt_params) {
        this.updateKeys = Zip.updateKeys;
        this.createDecryptionKey = Zip.createEncryptionKey;
        this.getByte = Zip.getByte;
        opt_params = opt_params || {};
        this.input =
            (USE_TYPEDARRAY && (input instanceof Array)) ?
                new Uint8Array(input) : input;
        this.ip = 0;
        this.verify = opt_params['verify'] || false;
        this.password = opt_params['password'];
    }
    getFileHeaderAttribute(filename, attributeName) {
        const fileHeaderIndex = this.filenameToIndex[filename];
        if (fileHeaderIndex) {
            return this.fileHeaderList[fileHeaderIndex][attributeName];
        }
    }
    parse() {
        let input = this.input;
        let ip = this.offset;
        // central file header signature
        if (input[ip++] !== Unzip.FileHeaderSignature[0] ||
            input[ip++] !== Unzip.FileHeaderSignature[1] ||
            input[ip++] !== Unzip.FileHeaderSignature[2] ||
            input[ip++] !== Unzip.FileHeaderSignature[3]) {
            throw new Error('invalid file header signature');
        }
        // version made by
        this.version = input[ip++];
        this.os = input[ip++];
        // version needed to extract
        this.needVersion = input[ip++] | (input[ip++] << 8);
        // general purpose bit flag
        this.flags = input[ip++] | (input[ip++] << 8);
        // compression method
        this.compression = input[ip++] | (input[ip++] << 8);
        // last mod file time
        this.time = input[ip++] | (input[ip++] << 8);
        //last mod file date
        this.date = input[ip++] | (input[ip++] << 8);
        // crc-32
        this.crc32 = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // compressed size
        this.compressedSize = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // uncompressed size
        this.plainSize = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // file name length
        this.fileNameLength = input[ip++] | (input[ip++] << 8);
        // extra field length
        this.extraFieldLength = input[ip++] | (input[ip++] << 8);
        // file comment length
        this.fileCommentLength = input[ip++] | (input[ip++] << 8);
        // disk number start
        this.diskNumberStart = input[ip++] | (input[ip++] << 8);
        // internal file attributes
        this.internalFileAttributes = input[ip++] | (input[ip++] << 8);
        // external file attributes
        this.externalFileAttributes =
            (input[ip++]) | (input[ip++] << 8) |
                (input[ip++] << 16) | (input[ip++] << 24);
        // relative offset of local header
        this.relativeOffset = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // file name
        this.filename = String.fromCharCode.apply(null, USE_TYPEDARRAY ?
            input.subarray(ip, ip += this.fileNameLength) :
            input.slice(ip, ip += this.fileNameLength));
        // extra field
        this.extraField = USE_TYPEDARRAY ?
            input.subarray(ip, ip += this.extraFieldLength) :
            input.slice(ip, ip += this.extraFieldLength);
        // file comment
        this.comment = USE_TYPEDARRAY ?
            input.subarray(ip, ip + this.fileCommentLength) :
            input.slice(ip, ip + this.fileCommentLength);
        this.length = ip - this.offset;
    }
    searchEndOfCentralDirectoryRecord() {
        let input = this.input;
        let ip;
        for (ip = input.length - 12; ip > 0; --ip) {
            if (input[ip] === Unzip.CentralDirectorySignature[0] &&
                input[ip + 1] === Unzip.CentralDirectorySignature[1] &&
                input[ip + 2] === Unzip.CentralDirectorySignature[2] &&
                input[ip + 3] === Unzip.CentralDirectorySignature[3]) {
                this.eocdrOffset = ip;
                return;
            }
        }
        throw new Error('End of Central Directory Record not found');
    }
    parseEndOfCentralDirectoryRecord() {
        let input = this.input;
        let ip;
        if (!this.eocdrOffset) {
            this.searchEndOfCentralDirectoryRecord();
        }
        ip = this.eocdrOffset;
        // signature
        if (input[ip++] !== Unzip.CentralDirectorySignature[0] ||
            input[ip++] !== Unzip.CentralDirectorySignature[1] ||
            input[ip++] !== Unzip.CentralDirectorySignature[2] ||
            input[ip++] !== Unzip.CentralDirectorySignature[3]) {
            throw new Error('invalid signature');
        }
        // number of this disk
        this.numberOfThisDisk = input[ip++] | (input[ip++] << 8);
        // number of the disk with the start of the central directory
        this.startDisk = input[ip++] | (input[ip++] << 8);
        // total number of entries in the central directory on this disk
        this.totalEntriesThisDisk = input[ip++] | (input[ip++] << 8);
        // total number of entries in the central directory
        this.totalEntries = input[ip++] | (input[ip++] << 8);
        // size of the central directory
        this.centralDirectorySize = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // offset of start of central directory with respect to the starting disk number
        this.centralDirectoryOffset = ((input[ip++]) | (input[ip++] << 8) |
            (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
        // .ZIP file comment length
        this.commentLength = input[ip++] | (input[ip++] << 8);
        // .ZIP file comment
        this.comment = USE_TYPEDARRAY ?
            input.subarray(ip, ip + this.commentLength) :
            input.slice(ip, ip + this.commentLength);
    }
    parseFileHeader() {
        /** @type {Array.<Zlib.Unzip.FileHeader>} */
        let filelist = [];
        /** @type {Object.<string, number>} */
        let filetable = {};
        /** @type {number} */
        let ip;
        /** @type {Zlib.Unzip.FileHeader} */
        let fileHeader;
        /*: @type {number} */
        let i;
        /*: @type {number} */
        let il;
        if (this.fileHeaderList) {
            return;
        }
        if (this.centralDirectoryOffset === void 0) {
            this.parseEndOfCentralDirectoryRecord();
        }
        ip = this.centralDirectoryOffset;
        for (i = 0, il = this.totalEntries; i < il; ++i) {
            fileHeader = new FileHeader(this.input, ip);
            fileHeader.parse();
            ip += fileHeader.length;
            filelist[i] = fileHeader;
            filetable[fileHeader.filename] = i;
        }
        if (this.centralDirectorySize < ip - this.centralDirectoryOffset) {
            throw new Error('invalid file header size');
        }
        this.fileHeaderList = filelist;
        this.filenameToIndex = filetable;
    }
    getFileData(index, opt_params) {
        opt_params = opt_params || {};
        let input = this.input;
        let fileHeaderList = this.fileHeaderList;
        let localFileHeader;
        let offset;
        let length;
        let buffer;
        let crc32;
        let key;
        let i;
        let il;
        if (!fileHeaderList) {
            this.parseFileHeader();
        }
        if (fileHeaderList[index] === void 0) {
            throw new Error('wrong index');
        }
        offset = fileHeaderList[index].relativeOffset;
        localFileHeader = new LocalFileHeader(this.input, offset);
        localFileHeader.parse();
        offset += localFileHeader.length;
        length = localFileHeader.compressedSize;
        // decryption
        if ((localFileHeader.flags & LocalFileHeader.Flags.ENCRYPT) !== 0) {
            if (!(opt_params['password'] || this.password)) {
                throw new Error('please set password');
            }
            key = this.createDecryptionKey(opt_params['password'] || this.password);
            // encryption header
            for (i = offset, il = offset + 12; i < il; ++i) {
                this.decode(key, input[i]);
            }
            offset += 12;
            length -= 12;
            // decryption
            for (i = offset, il = offset + length; i < il; ++i) {
                input[i] = this.decode(key, input[i]);
            }
        }
        switch (localFileHeader.compression) {
            case Unzip.CompressionMethod.STORE:
                buffer = USE_TYPEDARRAY ?
                    this.input.subarray(offset, offset + length) :
                    this.input.slice(offset, offset + length);
                break;
            case Unzip.CompressionMethod.DEFLATE:
                buffer = new RawInflate(this.input, {
                    'index': offset,
                    'bufferSize': localFileHeader.plainSize
                }).decompress();
                break;
            default:
                throw new Error('unknown compression type');
        }
        if (this.verify) {
            crc32 = CRC32.calc(buffer);
            if (localFileHeader.crc32 !== crc32) {
                throw new Error('wrong crc: file=0x' + localFileHeader.crc32.toString(16) +
                    ', data=0x' + crc32.toString(16));
            }
        }
        return buffer;
    }
    getFilenames() {
        let filenameList = [];
        let i;
        let il;
        let fileHeaderList;
        if (!this.fileHeaderList) {
            this.parseFileHeader();
        }
        fileHeaderList = this.fileHeaderList;
        for (i = 0, il = fileHeaderList.length; i < il; ++i) {
            filenameList[i] = fileHeaderList[i].filename;
        }
        return filenameList;
    }
    decompress(filename, opt_params) {
        /** @type {number} */
        let index;
        if (!this.filenameToIndex) {
            this.parseFileHeader();
        }
        index = this.filenameToIndex[filename];
        if (index === void 0) {
            throw new Error(filename + ' not found');
        }
        return this.getFileData(index, opt_params);
    }
    /**
     * @param {(Array.<number>|Uint8Array)} password
     */
    setPassword(password) {
        this.password = password;
    }
    decode(key, n) {
        n ^= this.getByte(key);
        this.updateKeys(key, n);
        return n;
    }
    ;
}
Unzip.CompressionMethod = Zip.CompressionMethod;
Unzip.FileHeaderSignature = Zip.FileHeaderSignature;
Unzip.LocalFileHeaderSignature = Zip.LocalFileHeaderSignature;
Unzip.CentralDirectorySignature = Zip.CentralDirectorySignature;
/// <reference path="./zip.ts" />
/// <reference path="./unzip.ts" />
/// <reference path="./deflate.ts" />
/// <reference path="./inflate_stream.ts" />
/// <reference path="./inflate.ts" />
class ZlibT {
    static LogTest(msg) {
        console.log(msg);
    }
}
/// <reference path="./adler32.ts" />
/// <reference path="./crc32.ts" />
/// <reference path="./heap.ts" />
/// <reference path="./huffman.ts" />
// PKZIP
/// <reference path="./zip.ts" />
/// <reference path="./unzip.ts" />
/// <reference path="./gzip.ts" />
/// <reference path="./gunzip.ts" />
// RAW
/// <reference path="./rawinflate.ts" />
/// <reference path="./rawinflate_stream.ts" />
/// <reference path="./rawdeflate.ts" />
// Zlib
/// <reference path="./inflate_stream.ts" />
/// <reference path="./inflate.ts" />
/// <reference path="./deflate.ts" />
/// <reference path="./define/compress.ts" />
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />
class WeaponSystem extends Part {
    constructor(js) {
        super();
    }
    toJSON() {
        return {};
    }
    fromJSON(js) {
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        return stats;
    }
}
