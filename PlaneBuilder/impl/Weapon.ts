/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

enum SynchronizationType {
    NONE = -1,
    INTERRUPT,
    SYNCH,
    SPINNER,
    DEFLECT,
    NO_INTERFERENCE,
    ENUM_MAX
}
enum ProjectileType {
    BULLETS,
    HEATRAY,
    GYROJETS,
    PNEUMATIC,
    ENUM_MAX
}
enum ActionType {
    STANDARD,
    MECHANICAL,
    GAST,
    ROTARY,
    ENUM_MAX
}
type WeaponType = {
    name: string, era: string, size: number, stats: Stats,
    damage: number, hits: number, ammo: number,
    ap: number, jam: string, reload: number,
    rapid: boolean, synched: boolean, shells: boolean,
    can_action: boolean, can_projectile: boolean, deflection: number,
};
class Weapon extends Part {
    private weapon_type: WeaponType
    private fixed: boolean;
    private wing: boolean;
    private covered: boolean;
    private accessible: boolean;
    private free_accessible: boolean;
    private synchronization: SynchronizationType;
    private w_count: number;
    private repeating: boolean;

    public can_free_accessible: boolean;
    public can_synchronize: boolean;
    public can_spinner: boolean;
    public can_arty_spinner: boolean;
    public wing_reinforcement: boolean;
    public has_cantilever: boolean;
    private action: ActionType;
    private projectile: ProjectileType;

    constructor(weapon_type: WeaponType, action: ActionType, projectile: ProjectileType, fixed: boolean = false) {
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

    public toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            w_count: this.w_count,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
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

    public serialize(s: Serialize) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushNum(this.w_count);
    }

    public deserialize(d: Deserialize) {
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

    public SetWeaponType(weapon_type: WeaponType, action: ActionType, projectile: ProjectileType) {
        this.weapon_type = weapon_type;
        this.action = action;
        this.projectile = projectile;
        if (this.weapon_type.size == 16) {
            this.w_count = 1;
        }
        this.SetCount(this.w_count); //Triggers Calculate Stats
    }

    public GetFixed() {
        return this.fixed;
    }

    public SetFixed(use: boolean) {
        if (use != this.fixed) {
            if (use) {
                this.fixed = true;
            } else {
                this.fixed = false;
                this.synchronization = SynchronizationType.NONE;
            }
            this.CalculateStats();
        }
    }

    public GetWing() {
        return this.wing;
    }

    public CanWing() {
        return this.weapon_type.size <= 16;
    }

    public SetWing(use: boolean) {
        if (use && this.CanWing()) {
            this.wing = true;
            this.free_accessible = false;
            this.synchronization = SynchronizationType.NONE;
        } else {
            this.wing = false;
        }
        this.CalculateStats();
    }

    public CanCovered() {
        if (this.wing)
            return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
        else
            return !(this.GetArty() && !this.fixed);
    }

    public GetCovered() {
        return this.covered;
    }

    public SetCovered(use: boolean) {
        this.covered = use;
        this.CalculateStats();
    }

    public GetAccessible() {
        return this.accessible || this.free_accessible;
    }

    public SetAccessible(use: boolean) {
        if (use && this.free_accessible)
            use = false;
        this.accessible = use;
        this.CalculateStats();
    }

    public GetFreeAccessible() {
        return this.free_accessible;
    }

    public SetFreeAccessible(use: boolean) {
        if (use && !this.wing && this.can_free_accessible) {
            this.free_accessible = true;
            this.accessible = false;
        } else {
            this.free_accessible = false;
        }
        this.CalculateStats();
    }

    public CanSynchronization() {
        var lst = [];
        for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
            lst.push(this.CanSynch(i));
        }
        return lst;
    }

    private CanSynch(num: number) {
        if (!this.fixed && !this.wing) {
            if (num == SynchronizationType.NONE || num == SynchronizationType.DEFLECT || num == SynchronizationType.NO_INTERFERENCE) {
                return true;
            } else {
                return false;
            }
        }

        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        } else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }

        if (this.action == ActionType.MECHANICAL && !(num == SynchronizationType.NONE || num == SynchronizationType.SYNCH))
            return false;

        if (this.action == ActionType.GAST && num == SynchronizationType.SPINNER)
            return false;

        if ((num == SynchronizationType.INTERRUPT || num == SynchronizationType.SYNCH)
            && !this.weapon_type.synched) {
            return false;
        } else if (num == SynchronizationType.SPINNER && !this.CanSpinner()) {
            return false;
        } else if (num == SynchronizationType.DEFLECT && this.GetArty()) {
            return false;
        }
        return true;
    }

    public GetSynchronization() {
        return this.synchronization;
    }

    public SetSynchronization(use: number) {
        if (!this.CanSynch(use)) {
            this.synchronization = SynchronizationType.NONE;
        } else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.w_count = 1;

        this.CalculateStats();
    }

    public GetCount() {
        return this.w_count;
    }

    public SetCount(use: number) {
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

    public CanRepeating() {
        return !this.weapon_type.rapid || this.weapon_type.reload > 0;
    }

    public GetRepeating() {
        return this.repeating;
    }

    public SetRepeating(use: boolean) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else
            this.repeating = false;
        this.CalculateStats();
    }

    private ResolveSynch() {
        var use = this.synchronization;
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
        } else if (this.action == ActionType.MECHANICAL) {
            this.synchronization = SynchronizationType.SYNCH;
        } else {
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

    public GetArty() {
        return this.weapon_type.size == 16;
    }

    public CanSpinner() {
        if (this.GetArty())
            return this.can_spinner && this.can_arty_spinner;
        else
            return this.can_spinner;
    }

    public GetJam() {
        if (this.weapon_type.rapid) {
            var jams = this.weapon_type.jam.split('/');
            var out = [parseInt(jams[0]), parseInt(jams[1])];
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
            var ret = parseInt(this.weapon_type.jam)
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                ret += 1;
            }
            if (this.repeating) {
                ret += 1;
            }
            return ret;
        }
    }

    private IsLightningArc() {
        return this.weapon_type.name == "Lightning Arc";
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
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
            } else if (this.weapon_type.size <= 2) {
                cost = 1;
            } else if (this.weapon_type.size <= 4) {
                cost = 2;
            } else if (this.weapon_type.size <= 8) {
                cost = 5;
            } else if (this.weapon_type.size <= 16) {
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
        if ((!this.fixed && size > 8) || this.weapon_type.size == 16)
            stats.reqsections += 1;

        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(1.0e-6 + this.w_count / 2));
        }

        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            } else if (size <= 4) {
                stats.cost += 1;
            } else if (size <= 8) {
                stats.mass += 1;
                stats.cost += 3;
            } else if (size <= 16) {
                stats.mass += 2;
                stats.cost += 5;
            } else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }

        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += this.w_count * 2;

            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 2;
            }

        } else if (this.synchronization == SynchronizationType.SYNCH && this.action != ActionType.MECHANICAL) {
            stats.cost += this.w_count * 3;

            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 3;
            }
            //synchronization == 2 is spinner and costs nothing.
        } else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: lu(this.weapon_type.name),
                warning: lu("Deflector Plate Warning"),
            });
        } else if (this.synchronization == SynchronizationType.NO_INTERFERENCE && !this.IsLightningArc()) {
            stats.warnings.push({
                source: lu(this.weapon_type.name) + " " + lu("No Interference"),
                warning: lu("No Interference Warning"),
            });
        }

        if (this.wing_reinforcement)
            stats.mass += 2;

        stats.Round();

        return stats;
    }
}