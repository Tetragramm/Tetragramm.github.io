/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

enum SynchronizationType {
    NONE = -1,
    INTERRUPT,
    SYNCH,
    SPINNER,
    DEFLECT,
    ENUM_MAX,
}
class Weapon extends Part {
    private weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    };
    private fixed: boolean;
    private wing: boolean;
    private covered: boolean;
    private accessible: boolean;
    private free_accessible: boolean;
    private synchronization: number;
    private pair: boolean;
    private repeating: boolean;

    public can_free_accessible: boolean;
    public can_synchronize: boolean;
    public can_spinner: boolean;
    public can_arty_spinner: boolean;
    public wing_reinforcement: boolean;
    public has_cantilever: boolean;

    constructor(weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }, fixed: boolean = false) {
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
        this.pair = false;
        this.repeating = false;
    }

    public toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            pair: this.pair,
            repeating: this.repeating,
        }
    }

    public fromJSON(js: JSON) {
        this.fixed = js["fixed"];
        this.wing = js["wing"];
        this.covered = js["covered"];
        this.accessible = js["accessible"];
        this.free_accessible = js["free_accessible"];
        this.synchronization = js["synchronization"];
        this.pair = js["pair"];
        this.repeating = js["repeating"];
    }

    public serialize(s: Serialize) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushBool(this.pair);
        s.PushBool(this.repeating);
    }

    public deserialize(d: Deserialize) {
        this.fixed = d.GetBool();
        this.wing = d.GetBool();
        this.covered = d.GetBool();
        this.accessible = d.GetBool();
        this.free_accessible = d.GetBool();
        this.synchronization = d.GetNum();
        this.pair = d.GetBool();
        this.repeating = d.GetBool();
    }

    public SetWeaponType(weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }) {
        this.weapon_type = weapon_type;
        if (this.weapon_type.size == 16) {
            this.pair = false;
        }
        this.SetPair(this.pair); //Triggers Calculate Stats
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
        return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
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
        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        } else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }

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
            this.pair = false;

        this.CalculateStats();
    }

    public CanPair() {
        return this.weapon_type.size <= 8 && this.synchronization != SynchronizationType.SPINNER;
    }

    public GetPair() {
        return this.pair;
    }

    public SetPair(use: boolean) {
        if (this.wing && !this.fixed && this.weapon_type.size == 8)
            use = false;
        this.pair = use;
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
        } else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.pair = false;
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
            console.log(jams);
            var out = [parseInt(jams[0]), parseInt(jams[1])];
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                out[0]++;
                out[1]++;
            }
            return out;
        }
        else {
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                return parseInt(this.weapon_type.jam) + 1;
            }
            return parseInt(this.weapon_type.jam);
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        this.ResolveSynch();

        if (!this.CanCovered() && this.covered)
            this.covered = false;
        if (this.weapon_type.size == 16 && this.fixed)
            this.covered = true;

        stats = stats.Add(this.weapon_type.stats);
        if (this.pair)
            stats = stats.Add(this.weapon_type.stats);

        var size = this.weapon_type.size;
        if (this.pair)
            size *= 2;

        //Covered Cost
        if (this.covered) {
            var cost = 0;
            if (size == 1) {
                cost = 0;
            } else if (size == 2) {
                cost = 1;
            } else if (size == 4) {
                cost = 2;
            } else if (size == 8) {
                cost == 5;
            } else if (size == 16) {
                cost = 0;
            }
            if (!this.fixed)
                cost *= 2;
            stats.cost += cost;
            stats.drag *= 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing && !this.covered)
            stats.drag += 1;

        //Arty size weapon mounts need a section
        if (this.pair && this.weapon_type.size == 8 || this.weapon_type.size == 16)
            stats.reqsections += 1;

        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(stats.cost / 2));
        }

        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            } else if (size == 4) {
                stats.cost += 1;
            } else if (size == 8) {
                stats.mass += 1;
                stats.cost += 3;
            } else if (size == 16) {
                stats.mass += 2;
                stats.cost += 5;
            } else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }

        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += 2;
            if (this.pair)
                stats.cost += 2;
        } else if (this.synchronization == SynchronizationType.SYNCH) {
            stats.cost += 3;
            if (this.pair)
                stats.cost += 3;
            //synchronization == 2 is spinner and costs nothing.
        } else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: this.weapon_type.name,
                warning: "Deflector Plates inflict 1 Wear every time you roll a natural 5 or less."
            });
        }

        //If it's repeating
        if (this.repeating)
            stats.cost += 2;

        if (this.wing_reinforcement)
            stats.mass += 2;

        stats.Round();

        return stats;
    }
}