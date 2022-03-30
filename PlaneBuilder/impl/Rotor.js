import { Part, AIRCRAFT_TYPE } from "./Part.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { lu } from "./Localization.js";
var ROTOR_BLADE_COUNT;
(function (ROTOR_BLADE_COUNT) {
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Two"] = 2] = "Two";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Three"] = 3] = "Three";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Four"] = 4] = "Four";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Five"] = 5] = "Five";
})(ROTOR_BLADE_COUNT || (ROTOR_BLADE_COUNT = {}));
export class Rotor extends Part {
    constructor(js) {
        super();
        this.type = AIRCRAFT_TYPE.AIRPLANE;
        this.rotor_count = 0;
        this.rotor_span = 0;
        this.wing_area = 0;
        this.stagger_sel = 0;
        this.dryMP = 0;
        this.sizing_span = 0;
        this.cant_idx = 0;
        this.accessory = false;
        this.blade_idx = 0;
        this.blade_list = [];
        for (const elem of js["blade_count"]) {
            this.blade_list.push({ name: elem["name"], rotor_bleed: elem["rotor_bleed"], sizing: elem["sizing"], stats: new Stats(elem) });
        }
        this.stagger_list = [];
        for (const elem of js["arrangement"]) {
            this.stagger_list.push({ name: elem["name"], count: elem["count"], powerfactor: elem["powerfactor"], blades: elem["blades"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            type: this.type,
            rotor_count: this.rotor_count,
            rotor_span: this.rotor_span,
            rotor_mat: this.cant_idx,
            stagger_sel: this.stagger_sel,
            accessory: this.accessory,
            blade_idx: this.blade_idx,
        };
    }
    fromJSON(js, json_version) {
        this.type = js["type"];
        this.rotor_count = js["rotor_count"];
        this.rotor_span = js["rotor_span"];
        this.cant_idx = js["rotor_mat"];
        if (json_version < 12.35) {
            this.stagger_sel = 0;
        }
        else {
            this.stagger_sel = js["stagger_sel"];
        }
        this.accessory = js["accessory"];
        if (json_version > 11.55) {
            this.blade_idx = js["blade_idx"];
        }
        if (json_version < 12.45) {
            this.rotor_span = 0;
        }
    }
    serialize(s) {
        s.PushNum(this.type);
        s.PushNum(this.rotor_count);
        s.PushNum(this.rotor_span);
        s.PushNum(this.cant_idx);
        s.PushNum(this.stagger_sel);
        s.PushBool(this.accessory);
        s.PushNum(this.blade_idx);
    }
    deserialise(d) {
        this.type = d.GetNum();
        this.rotor_count = d.GetNum();
        this.rotor_span = d.GetNum();
        this.cant_idx = d.GetNum();
        if (d.version < 12.35) {
            d.GetBool();
            this.stagger_sel = 0;
        }
        else {
            this.stagger_sel = d.GetNum();
        }
        this.accessory = d.GetBool();
        if (d.version > 11.55) {
            this.blade_idx = d.GetNum();
        }
        if (d.version < 12.45) {
            this.rotor_span = 0;
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
            this.stagger_sel = 0;
            this.rotor_count = 1;
            this.type = new_type;
            this.rotor_span = 0;
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
            this.stagger_sel = 0;
        this.CalculateStats();
    }
    GetRotorCount() {
        return this.rotor_count;
    }
    CanRotorSpan() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }
    SetRotorSpan(num) {
        this.rotor_span = Math.floor(1.0e-6 + num);
        this.CalculateStats();
    }
    GetRotorSpan() {
        return this.rotor_span;
    }
    CanTandem() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count > 1;
    }
    SetBladeCount(idx) {
        this.blade_idx = idx;
        this.CalculateStats();
    }
    SetWingArea(num) {
        this.wing_area = num;
    }
    GetSizingSpan() {
        return this.sizing_span;
    }
    SetMP(mp) {
        if (mp != this.dryMP) {
            this.dryMP = mp;
            this.CalculateStats();
        }
    }
    GetRotorStrain() {
        const area = this.GetRotorArea();
        return this.rotor_count * Math.max(1, 2 * (this.sizing_span + this.rotor_span) + area - 10);
    }
    GetRotorArea() {
        return (Math.PI / 9) * (this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span);
    }
    GetIdealRotorArea() {
        return (Math.PI / 9) * (this.sizing_span) * (this.sizing_span);
    }
    GetRotorDrag() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER || this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            const area = this.GetRotorArea();
            if (this.rotor_count == 1) {
                return Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span)));
            }
            else {
                return Math.floor(1.0e-6 + 0.75 * this.rotor_count * Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span))));
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
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count < 2;
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
    GetPowerFactor() {
        return this.stagger_list[this.stagger_sel].powerfactor;
    }
    GetBladeCountIdx() {
        return this.blade_idx;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetStagger() {
        return this.stagger_sel;
    }
    SetStagger(num) {
        if (num != this.stagger_sel) {
            this.stagger_sel = num;
            this.CalculateStats();
        }
    }
    CanStagger() {
        const can = [];
        for (let i = 0; i < this.stagger_list.length; i++) {
            if (this.rotor_count == 1 && this.stagger_list[i].count == 1) {
                can.push(true);
            }
            else if (this.rotor_count == 2 && this.stagger_list[i].count == 2) {
                can.push(true);
            }
            else if (this.rotor_count >= 2 && this.stagger_list[i].count == 3) {
                can.push(true);
            }
            else {
                can.push(false);
            }
        }
        return can;
    }
    VerifySizes() {
        if (this.type == AIRCRAFT_TYPE.AIRPLANE) {
            this.rotor_count = 0;
            this.rotor_span = 0;
            this.stagger_sel = 0;
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor_count = 1;
            this.sizing_span = Math.ceil(-1.0e-6 + Math.sqrt((0.6 * this.wing_area) / (Math.PI / 8)));
            this.rotor_span = Math.max(this.rotor_span, 2 - this.sizing_span);
            this.stagger_sel = 0;
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
            this.rotor_span = Math.max(this.rotor_span, -Math.floor(1.0e-6 + this.sizing_span / 2));
        }
    }
    VerifyStagger() {
        if (this.rotor_count > 2 && this.stagger_list[this.stagger_sel].count <= 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 3) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
        else if (this.rotor_count == 2 && this.stagger_list[this.stagger_sel].count != 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 2) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
        else if (this.rotor_count == 1 && this.stagger_list[this.stagger_sel].count != 1) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 1) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
    }
    PartStats() {
        this.VerifySizes();
        this.VerifyStagger();
        var stats = new Stats();
        const area = this.GetRotorArea();
        stats.wingarea += Math.floor(1.0e-6 + area);
        stats.drag = this.GetRotorDrag();
        const strain = this.GetRotorStrain();
        var ts = this.cant_list[this.cant_idx].stats.Clone();
        const count = Math.ceil(-1.0e-6 + strain / ts.maxstrain);
        ts = ts.Multiply(count);
        ts.maxstrain = 0;
        ts.toughness = 0;
        stats = stats.Add(ts);
        stats = stats.Add(this.stagger_list[this.stagger_sel].stats.Clone());
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.reliability = 2 * Math.min(0, this.rotor_span);
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
        else {
            if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
                stats.mass += Math.max(this.rotor_count, this.engine_count);
            }
        }
        //Warnings
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.warnings.push({
                source: lu("Helicopter Landing"),
                warning: lu("Helicopter Landing Warning"),
                color: WARNING_COLOR.WHITE,
            });
            stats.warnings.push({
                source: lu("Helicopter Descent"),
                warning: lu("Helicopter Descent Warning"),
                color: WARNING_COLOR.WHITE,
            });
            stats.warnings.push({
                source: lu("Helicopter Stall"),
                warning: lu("Helicopter Stall Warning"),
                color: WARNING_COLOR.WHITE,
            });
            if (stats.reliability < 0) {
                stats.warnings.push({
                    source: lu("Rotor Span"),
                    warning: lu("Rotor Span Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            stats.warnings.push({
                source: lu("Autogyro Stall"),
                warning: lu("Autogyro Stall Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
