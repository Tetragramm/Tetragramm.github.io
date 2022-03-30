import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
export class Radiator extends Part {
    constructor(tl, ml, cl) {
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
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant,
            harden_cool: this.harden_cool,
        };
    }
    fromJSON(js, json_version) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
        if (json_version > 10.85) {
            this.harden_cool = js["harden_cool"];
        }
    }
    serialize(s) {
        s.PushNum(this.idx_type);
        s.PushNum(this.idx_mount);
        s.PushNum(this.idx_coolant);
        s.PushBool(this.harden_cool);
    }
    derserialize(d) {
        this.idx_type = d.GetNum();
        this.idx_mount = d.GetNum();
        this.idx_coolant = d.GetNum();
        if (d.version > 10.85) {
            this.harden_cool = d.GetBool();
        }
    }
    GetTypeList() {
        return this.type_list;
    }
    GetMountList() {
        return this.mount_list;
    }
    GetCoolantList() {
        return this.coolant_list;
    }
    CanType() {
        const can = [...Array(this.type_list.length).fill(true)];
        for (let i = 0; i < this.type_list.length; i++) {
            if (this.type_list[i].name == "Evaporation" && this.metal_area < this.engine_count * 5)
                can[i] = false;
        }
        return can;
    }
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetParasol(has) {
        this.has_parasol = has;
        if (!this.CanMount()[this.idx_mount])
            this.idx_mount = 0;
    }
    CanMount() {
        const can = [...Array(this.mount_list.length).fill(true)];
        for (let i = 0; i < this.mount_list.length; i++) {
            if (this.mount_list[i].name == "High Offset" && !this.has_parasol)
                can[i] = false;
        }
        return can;
    }
    SetMountIndex(num) {
        if (this.CanMount()[num]) {
            this.idx_mount = num;
            this.CalculateStats();
        }
    }
    GetMountIndex() {
        return this.idx_mount;
    }
    SetCoolantIndex(num) {
        this.idx_coolant = num;
        this.CalculateStats();
    }
    GetCoolantIndex() {
        return this.idx_coolant;
    }
    SetNeedCool(num, engnum) {
        this.need_cool = num;
        this.engine_count = engnum;
    }
    SetMetalArea(num) {
        this.metal_area = num;
        if (!this.CanType()[this.idx_type])
            this.idx_type = 0;
    }
    GetHarden() {
        return this.harden_cool;
    }
    SetHarden(use) {
        this.harden_cool = use;
        this.CalculateStats();
    }
    VerifyHarden() {
        if (this.coolant_list[this.idx_coolant].harden) {
            this.harden_cool = true;
        }
    }
    GetIsFlammable() {
        return this.coolant_list[this.idx_coolant].flammable;
    }
    PartStats() {
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
