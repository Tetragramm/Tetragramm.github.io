class Stats {
    public liftbleed: number = 0;
    public wetmass: number = 0;
    public mass: number = 0;
    public drag: number = 0;
    public control: number = 0;
    public cost: number = 0;
    public reqsections: number = 0;
    public visibility: number = 0;
    public flightstress: number = 0;
    public escape: number = 0;
    public pitchstab: number = 0;
    public latstab: number = 0;
    public cooling: number = 0;
    public reliability: number = 0;
    public power: number = 0;
    public fuelconsumption: number = 0;
    public maxstrain: number = 0;
    public structure: number = 0;
    public pitchspeed: number = 0;
    public pitchboost: number = 0;
    public wingarea: number = 0;
    public toughness: number = 0;
    public upkeep: number = 0;
    public crashsafety: number = 0;
    public bomb_mass: number = 0;
    public fuel: number = 0;
    public charge: number = 0;
    public warnings: { source: string, warning: string }[] = [];
    public era: { name: string, era: string }[];

    constructor(js?: JSON) {
        this.era = [];
        if (js) {
            this.fromJSON(js, 0);
        }
    }

    public toJSON() {
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

    public fromJSON(js: JSON, json_version: number) {
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

    public serialize(s: Serialize) {
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

    public deserialize(d: Deserialize) {
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

    public Add(other: Stats): Stats {
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

    private MergeWarnings(owarn: { source: string, warning: string }[]) {
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

    private MergeEra(oera: { name: string, era: string }[]) {
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

    public Multiply(other: number): Stats {
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

    public Equal(other: Stats) {
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
    private rtz(num: number) {
        if (num > 0) {
            return Math.floor(1.0e-6 + num);
        }
        return Math.ceil(-1.0e-6 + num);
    }

    public Round() {
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

    public Clone() {
        return this.Add(new Stats());
    }
}

var era2numHh = (era: string): number => {
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

var era2numHl = (era: string): number => {
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

var num2era = (era: number): string => {
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