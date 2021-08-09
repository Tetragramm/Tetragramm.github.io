/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Reinforcement extends Part {
    private ext_wood_list: { name: string, tension: number, config: boolean, first: boolean, small_sqp: boolean, ornith: boolean, stats: Stats }[];
    private ext_steel_list: { name: string, tension: number, config: boolean, first: boolean, small_sqp: boolean, ornith: boolean, stats: Stats }[];
    private ext_cabane_list: { name: string, tension: number, stats: Stats }[];
    private ext_wood_count: number[];
    private ext_steel_count: number[];
    private cant_list: { name: string, limited: boolean, stats: Stats }[];
    private cant_count: number[];
    private wires: boolean;
    private cabane_sel: number;
    private wing_blades: boolean;

    //Set by Calculate Stats
    private is_staggered: boolean;
    private is_tandem: boolean;
    private is_monoplane: boolean;
    private can_external: boolean;
    private acft_structure: number;
    private cant_lift: number;
    private tension_sqp: boolean;
    private limited_sqp: boolean;
    private acft_type: AIRCRAFT_TYPE;

    constructor(js: JSON) {
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

    public toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
            cabane_sel: this.cabane_sel,
            wing_blades: this.wing_blades,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
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

    public serialize(s: Serialize) {
        s.PushNumArr(this.ext_wood_count);
        s.PushNumArr(this.ext_steel_count);
        s.PushNumArr(this.cant_count);
        s.PushBool(this.wires);
        s.PushNum(this.cabane_sel);
        s.PushBool(this.wing_blades);
    }

    public deserialize(d: Deserialize) {
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

    public GetExternalList() {
        return this.ext_wood_list;
    }

    public GetCantileverList() {
        return this.cant_list;
    }

    public CanExternalWood() {
        var can = [...Array(this.ext_wood_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
                can[i] = this.ext_wood_list[i].ornith;
            }
            else if (this.limited_sqp) {
                can[i] = this.ext_wood_list[i].small_sqp;
            }
        }
        return can;
    }

    public GetExternalWoodCount() {
        return this.ext_wood_count;
    }

    public SetExternalWoodCount(idx: number, count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }

    public CanExternalSteel() {
        var can = [...Array(this.ext_steel_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_steel_list.length; i++) {
            if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
                can[i] = this.ext_steel_list[i].ornith;
            }
            else if (this.limited_sqp) {
                can[i] = this.ext_steel_list[i].small_sqp;
            }
        }
        return can;
    }

    public GetExternalSteelCount() {
        return this.ext_steel_count;
    }

    public SetExternalSteelCount(idx: number, count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
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
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }

    private ImplSCC(idx: number, count: number) {
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

    public SetCanUseExternal(has: boolean) {
        this.can_external = has;
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

    public GetCantileverType() {
        var wood_count = this.cant_count[0] + this.cant_count[4];
        var metal_count = this.cant_count[1] + this.cant_count[2] + this.cant_count[3];
        if (metal_count > 0)
            return 2;
        else if (wood_count > 0)
            return 1;
        else
            return 0;
    }

    public GetCabaneList() {
        return this.ext_cabane_list;
    }

    public GetCabane() {
        return this.cabane_sel;
    }

    public SetCabane(num: number) {
        this.cabane_sel = num;
        this.CalculateStats();
    }

    public SetCantLift(use: number) {
        this.cant_lift = use;
    }

    public CanWingBlade() {
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

    public GetWingBlade() {
        return this.wing_blades;
    }

    public SetWingBlade(use: boolean) {
        this.wing_blades = use;
        this.CalculateStats();
    }

    public SetAircraftType(type: AIRCRAFT_TYPE) {
        this.acft_type = type;
        if (type == AIRCRAFT_TYPE.HELICOPTER) {
            this.can_external = false;
            this.is_monoplane = false;
            this.is_tandem = false;
            this.is_staggered = false;
        }
        if (type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            this.can_external = false;
        }
        var can_wood = this.CanExternalWood();
        for (let i = 0; i < this.ext_wood_count.length; i++) {
            if (!can_wood[i])
                this.ext_wood_count[i] = 0;
        }
        var can_steel = this.CanExternalSteel();
        for (let i = 0; i < this.ext_steel_count.length; i++) {
            if (!can_steel[i])
                this.ext_steel_count[i] = 0;
        }
    }

    public SetSesquiplane(sqp: { is: boolean, deck: number, super_small: boolean }) {
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

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        switch (this.acft_type) {
            case AIRCRAFT_TYPE.AIRPLANE:
            case AIRCRAFT_TYPE.AUTOGYRO:
            case AIRCRAFT_TYPE.ORNITHOPTER_BASIC:
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
            case AIRCRAFT_TYPE.ORNITHOPTER_BUZZER:
            case AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER:
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

        //Ornithopter multiple is less than any other option.
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            tension_multiple = 0.5;
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


        //Reduce strain from regular struts by 50%
        //Does not affect Cabane, and tension is taken care off by multiplier.
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            stats.maxstrain = Math.floor(1.0e-6 + 0.5 * stats.maxstrain)
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