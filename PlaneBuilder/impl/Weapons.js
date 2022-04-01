import { Part } from "./Part.js";
import { Stats, era2numHh, WARNING_COLOR } from "./Stats.js";
import { lu } from "./Localization.js";
import { WeaponSystem } from "./WeaponSystem.js";
import { SynchronizationType, ProjectileType } from "./Weapon.js";
import { StringFmt } from "../string/index.js";
import * as js from "../weapons.json";
export { ProjectileType, SynchronizationType, ActionType } from "./Weapon";
export class Weapons extends Part {
    constructor() {
        super();
        this.direction_list = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
        this.synchronization_list = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate", "No Interference"];
        this.action_list = [
            { name: "Standard Action" },
            { name: "Mechanical Action" },
            { name: "Gast Principle" },
            { name: "Rotary_Gun" },
        ];
        this.projectile_list = [
            { name: "Standard" },
            { name: "Heat Ray" },
            // { name: "Gyrojets" },
            { name: "Pneumatic" },
        ];
        this.weapon_list = [];
        for (const elem of js["weapons"]) {
            const weap = {
                name: elem["name"],
                abrv: elem["abrv"],
                era: elem["era"],
                size: elem["size"],
                stats: new Stats(elem),
                damage: elem["damage"],
                hits: elem["hits"],
                ammo: elem["ammo"],
                ap: elem["ap"],
                jam: elem["jam"].toString(),
                reload: elem["reload"],
                rapid: elem["rapid"],
                synched: elem["synched"],
                shells: elem["shells"],
                can_action: elem["can_action"],
                can_projectile: elem["can_projectile"],
                deflection: elem["deflection"],
            };
            this.weapon_list.push(weap);
        }
        const pred = (a, b) => {
            const cvt2num = (l, r) => {
                if (l < r)
                    return -1;
                if (r < l)
                    return 1;
                return 0;
            };
            if (a.size != b.size)
                return cvt2num(a.size, b.size);
            else if (a.era != b.era)
                return cvt2num(era2numHh(a.era), era2numHh(b.era));
            else if (a.damage != b.damage)
                return cvt2num(a.damage, b.damage);
            else
                return cvt2num(a.name, b.name);
        };
        this.wl_permute = Array.from(Array(this.weapon_list.length).keys())
            .sort((a, b) => { return pred(this.weapon_list[a], this.weapon_list[b]); });
        const p2 = [];
        for (let i = 0; i < this.wl_permute.length; i++) {
            p2.push(this.wl_permute.findIndex((value) => { return value == i; }));
        }
        this.wl_permute = p2;
        this.weapon_list = this.weapon_list.sort(pred);
        this.weapon_sets = [];
        this.brace_count = 0;
        this.isheli = false;
    }
    toJSON() {
        const lst = [];
        for (const ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            weapon_systems: lst,
            brace_count: this.brace_count,
        };
    }
    fromJSON(js, json_version) {
        this.weapon_sets = [];
        const lst = js["weapon_systems"];
        for (const wsj of lst) {
            const ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.fromJSON(wsj, json_version);
            this.weapon_sets.push(ws);
        }
        if (json_version > 10.35) {
            this.brace_count = js["brace_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.weapon_sets.length);
        for (const ws of this.weapon_sets) {
            ws.serialize(s);
        }
        s.PushNum(this.brace_count);
    }
    deserialize(d) {
        this.weapon_sets = [];
        const wlen = d.GetNum();
        for (let i = 0; i < wlen; i++) {
            const ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.deserialize(d);
            this.weapon_sets.push(ws);
        }
        if (d.version > 10.35)
            this.brace_count = d.GetNum();
    }
    GetWeaponList() {
        return this.weapon_list;
    }
    GetDirectionList() {
        return this.direction_list;
    }
    GetSynchronizationList() {
        return this.synchronization_list;
    }
    SetWeaponSetCount(num) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapon_sets.length) {
            const w = new WeaponSystem(this.weapon_list, this.wl_permute);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        this.CalculateStats();
    }
    GetWeaponSets() {
        return this.weapon_sets;
    }
    CountTractorSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyTractorSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountPusherSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyPusherSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CleanFreelyAccessible() {
        var has_fa = Array(this.cockpit_count).fill(false);
        for (const ws of this.weapon_sets) {
            const seat = ws.GetSeat();
            for (const w of ws.GetWeapons()) {
                if (w.GetFreeAccessible() && has_fa[seat]) {
                    w.SetFreeAccessible(false);
                }
                else if (w.GetFreeAccessible()) {
                    has_fa[seat] = true;
                }
            }
        }
        for (const ws of this.weapon_sets) {
            const seat = ws.GetSeat();
            for (const w of ws.GetWeapons()) {
                if ((has_fa[seat] && !w.GetFreeAccessible()) || w.GetWing()) {
                    w.can_free_accessible = false;
                }
                else {
                    w.can_free_accessible = true;
                }
            }
        }
    }
    RemoveOneTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    RemoveOnePusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyPusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    CanTractorSpinner() {
        return this.CountTractorSpinner() + this.CountArtyTractorSpinner() < this.tractor_spinner_count;
    }
    CanArtyTractorSpinner() {
        return this.CountArtyTractorSpinner() < this.tractor_arty_spinner_count;
    }
    CanPusherSpinner() {
        return this.CountPusherSpinner() + this.CountArtyTractorSpinner() < this.pusher_spinner_count;
    }
    CanArtyPusherSpinner() {
        return this.CountArtyPusherSpinner() < this.pusher_arty_spinner_count;
    }
    SetTractorInfo(info) {
        this.has_tractor = info.have;
        this.tractor_spinner_count = info.spin_count;
        this.tractor_arty_spinner_count = info.arty_spin_count;
    }
    SetPusherInfo(info) {
        this.has_pusher = info.have;
        this.pusher_spinner_count = info.spin_count;
        this.pusher_arty_spinner_count = info.arty_spin_count;
    }
    GetActionList() {
        return this.action_list;
    }
    GetProjectileList() {
        return this.projectile_list;
    }
    GetBraceCount() {
        return this.brace_count;
    }
    SetBraceCount(num) {
        if (num < 0 || num != num)
            num = 0;
        num -= num % 3;
        this.brace_count = num;
        this.CalculateStats();
    }
    SetHavePropeller(have) {
        for (const ws of this.weapon_sets) {
            ws.SetHavePropeller(have);
        }
    }
    SetCanWing(can) {
        for (const ws of this.weapon_sets) {
            ws.SetCanWing(can);
        }
    }
    SetStickyGuns(num) {
        for (const ws of this.weapon_sets) {
            ws.SetStickyGuns(num);
        }
    }
    GetWingWeight() {
        var sum = 0;
        for (const w of this.weapon_sets) {
            sum += w.GetWingWeight();
        }
        return sum;
    }
    GetSeatList() {
        const lst = [];
        for (let i = 0; i < this.cockpit_count; i++) {
            lst.push(lu("Seat #", i + 1));
        }
        return lst;
    }
    GetArmedSeats() {
        const lst = Array(this.cockpit_count).fill(false);
        for (const ws of this.weapon_sets) {
            lst[ws.GetSeat()] = true;
        }
        return lst;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (const set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }
    SetNumberOfCockpits(num) {
        this.cockpit_count = num;
    }
    SetHeli(value) {
        this.isheli = value;
    }
    PartStats() {
        var stats = new Stats();
        //Update Freely Accessible state.
        // while (this.CountFreelyAccessible() > this.cockpit_count) {
        //     this.RemoveOneFreelyAccessible();
        // }
        this.CleanFreelyAccessible();
        while (this.CountArtyTractorSpinner() > this.tractor_arty_spinner_count) {
            this.RemoveOneArtyTractorSpinner();
        }
        while (this.CountTractorSpinner() > this.tractor_spinner_count) {
            this.RemoveOneTractorSpinner();
        }
        while (this.CountArtyPusherSpinner() > this.pusher_arty_spinner_count) {
            this.RemoveOneArtyPusherSpinner();
        }
        while (this.CountPusherSpinner() > this.pusher_spinner_count) {
            this.RemoveOnePusherSpinner();
        }
        //Wing reinforcement. Do this so it gets included in parts display.
        var wing_size = 0;
        if (this.cant_type == 0)
            wing_size = 4;
        else if (this.cant_type == 1)
            wing_size = 8;
        else
            wing_size = 16;
        //Create list of every weapon size and a ref to the weapon
        const slist = [];
        for (const ws of this.weapon_sets) {
            for (const w of ws.GetWeapons()) {
                w.wing_reinforcement = false;
                const s = { s: 0, w: w };
                if (w.GetWing()) {
                    s.s = (w.GetCount() * this.weapon_list[ws.GetWeaponSelected()].size);
                    slist.push(s);
                }
            }
        }
        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.s - b.s; });
        for (const s of slist) {
            if (wing_size >= 0) {
                wing_size -= s.s;
            }
            if (wing_size < 0) {
                s.w.wing_reinforcement = true;
            }
        }
        for (const ws of this.weapon_sets) {
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.CanArtyTractorSpinner(), this.has_pusher, this.CanPusherSpinner(), this.CanArtyPusherSpinner(), this.isheli);
            ws.has_cantilever = this.cant_type > 0;
            stats = stats.Add(ws.PartStats());
        }
        //Weapon braces cost 1/3.  Should always be multiple of 3
        stats.cost += this.brace_count / 3;
        if (this.brace_count > 0) {
            stats.warnings.push({
                source: lu("Weapons Braces"),
                warning: lu("Weapons Braces Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        //Wing-tip weight: -1 control for every 5 mass
        stats.control -= Math.floor(1.0e-6 + this.GetWingWeight() / 5);
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        for (let i = 0; i < this.weapon_sets.length; i++) {
            const set = this.weapon_sets[i];
            if (set.GetProjectile() == ProjectileType.HEATRAY || set.IsLightningArc()) {
                const charges = set.GetHRCharges();
                //Negate the values for display
                for (let c = 0; c < charges.length; c++)
                    charges[c] *= -1;
                value.equipment.push({
                    source: lu("Vital Part Weapon Set", i, set.GetFinalWeapon().abrv),
                    charge: StringFmt.Join('/', charges),
                });
            }
        }
        return value;
    }
}
