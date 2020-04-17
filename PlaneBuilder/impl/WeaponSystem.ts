/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class WeaponSystem extends Part {
    private weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];
    private ammo: number;

    private tractor: boolean;
    private pusher: boolean;
    private spinner_t: boolean;
    private spinner_p: boolean;

    private weapon_list: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }[];

    constructor(weapon_list: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }[]) {
        super();
        this.weapon_list = weapon_list;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.weapons = [];
        this.SWC(1);
    }

    public toJSON() {
        var wlist = [];
        for (let w of this.weapons) {
            wlist.push(w.toJSON());
        }
        return {
            weapon_type: this.weapon_type,
            fixed: this.fixed,
            directions: this.directions,
            weapons: wlist,
            ammo: this.ammo,
        }
    }

    public fromJSON(js: JSON) {
        this.weapon_type = js["weapon_type"];
        this.fixed = js["fixed"];
        this.directions = js["directions"];
        this.weapons = [];
        for (let elem of js["weapons"]) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem);
            this.weapons.push(w);
        }
        this.ammo = js["ammo"];
        if (this.ammo == null)
            this.ammo = 1;
    }

    public GetWeaponSelected() {
        return this.weapon_type;
    }

    public SetWeaponSelected(num: number) {
        if (this.weapon_list[num].size == 16 && this.weapon_list[this.weapon_type].size != 16) {
            this.weapons = []; //CLear all weapons
            this.weapon_type = num;
            this.SetFixed(true);
            this.directions = [...Array(6).fill(false)];
            if (this.tractor && this.spinner_t)
                this.directions[0] = true;
            else if (this.tractor && this.spinner_p)
                this.directions[1] = true;
            else
                this.directions[3] = true;

            this.SWC(1); //Create a single weapon for arty.
            this.weapons[0].SetWing(false);
        } else {
            this.weapon_type = num;
            for (let w of this.weapons) {
                w.SetWeaponType(this.weapon_list[num]);
            }
        }
        this.CalculateStats();
    }

    public GetFixed() {
        return this.fixed;
    }

    public SetFixed(use: boolean) {
        if (this.fixed != use) {
            this.fixed = use;
            for (let w of this.weapons) {
                w.SetFixed(this.fixed);
            }
            if (use) {
                var good = false;
                for (let i = 0; i < this.directions.length; i++) {
                    if (this.directions[i] && good)
                        this.directions[i] = false;
                    else if (this.directions[i])
                        good = true;
                }

            }
        }
        this.CalculateStats();
    }

    public CanDirection() {
        var directions = [...Array(6).fill(true)];
        if (this.fixed && this.weapon_list[this.weapon_type].size == 16 && this.weapons.length > 0) {
            var is_spinner = this.weapons[0].GetSynchronization() == SynchronizationType.SPINNER;
            if (this.tractor && !(this.spinner_t || (is_spinner && this.directions[0])))
                directions[0] = false;
            if (this.pusher && !(this.spinner_p || (is_spinner && this.directions[1])))
                directions[1] = false;
        }
        return directions;
    }

    public GetDirection() {
        return this.directions;
    }

    public SetDirection(num: number, use: boolean) {
        if (this.fixed && this.directions[num] && !use)
            use = true;
        if (this.fixed) {
            this.directions = [...Array(6).fill(false)];
            if (this.weapon_list[this.weapon_type].size == 16) {
                if (num == 0 && this.tractor && !this.spinner_t)
                    num = 1;
                if (num == 1 && this.pusher && !this.spinner_p)
                    num = 3;
            }
        }
        this.directions[num] = use;
        this.CalculateStats();
    }

    public GetWeaponCount() {
        return this.weapons.length;
    }

    private SWC(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        while (num > this.weapons.length) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }

    public SetWeaponCount(num: number) {
        if (this.weapon_list[this.weapon_type].size == 16)
            num = 1;
        this.SWC(num);
        this.CalculateStats();
    }

    public GetWeapons() {
        return this.weapons;
    }

    public SetCanFreelyAccessible(use: boolean) {
        for (let w of this.weapons) {
            if (!w.GetWing())
                w.can_free_accessible = use;
            else
                w.can_free_accessible = false;
        }
    }

    public SetTractorPusher(hasT: boolean, can_spinnerT: boolean,
        hasP: boolean, can_spinnerP: boolean) {
        this.tractor = hasT;
        this.pusher = hasP;
        this.spinner_t = can_spinnerT;
        this.spinner_p = can_spinnerP;

        if (this.directions[0] && hasT) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerT;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                }
            }
        } else if (this.directions[1] && hasP) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerT;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                }
            }
        } else {
            for (let w of this.weapons) {
                w.can_synchronize = false;
                w.can_spinner = false;
            }
        }
    }

    public GetHits() {
        var hits = this.weapon_list[this.weapon_type].hits;
        var centerline = 0;
        var wings = 0;
        for (let w of this.weapons) {
            if (w.GetWing() && w.GetFixed()) {
                wings += hits;
                if (w.GetPair())
                    wings += hits;
            } else {
                centerline += hits;
                if (w.GetPair())
                    centerline += hits;
            }
        }
        return [
            centerline + Math.floor(wings * 0.8),
            wings + Math.floor(centerline * 0.75),
            Math.floor(centerline * 0.5) + Math.floor(wings * 0.3),
            Math.floor(centerline * 0.25) + Math.floor(wings * 0.1)
        ];
    }

    public GetDamage() {
        return this.weapon_list[this.weapon_type].damage;
    }

    public GetAmmo() {
        return this.ammo;
    }

    public SetAmmo(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        this.ammo = num;
        this.CalculateStats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (let w of this.weapons) {
            w.SetCalculateStats(callback);
        }
    }

    public PartStats() {
        var stats = new Stats();

        var dircount = 0;
        for (let d of this.directions)
            if (d)
                dircount++;

        for (let w of this.weapons) {
            stats = stats.Add(w.PartStats());

            if (!this.fixed) {
                //Turret direction costs
                if (dircount == 2)
                    stats.cost += 1;
                else if (dircount == 3 || dircount == 4)
                    stats.cost += 2;
                else if (dircount == 5)
                    stats.cost += 3;
                else if (dircount == 6)
                    stats.cost += 4;
                //Turret Size costs handled in Weapon.ts
            }
        }

        //Ammunition Cost
        stats.mass += (this.ammo - 1) * this.weapons.length;

        return stats;
    }
}