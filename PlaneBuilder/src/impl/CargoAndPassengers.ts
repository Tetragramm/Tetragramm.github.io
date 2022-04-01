import { Cargo_PS, Part } from "./Part.js";
import { Stats } from "./Stats.js";
import { Serialize, Deserialize } from "./Serialize.js";

export class CargoAndPassengers extends Part {
    private cargo_list: { name: string, stats: Stats }[];
    private cargo_sel: number;

    constructor(js: Cargo_PS) {
        super();
        this.cargo_list = [];
        for (const elem of js["spaces"]) {
            this.cargo_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cargo_sel = 0;
    }

    public toJSON() {
        return {
            space_sel: this.cargo_sel,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.cargo_sel = js["space_sel"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.cargo_sel);
    }

    public deserialize(d: Deserialize) {
        this.cargo_sel = d.GetNum();
    }

    public GetSpaceList() {
        return this.cargo_list;
    }

    public GetSpace() {
        return this.cargo_sel;
    }

    public SetSpace(num: number) {
        this.cargo_sel = num;
        this.CalculateStats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.cargo_list[this.cargo_sel].stats);

        stats.bomb_mass += stats.reqsections * 3;

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);

        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const battery_storage = 0;
        const equipment: { source: string, charge: string }[] = [];

        return { storage: battery_storage, equipment: equipment };
    }
}
