/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class AlterStats extends Part {
    public custom_parts: { name: string, stats: Stats }[];
    private part_store: { idx: number, qty: number }[];

    constructor() {
        super();
        var cp_json = JSON.parse(window.localStorage.getItem('test.CustomParts'));
        if (!cp_json) {
            cp_json = [];
            window.localStorage.setItem('test.CustomParts', JSON.stringify([]));
        }
        for (let elem of cp_json) {
            this.custom_parts.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.part_store = [];
    }

    public toJSON() {
        var plist = [];
        for (let p of this.part_store) {
            plist.push({ name: this.custom_parts[p.idx].name, stats: this.custom_parts[p.idx].stats.toJSON(), qty: p.qty });
        }
        return {
            part_list: plist,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.part_store = [];
        for (let elem of js["part_list"]) {
            var idx = this.custom_parts.findIndex((value) => { return value.name == elem["name"]; });
            if (idx == -1) {
                idx = this.custom_parts.length;
                this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]) });
            }
            this.part_store.push({ idx: idx, qty: elem["qty"] });
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.part_store.length);
        for (let p of this.part_store) {
            s.PushString(this.custom_parts[p.idx].name);
            this.custom_parts[p.idx].stats.serialize(s);
            s.PushNum(p.qty);
        }
    }

    public deserialize(d: Deserialize) {
        this.part_store = [];
        var pcount = d.GetNum();
        for (let i = 0; i < pcount; i++) {
            let name = d.GetString();
            let stats = new Stats();
            stats.deserialize(d);
            let qty = d.GetNum();

            var idx = this.custom_parts.findIndex((value) => { return value.name == name; });
            if (idx == -1) {
                idx = this.custom_parts.length;
                this.custom_parts.push({ name: name, stats: stats });
            }
            this.part_store.push({ idx: idx, qty: qty });
        }
    }


    public AddPart(name: string, stats: Stats) {
        var idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts[idx].stats = stats;
        } else {
            this.custom_parts.push({ name: name, stats: stats });
        }
    }

    public RemovePart(name: string) {
        var idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts = this.custom_parts.splice(idx, 1);
        }
    }

    public GetParts() {
        return this.custom_parts;
    }

    public GetUsedParts() {
        return this.part_store;
    }

    public SetUsedPart(which: number, idx: number, qty: number) {
        if (which == this.part_store.length) {
            this.part_store.push({ idx: idx, qty: qty });
        } else if (which < this.part_store.length) {
            if (qty != 0 && idx != -1) {
                this.part_store[which].idx = idx;
                this.part_store[which].qty = qty;
            } else {
                this.part_store = this.part_store.splice(which, 1);
            }
        } else {
            console.error("Item outside of list, got " + which.toString() + " for list of size " + this.part_store.length.toString());
        }
    }

    public PartStats(): Stats {
        var stats = new Stats();
        for (let part of this.part_store) {
            let pstats = this.custom_parts[part.idx].stats.Clone();
            pstats = pstats.Multiply(part.qty);
            stats = stats.Add(pstats);
        }
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}