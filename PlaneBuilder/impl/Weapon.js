import { Part } from "./Part.js";
import { lu } from "./Localization.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
export var SynchronizationType;
(function (SynchronizationType) {
    SynchronizationType[SynchronizationType["NONE"] = -1] = "NONE";
    SynchronizationType[SynchronizationType["INTERRUPT"] = 0] = "INTERRUPT";
    SynchronizationType[SynchronizationType["SYNCH"] = 1] = "SYNCH";
    SynchronizationType[SynchronizationType["SPINNER"] = 2] = "SPINNER";
    SynchronizationType[SynchronizationType["DEFLECT"] = 3] = "DEFLECT";
    SynchronizationType[SynchronizationType["NO_INTERFERENCE"] = 4] = "NO_INTERFERENCE";
    SynchronizationType[SynchronizationType["ENUM_MAX"] = 5] = "ENUM_MAX";
})(SynchronizationType || (SynchronizationType = {}));
export var ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["BULLETS"] = 0] = "BULLETS";
    ProjectileType[ProjectileType["HEATRAY"] = 1] = "HEATRAY";
    ProjectileType[ProjectileType["PNEUMATIC"] = 2] = "PNEUMATIC";
    ProjectileType[ProjectileType["ENUM_MAX"] = 3] = "ENUM_MAX";
    ProjectileType[ProjectileType["GYROJETS"] = 4] = "GYROJETS";
})(ProjectileType || (ProjectileType = {}));
export var ActionType;
(function (ActionType) {
    ActionType[ActionType["STANDARD"] = 0] = "STANDARD";
    ActionType[ActionType["MECHANICAL"] = 1] = "MECHANICAL";
    ActionType[ActionType["GAST"] = 2] = "GAST";
    ActionType[ActionType["ROTARY"] = 3] = "ROTARY";
    ActionType[ActionType["ENUM_MAX"] = 4] = "ENUM_MAX";
})(ActionType || (ActionType = {}));
export class Weapon extends Part {
    constructor(weapon_type, action, projectile, fixed = false) {
        super();
        this.weapon_type = weapon_type;
        this.fixed = fixed;
        this.wing = true;
        this.covered = false;
        this.accessible = false;
        this.free_accessible = false;
        if (fixed)
            this.synchronization = SynchronizationType.NONE;
        else
            this.synchronization = SynchronizationType.INTERRUPT;
        this.w_count = 1;
        this.repeating = false;
        this.wing_reinforcement = false;
    }
    toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            w_count: this.w_count,
        };
    }
    fromJSON(js, json_version) {
        this.fixed = js["fixed"];
        this.wing = js["wing"];
        this.covered = js["covered"];
        this.accessible = js["accessible"];
        this.free_accessible = js["free_accessible"];
        this.synchronization = js["synchronization"];
        this.w_count = js["w_count"];
        if (json_version < 10.95)
            this.repeating = js["repeating"];
    }
    serialize(s) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushNum(this.w_count);
    }
    deserialize(d) {
        this.fixed = d.GetBool();
        this.wing = d.GetBool();
        this.covered = d.GetBool();
        this.accessible = d.GetBool();
        this.free_accessible = d.GetBool();
        this.synchronization = d.GetNum();
        this.w_count = d.GetNum();
        if (d.version < 10.95)
            this.repeating = d.GetBool();
    }
    SetWeaponType(weapon_type, action, projectile) {
        this.weapon_type = weapon_type;
        this.action = action;
        if (this.weapon_type.size == 16) {
            this.w_count = 1;
        }
        this.SetCount(this.w_count); //Triggers Calculate Stats
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        if (use != this.fixed) {
            if (use) {
                this.fixed = true;
            }
            else {
                this.fixed = false;
                this.synchronization = SynchronizationType.NONE;
            }
            this.CalculateStats();
        }
    }
    SetCanWing(can) {
        this.canwing = can;
        if (this.wing && !can) {
            this.wing = false;
        }
    }
    GetWing() {
        return this.wing;
    }
    CanWing() {
        return this.weapon_type.size <= 16 && this.canwing;
    }
    SetWing(use) {
        if (use && this.CanWing()) {
            this.wing = true;
            this.free_accessible = false;
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.wing = false;
        }
        this.CalculateStats();
    }
    CanCovered() {
        if (this.wing)
            return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
        else
            return !(this.GetArty() && !this.fixed);
    }
    GetCovered() {
        return this.covered;
    }
    SetCovered(use) {
        this.covered = use;
        this.CalculateStats();
    }
    GetAccessible() {
        return this.accessible || this.free_accessible;
    }
    SetAccessible(use) {
        if (use && this.free_accessible)
            use = false;
        this.accessible = use;
        this.CalculateStats();
    }
    GetFreeAccessible() {
        return this.free_accessible;
    }
    SetFreeAccessible(use) {
        if (use && !this.wing && this.can_free_accessible) {
            this.free_accessible = true;
            this.accessible = false;
        }
        else {
            this.free_accessible = false;
        }
        this.CalculateStats();
    }
    CanSynchronization() {
        const lst = [];
        for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
            lst.push(this.CanSynch(i));
        }
        return lst;
    }
    CanSynch(num) {
        if (!this.fixed && !this.wing) {
            if (!this.can_synchronize) {
                if (num == SynchronizationType.NONE)
                    return true;
                else
                    return false;
            }
            if (num == SynchronizationType.NONE || num == SynchronizationType.DEFLECT || num == SynchronizationType.NO_INTERFERENCE) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        }
        else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }
        if (this.weapon_type.name == "Fliergerflammenwerfer" &&
            !(num == SynchronizationType.NONE || num == SynchronizationType.SPINNER || num == SynchronizationType.NO_INTERFERENCE)) {
            return false;
        }
        if (this.action == ActionType.MECHANICAL && !(num == SynchronizationType.NONE || num == SynchronizationType.SYNCH ||
            (num == SynchronizationType.SPINNER && this.CanSpinner())))
            return false;
        if (this.action == ActionType.GAST && num == SynchronizationType.SPINNER)
            return false;
        if ((num == SynchronizationType.INTERRUPT || num == SynchronizationType.SYNCH)
            && !this.weapon_type.synched) {
            return false;
        }
        else if (num == SynchronizationType.SPINNER && !this.CanSpinner()) {
            return false;
        }
        else if (num == SynchronizationType.DEFLECT && this.GetArty()) {
            return false;
        }
        return true;
    }
    GetSynchronization() {
        return this.synchronization;
    }
    SetSynchronization(use) {
        if (!this.CanSynch(use)) {
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.w_count = 1;
        this.CalculateStats();
    }
    GetCount() {
        return this.w_count;
    }
    SetCount(use) {
        if (use != use) {
            use = 1;
        }
        use = Math.max(1, use);
        if (this.synchronization == SynchronizationType.SPINNER)
            use = 1;
        if (this.weapon_type.name == "Precision Rifle")
            use = 1;
        while (use * this.weapon_type.size > 16) {
            use -= 1;
        }
        this.w_count = use;
        this.CalculateStats();
    }
    CanRepeating() {
        return !this.weapon_type.rapid || this.weapon_type.reload > 0;
    }
    GetRepeating() {
        return this.repeating;
    }
    SetRepeating(use) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else
            this.repeating = false;
        this.CalculateStats();
    }
    ResolveSynch() {
        const use = this.synchronization;
        this.synchronization = SynchronizationType.ENUM_MAX;
        if (!this.CanSynch(use)) {
            for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
                if (this.CanSynch(i)) {
                    this.synchronization = i;
                    break;
                }
            }
            if (this.synchronization == SynchronizationType.ENUM_MAX) {
                //No valid synchronizations
                this.SetWing(true);
            }
        }
        else if (this.action == ActionType.MECHANICAL && use != SynchronizationType.SPINNER) {
            this.synchronization = SynchronizationType.SYNCH;
        }
        else {
            this.synchronization = use;
        }
        if (this.wing)
            this.synchronization = SynchronizationType.NONE;
        if (this.synchronization == SynchronizationType.SPINNER) {
            this.w_count = 1;
            this.covered = true;
        }
        if (this.IsLightningArc())
            this.synchronization = SynchronizationType.NO_INTERFERENCE;
    }
    GetArty() {
        return this.weapon_type.size == 16;
    }
    CanSpinner() {
        if (this.GetArty())
            return this.can_spinner && this.can_arty_spinner;
        else
            return this.can_spinner;
    }
    GetJam() {
        if (this.weapon_type.rapid) {
            const jams = this.weapon_type.jam.split('/');
            const out = [parseInt(jams[0]), parseInt(jams[1])];
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                out[0]++;
                out[1]++;
            }
            if (this.repeating) {
                out[0]++;
                out[1]++;
            }
            return out;
        }
        else {
            var ret = parseInt(this.weapon_type.jam);
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                ret += 1;
            }
            if (this.repeating) {
                ret += 1;
            }
            return ret;
        }
    }
    IsLightningArc() {
        return this.weapon_type.name == "Lightning Arc";
    }
    SetTurret(is) {
        this.turret = is;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        this.ResolveSynch();
        if (!this.CanCovered() && this.covered)
            this.covered = false;
        if (this.weapon_type.size == 16)
            this.covered = this.fixed;
        var size = 0;
        for (let i = 0; i < this.w_count; i++) {
            stats = stats.Add(this.weapon_type.stats);
            size += this.weapon_type.size;
        }
        //Covered Cost
        if (this.covered) {
            var cost = 0;
            if (this.weapon_type.size <= 1) {
                cost = 0;
            }
            else if (this.weapon_type.size <= 2) {
                cost = 1;
            }
            else if (this.weapon_type.size <= 4) {
                cost = 2;
            }
            else if (this.weapon_type.size <= 8) {
                cost = 5;
            }
            else if (this.weapon_type.size <= 16) {
                cost = 0;
            }
            cost *= this.w_count;
            if (!this.fixed)
                cost *= 2;
            if (this.synchronization != SynchronizationType.SPINNER) {
                stats.cost += cost;
            }
            stats.drag *= 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing && !this.covered)
            stats.drag += this.w_count;
        //Arty size weapon turrets need a section
        //Arty weapons in the fuselage need a section
        if ((this.turret && size > 8) || this.weapon_type.size == 16)
            stats.reqsections += 1;
        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(1.0e-6 + this.w_count / 2));
        }
        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            }
            else if (size <= 4) {
                stats.cost += 1;
            }
            else if (size <= 8) {
                stats.mass += 1;
                stats.cost += 3;
            }
            else if (size <= 16) {
                stats.mass += 2;
                stats.cost += 5;
            }
            else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }
        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += this.w_count * 2;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 2;
            }
            stats.era.push({ name: lu("Interruptor Gear"), era: lu("WWI") });
        }
        else if (this.synchronization == SynchronizationType.SYNCH && this.action != ActionType.MECHANICAL) {
            stats.cost += this.w_count * 3;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 3;
            }
            stats.era.push({ name: lu("Synchronization Gear"), era: lu("Roaring 20s") });
            //synchronization == 2 is spinner and costs nothing.
        }
        else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: lu(this.weapon_type.name),
                warning: lu("Deflector Plate Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        else if (this.synchronization == SynchronizationType.NO_INTERFERENCE && !this.IsLightningArc()) {
            stats.warnings.push({
                source: lu(this.weapon_type.name) + " " + lu("No Interference"),
                warning: lu("No Interference Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (this.wing_reinforcement)
            stats.mass += 2;
        stats.Round();
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
