/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Fuel extends Part {
    private tank_stats: {
        name: string, stats: Stats,
        internal: boolean, cantilever: boolean
    }[];
    private tank_count: number[];
    private self_sealing: boolean;
    private fire_extinguisher: boolean;
    private is_cantilever: boolean;
    private wing_area: number;

    constructor(js: JSON) {
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

    public toJSON() {
        return {
            tank_count: this.tank_count,
            self_sealing: this.self_sealing,
            fire_extinguisher: this.fire_extinguisher,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.tank_count = NumArr(js["tank_count"], this.tank_count.length);
        this.self_sealing = js["self_sealing"];
        this.fire_extinguisher = js["fire_extinguisher"];
        this.wing_area = -1;
    }

    public serialize(s: Serialize) {
        s.PushNumArr(this.tank_count);
        s.PushBool(this.self_sealing);
        s.PushBool(this.fire_extinguisher);
    }

    public deserialize(d: Deserialize) {
        this.tank_count = d.GetNumArr(this.tank_count.length);
        this.self_sealing = d.GetBool();
        this.fire_extinguisher = d.GetBool();
        this.wing_area = -1;
    }

    public GetTankList() {
        return this.tank_stats;
    }

    public GetTankEnabled() {
        var lst = [];
        for (let e of this.tank_stats) {
            if (!this.is_cantilever && e.cantilever)
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }

    public GetTankCount() {
        return this.tank_count;
    }

    public SetTankCount(idx: number, count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.tank_count[idx] = count;
        this.VerifyOK();
        this.CalculateStats();
    }

    public SetCantilever(is: boolean) {
        if (this.is_cantilever && !is) {
            this.is_cantilever = is;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.is_cantilever = is;
    }

    public SetArea(num: number) {
        if (this.wing_area > num) {
            this.wing_area = num;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.wing_area = num;
    }

    private VerifyOK() {
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

    public GetSealingEnabled() {
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        return internal_count > 0;
    }

    public GetSelfSealing() {
        return this.self_sealing;
    }

    public SetSelfSealing(is: boolean) {
        this.self_sealing = is;
        this.CalculateStats();
    }

    public GetExtinguisher() {
        return this.fire_extinguisher;
    }

    public SetExtinguisher(is: boolean) {
        this.fire_extinguisher = is;
        this.CalculateStats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
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
            stats.warnings.push({
                source: lu("Self-Sealing Gas Tank"),
                warning: lu("Self-Sealing Gas Tank Warning")
            });
        }

        if (this.fire_extinguisher) {
            stats.mass += 2;
            stats.cost += 3;
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