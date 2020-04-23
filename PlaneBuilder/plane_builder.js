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
            var opt = {
                name: elem["name"], value: elem["liftbleed"],
                maxbomb: elem["maxbomb"], cant_lift: elem["cant_lift"]
            };
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
    serialize(s) {
        s.PushNum(this.selected);
    }
    deserialize(d) {
        this.selected = d.GetNum();
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
    GetMaxBomb() {
        return this.vals[this.selected].maxbomb;
    }
    GetCantLift() {
        return this.vals[this.selected].cant_lift;
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
        this.is_primary = false;
    }
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades,
            safety: this.selected_safety,
            sights: this.selected_gunsights,
        };
    }
    fromJSON(js) {
        this.selected_type = js["type"];
        this.selected_upgrades = js["upgrades"];
        this.selected_safety = js["safety"];
        this.selected_gunsights = js["sights"];
    }
    serialize(s) {
        s.PushNum(this.selected_type);
        s.PushBoolArr(this.selected_upgrades);
        s.PushBoolArr(this.selected_safety);
        s.PushBoolArr(this.selected_gunsights);
    }
    deserialize(d) {
        this.selected_type = d.GetNum();
        this.selected_upgrades = d.GetBoolArr();
        this.selected_safety = d.GetBoolArr();
        this.selected_gunsights = d.GetBoolArr();
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
    GetAttack() {
        var mx = 0;
        for (let i = 0; i < this.gunsights.length; i++) {
            if (this.selected_gunsights[i]) {
                mx = Math.max(mx, this.gunsights[i].attack);
            }
        }
        return mx;
    }
    SetPrimary() {
        this.is_primary = true;
    }
    CanUpgrades() {
        var can = [...Array(this.upgrades.length).fill(true)];
        if (this.is_primary) {
            can[0] = false;
        }
        return can;
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
    fromJSON(js) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            if (this.positions.length == 0)
                cp.SetPrimary();
            cp.fromJSON(elem);
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
            if (this.positions.length == 0)
                cp.SetPrimary();
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
    SetNumberOfCockpits(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            if (this.positions.length == 0)
                cp.SetPrimary();
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
    serialize(s) {
        this.etype_stats.serialize(s);
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
    }
    deserialize(d) {
        this.etype_stats.deserialize(d);
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
        if (stats.oiltank) {
            stats.stats.cooling = 0;
        }
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
    GetListOfEngines() {
        return this.engine_list;
    }
    RequiresExtendedDriveshafts() {
        return this.mount_list[this.selected_mount].reqED;
    }
    SetTailMods(forb, swr) {
        if (this.mount_list[this.selected_mount].reqTail && !(forb || swr))
            this.use_ds = true;
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
        if (use)
            this.cooling_count *= 2;
        else
            this.cooling_count /= 2;
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
            this.total_reliability -= (this.GetMaxCooling() - this.cooling_count);
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
            else if (this.NeedCooling()) { //Means liquid
                lst.push(c.liquid);
            }
            else if (this.etype_stats.oiltank) { //Means rotary
                lst.push(c.rotary || c.air);
            }
            else { //Means air cooled
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
    GetTractor() {
        return {
            has: this.mount_list[this.selected_mount].name == "Tractor"
                || this.mount_list[this.selected_mount].name == "Center-Mounted Tractor",
            spinner: this.GetSpinner()
        };
    }
    GetPusher() {
        return {
            has: this.mount_list[this.selected_mount].name == "Rear-Mounted Pusher"
                || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher",
            spinner: this.GetSpinner()
        };
    }
    GetSpinner() {
        if (this.gp_count > 0) {
            if (this.use_ds &&
                (this.mount_list[this.selected_mount].name == "Center-Mounted Tractor"
                    || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher")) { //Uses Extended Driveshafts, can be arty, and rotary engine
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
        return this.has_alternator || this.is_generator;
    }
    GetEngineHeight() {
        if (this.mount_list[this.selected_mount].name == "Pod" || this.etype_stats.pulsejet)
            return 2;
        else if (this.mount_list[this.selected_mount].name == "Nacelle (Offset)")
            return 1;
        else if (this.mount_list[this.selected_mount].name == "Nacelle (Inside)"
            || this.mount_list[this.selected_mount].name == "Channel Tractor")
            return 0;
        return -1;
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
        stats.mass += Math.floor(stats.drag * this.cowl_list[this.cowl_sel].mpd);
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
            stats.mass += 1;
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
            let eng = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
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
        var js = null;
        if (this.engines.length > 0) {
            js = JSON.parse(JSON.stringify(this.engines[this.engines.length - 1].toJSON()));
        }
        while (this.engines.length < num) {
            let en = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
            en.SetCalculateStats(this.CalculateStats);
            if (js)
                en.fromJSON(js);
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
    GetTractor() {
        var ret = { have: false, spin_count: 0, arty_spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetTractor();
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
    GetPusher() {
        var ret = { have: false, spin_count: 0, arty_spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetPusher();
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
    SetTailMods(forb, swr) {
        for (let e of this.engines)
            e.SetTailMods(forb, swr);
    }
    GetEngineHeight() {
        var min = 2;
        for (let e of this.engines)
            min = Math.min(min, e.GetEngineHeight());
        return min;
    }
    PartStats() {
        var stats = new Stats;
        var needCool = [...Array(this.GetNumberOfRadiators()).fill({ cool: 0, count: 0 })];
        //Engine stuff
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling()) {
                needCool[en.GetRadiator()].cool += en.GetCooling();
                needCool[en.GetRadiator()].count += 1;
            }
        }
        stats.flightstress += this.GetMaxRumble();
        //Upkeep calc only uses engine costs
        stats.upkeep = Math.floor(Math.min(stats.power / 10, stats.cost));
        //Include radiaators
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i].cool, needCool[i].count);
            stats = stats.Add(rad.PartStats());
        }
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
        var is_pulsejet = false;
        for (let en of this.engines) {
            if (en.GetIsPulsejet())
                is_pulsejet = true;
        }
        if (is_pulsejet) {
            stats.warnings.push({ source: "Pulsejets", warning: "Pulsejets double Boost when above dropoff speed." });
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
        this.idx_prop = 2;
        this.use_variable = false;
        this.have_propellers = true;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({
                name: elem["name"], stats: new Stats(elem),
                automatic: elem["automatic"],
                energy: elem["energy"], turn: elem["turn"],
            });
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
    serialize(s) {
        s.PushNum(this.idx_prop);
        s.PushBool(this.use_variable);
    }
    deserialize(d) {
        this.idx_prop = d.GetNum();
        this.use_variable = d.GetBool();
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
    GetEnergy() {
        if (this.have_propellers)
            return this.prop_list[this.idx_prop].energy;
        else
            return 5;
    }
    GetTurn() {
        if (this.have_propellers)
            return this.prop_list[this.idx_prop].turn;
        else
            return 7;
    }
    PartStats() {
        var stats = new Stats();
        if (this.have_propellers) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats);
            if (this.use_variable) {
                stats.cost += 2;
                stats.warnings.push({
                    source: "Manually Variable Propeller",
                    "warning": "Allows blade pitch to be adjusted on the ground without replacing it."
                });
            }
        }
        else {
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
    serialize(s) {
        s.PushNum(this.section_list.length);
        for (let i = 0; i < this.section_list.length; i++) {
            var sec = this.section_list[i];
            s.PushNum(sec.frame);
            s.PushNum(sec.skin);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.tail_section_list.length);
        for (let i = 0; i < this.tail_section_list.length; i++) {
            var sec = this.tail_section_list[i];
            s.PushNum(sec.frame);
            s.PushNum(sec.skin);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.sel_tail);
        s.PushBool(this.farman);
        s.PushBool(this.boom);
        s.PushBool(this.flying_wing);
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
            sec.skin = d.GetNum();
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
            sec.skin = d.GetNum();
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
            && this.PossibleInternalBracing(true)
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
    PossibleInternalBracing(convert = false) {
        if (convert)
            return this.CountInternalBracing() + 1 <= this.CountSections() + this.tail_section_list.length - 1;
        else
            return this.CountInternalBracing() + 1 <= this.CountSections() + this.tail_section_list.length;
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
        for (let s of this.section_list) {
            if (!s.internal_bracing) {
                s.skin = num;
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        for (let s of this.tail_section_list) {
            if (!s.internal_bracing) {
                s.skin = num;
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        this.CalculateStats();
    }
    GetArmor() {
        var count = 0;
        for (let s of this.section_list) {
            if (this.skin_list[s.skin].name == "Dragon Skin")
                count++;
        }
        for (let s of this.tail_section_list) {
            if (this.skin_list[s.skin].name == "Dragon Skin")
                count++;
        }
        return count;
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
            stats.drag -= this.CountLiftingBody();
            ;
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
        stats.Round();
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
                dragfactor: elem["dragfactor"], metal: elem["metal"]
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
    serialize(s) {
        s.PushNum(this.wing_list.length);
        for (let i = 0; i < this.wing_list.length; i++) {
            var w = this.wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
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
            let wing = { surface: 0, area: 0, span: 0, dihedral: 0, anhedral: 0, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            wing.dihedral = d.GetNum();
            wing.anhedral = d.GetNum();
            wing.deck = d.GetNum();
            this.wing_list.push(wing);
        }
        var mlen = d.GetNum();
        this.mini_wing_list = [];
        for (let i = 0; i < mlen; i++) {
            let wing = { surface: 0, area: 0, span: 0, dihedral: 0, anhedral: 0, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            wing.dihedral = d.GetNum();
            wing.anhedral = d.GetNum();
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
        return this.wing_stagger;
    }
    CanAddFullWing(deck) {
        if (deck >= this.deck_list.length)
            console.log("Deck out of Bounds");
        if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
            return false;
        var full_count = this.DeckCountFull();
        if (!this.stagger_list[this.wing_stagger].inline && full_count[deck] == 1 && this.deck_list[deck].limited)
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
    GetWingHeight() {
        var max = 0;
        for (let w of this.wing_list)
            max = Math.max(max, 4 - w.deck);
        return max;
    }
    CanClosed() {
        return this.wing_list.length > 1 && !this.stagger_list[this.wing_stagger].inline;
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
        return this.stagger_list[this.wing_stagger].inline;
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
    GetParasol() {
        for (let w of this.wing_list) {
            if (w.deck == 0) {
                return true;
            }
        }
        for (let w of this.mini_wing_list) {
            if (w.deck == 0) {
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
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            var wdrag = Math.max(1, 6 * w.area * w.area / (wspan * wspan));
            drag += Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;
            //Drag is modified by area, span
            var wdrag = Math.max(1, 6 * w.area * w.area / (wspan * wspan));
            drag += Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
        }
        return drag;
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
            //Actual stats
            wStats = wStats.Add(this.skin_list[w.surface].stats.Multiply(w.area));
            wStats.wingarea = w.area;
            //Wings cannot generate positive max strain
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + 6 * w.area * w.area / (w.span * w.span));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            //Inline wings
            if (deck_count[w.deck] > 1) {
                wStats.drag = Math.floor(0.75 * wStats.drag);
            }
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
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span
            wStats.drag = Math.max(1, wStats.drag + 6 * w.area * w.area / (w.span * w.span));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        //Deck Stats
        for (let i = 0; i < this.deck_list.length; i++) {
            if (deck_count[i] > 0)
                stats = stats.Add(this.deck_list[i].stats);
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
        for (let t of this.hstab_list) {
            if ((t.name == "The Wings" || t.name == "Outboard")
                && !(this.is_tandem || this.is_swept))
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
        for (let t of this.vstab_list) {
            if (t.name == "Outboard" && !this.CanVOutboard())
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
    CanVOutboard() {
        return this.is_swept || this.is_tandem || this.hstab_list[this.hstab_sel].is_canard;
    }
    GetVOutboard() {
        return this.vstab_list[this.vstab_sel].name == "Outboard";
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
            stats.drag += Math.floor(this.wing_drag / 4 * this.hstab_list[this.hstab_sel].dragfactor);
        }
        else if (this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(this.wing_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            stats.drag += Math.floor(this.wing_drag / 8 * this.vstab_list[this.vstab_sel].dragfactor);
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
        this.drag_sel = d.GetBoolArr();
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
        this.ext_wood_list = [];
        for (let elem of js["external_wood"]) {
            this.ext_wood_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], stats: new Stats(elem) });
        }
        this.ext_wood_count = [...Array(this.ext_wood_list.length).fill(0)];
        this.ext_steel_list = [];
        for (let elem of js["external_steel"]) {
            this.ext_steel_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], stats: new Stats(elem) });
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
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.acft_structure = 0;
        this.cant_lift = false;
    }
    toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
            cabane_sel: this.cabane_sel,
        };
    }
    fromJSON(js) {
        this.ext_wood_count = js["ext_wood_count"];
        this.ext_steel_count = js["ext_steel_count"];
        this.cant_count = js["cant_count"];
        this.wires = js["wires"];
        this.cabane_sel = js["cabane_sel"];
    }
    serialize(s) {
        s.PushNumArr(this.ext_wood_count);
        s.PushNumArr(this.ext_steel_count);
        s.PushNumArr(this.cant_count);
        s.PushBool(this.wires);
        s.PushNum(this.cabane_sel);
    }
    deserialize(d) {
        this.ext_wood_count = d.GetNumArr();
        this.ext_steel_count = d.GetNumArr();
        this.cant_count = d.GetNumArr();
        this.wires = d.GetBool();
        this.cabane_sel = d.GetNum();
    }
    GetExternalList() {
        return this.ext_wood_list;
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
        var struct_count = this.ext_cabane_list[this.cabane_sel].stats.structure;
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_wood_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * this.ext_steel_list[i].stats.structure;
        }
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
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            if (this.ext_wood_count[i] > 0) {
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
                let ts = this.ext_steel_list[i].stats.Clone();
                ts = ts.Multiply(this.ext_steel_count[i]);
                stats = stats.Add(ts);
                if (this.ext_steel_list[i].config)
                    tension += tension_multiple * this.ext_steel_list[i].tension * this.ext_steel_count[i];
                else
                    tension += this.ext_steel_list[i].tension * this.ext_steel_count[i];
            }
        }
        //Cabane Strut
        let ts = this.ext_cabane_list[this.cabane_sel].stats.Clone();
        stats = stats.Add(ts);
        tension += tension_multiple * this.ext_cabane_list[this.cabane_sel].tension;
        if (this.cabane_sel > 0)
            strut_count += 1;
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
        if (use_cant && this.cant_lift)
            stats.liftbleed -= 4;
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
    serialize(s) {
        s.PushNumArr(this.tank_count);
        s.PushBool(this.self_sealing);
        s.PushBool(this.fire_extinguisher);
    }
    deserialize(d) {
        this.tank_count = d.GetNumArr();
        this.self_sealing = d.GetBool();
        this.fire_extinguisher = d.GetBool();
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
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
    }
    serialize(s) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
    }
    deserialize(d) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
    }
    GetBombCount() {
        return this.bomb_count;
    }
    GetMaxBombSize() {
        var sz = 0;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                if (this.internal_bay_2) {
                    sz = Math.floor(10 * this.internal_bay_count);
                }
                else {
                    sz = Math.floor(10 * this.internal_bay_count / 2);
                }
            }
            else {
                sz = Math.floor(10 * this.internal_bay_count / 4);
            }
        }
        return sz;
    }
    SetBombCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.bomb_count = count;
        this.LimitMass(true);
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
        count = Math.floor(count);
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
    LimitMass(bomb) {
        var reduce = false;
        while (this.bomb_count > this.acft_struct * this.maxbomb) {
            reduce = true;
            this.bomb_count--;
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
        var ext_mass = ext_bomb_count;
        return ext_mass;
    }
    SetAcftStructure(num, maxbomb) {
        this.acft_struct = num;
        this.maxbomb = maxbomb;
        if (this.LimitMass(false)) {
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var ext_bomb_count = this.bomb_count - 10 * this.internal_bay_count;
        ext_bomb_count = Math.max(0, ext_bomb_count);
        stats.reqsections += this.internal_bay_count;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                stats.reqsections++;
                if (this.internal_bay_2) {
                    stats.reqsections++;
                }
            }
        }
        var rack_mass = Math.ceil(ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.bomb_mass = this.bomb_count;
        stats.reqsections = Math.ceil(stats.reqsections);
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
    fromJSON(js) {
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
        stats.wetmass += stats.reqsections * 3;
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
    serialize(s) {
        s.PushNum(this.gear_sel);
        s.PushBool(this.retract);
        s.PushBoolArr(this.extra_sel);
    }
    deserialize(d) {
        this.gear_sel = d.GetNum();
        this.retract = d.GetBool();
        this.extra_sel = d.GetBoolArr();
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        if (!this.CanGear()[this.gear_sel])
            this.gear_sel = 0;
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
        this.armour_coverage = [...Array(8).fill(0)];
        this.acft_power = 0;
        this.acft_rad = false;
        this.skin_armour = 0;
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
            v: 2,
            armour_coverage: this.armour_coverage,
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
        if (js["v"] == 2) {
            this.armour_coverage = js["armour_coverage"];
        }
        this.electrical_count = js["electrical_count"];
        this.radio_sel = js["radio_sel"];
        this.info_sel = js["info_sel"];
        this.visi_sel = js["visi_sel"];
        this.clim_sel = js["clim_sel"];
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }
    serialize(s) {
        s.PushNumArr(this.armour_coverage);
        s.PushNumArr(this.electrical_count);
        s.PushNum(this.radio_sel);
        s.PushBoolArr(this.info_sel);
        s.PushBoolArr(this.visi_sel);
        s.PushBoolArr(this.clim_sel);
        s.PushNum(this.auto_sel);
        s.PushNum(this.cont_sel);
    }
    deserialize(d) {
        this.armour_coverage = d.GetNumArr();
        this.electrical_count = d.GetNumArr();
        this.radio_sel = d.GetNum();
        this.info_sel = d.GetBoolArr();
        this.visi_sel = d.GetBoolArr();
        this.clim_sel = d.GetBoolArr();
        this.auto_sel = d.GetNum();
        this.cont_sel = d.GetNum();
    }
    GetCommunicationName() {
        return this.radio_list[this.radio_sel].name;
    }
    GetArmourCoverage() {
        return this.armour_coverage;
    }
    SetArmourCoverage(idx, num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.armour_coverage[idx] = num;
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
    IsElectrics() {
        for (let e of this.electrical_count) {
            if (e > 0)
                return true;
        }
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        this.armour_coverage[1] = Math.max(this.armour_coverage[1], this.skin_armour);
        //Armour
        for (let i = 0; i < this.armour_coverage.length; i++) {
            let AP = i + 1;
            var count = this.armour_coverage[i];
            if (AP == 2) {
                count -= this.skin_armour;
            }
            stats.mass += count * AP;
            stats.cost += Math.floor(count * AP / 3);
            stats.toughness += this.armour_coverage[i] * AP;
        }
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
        stats.cost = Math.floor(-(this.cost * 2 * this.acft_stats.cost / 10));
        stats.liftbleed = Math.floor(-this.bleed * 3);
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = Math.floor(-(this.mass * this.acft_stats.mass / 10));
        stats.toughness = Math.floor(this.toughness * this.acft_stats.toughness / 4);
        stats.maxstrain = Math.floor(this.maxstrain * 1.5 * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = Math.floor(-(this.drag * this.acft_stats.drag / 10));
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
    SynchronizationType[SynchronizationType["ENUM_MAX"] = 4] = "ENUM_MAX";
})(SynchronizationType || (SynchronizationType = {}));
class Weapon extends Part {
    constructor(weapon_type, fixed = false) {
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
        this.pair = false;
        this.repeating = false;
    }
    toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            pair: this.pair,
            repeating: this.repeating,
        };
    }
    fromJSON(js) {
        this.fixed = js["fixed"];
        this.wing = js["wing"];
        this.covered = js["covered"];
        this.accessible = js["accessible"];
        this.free_accessible = js["free_accessible"];
        this.synchronization = js["synchronization"];
        this.pair = js["pair"];
        this.repeating = js["repeating"];
    }
    serialize(s) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushBool(this.pair);
        s.PushBool(this.repeating);
    }
    deserialize(d) {
        this.fixed = d.GetBool();
        this.wing = d.GetBool();
        this.covered = d.GetBool();
        this.accessible = d.GetBool();
        this.free_accessible = d.GetBool();
        this.synchronization = d.GetNum();
        this.pair = d.GetBool();
        this.repeating = d.GetBool();
    }
    SetWeaponType(weapon_type) {
        this.weapon_type = weapon_type;
        if (this.weapon_type.size == 16) {
            this.pair = false;
        }
        this.SetPair(this.pair); //Triggers Calculate Stats
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
        return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
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
        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        }
        else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }
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
            this.pair = false;
        this.CalculateStats();
    }
    CanPair() {
        return this.weapon_type.size <= 8 && this.synchronization != SynchronizationType.SPINNER;
    }
    GetPair() {
        return this.pair;
    }
    SetPair(use) {
        if (this.wing && !this.fixed && this.weapon_type.size == 8)
            use = false;
        this.pair = use;
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
        else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.pair = false;
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
            return out;
        }
        else {
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                return parseInt(this.weapon_type.jam) + 1;
            }
            return parseInt(this.weapon_type.jam);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        this.ResolveSynch();
        if (!this.CanCovered() && this.covered)
            this.covered = false;
        if (this.weapon_type.size == 16 && this.fixed)
            this.covered = true;
        stats = stats.Add(this.weapon_type.stats);
        if (this.pair)
            stats = stats.Add(this.weapon_type.stats);
        var size = this.weapon_type.size;
        if (this.pair)
            size *= 2;
        //Covered Cost
        if (this.covered) {
            var cost = 0;
            if (size == 1) {
                cost = 0;
            }
            else if (size == 2) {
                cost = 1;
            }
            else if (size == 4) {
                cost = 2;
            }
            else if (size == 8) {
                cost == 5;
            }
            else if (size == 16) {
                cost = 0;
            }
            if (!this.fixed)
                cost *= 2;
            stats.cost += cost;
            stats.drag *= 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing && !this.covered)
            stats.drag += 1;
        //Arty size weapon mounts need a section
        if (this.pair && this.weapon_type.size == 8 || this.weapon_type.size == 16)
            stats.reqsections += 1;
        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(stats.cost / 2));
        }
        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            }
            else if (size == 4) {
                stats.cost += 1;
            }
            else if (size == 8) {
                stats.mass += 1;
                stats.cost += 3;
            }
            else if (size == 16) {
                stats.mass += 2;
                stats.cost += 5;
            }
            else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }
        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += 2;
            if (this.pair)
                stats.cost += 2;
        }
        else if (this.synchronization == SynchronizationType.SYNCH) {
            stats.cost += 3;
            if (this.pair)
                stats.cost += 3;
            //synchronization == 2 is spinner and costs nothing.
        }
        else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: this.weapon_type.name,
                warning: "Deflector Plates inflict 1 Wear every time you roll a natural 5 or less."
            });
        }
        //If it's repeating
        if (this.repeating)
            stats.cost += 2;
        if (this.wing_reinforcement)
            stats.mass += 2;
        stats.Round();
        return stats;
    }
}
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />
class Weapons extends Part {
    constructor(js) {
        super();
        this.direction_list = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
        this.synchronization_list = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate"];
        this.weapon_list = [];
        for (let elem of js["weapons"]) {
            var weap = {
                name: elem["name"],
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
            };
            this.weapon_list.push(weap);
        }
        this.weapon_sets = [];
    }
    toJSON() {
        var lst = [];
        for (let ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            state: "BETA3",
            weapon_systems: lst,
        };
    }
    fromJSON(js) {
        if (js && js["state"] == "BETA3") {
            this.weapon_sets = [];
            var lst = js["weapon_systems"];
            for (let wsj of lst) {
                var ws = new WeaponSystem(this.weapon_list);
                ws.SetCalculateStats(this.CalculateStats);
                ws.fromJSON(wsj);
                this.weapon_sets.push(ws);
            }
        }
        else {
            this.SetWeaponSetCount(0);
        }
    }
    serialize(s) {
        s.PushNum(this.weapon_sets.length);
        for (let ws of this.weapon_sets) {
            ws.serialize(s);
        }
    }
    deserialize(d) {
        this.weapon_sets = [];
        var wlen = d.GetNum();
        for (let i = 0; i < wlen; i++) {
            var ws = new WeaponSystem(this.weapon_list);
            ws.SetCalculateStats(this.CalculateStats);
            ws.deserialize(d);
            this.weapon_sets.push(ws);
        }
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
        num = Math.floor(num);
        while (num > this.weapon_sets.length) {
            var w = new WeaponSystem(this.weapon_list);
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
    CountFreelyAccessible() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            var wlist = ws.GetWeapons();
            for (let w of wlist) {
                if (w.GetFreeAccessible())
                    count++;
            }
        }
        return count;
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
    RemoveOneFreelyAccessible() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            var wlist = this.weapon_sets[i].GetWeapons();
            for (let j = wlist.length - 1; j >= 0; j--) {
                if (wlist[j].GetFreeAccessible()) {
                    wlist[j].SetFreeAccessible(false);
                    return;
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (let set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }
    PartStats() {
        var stats = new Stats();
        //Update Freely Accessible state.
        while (this.CountFreelyAccessible() > this.cockpit_count) {
            this.RemoveOneFreelyAccessible();
        }
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
                var s = { s: 0, w: w };
                if (w.GetWing()) {
                    if (w.GetPair())
                        s.s = (2 * this.weapon_list[ws.GetWeaponSelected()].size);
                    else
                        s.s = (this.weapon_list[ws.GetWeaponSelected()].size);
                    slist.push(s);
                }
            }
        }
        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.s - b.s; });
        for (let s of slist) {
            wing_size -= s.s;
            if (wing_size < 0)
                s.w.wing_reinforcement = true;
        }
        for (let ws of this.weapon_sets) {
            ws.SetCanFreelyAccessible(this.CountFreelyAccessible() < this.cockpit_count);
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.CanArtyTractorSpinner(), this.has_pusher, this.CanPusherSpinner(), this.CanArtyPusherSpinner());
            ws.has_cantilever = this.cant_type > 0;
            stats = stats.Add(ws.PartStats());
        }
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
    constructor(js, engine_json, weapon_json, storage) {
        this.use_storage = false;
        this.reset_json = String.raw `{"version":"10.0","name":"Beginner","era":{"selected":0},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false],"sights":[false,false,false,false]}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Hornet R - 3 Boxer 6 - Cylinder","overspeed":26,"altitude":3,"torque":0,"rumble":0,"oiltank":false,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":6,"drag":4,"control":0,"cost":6,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":8,"reliability":-1,"power":15,"fuelconsumption":14,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"cooling_count":8,"radiator_index":0,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":0,"is_generator":false,"has_alternator":false}],"radiators":[{"type":0,"mount":0,"coolant":0}],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false},"wings":{"wing_list":[{"surface":0,"area":5,"span":10,"dihedral":0,"anhedral":0,"deck":0},{"surface":0,"area":5,"span":10,"dihedral":0,"anhedral":0,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[3,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":0},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false},"munitions":{"bomb_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"state":"BETA3","weapon_systems":[]}}`;
        this.use_large_airplane_rules = false;
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
        this.cargo = new CargoAndPassengers(js["cargo"]);
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);
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
        this.alter.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
        this.Reset();
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
    fromJSON(js, disp = true) {
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
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
    }
    deserialize(d) {
        this.version = d.GetString();
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
        this.engines.SetTailMods(this.frames.GetFarmanOrBoom(), this.wings.GetSwept() && this.stabilizers.GetVOutboard());
        this.engines.SetMetalArea(this.wings.GetMetalArea());
        this.engines.HaveParasol(this.wings.GetParasol());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.propeller.PartStats());
        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        //Weapons go here, because they make sections.
        this.weapons.cockpit_count = this.cockpits.GetNumberOfCockpits();
        this.weapons.SetTractorInfo(this.engines.GetTractor());
        this.weapons.SetPusherInfo(this.engines.GetPusher());
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.wings.GetTandem());
        stats = stats.Add(this.frames.PartStats());
        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetWingArea(stats.wingarea);
        this.stabilizers.wing_drag = this.wings.GetWingDrag();
        stats = stats.Add(this.stabilizers.PartStats());
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        stats = stats.Add(this.reinforcements.PartStats());
        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        stats = stats.Add(this.accessories.PartStats());
        //Gear go last, because they need total mass.
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());
        stats.toughness += Math.floor(Math.max(0, (stats.structure - stats.maxstrain) / 2) + stats.maxstrain / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        stats = stats.Add(this.alter.PartStats());
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
            this.munitions.SetAcftStructure(stats.structure, this.era.GetMaxBomb());
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
        var span = Math.max(1, this.wings.GetSpan());
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
        if (this.use_large_airplane_rules) {
            StallSpeedEmpty = Math.floor(Math.sqrt(this.stats.liftbleed * 5 * DryMP / Math.max(1, this.stats.wingarea)));
            StallSpeedFull = Math.floor(Math.sqrt(this.stats.liftbleed * 5 * WetMP / Math.max(1, this.stats.wingarea)));
            StallSpeedFullwBombs = Math.floor(Math.sqrt(this.stats.liftbleed * 5 * WetMPwBombs / Math.max(1, this.stats.wingarea)));
        }
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
        var EnergyLoss = Math.ceil(DPEmpty / this.propeller.GetEnergy());
        var EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        var TurnBleed = Math.ceil((StallSpeedEmpty + StallSpeedFull) / this.propeller.GetTurn());
        var TurnBleedwBombs = TurnBleed + 1;
        TurnBleed = Math.max(TurnBleed, 1);
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);
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
    IsElectrics() {
        return this.engines.IsElectrics() || this.accessories.IsElectrics();
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
        var upglst = cp.GetUpgradeList();
        var can = cp.CanUpgrades();
        for (let i = 0; i < upglst.length; i++) {
            if (can[i]) {
                let elem = upglst[i];
                let upg = document.createElement("INPUT");
                FlexCheckbox(elem.name, upg, fs);
                let local_index = upg_index;
                upg_index += 1;
                upg.onchange = () => { this.cockpit.SetUpgrade(local_index, upg.checked); };
                this.upg_chbxs.push(upg);
            }
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
            this.cool_count.max = this.engine.GetMaxCooling().toString();
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
        this.metal_area = 0;
        this.engine_count = 0;
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
    serialize(s) {
        s.PushNum(this.idx_type);
        s.PushNum(this.idx_mount);
        s.PushNum(this.idx_coolant);
    }
    derserialize(d) {
        this.idx_type = d.GetNum();
        this.idx_mount = d.GetNum();
        this.idx_coolant = d.GetNum();
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
        this.is_asymmetric.onchange = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
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
        this.all_frame = document.getElementById("all_frame");
        this.all_skin = document.getElementById("all_skin");
        var spar_list = this.frames.GetFrameList();
        for (let spar of spar_list) {
            if (spar.basestruct > 0) {
                let opt = document.createElement("OPTION");
                opt.text = spar.name;
                this.all_frame.add(opt);
            }
        }
        this.all_frame.oninput = () => { this.frames.SetAllFrame(this.all_frame.selectedIndex); };
        var skin_list = this.frames.GetSkinList();
        for (let skin of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = skin.name;
            this.all_skin.add(opt);
        }
        this.all_skin.oninput = () => { this.frames.SetAllSkin(this.all_skin.selectedIndex); };
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
        this.all_frame.selectedIndex = -1;
        this.all_skin.selectedIndex = -1;
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
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing(true) || !this.frames.PossibleRemoveSections()))
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
        ht.deck.onchange = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.onchange = () => {
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
        ht.deck.onchange = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.onchange = () => {
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
        this.fw_add.onchange = () => {
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
        this.mw_add.onchange = () => {
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
        var fsr = CreateFlexSection(fs.div2);
        var fs_wood = CreateFlexSection(fsr.div1);
        var fs_steel = CreateFlexSection(fsr.div2);
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
        this.cabane = document.createElement("SELECT");
        FlexSelect("Cabane", this.cabane, fs);
        for (let o of this.rf.GetCabaneList()) {
            let opt = document.createElement("OPTION");
            opt.text = o.name;
            this.cabane.add(opt);
        }
        this.cabane.onchange = () => { this.rf.SetCabane(this.cabane.selectedIndex); };
        this.cabane.selectedIndex = 0;
        this.wires = document.createElement("INPUT");
        FlexCheckbox("Wires", this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
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
        this.cabane.selectedIndex = this.rf.GetCabane();
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
        FlexInput("Bombs and Rockets", this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.bay_count = document.createElement("INPUT");
        FlexInput("Internal Bay Count", this.bay_count, fs);
        this.bay_count.onchange = () => { this.boom.SetBayCount(this.bay_count.valueAsNumber); };
        this.bay1 = document.createElement("INPUT");
        FlexCheckbox("Widen Internal Bay 1", this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
        this.bay2 = document.createElement("INPUT");
        FlexCheckbox("Widen Internal Bay 2", this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }
    InitCargoAndPassengers(cell) {
        var fs = CreateFlexSection(cell);
        this.carg = document.createElement("SELECT");
        FlexSelect("Cargo", this.carg, fs);
        var lst = this.cargo.GetSpaceList();
        for (let l of lst) {
            let opt = document.createElement("OPTION");
            opt.text = l.name;
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
        this.InitClimate(row.insertCell());
        this.InitVisibility(row.insertCell());
        this.InitStats(row.insertCell());
        row = tbl.insertRow();
        this.InitInformation(row.insertCell());
        this.InitElectrical(row.insertCell());
        this.InitControl(row.insertCell());
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
            FlexInput("AP " + AP.toString(), this.a_AP[i], lfs);
            this.a_AP[i].onchange = () => { this.acc.SetArmourCoverage(i, this.a_AP[i].valueAsNumber); };
            let j = i + len / 2;
            AP = j + 1;
            FlexInput("AP " + AP.toString(), this.a_AP[j], rfs);
            this.a_AP[j].onchange = () => { this.acc.SetArmourCoverage(j, this.a_AP[j].valueAsNumber); };
        }
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
        var AP = this.acc.GetArmourCoverage();
        for (let i = 0; i < AP.length; i++) {
            this.a_AP[i].valueAsNumber = AP[i];
        }
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
        this.cost_cbx = this.InitRow(row1, "Expense: +/- 20% Cost", (num) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(tbl.insertRow(), "Lift Efficienty: +/- 3 Lift Bleed", (num) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(tbl.insertRow(), "Leg Room: +/- 1 Escape, Visibility", (num) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(tbl.insertRow(), "Mass: +/- 10% Mass", (num) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(tbl.insertRow(), "Redundancy: +/- 25% Toughness ", (num) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(tbl.insertRow(), "Support: +/- 15% Max Strain", (num) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(tbl.insertRow(), "Reliability: +/- 2 Reliability", (num) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(tbl.insertRow(), "Streamlining: +/- 10% Drag", (num) => this.opt.SetDrag(num));
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
        this.inp_w_count = document.getElementById("num_wsets");
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };
        this.tbl = document.getElementById("table_weapons");
        this.wrow = [];
    }
    CreateWSetRow() {
        var row = this.tbl.insertRow(this.wrow.length + 1);
        var setcell = row.insertCell();
        var fs = CreateFlexSection(setcell);
        var type = {
            type: document.createElement("SELECT"),
            dirs: [],
            count: document.createElement("INPUT"),
            fixed: document.createElement("INPUT"),
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT"),
            stats: { mass: null, drag: null, cost: null, sect: null, hits: null, damg: null },
        };
        var wlist = this.weap.GetWeaponList();
        for (let w of wlist) {
            let opt = document.createElement("OPTION");
            opt.text = w.name + " (" + w.era + ")";
            type.type.add(opt);
        }
        type.type.required = true;
        FlexSelect("Type", type.type, fs);
        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        FlexInput("Number", type.count, lfs);
        FlexInput("Ammunition", type.ammo, rfs);
        FlexCheckbox("Fixed", type.fixed, lfs);
        FlexSpace(rfs);
        var dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            var dl = dirlist[i];
            var cbx = document.createElement("INPUT");
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            var dr = dirlist[i + 1];
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
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        var h2_row = stable.insertRow();
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Hits");
        CreateTH(h2_row, "Damage");
        var c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.hits = c2_row.insertCell();
        type.stats.damg = c2_row.insertCell();
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
            pair: document.createElement("INPUT"),
            repeating: document.createElement("INPUT"),
        };
        CreateCheckbox("Accessible", w.accessible, w.span, false);
        CreateCheckbox("Free Accessible", w.free_access, w.span, false);
        CreateCheckbox("Covered", w.covered, w.span, false);
        CreateCheckbox("Paired", w.pair, w.span, true);
        CreateCheckbox("Wing Mount", w.wing, w.span, false);
        CreateCheckbox("Autoloader", w.repeating, w.span, true);
        CreateSelect("Synchronization", w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));
        var slist = this.weap.GetSynchronizationList();
        for (let s of slist) {
            var opt = document.createElement("OPTION");
            opt.text = s;
            w.synch.add(opt);
        }
        wcell.appendChild(w.span);
        return w;
    }
    UpdateWSet(set, disp) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };
        disp.count.valueAsNumber = set.GetWeaponCount();
        disp.count.onchange = () => { set.SetWeaponCount(disp.count.valueAsNumber); };
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
            disp.weaps[i].pair.checked = wlist[i].GetPair();
            disp.weaps[i].pair.onchange = () => { wlist[i].SetPair(disp.weaps[i].pair.checked); };
            disp.weaps[i].pair.disabled = !wlist[i].CanPair();
            disp.weaps[i].repeating.checked = wlist[i].GetRepeating();
            disp.weaps[i].repeating.onchange = () => { wlist[i].SetRepeating(disp.weaps[i].repeating.checked); };
            disp.weaps[i].repeating.disabled = !wlist[i].CanRepeating();
            disp.weaps[i].synch.selectedIndex = wlist[i].GetSynchronization() + 1;
            disp.weaps[i].synch.onchange = () => { wlist[i].SetSynchronization(disp.weaps[i].synch.selectedIndex - 1); };
            disp.weaps[i].synch.disabled = !wlist[i].can_synchronize;
            var can = wlist[i].CanSynchronization();
            for (let j = 0; j < can.length; j++) {
                disp.weaps[i].synch.options[j].disabled = !can[j];
            }
        }
        var stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString());
        BlinkIfChanged(disp.stats.drag, stats.drag.toString());
        BlinkIfChanged(disp.stats.cost, stats.cost.toString());
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString());
        var h = set.GetHits();
        var hits = h[0].toString() + "\\"
            + h[1].toString() + "\\"
            + h[2].toString() + "\\"
            + h[3].toString();
        BlinkIfChanged(disp.stats.hits, hits);
        BlinkIfChanged(disp.stats.damg, set.GetDamage().toString());
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
        var tbla = document.getElementById("tbl_alter");
        this.InitAlter(tbla);
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
                    var acft = new Aircraft(parts_JSON, engine_json, weapon_json, false);
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
        load_text_area.onchange = () => {
            try {
                var str = JSON.parse(load_text_area.value);
                var acft = new Aircraft(parts_JSON, engine_json, weapon_json, false);
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
        load_text_area2.onchange = () => {
            try {
                var str = JSON.parse(load_text_area2.value);
                var acft = new Aircraft(parts_JSON, engine_json, weapon_json, false);
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
            // var str = JSON.stringify(this.acft.toJSON());
            // var txt = LZString.compressToEncodedURIComponent(str);
            var ser = new Serialize();
            aircraft_model.serialize(ser);
            var arr = ser.FinalArray();
            var str2 = _arrayBufferToString(arr);
            var txt2 = LZString.compressToEncodedURIComponent(str2);
            var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt2);
            copyStringToClipboard(link);
        };
        var reset_button = document.getElementById("acft_reset");
        reset_button.onclick = () => { aircraft_model.Reset(); };
    }
    InitAlter(tbl) {
        var row = tbl.insertRow();
        CreateTH(row, "Lift Bleed");
        CreateTH(row, "Drag");
        CreateTH(row, "Mass");
        CreateTH(row, "Wet Mass");
        CreateTH(row, "Bomb Mass");
        CreateTH(row, "Cost");
        CreateTH(row, "Upkeep");
        row = tbl.insertRow();
        this.a_lift = document.createElement("INPUT");
        this.a_drag = document.createElement("INPUT");
        this.a_mass = document.createElement("INPUT");
        this.a_wmas = document.createElement("INPUT");
        this.a_bmas = document.createElement("INPUT");
        this.a_cost = document.createElement("INPUT");
        this.a_upkp = document.createElement("INPUT");
        row.insertCell().appendChild(this.a_lift);
        row.insertCell().appendChild(this.a_drag);
        row.insertCell().appendChild(this.a_mass);
        row.insertCell().appendChild(this.a_wmas);
        row.insertCell().appendChild(this.a_bmas);
        row.insertCell().appendChild(this.a_cost);
        row.insertCell().appendChild(this.a_upkp);
        this.a_lift.setAttribute("type", "number");
        this.a_drag.setAttribute("type", "number");
        this.a_mass.setAttribute("type", "number");
        this.a_wmas.setAttribute("type", "number");
        this.a_bmas.setAttribute("type", "number");
        this.a_cost.setAttribute("type", "number");
        this.a_upkp.setAttribute("type", "number");
        this.a_lift.valueAsNumber = 0;
        this.a_drag.valueAsNumber = 0;
        this.a_mass.valueAsNumber = 0;
        this.a_wmas.valueAsNumber = 0;
        this.a_bmas.valueAsNumber = 0;
        this.a_cost.valueAsNumber = 0;
        this.a_upkp.valueAsNumber = 0;
        this.a_lift.oninput = () => { aircraft_model.GetAlter().stats.liftbleed = this.a_lift.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_drag.oninput = () => { aircraft_model.GetAlter().stats.drag = this.a_drag.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_mass.oninput = () => { aircraft_model.GetAlter().stats.mass = this.a_mass.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_wmas.oninput = () => { aircraft_model.GetAlter().stats.wetmass = this.a_wmas.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_bmas.oninput = () => { aircraft_model.GetAlter().stats.bomb_mass = this.a_bmas.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_cost.oninput = () => { aircraft_model.GetAlter().stats.cost = this.a_cost.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_upkp.oninput = () => { aircraft_model.GetAlter().stats.upkeep = this.a_upkp.valueAsNumber; aircraft_model.CalculateStats(); };
        row = tbl.insertRow();
        CreateTH(row, "Control");
        CreateTH(row, "Pitch Stability");
        CreateTH(row, "Lateral Stability");
        CreateTH(row, "Wing Area");
        CreateTH(row, "Max Strain");
        CreateTH(row, "Structure");
        CreateTH(row, "Toughness");
        row = tbl.insertRow();
        this.a_cont = document.createElement("INPUT");
        this.a_pstb = document.createElement("INPUT");
        this.a_lstb = document.createElement("INPUT");
        this.a_wara = document.createElement("INPUT");
        this.a_mstr = document.createElement("INPUT");
        this.a_strc = document.createElement("INPUT");
        this.a_tugh = document.createElement("INPUT");
        row.insertCell().appendChild(this.a_cont);
        row.insertCell().appendChild(this.a_pstb);
        row.insertCell().appendChild(this.a_lstb);
        row.insertCell().appendChild(this.a_wara);
        row.insertCell().appendChild(this.a_mstr);
        row.insertCell().appendChild(this.a_strc);
        row.insertCell().appendChild(this.a_tugh);
        this.a_cont.setAttribute("type", "number");
        this.a_pstb.setAttribute("type", "number");
        this.a_lstb.setAttribute("type", "number");
        this.a_wara.setAttribute("type", "number");
        this.a_mstr.setAttribute("type", "number");
        this.a_strc.setAttribute("type", "number");
        this.a_tugh.setAttribute("type", "number");
        this.a_cont.valueAsNumber = 0;
        this.a_pstb.valueAsNumber = 0;
        this.a_lstb.valueAsNumber = 0;
        this.a_wara.valueAsNumber = 0;
        this.a_mstr.valueAsNumber = 0;
        this.a_strc.valueAsNumber = 0;
        this.a_tugh.valueAsNumber = 0;
        this.a_cont.oninput = () => { aircraft_model.GetAlter().stats.control = this.a_cont.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_pstb.oninput = () => { aircraft_model.GetAlter().stats.pitchstab = this.a_pstb.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_lstb.oninput = () => { aircraft_model.GetAlter().stats.latstab = this.a_lstb.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_wara.oninput = () => { aircraft_model.GetAlter().stats.wingarea = this.a_wara.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_mstr.oninput = () => { aircraft_model.GetAlter().stats.maxstrain = this.a_mstr.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_strc.oninput = () => { aircraft_model.GetAlter().stats.structure = this.a_strc.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_tugh.oninput = () => { aircraft_model.GetAlter().stats.toughness = this.a_tugh.valueAsNumber; aircraft_model.CalculateStats(); };
        row = tbl.insertRow();
        CreateTH(row, "Power");
        CreateTH(row, "Fuel Consumption");
        CreateTH(row, "Fuel");
        CreateTH(row, "Pitch Speed");
        CreateTH(row, "Pitch Boost");
        CreateTH(row, "Charge");
        CreateTH(row, "Crash Safety");
        row = tbl.insertRow();
        this.a_powr = document.createElement("INPUT");
        this.a_fcom = document.createElement("INPUT");
        this.a_fuel = document.createElement("INPUT");
        this.a_pspd = document.createElement("INPUT");
        this.a_pbst = document.createElement("INPUT");
        this.a_chrg = document.createElement("INPUT");
        this.a_crsh = document.createElement("INPUT");
        row.insertCell().appendChild(this.a_powr);
        row.insertCell().appendChild(this.a_fcom);
        row.insertCell().appendChild(this.a_fuel);
        row.insertCell().appendChild(this.a_pspd);
        row.insertCell().appendChild(this.a_pbst);
        row.insertCell().appendChild(this.a_chrg);
        row.insertCell().appendChild(this.a_crsh);
        this.a_powr.setAttribute("type", "number");
        this.a_fcom.setAttribute("type", "number");
        this.a_fuel.setAttribute("type", "number");
        this.a_pspd.setAttribute("type", "number");
        this.a_pbst.setAttribute("type", "number");
        this.a_chrg.setAttribute("type", "number");
        this.a_crsh.setAttribute("type", "number");
        this.a_powr.valueAsNumber = 0;
        this.a_fcom.valueAsNumber = 0;
        this.a_fuel.valueAsNumber = 0;
        this.a_pspd.valueAsNumber = 0;
        this.a_pbst.valueAsNumber = 0;
        this.a_chrg.valueAsNumber = 0;
        this.a_crsh.valueAsNumber = 0;
        this.a_powr.oninput = () => { aircraft_model.GetAlter().stats.power = this.a_powr.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_fcom.oninput = () => { aircraft_model.GetAlter().stats.fuelconsumption = this.a_fcom.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_fuel.oninput = () => { aircraft_model.GetAlter().stats.fuel = this.a_fuel.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_pspd.oninput = () => { aircraft_model.GetAlter().stats.pitchspeed = this.a_pspd.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_pbst.oninput = () => { aircraft_model.GetAlter().stats.pitchboost = this.a_pbst.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_chrg.oninput = () => { aircraft_model.GetAlter().stats.charge = this.a_chrg.valueAsNumber; aircraft_model.CalculateStats(); };
        this.a_crsh.oninput = () => { aircraft_model.GetAlter().stats.crashsafety = this.a_crsh.valueAsNumber; aircraft_model.CalculateStats(); };
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
        this.weapon_head = CreateTH(tbl.insertRow(), "Weapon Systems");
        this.weapon_head.colSpan = 8;
        this.weapon_cell = tbl.insertRow().insertCell();
        this.weapon_cell.colSpan = 8;
        this.warning_head = CreateTH(tbl.insertRow(), "Special Rules");
        this.warning_head.colSpan = 8;
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
            this.vital_components.rowSpan = 5;
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
            this.ts_fullwB.innerText = Math.floor(derived.MaxSpeedwBombs).toString();
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
            this.vital_components.rowSpan = 3;
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
        this.maxalt_cell.innerText = (this.acft.GetMaxAltitude() * 10 - 1).toString();
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
        if (this.acft.IsElectrics()) {
            vital += "<br/>Electrics";
            this.copy_text += "Electrics\n\t";
        }
        this.vital_components.innerHTML = vital;
        this.copy_text += "\n";
        if (aircraft_model.GetWeapons().GetWeaponSets().length > 0) {
            this.copy_text += "Weapons\n\t";
        }
        var wlist = aircraft_model.GetWeapons().GetWeaponList();
        var dlist = aircraft_model.GetWeapons().GetDirectionList();
        this.weapon_cell.innerHTML = "";
        if (aircraft_model.GetMunitions().GetBombCount() > 0) {
            var weaphtml = aircraft_model.GetMunitions().GetBombCount().toString() + " Mass of bombs or rockets.";
            if (aircraft_model.GetMunitions().GetMaxBombSize() > 0) {
                weaphtml += " Largest internal bomb allowed is " + aircraft_model.GetMunitions().GetMaxBombSize() + " Mass.";
            }
            this.weapon_cell.innerHTML = weaphtml + "<br/>";
            this.copy_text += weaphtml + "\n\t";
        }
        for (let w of aircraft_model.GetWeapons().GetWeaponSets()) {
            var weaphtml = "";
            weaphtml += wlist[w.GetWeaponSelected()].name;
            if (w.IsPlural()) {
                weaphtml += "s";
                weaphtml += " fire ";
            }
            else {
                weaphtml += " fires ";
            }
            var ds = w.GetDirection();
            weaphtml += "[";
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    weaphtml += dlist[i] + " ";
            }
            weaphtml = weaphtml.substr(0, weaphtml.length - 1);
            weaphtml += "] ";
            let h = w.GetHits();
            weaphtml += "for " + wlist[w.GetWeaponSelected()].damage + " damage with " + h[0].toString() + "\\"
                + h[1].toString() + "\\"
                + h[2].toString() + "\\"
                + h[3].toString() + " hits with "
                + wlist[w.GetWeaponSelected()].ammo * w.GetAmmo() + " ammunition. "; //TODO
            if (wlist[w.GetWeaponSelected()].rapid || wlist[w.GetWeaponSelected()].shells || wlist[w.GetWeaponSelected()].ap > 0) {
                weaphtml += "[";
                weaphtml += " Jam " + w.GetJam();
                if (wlist[w.GetWeaponSelected()].rapid) {
                    weaphtml += ", ";
                    weaphtml += "Rapid Fire";
                }
                if (wlist[w.GetWeaponSelected()].shells) {
                    weaphtml += ", ";
                    weaphtml += "Shells";
                }
                if (wlist[w.GetWeaponSelected()].ap > 0) {
                    weaphtml += ", ";
                    weaphtml += "AP " + wlist[w.GetWeaponSelected()].ap.toString();
                }
                weaphtml += " ]";
            }
            this.copy_text += weaphtml + "\n\t";
            weaphtml += "<br\>";
            this.weapon_cell.innerHTML += weaphtml;
        }
        this.copy_text += "\n";
        if (stats.warnings.length > 0) {
            this.copy_text += "Special Rules\n\t";
        }
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
/// <reference path="./impl/Aircraft.ts" />
/// <reference path="./disp/Tools.ts" />
/// <reference path="./disp/Aircraft.ts" />
//TODO: air fan
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
            loadJSON('/PlaneBuilder/weapons.json', (weapon_resp) => {
                weapon_json = JSON.parse(weapon_resp);
                aircraft_model = new Aircraft(parts_JSON, engine_json, weapon_json, true);
                aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);
                var loaded = false;
                if (qp && !loaded) {
                    console.log("Used Query Parameter");
                    try {
                        var str = LZString.decompressFromEncodedURIComponent(qp);
                        var arr = _stringToArrayBuffer(str);
                        var des = new Deserialize(arr);
                        aircraft_model.deserialize(des);
                        aircraft_model.CalculateStats();
                        loaded = true;
                    }
                    catch (_a) {
                        console.log("Compressed Query Parameter Failed.");
                        aircraft_model.Reset();
                    }
                }
                if (acft_data && !loaded) {
                    console.log("Used Saved Data");
                    try {
                        loaded = aircraft_model.fromJSON(JSON.parse(acft_data));
                        aircraft_model.CalculateStats();
                    }
                    catch (_b) {
                        console.log("Saved Data Failed.");
                        aircraft_model.Reset();
                    }
                }
                aircraft_model.CalculateStats();
                location.hash = ihash;
                window.onscroll = SetScroll;
            });
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
var parts_JSON;
var engine_json;
var weapon_json;
var aircraft_model;
var aircraft_display;
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
class AlterStats extends Part {
    constructor() {
        super();
        this.stats = new Stats();
    }
    PartStats() {
        var stats = new Stats();
        if (!this.stats.liftbleed)
            this.stats.liftbleed = 0;
        if (!this.stats.drag)
            this.stats.drag = 0;
        if (!this.stats.mass)
            this.stats.mass = 0;
        if (!this.stats.wetmass)
            this.stats.wetmass = 0;
        if (!this.stats.bomb_mass)
            this.stats.bomb_mass = 0;
        if (!this.stats.cost)
            this.stats.cost = 0;
        if (!this.stats.upkeep)
            this.stats.upkeep = 0;
        if (!this.stats.control)
            this.stats.control = 0;
        if (!this.stats.pitchstab)
            this.stats.pitchstab = 0;
        if (!this.stats.latstab)
            this.stats.latstab = 0;
        if (!this.stats.wingarea)
            this.stats.wingarea = 0;
        if (!this.stats.maxstrain)
            this.stats.maxstrain = 0;
        if (!this.stats.structure)
            this.stats.structure = 0;
        if (!this.stats.toughness)
            this.stats.toughness = 0;
        if (!this.stats.power)
            this.stats.power = 0;
        if (!this.stats.fuelconsumption)
            this.stats.fuelconsumption = 0;
        if (!this.stats.fuel)
            this.stats.fuel = 0;
        if (!this.stats.pitchspeed)
            this.stats.pitchspeed = 0;
        if (!this.stats.pitchboost)
            this.stats.pitchboost = 0;
        if (!this.stats.charge)
            this.stats.charge = 0;
        if (!this.stats.crashsafety)
            this.stats.crashsafety = 0;
        stats = stats.Add(this.stats);
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
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
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />
class WeaponSystem extends Part {
    constructor(weapon_list) {
        super();
        this.weapon_list = weapon_list;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.weapons = [];
        this.SWC(1);
    }
    toJSON() {
        var wlist = [];
        for (let w of this.weapons) {
            wlist.push(w.toJSON());
        }
        return {
            weapon_type: this.weapon_type,
            fixed: this.fixed,
            directions: this.directions,
            weapons: wlist,
            ammo: this.ammo,
        };
    }
    fromJSON(js) {
        this.weapon_type = js["weapon_type"];
        this.fixed = js["fixed"];
        this.directions = js["directions"];
        this.weapons = [];
        for (let elem of js["weapons"]) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem);
            this.weapons.push(w);
        }
        this.ammo = js["ammo"];
        if (this.ammo == null)
            this.ammo = 1;
    }
    serialize(s) {
        s.PushNum(this.weapon_type);
        s.PushBool(this.fixed);
        s.PushBoolArr(this.directions);
        s.PushNum(this.ammo);
        s.PushNum(this.weapons.length);
        for (let w of this.weapons) {
            w.serialize(s);
        }
    }
    deserialize(d) {
        this.weapon_type = d.GetNum();
        this.fixed = d.GetBool();
        this.directions = d.GetBoolArr();
        this.ammo = d.GetNum();
        var wlen = d.GetNum();
        this.weapons = [];
        for (let i = 0; i < wlen; i++) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.deserialize(d);
            this.weapons.push(w);
        }
    }
    GetWeaponSelected() {
        return this.weapon_type;
    }
    SetWeaponSelected(num) {
        this.weapon_type = num;
        if (this.weapon_list[num].size == 16) {
            while (this.weapons.length > 1) {
                this.weapons.pop();
            }
        }
        for (let w of this.weapons) {
            w.SetWeaponType(this.weapon_list[num]);
        }
        this.CalculateStats();
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
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
        var directions = [...Array(6).fill(true)];
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
    GetWeaponCount() {
        return this.weapons.length;
    }
    SWC(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        while (num > this.weapons.length) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }
    SetWeaponCount(num) {
        if (this.weapon_list[this.weapon_type].size == 16)
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
        var hits = this.weapon_list[this.weapon_type].hits;
        var centerline = 0;
        var wings = 0;
        for (let w of this.weapons) {
            if (w.GetWing() && w.GetFixed()) {
                wings += hits;
                if (w.GetPair())
                    wings += hits;
            }
            else {
                centerline += hits;
                if (w.GetPair())
                    centerline += hits;
            }
        }
        return [
            centerline + Math.floor(wings * 0.8),
            wings + Math.floor(centerline * 0.75),
            Math.floor(centerline * 0.5) + Math.floor(wings * 0.3),
            Math.floor(centerline * 0.25) + Math.floor(wings * 0.1)
        ];
    }
    GetDamage() {
        return this.weapon_list[this.weapon_type].damage;
    }
    GetAmmo() {
        return this.ammo;
    }
    GetJam() {
        if (this.weapon_list[this.weapon_type].rapid) {
            var jams = [0, 0];
            for (let w of this.weapons) {
                var t = w.GetJam();
                jams[0] = Math.max(jams[0], t[0]);
                jams[1] = Math.max(jams[1], t[1]);
            }
            return jams[0].toString() + "/" + jams[1].toString();
        }
        else {
            var jam = 0;
            for (let w of this.weapons) {
                jam = Math.max(jam, w.GetJam());
            }
            return jam.toString();
        }
    }
    IsPlural() {
        return this.weapons.length > 1 || this.weapons[0].GetPair();
    }
    SetAmmo(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        this.ammo = num;
        this.CalculateStats();
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
        for (let w of this.weapons) {
            w.has_cantilever = this.has_cantilever;
            stats = stats.Add(w.PartStats());
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
        //Ammunition Cost
        stats.mass += (this.ammo - 1) * this.weapons.length;
        return stats;
    }
}
