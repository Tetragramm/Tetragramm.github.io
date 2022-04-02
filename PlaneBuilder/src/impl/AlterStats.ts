import { Part } from "./Part";
import { Stats } from "./Stats";
import { Serialize, Deserialize } from "./Serialize";

export class AlterStats extends Part {
    public custom_parts: { name: string, stats: Stats, qty: number }[];

    constructor() {
        super();
        let cp_json = JSON.parse(window.localStorage.getItem('CustomParts'));
        if (!cp_json) {
            cp_json = [];
            window.localStorage.setItem('CustomParts', JSON.stringify([]));
        }
        this.custom_parts = [];
        for (const elem of cp_json) {
            this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: 0 });
        }
    }

    public toJSON() {
        const plist = [];
        const plist_save = [];
        for (const p of this.custom_parts) {
            plist_save.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
        }
        window.localStorage.setItem('CustomParts', JSON.stringify(plist_save));
        return {
            part_list: plist,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        for (const p of this.custom_parts) {
            p.qty = 0;
        }

        for (const elem of js["part_list"]) {
            const idx = this.custom_parts.findIndex((value) => { return value.name == elem["name"]; });
            if (idx == -1) {
                this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: elem["qty"] });
            } else {
                this.custom_parts[idx].qty = elem["qty"];
            }
        }
    }

    public serialize(s: Serialize) {
        const plist = [];
        for (const p of this.custom_parts) {
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats, qty: p.qty });
        }
        s.PushNum(plist.length);
        for (const p of plist) {
            s.PushString(p.name);
            p.stats.serialize(s);
            s.PushNum(p.qty);
        }
    }

    public deserialize(d: Deserialize) {

        for (const p of this.custom_parts) {
            p.qty = 0;
        }

        const pcount = d.GetNum();
        for (let i = 0; i < pcount; i++) {
            const name = d.GetString();
            const stats = new Stats();
            stats.deserialize(d);
            const qty = d.GetNum();
            var idx = this.custom_parts.findIndex((value) => { return value.name == name; });
            if (idx == -1) {
                idx = this.custom_parts.length;
                this.custom_parts.push({ name: name, stats: stats, qty: qty });
            } else {
                this.custom_parts[idx].qty = qty;
            }
        }
    }

    public ClearAll() {
        for (const p of this.custom_parts) {
            p.qty = 0;
        }
    }


    public AddPart(name: string, stats: Stats) {
        var sumstats = 0;
        sumstats += Math.abs(stats.drag);
        sumstats += Math.abs(stats.mass);
        sumstats += Math.abs(stats.wetmass);
        sumstats += Math.abs(stats.bomb_mass);
        sumstats += Math.abs(stats.cost);
        sumstats += Math.abs(stats.upkeep);
        sumstats += Math.abs(stats.liftbleed);
        sumstats += Math.abs(stats.wingarea);
        sumstats += Math.abs(stats.control);
        sumstats += Math.abs(stats.pitchstab);
        sumstats += Math.abs(stats.latstab);
        sumstats += Math.abs(stats.maxstrain);
        sumstats += Math.abs(stats.structure);
        sumstats += Math.abs(stats.toughness);
        sumstats += Math.abs(stats.power);
        sumstats += Math.abs(stats.fuelconsumption);
        sumstats += Math.abs(stats.fuel);
        sumstats += Math.abs(stats.charge);
        sumstats += Math.abs(stats.crashsafety);
        sumstats += Math.abs(stats.visibility);
        sumstats += Math.abs(stats.escape);
        sumstats += Math.abs(stats.reliability);
        sumstats += Math.abs(stats.warnings.length);
        if (sumstats == 0) {
            return;
        }

        const idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts[idx].stats = stats;
        } else {
            this.custom_parts.push({ name: name, stats: stats, qty: 0 });
        }
        this.custom_parts.sort((a, b) => a.name.localeCompare(b.name));
        this.CalculateStats();
    }

    public RemovePart(name: string) {
        const idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts.splice(idx, 1);
        }
        this.CalculateStats();
    }

    public GetParts() {
        return this.custom_parts;
    }

    public SetUsedPart(idx: number, qty: number) {
        this.custom_parts[idx].qty = qty;
        this.CalculateStats();
    }

    public PartStats(): Stats {
        var stats = new Stats();
        for (const part of this.custom_parts) {
            if (part.qty > 0) {
                let pstats = part.stats.Clone();
                pstats = pstats.Multiply(part.qty);
                stats = stats.Add(pstats);
            }
        }
        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const battery_storage = 0;
        var equipment: { source: string, charge: string }[] = [];

        for (const part of this.custom_parts) {
            if (part.qty > 0) {
                equipment = this.FormatEquipment(equipment, part.name, part.stats.charge);
            }
        }

        return { storage: battery_storage, equipment: equipment };
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}
