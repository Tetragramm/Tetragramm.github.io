/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Radiator extends Part {
    private type_list: { name: string, stats: Stats, dragpercool: number }[];
    private idx_type: number;
    private mount_list: { name: string, stats: Stats }[];
    private idx_mount: number;
    private coolant_list: { name: string, stats: Stats }[];
    private idx_coolant: number;
    private need_cool: number;
    private has_parasol: boolean;

    constructor(tl: { name: string, stats: Stats, dragpercool: number }[],
        ml: { name: string, stats: Stats }[], cl: { name: string, stats: Stats }[]) {
        super();
        this.need_cool = 0;
        this.idx_type = 0;
        this.idx_mount = 0;
        this.idx_coolant = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
    }

    public toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant
        }
    }

    public fromJSON(js: JSON) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
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
        var can = [...Array(this.mount_list.length).fill(true)];
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

    public SetNeedCool(num: number) {
        this.need_cool = num;
    }

    public PartStats(): Stats {
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);

        stats.drag += Math.ceil(this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}