/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

enum SynchronizationType {
    NONE = -1,
    INTERRUPT,
    SYNCH,
    SPINNER,
    DEFLECT,
}
class Weapon extends Part {
    private weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    };
    private fixed: boolean;
    private wing: boolean;
    private covered: boolean;
    private accessible: boolean;
    private free_accessible: boolean;
    private synchronization: number;
    private pair: boolean;

    public can_free_accessible: boolean;
    public can_synchronize: boolean;
    public can_spinner: boolean;
    public wing_reinforcement: boolean;

    constructor(weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
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
    }

    public SetWeaponType(weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }) {
        this.weapon_type = weapon_type;
        if (this.weapon_type.size == 16) {
            this.pair = false;
            this.wing = false;
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
        return this.weapon_type.size <= 8;
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

    public GetSynchronization() {
        return this.synchronization;
    }

    public SetSynchronization(use: number) {
        if (use >= 0 && this.weapon_type.synched && this.can_synchronize) {
            if (use == SynchronizationType.SPINNER && !this.can_spinner)
                use--;
            this.synchronization = use;
        } else {
            this.synchronization = SynchronizationType.NONE;
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

    private ResolveSynch() {
        if (this.can_synchronize && !this.wing) {
            if (this.synchronization == SynchronizationType.NONE
                || this.synchronization == SynchronizationType.SPINNER && !this.can_spinner) {
                this.synchronization = SynchronizationType.INTERRUPT;
            }
            if (this.weapon_type.size == 16) {
                this.synchronization = SynchronizationType.SPINNER;
            }
        } else {
            this.synchronization = SynchronizationType.NONE;
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        this.ResolveSynch();

        stats = stats.Add(this.weapon_type.stats);
        if (this.pair)
            stats = stats.Add(this.weapon_type.stats);

        //Covered Cost
        if (this.covered) {
            stats.mass += 1;
            stats.drag = 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing)
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
            var size = this.weapon_type.size;
            if (this.pair)
                size *= 2;
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

        if (this.wing_reinforcement)
            stats.mass += 2;

        stats.Round();

        return stats;
    }
}