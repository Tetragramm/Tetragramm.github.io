import { Part, AIRCRAFT_TYPE, Rotor_PS } from "./Part";
import { Stats, WARNING_COLOR } from "./Stats";
import { Serialize, Deserialize } from "./Serialize";
import { lu } from "./Localization";

enum ROTOR_BLADE_COUNT {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}

export class Rotor extends Part {
    private type: AIRCRAFT_TYPE;
    private rotor_count: number;
    private rotor_span: number;
    private wing_area: number;
    private dryMP: number;
    private sizing_span: number;
    private accessory: boolean;
    private engine_count: number;
    private blade_list: { name: string, rotor_bleed: number, sizing: number, stats: Stats }[];
    private blade_idx: number;
    private stagger_list: { name: string, count: number, powerfactor: number, blades: number, stats: Stats }[];
    private stagger_sel: number;

    private cant_idx: number;
    private cant_list: { name: string, limited: boolean, stats: Stats }[];
    private rotor_thickness: number;

    constructor(js: Rotor_PS) {
        super();
        this.type = AIRCRAFT_TYPE.AIRPLANE;
        this.rotor_count = 0;
        this.rotor_span = 0;
        this.wing_area = 0;
        this.stagger_sel = 0;
        this.dryMP = 0;
        this.sizing_span = 0;
        this.cant_idx = 0;
        this.rotor_thickness = 0;
        this.accessory = false;
        this.blade_idx = 0;
        this.blade_list = [];
        for (const elem of js["blade_count"]) {
            this.blade_list.push({ name: elem["name"], rotor_bleed: elem["rotor_bleed"], sizing: elem["sizing"], stats: new Stats(elem) })
        }
        this.stagger_list = [];
        for (const elem of js["arrangement"]) {
            this.stagger_list.push({ name: elem["name"], count: elem["count"], powerfactor: elem["powerfactor"], blades: elem["blades"], stats: new Stats(elem) })
        }
    }

    public toJSON() {
        return {
            type: this.type,
            rotor_count: this.rotor_count,
            rotor_span: this.rotor_span,
            rotor_mat: this.cant_idx,
            stagger_sel: this.stagger_sel,
            accessory: this.accessory,
            blade_idx: this.blade_idx,
            rotor_thickness: this.rotor_thickness,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.type = js["type"];
        this.rotor_count = js["rotor_count"];
        this.rotor_span = js["rotor_span"];
        this.cant_idx = js["rotor_mat"];
        if (json_version < 12.35) {
            this.stagger_sel = 0;
        } else {
            this.stagger_sel = js["stagger_sel"];
        }
        this.accessory = js["accessory"];
        if (json_version > 11.55) {
            this.blade_idx = js["blade_idx"];
        }
        if (json_version < 12.45) {
            this.rotor_span = 0;
        }
        if (json_version < 12.55) {
            this.rotor_thickness = 0;
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.type);
        s.PushNum(this.rotor_count);
        s.PushNum(this.rotor_span);
        s.PushNum(this.cant_idx);
        s.PushNum(this.stagger_sel);
        s.PushBool(this.accessory);
        s.PushNum(this.blade_idx);
        s.PushNum(this.rotor_thickness);
    }

    public deserialise(d: Deserialize) {
        this.type = d.GetNum();
        this.rotor_count = d.GetNum();
        this.rotor_span = d.GetNum();
        this.cant_idx = d.GetNum();
        if (d.version < 12.35) {
            d.GetBool();
            this.stagger_sel = 0;
        } else {
            this.stagger_sel = d.GetNum();
        }
        this.accessory = d.GetBool();
        if (d.version > 11.55) {
            this.blade_idx = d.GetNum();
        }
        if (d.version < 12.45) {
            this.rotor_span = 0;
        }
        if (d.version < 12.55) {
            this.rotor_thickness = 0;
        } else {
            this.rotor_thickness = d.GetNum();
        }
    }

    public SetCantileverList(cant_list: { name: string, limited: boolean, stats: Stats }[]) {
        this.cant_list = cant_list;
    }

    public GetCantileverList() {
        return this.cant_list;
    }

    public SetCantilever(num: number) {
        this.cant_idx = num;
        this.CalculateStats();
    }

    public GetCantilever() {
        return this.cant_idx;
    }

    public SetRotorThickness(num: number) {
        if (num < 0) {
            num = 0;
        }
        this.rotor_thickness = Math.floor(1.0e-6 + num);
        this.CalculateStats();
    }

    public GetRotorThickness() {
        return this.rotor_thickness;
    }

    public SetType(new_type: AIRCRAFT_TYPE) {
        if (this.type != new_type) {
            this.accessory = false;
            this.cant_idx = 0;
            this.stagger_sel = 0;
            this.rotor_count = 1;
            this.type = new_type;
            this.rotor_span = 0;
        }
    }

    public CanRotorCount() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }

    public SetRotorCount(num: number) {
        if (num < 1)
            num = 1;
        if (num >= 2) {
            if (num % 2 == 1) {
                if (num == this.rotor_count + 1) {
                    num = num + 1;
                } else {
                    num = num - 1;
                }
            }
        }
        this.rotor_count = num;
        if (this.rotor_count < 2)
            this.stagger_sel = 0;
        this.CalculateStats();
    }

    public GetRotorCount() {
        return this.rotor_count;
    }

    public CanRotorSpan() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }

    public SetRotorSpan(num: number) {
        this.rotor_span = Math.floor(1.0e-6 + num);
        this.CalculateStats();
    }

    public GetRotorSpan() {
        return this.rotor_span;
    }

    public CanTandem() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count > 1;
    }

    public SetBladeCount(idx: number) {
        this.blade_idx = idx;
        this.CalculateStats();
    }

    public SetWingArea(num: number) {
        this.wing_area = num;
    }

    public GetSizingSpan() {
        return this.sizing_span;
    }

    public SetMP(mp: number) {
        if (mp != this.dryMP) {
            this.dryMP = mp;
            this.CalculateStats();
        }
    }

    private GetRotorStrain() {
        const area = this.GetRotorArea();
        return this.rotor_count * Math.max(1, 2 * (this.sizing_span + this.rotor_span) + area - 10);
    }

    public GetRotorArea() {
        return (Math.PI / 9) * (this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span);
    }

    public GetIdealRotorArea() {
        return (Math.PI / 9) * (this.sizing_span) * (this.sizing_span);
    }

    public GetRotorDrag() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER || this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            const area = this.GetRotorArea();
            if (this.rotor_count == 1) {
                return Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span)));
            } else {
                return Math.floor(1.0e-6 + 0.75 * this.rotor_count * Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span))));
            }
        }
        return 0;
    }

    public GetType() {
        return this.type;
    }

    public GetAccessory() {
        return this.accessory;
    }

    public SetAccessory(use: boolean) {
        this.accessory = use;
        this.CalculateStats();
    }

    public SetEngineCount(num: number) {
        this.engine_count = num;
    }

    public GetTailRotor() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count < 2;
    }

    public GetBladeList() {
        return this.blade_list;
    }

    public GetRotorBleed() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            return this.blade_list[this.blade_idx].rotor_bleed;
        }
        return 0;
    }

    public GetPowerFactor() {
        return this.stagger_list[this.stagger_sel].powerfactor;
    }

    public GetBladeCountIdx() {
        return this.blade_idx;
    }

    public GetStaggerList() {
        return this.stagger_list;
    }

    public GetStagger() {
        return this.stagger_sel;
    }

    public SetStagger(num: number) {
        if (num != this.stagger_sel) {
            this.stagger_sel = num;
            this.CalculateStats();
        }
    }

    public CanStagger() {
        const can = [];
        for (let i = 0; i < this.stagger_list.length; i++) {
            if (this.rotor_count == 1 && this.stagger_list[i].count == 1) {
                can.push(true);
            } else if (this.rotor_count == 2 && this.stagger_list[i].count == 2) {
                can.push(true);
            } else if (this.rotor_count >= 2 && this.stagger_list[i].count == 3) {
                can.push(true);
            } else {
                can.push(false);
            }
        }
        return can;
    }

    private VerifySizes() {
        if (this.type == AIRCRAFT_TYPE.AIRPLANE) {
            this.rotor_count = 0;
            this.rotor_span = 0;
            this.stagger_sel = 0;
        } else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor_count = 1;
            this.sizing_span = Math.ceil(-1.0e-6 + Math.sqrt((0.6 * this.wing_area) / (Math.PI / 8)));
            this.rotor_span = Math.max(this.rotor_span, 2 - this.sizing_span);
            this.stagger_sel = 0;
        } else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            this.rotor_count = Math.max(1, this.rotor_count);
            if (this.rotor_count > 1 && this.rotor_count % 2 == 1)
                this.rotor_count = this.rotor_count - 1;
            if (this.rotor_count == 1) {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 5 * this.blade_list[this.blade_idx].sizing);
            } else {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 4 * this.blade_list[this.blade_idx].sizing);
            }
            this.sizing_span = Math.min(100, this.sizing_span);
            this.rotor_span = Math.max(this.rotor_span, -Math.floor(1.0e-6 + this.sizing_span / 2));
        }
    }

    private VerifyStagger() {
        if (this.rotor_count > 2 && this.stagger_list[this.stagger_sel].count <= 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 3) {
                    this.stagger_sel = i;
                    break;
                }
            }
        } else if (this.rotor_count == 2 && this.stagger_list[this.stagger_sel].count != 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 2) {
                    this.stagger_sel = i;
                    break;
                }
            }
        } else if (this.rotor_count == 1 && this.stagger_list[this.stagger_sel].count != 1) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 1) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
    }

    public PartStats() {
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
            stats.power -= this.rotor_thickness;
            stats.maxstrain += 10 * this.rotor_thickness;
        }

        if (this.accessory) {
            if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
                stats.cost += 2;
                stats.mass += 2;
            } else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
                stats.mass += this.rotor_count * this.engine_count;
            }
        } else {
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
        } else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            stats.warnings.push({
                source: lu("Autogyro Stall"),
                warning: lu("Autogyro Stall Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
