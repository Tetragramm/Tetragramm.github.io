import { Part, Stabilizers_PS } from "./Part.js";
import { Stats } from "./Stats.js";
import { Serialize, Deserialize } from "./Serialize.js";

export class Stabilizers extends Part {
    private have_tail: boolean;
    private is_tandem: boolean;
    private is_swept: boolean;
    private lifting_area: number;
    private engine_count: number;

    private hstab_list: {
        name: string, is_canard: boolean, increment: number, stats: Stats,
        dragfactor: number, is_vtail: boolean, is_tail: boolean
    }[];
    private vstab_list: {
        name: string, increment: number, stats: Stats,
        dragfactor: number, is_vtail: boolean, is_tail: boolean
    }[];

    private hstab_sel: number;
    private hstab_count: number;
    private vstab_sel: number;
    private vstab_count: number;
    private is_heli: boolean;

    constructor(js: Stabilizers_PS) {
        super();

        this.have_tail = true;
        this.is_tandem = false;
        this.is_swept = false;
        this.is_heli = false;

        this.hstab_sel = 0;
        this.hstab_count = 1;
        this.hstab_list = [];
        for (const elem of js["hstab"]) {
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
        for (const elem of js["vstab"]) {
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

    public toJSON() {
        return {
            hstab_sel: this.hstab_sel,
            hstab_count: this.hstab_count,
            vstab_sel: this.vstab_sel,
            vstab_count: this.vstab_count,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.hstab_sel);
        s.PushNum(this.hstab_count);
        s.PushNum(this.vstab_sel);
        s.PushNum(this.vstab_count);
    }

    public deserialize(d: Deserialize) {
        this.hstab_sel = d.GetNum();
        this.hstab_count = d.GetNum();
        this.vstab_sel = d.GetNum();
        this.vstab_count = d.GetNum();
    }

    public GetHStabList() {
        return this.hstab_list;
    }

    public GetVStabList() {
        return this.vstab_list;
    }

    public GetHStabType() {
        return this.hstab_sel;
    }

    public SetHStabType(num: number) {
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

    public GetHValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.hstab_list.length).fill(false);
            if (this.have_tail)
                lst[0] = true;
            else
                lst[1] = true;
        } else {
            for (const t of this.hstab_list) {
                if ((t.name == "The Wings" || t.name == "Outboard")
                    && !(this.is_tandem || this.is_swept))
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }

    public GetIsVTail() {
        return this.hstab_list[this.hstab_sel].is_vtail;
    }

    private SetVTail() {
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

    public GetVStabType() {
        return this.vstab_sel;
    }

    public SetVStabType(num: number) {
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

    public GetVValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.vstab_list.length).fill(false);
            lst[0] = true;
        } else {
            for (const t of this.vstab_list) {
                if (t.name == "Outboard" && !this.CanVOutboard())
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }

    public GetHStabCount() {
        return this.hstab_count;
    }

    public SetHStabCount(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
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

    public GetHStabIncrement() {
        if (this.hstab_sel >= 0)
            return this.hstab_list[this.hstab_sel].increment;
        return 1;
    }

    public GetVStabCount() {
        return this.vstab_count;
    }

    public SetVStabCount(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
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

    public GetVStabIncrement() {
        if (this.vstab_sel >= 0)
            return this.vstab_list[this.vstab_sel].increment;
        return 1;
    }

    public SetEngineCount(num: number) {
        this.engine_count = num;
    }

    public GetIsTandem() {
        return this.is_tandem;
    }

    public SetIsTandem(is: boolean) {
        this.is_tandem = is;
    }

    public SetIsSwept(is: boolean) {
        this.is_swept = is;
    }

    public CanVOutboard() {
        return this.is_swept || this.is_tandem || (this.hstab_list[this.hstab_sel].is_canard && this.hstab_count > 0);
    }

    public GetVOutboard() {
        return this.vstab_list[this.vstab_sel].name == "Outboard";
    }

    public GetCanard() {
        return this.hstab_list[this.hstab_sel].is_canard;
    }

    public SetLiftingArea(num: number) {
        this.lifting_area = num;
    }

    public SetHaveTail(use: boolean) {
        this.have_tail = use;
        if (!use) {
            const hvalid = this.GetHValidList();
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 2;
            }
            const vvalid = this.GetVValidList();
            if (!vvalid[this.vstab_sel]) {
                if (!vvalid[1]) //If it was outboard, set it to canard so we can have outboard vstab.
                    this.hstab_sel = 2;
                this.vstab_sel = 1;
                if (this.vstab_count % 2 != 0)
                    this.vstab_count++;
            }
        }
        if (this.is_heli) {
            if (this.have_tail) {
                this.hstab_sel = 0;
            } else {
                this.hstab_sel = 1;
            }
            this.hstab_count = 1;
        }
    }

    public SetHelicopter(is: boolean) {
        this.is_heli = is;
        if (is) {
            this.have_tail = true;
            this.is_tandem = false;
            this.is_swept = false;
            this.lifting_area = 0;
            this.engine_count = 0;
            this.hstab_sel = 0;
            this.hstab_count = 1;
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public wing_drag: number;
    public PartStats() {
        const hvalid = this.GetHValidList();
        if (!hvalid[this.hstab_sel]) {
            this.hstab_sel = 0;
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 0;
                this.hstab_count = 0;
            }
        }
        const vvalid = this.GetVValidList();
        if (!vvalid[this.vstab_sel]) {
            this.vstab_sel = 0;
            if (!vvalid[this.vstab_sel]) {
                this.vstab_sel = 0;
                this.vstab_count = 0;
            }
        }

        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            var drag = 0;
            if (this.is_heli) {
                drag = Math.floor(1.0e-6 + this.wing_drag / 8 * this.hstab_list[this.hstab_sel].dragfactor);
                stats.drag += Math.max(Math.ceil(1 * this.hstab_list[this.hstab_sel].dragfactor), drag);
            } else {
                drag = Math.floor(1.0e-6 + this.wing_drag / 4 * this.hstab_list[this.hstab_sel].dragfactor);
                stats.drag += Math.max(1, drag);
            }
        }
        else if (this.hstab_sel < 0 || this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(1.0e-6 + this.lifting_area / 2);
            stats.liftbleed += 5;
        }

        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            var drag = 0;
            if (this.is_heli) {
                drag = Math.floor(1.0e-6 + this.wing_drag / 16 * this.vstab_list[this.vstab_sel].dragfactor);
                stats.drag += Math.max(Math.ceil(1 * this.hstab_list[this.hstab_sel].dragfactor), drag);
            } else {
                drag = Math.floor(1.0e-6 + this.wing_drag / 8 * this.vstab_list[this.vstab_sel].dragfactor);
                stats.drag += Math.max(1, drag);
            }
        }
        else if (this.vstab_sel < 0 || (this.vstab_list[this.vstab_sel].increment != 0 || (this.vstab_list[this.vstab_sel].increment == 0 && this.hstab_count == 0))) {
            stats.latstab -= this.lifting_area;
        }

        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));

        //Pairs of stabilizers
        if (this.vstab_sel >= 0 && this.vstab_list[this.vstab_sel].increment != 0) {
            var leftovers = Math.max(0, this.hstab_count - 1);
            const es_pairs = Math.min(this.engine_count - 1, this.vstab_count - 1);
            leftovers += Math.max(0, this.vstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        } else {
            const es_pairs = Math.max(0, Math.min(this.engine_count - 1, this.hstab_count - 1));
            leftovers = Math.max(0, this.hstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        }

        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
