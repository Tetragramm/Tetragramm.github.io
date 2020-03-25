// export { Stabilizers };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Stabilizers extends Part {
    private have_tail: boolean;
    private is_tandem: boolean;
    private is_swept: boolean;
    private wing_area: number;
    private engine_count: number;

    private hstab_list: {
        name: string, is_canard: boolean, increment: number, stats: Stats,
        dragfactor: number, is_vtail: boolean
    }[];
    private vstab_list: {
        name: string, increment: number, stats: Stats,
        dragfactor: number, is_vtail: boolean
    }[];

    private hstab_sel: number;
    private hstab_count: number;
    private vstab_sel: number;
    private vstab_count: number;

    constructor(js: JSON) {
        super();

        this.have_tail = false;
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
                is_vtail: elem["is_vtail"]
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
                is_vtail: elem["is_vtail"]
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

    public fromJSON(js: JSON) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
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
        for (let t of this.hstab_list) {
            if (t.name == "The Wings" && !(this.is_tandem || this.is_swept))
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
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
        if (this.vstab_list[num].name == "Outboard" && !this.GetVOutboard())
            return;

        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
        }

        this.vstab_sel = num;


        this.SetVStabCount(this.vstab_count);

        this.CalculateStats();
    }

    public GetVValidList() {
        var lst = [];
        for (let t of this.vstab_list) {
            if (t.name == "Outboard" && !this.GetVOutboard())
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }

    public GetHStabCount() {
        return this.hstab_count;
    }

    public SetHStabCount(num: number) {
        if (num != num)
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

    public GetHStabIncrement() {
        return this.hstab_list[this.hstab_sel].increment;
    }

    public GetVStabCount() {
        return this.vstab_count;
    }

    public SetVStabCount(num: number) {
        if (num != num)
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

    public GetVStabIncrement() {
        return this.vstab_list[this.vstab_sel].increment;
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

    public GetVOutboard() {
        return this.is_swept || this.is_tandem || this.hstab_list[this.hstab_sel].is_canard;
    }

    public SetWingArea(num: number) {
        this.wing_area = num;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
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
            stats.drag += Math.floor(this.wing_area / 5 * this.hstab_list[this.hstab_sel].dragfactor);
        }
        else if (this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(this.wing_area / 2);
            stats.liftbleed += 5;
        }

        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 10 * this.vstab_list[this.vstab_sel].dragfactor);
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