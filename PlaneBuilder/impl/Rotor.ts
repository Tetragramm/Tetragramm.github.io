/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

enum AIRCRAFT_TYPE {
    AIRPLANE,
    HELICOPTER,
    AUTOGYRO,
}
enum ROTOR_BLADE_COUNT {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}
class Rotor extends Part {
    private type: AIRCRAFT_TYPE;
    private rotor_count: number;
    private rotor_span: number;
    private wing_area: number;
    private is_tandem: boolean;
    private dryMP: number;
    private sizing_span: number;
    private accessory: boolean;
    private engine_count: number;
    private blade_list: { name: string, rotor_bleed: number, sizing: number, stats: Stats }[];
    private blade_idx: number;

    private cant_idx: number;
    private cant_list: { name: string, limited: boolean, stats: Stats }[];

    constructor(js: JSON) {
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
            this.blade_list.push({ name: elem["name"], rotor_bleed: elem["rotor_bleed"], sizing: elem["sizing"], stats: new Stats(elem) })
        }
    }

    public toJSON() {
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

    public fromJSON(js: JSON, json_version: number) {
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

    public serialize(s: Serialize) {
        s.PushNum(this.type);
        s.PushNum(this.rotor_count);
        s.PushNum(this.rotor_span);
        s.PushNum(this.cant_idx);
        s.PushBool(this.is_tandem);
        s.PushBool(this.accessory);
        s.PushNum(this.blade_idx);
    }

    public deserialise(d: Deserialize) {
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

    public SetType(new_type: AIRCRAFT_TYPE) {
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
            this.is_tandem = false;
        this.CalculateStats();
    }

    public GetRotorCount() {
        return this.rotor_count;
    }

    public CanRotorSpan() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }

    public SetRotorSpan(num: number) {
        if (num < 2)
            num = 2;
        this.rotor_span = num;
        this.CalculateStats();
    }

    public GetRotorSpan() {
        return this.rotor_span;
    }

    public CanTandem() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count > 1;
    }

    public SetTandem(tan: boolean) {
        this.is_tandem = tan;
        this.CalculateStats();
    }

    public GetTandem() {
        return this.is_tandem;
    }

    public SetBladeCount(idx: number) {
        this.blade_idx = idx;
        this.VerifySizes();
        this.CalculateStats();
    }

    public SetWingArea(num: number) {
        this.wing_area = num;
        this.VerifySizes();
    }

    public GetSizingSpan() {
        return this.sizing_span;
    }

    public SetMP(mp: number) {
        if (mp != this.dryMP) {
            this.dryMP = mp;
            this.VerifySizes();
            this.CalculateStats();
        }
    }

    private GetRotorStrain() {
        var area = (Math.PI / 8) * this.rotor_span * this.rotor_span;
        return this.rotor_count * Math.max(1, 2 * this.rotor_span + area - 10);
    }

    public GetRotorDrag() {
        if (this.type != AIRCRAFT_TYPE.AIRPLANE) {
            var area = (Math.PI / 8) * this.rotor_span * this.rotor_span;
            if (this.rotor_count == 1) {
                return Math.floor(1.0e-6 + 6 * area * area / (this.rotor_span * this.rotor_span));
            } else {
                return Math.floor(1.0e-6 + 0.75 * this.rotor_count * Math.floor(1.0e-6 + 6 * area * area / (this.rotor_span * this.rotor_span)));
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
        return this.type == AIRCRAFT_TYPE.HELICOPTER && !this.is_tandem;
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

    public GetBladeCountIdx() {
        return this.blade_idx;
    }

    private VerifySizes() {
        if (this.type == AIRCRAFT_TYPE.AIRPLANE) {
            this.rotor_count = 0;
            this.rotor_span = 0;
            this.is_tandem = false;
        } else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor_count = 1;
            this.sizing_span = Math.ceil(-1.0e-6 + Math.sqrt((0.6 * this.wing_area) / (Math.PI / 8)));
            this.rotor_span = Math.max(this.rotor_span, this.sizing_span);
            this.is_tandem = false;
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
        }
    }

    public PartStats() {
        this.VerifySizes();

        var stats = new Stats();
        var area = (Math.PI / 8) * this.rotor_span * this.rotor_span;
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
            } else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
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
        } else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            stats.warnings.push({
                source: lu("Autogyro Stall"),
                warning: lu("Autogyro Stall Warning")
            });
        }

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}