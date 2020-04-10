/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

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

    public can_wing: boolean;
    public can_free_accessible: boolean;
    public can_synchronize: boolean;
    public can_spinner: boolean;
    public can_deflector: boolean;

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
            this.synchronization = -1;
        else
            this.synchronization = 0;
        this.pair = false;
    }

    public toJSON() {
        return {
        }
    }

    public fromJSON(js: JSON) {
    }

    public SetWeaponType(weapon_type: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }) {
        if (weapon_type.size < 16) {
            this.weapon_type = weapon_type;
            this.SetPair(this.pair); //Triggers Calculate Stats
        }
    }

    public GetFixed() {
        return this.fixed;
    }

    public SetFixed(use: boolean) {
        if (use != this.fixed) {
            if (use) {
                this.fixed = true;
                this.synchronization = 0;
            } else {
                this.fixed = false;
                this.synchronization = -1;
            }
            this.CalculateStats();
        }
    }

    public GetWing() {
        return this.wing;
    }

    public SetWing(use: boolean) {
        if (use && this.can_wing) {
            this.wing = true;
            this.synchronization = -1;
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
        if (use && this.can_free_accessible) {
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
            if (use == 3 && !this.can_deflector)
                use--;

            if (use == 2 && !this.can_spinner)
                use--;
            this.synchronization = use;
        } else {
            this.synchronization = -1;
        }
        this.CalculateStats();
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

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

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
        if (this.pair && this.weapon_type.size == 8)
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
        if (this.synchronization == 0) { //Interruptor Gear
            stats.cost += 2;
            if (this.pair)
                stats.cost += 2;
        } else if (this.synchronization == 1) { // Synch Gear
            stats.cost += 3;
            if (this.pair)
                stats.cost += 3;
            //synchronization == 2 is spinner and costs nothing.
        } else if (this.synchronization == 3) {
            stats.cost += 1;
            stats.warnings.push({
                source: this.weapon_type.name,
                warning: "Deflector Plates inflict 1 Wear every time you roll a natural 5 or less."
            });
        }

        return stats;
    }
}