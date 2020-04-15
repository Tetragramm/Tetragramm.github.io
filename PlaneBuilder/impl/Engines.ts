/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />
/// <reference path="./Engine.ts" />

class Engines extends Part {
    private engines: Engine[];
    private engine_stats: EngineStats[];
    private mount_list: { name: string, stats: Stats, strainfactor: number, dragfactor: number, pp_type: string, reqED: boolean, reqTail: boolean }[];
    private pp_list: Array<{ name: string, powerfactor: number }>;
    private radiators: Radiator[];
    private is_asymmetric: boolean;
    private r_type_list: { name: string, stats: Stats, dragpercool: number }[];
    private r_mount_list: { name: string, stats: Stats }[];
    private r_coolant_list: { name: string, stats: Stats }[];
    private cowl_list: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[]

    constructor(js: JSON, engine_json: JSON) {
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

    public toJSON() {
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

    public fromJSON(js: JSON) {
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

    public GetHasOilTank() {
        for (let e of this.engines) {
            if (e.GetCurrentStats().oiltank)
                return true;
        }
        return false;
    }

    public GetReliabilityList() {
        var lst = [];
        for (let e of this.engines) {
            lst.push(e.GetReliability());
        }
        return lst;
    }

    public GetMaxAltitude() {
        var m = 100;
        for (let e of this.engines) {
            m = Math.min(m, e.GetMaxAltitude());
        }
        return m;
    }

    public SetNumberOfEngines(num: number) {
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

    public GetNumberOfEngines(): number {
        return this.engines.length;
    }

    public GetEngine(num: number): Engine {
        return this.engines[num];
    }

    public GetRadiator(num: number): Radiator {
        return this.radiators[num];
    }

    public SetNumberOfRadiators(num: number) {
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

    public GetNumberOfRadiators(): number {
        if (this.radiators.length == 0 && this.NeedCooling())
            this.SetNumberOfRadiators(1);
        else if (this.radiators.length > 0 && !this.NeedCooling())
            this.SetNumberOfRadiators(0);

        return this.radiators.length;
    }

    private NeedCooling(): boolean {
        var need = false;
        for (let elem of this.engines) {
            need = need || elem.NeedCooling();
        }
        return need;
    }

    public UpdateReliability(stats: Stats) {
        for (let elem of this.engines) {
            let rad_stats = new Stats();
            if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
                rad_stats = this.radiators[elem.GetRadiator()].PartStats();
            }
            elem.UpdateReliability(stats.reliability + rad_stats.reliability);
        }
    }

    public SetAsymmetry(use: boolean) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }

    public GetAsymmetry(): boolean {
        return this.is_asymmetric;
    }

    public GetHavePropeller() {
        for (let e of this.engines) {
            if (e.GetHavePropeller())
                return true;
        }
        return false;
    }

    public GetOverspeed() {
        var os = 100;
        for (let e of this.engines)
            os = Math.min(os, e.GetOverspeed());
        return os;
    }

    public GetRumble() {
        var r = 0;
        for (let e of this.engines)
            r += e.GetRumble();
        return r;
    }
    public GetMaxRumble() {
        var r = 0;
        for (let e of this.engines)
            r = Math.max(r, e.GetRumble());
        return r;
    }

    public GetTractor() {
        var ret = { have: false, spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetTractor();
            if (t.has) {
                ret.have = true;
                if (t.spinner)
                    ret.spin_count++;
            }
        }
        return ret;
    }

    public GetPusher() {
        var ret = { have: false, spin_count: 0 };
        for (let e of this.engines) {
            var t = e.GetPusher();
            if (t.has) {
                ret.have = true;
                if (t.spinner)
                    ret.spin_count++;
            }
        }
        return ret;
    }

    public PartStats(): Stats {
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

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetHasTractorNacelles() {
        let has = 0;
        for (let en of this.engines) {
            if (en.GetIsTractorNacelle())
                has++;
        }
        return has > 1;
    }
}