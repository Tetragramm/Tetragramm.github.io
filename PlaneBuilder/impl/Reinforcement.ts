/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Reinforcement extends Part {
    private ext_list: { name: string, tension: number, config: boolean, stats: Stats }[];
    private ext_wood_count: number[];
    private ext_steel_count: number[];
    private cant_list: { name: string, limited: boolean, stats: Stats }[];
    private cant_count: number[];
    private wires: boolean;

    //Set by Calculate Stats
    private is_staggered: boolean;
    private is_tandem: boolean;
    private is_monoplane: boolean;
    private acft_structure: number;

    constructor(js: JSON) {
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

    public toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
        }
    }

    public fromJSON(js: JSON) {
        this.ext_wood_count = js["ext_wood_count"];
        this.ext_steel_count = js["ext_steel_count"];
        this.cant_count = js["cant_count"];
        this.wires = js["wires"];
    }

    public GetExternalList() {
        return this.ext_list;
    }

    public GetCantileverList() {
        return this.cant_list;
    }

    public GetExternalWoodCount() {
        return this.ext_wood_count;
    }

    public SetExternalWoodCount(idx: number, count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }

    public GetExternalSteelCount() {
        return this.ext_steel_count;
    }

    public SetExternalSteelCount(idx: number, count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ext_steel_count[idx] = count;
        this.CalculateStats();
    }

    public GetCantileverCount() {
        return this.cant_count;
    }

    public GetIsCantilever() {
        var count = 0;
        for (let c of this.cant_count)
            count += c;
        return count > 0;
    }

    public SetCantileverCount(idx: number, count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }

    private ImplSCC(idx: number, count: number) {
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

    public GetWires() {
        return this.wires;
    }

    public SetWires(use: boolean) {
        this.wires = use;
        this.CalculateStats();
    }

    public SetStaggered(is: boolean) {
        this.is_staggered = is;
    }

    public SetTandem(is: boolean) {
        this.is_tandem = is;
    }

    public SetMonoplane(is: boolean) {
        this.is_monoplane = is;
    }

    public SetAcftStructure(struct: number) {
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

    private TotalStructure() {
        var struct_count = 0;
        for (let i = 0; i < this.ext_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * 2 * this.ext_list[i].stats.structure;
        }
        return this.acft_structure + struct_count;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
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