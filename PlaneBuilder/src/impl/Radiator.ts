import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
import { Serialize, Deserialize } from "./Serialize.js";

export class Radiator extends Part {
    private type_list: { name: string, stats: Stats, dragpercool: number }[];
    private idx_type: number;
    private mount_list: { name: string, stats: Stats }[];
    private idx_mount: number;
    private coolant_list: { name: string, harden: boolean, flammable: boolean, stats: Stats }[];
    private idx_coolant: number;
    private need_cool: number;
    private engine_count: number;
    private has_parasol: boolean;
    private metal_area: number;
    private harden_cool: boolean;

    constructor(tl: { name: string, stats: Stats, dragpercool: number }[],
        ml: { name: string, stats: Stats }[], cl: { name: string, harden: boolean, flammable: boolean, stats: Stats }[]) {
        super();
        this.need_cool = 0;
        this.idx_type = 1;
        this.idx_mount = 1;
        this.idx_coolant = 0;
        this.metal_area = 0;
        this.engine_count = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
        this.harden_cool = false;
    }

    public toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant,
            harden_cool: this.harden_cool,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
        if (json_version > 10.85) {
            this.harden_cool = js["harden_cool"];
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.idx_type);
        s.PushNum(this.idx_mount);
        s.PushNum(this.idx_coolant);
        s.PushBool(this.harden_cool);
    }

    public derserialize(d: Deserialize) {
        this.idx_type = d.GetNum();
        this.idx_mount = d.GetNum();
        this.idx_coolant = d.GetNum();
        if (d.version > 10.85) {
            this.harden_cool = d.GetBool();
        }
    }

    public GetTypeList() {
        return this.type_list;
    }

    public GetMountList() {
        return this.mount_list;
    }

    public GetCoolantList() {
        return this.coolant_list;
    }

    public CanType() {
        const can = [...Array(this.type_list.length).fill(true)];
        for (let i = 0; i < this.type_list.length; i++) {
            if (this.type_list[i].name == "Evaporation" && this.metal_area < this.engine_count * 5)
                can[i] = false;
        }
        return can;
    }

    public SetTypeIndex(num: number) {
        this.idx_type = num;
        this.CalculateStats();
    }

    public GetTypeIndex() {
        return this.idx_type;
    }

    public SetParasol(has: boolean) {
        this.has_parasol = has;
        if (!this.CanMount()[this.idx_mount])
            this.idx_mount = 0;
    }

    public CanMount() {
        const can = [...Array(this.mount_list.length).fill(true)];
        for (let i = 0; i < this.mount_list.length; i++) {
            if (this.mount_list[i].name == "High Offset" && !this.has_parasol)
                can[i] = false;
        }
        return can;
    }

    public SetMountIndex(num: number) {
        if (this.CanMount()[num]) {
            this.idx_mount = num;
            this.CalculateStats();
        }
    }

    public GetMountIndex() {
        return this.idx_mount;
    }

    public SetCoolantIndex(num: number) {
        this.idx_coolant = num;
        this.CalculateStats();
    }

    public GetCoolantIndex() {
        return this.idx_coolant;
    }

    public SetNeedCool(num: number, engnum: number) {
        this.need_cool = num;
        this.engine_count = engnum;
    }

    public SetMetalArea(num: number) {
        this.metal_area = num;
        if (!this.CanType()[this.idx_type])
            this.idx_type = 0;
    }

    public GetHarden() {
        return this.harden_cool;
    }

    public SetHarden(use: boolean) {
        this.harden_cool = use;
        this.CalculateStats();
    }

    private VerifyHarden() {
        if (this.coolant_list[this.idx_coolant].harden) {
            this.harden_cool = true;
        }
    }

    public GetIsFlammable(): boolean {
        return this.coolant_list[this.idx_coolant].flammable;
    }

    public PartStats(): Stats {
        this.VerifyHarden();

        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);

        stats.drag += Math.ceil(-1.0e-6 + this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));

        if (this.harden_cool) {
            stats.cost += 2;
        }

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
