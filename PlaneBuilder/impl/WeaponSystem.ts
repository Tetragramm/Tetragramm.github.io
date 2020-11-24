/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class WeaponSystem extends Part {
    private final_weapon: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number
    };
    private weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];
    private ammo: number;
    private action_sel: number;
    private projectile_sel: number;

    private tractor: boolean;
    private pusher: boolean;
    private spinner_t: boolean;
    private spinner_p: boolean;
    public has_cantilever: boolean;
    private has_propeller: boolean;
    private sticky_guns: number;
    private repeating: boolean;

    private weapon_list: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number,
    }[];

    constructor(weapon_list: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number,
    }[]) {
        super();
        this.weapon_list = weapon_list;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.weapons = [];
        this.action_sel = ActionType.STANDARD;
        this.projectile_sel = ProjectileType.BULLETS;
        this.has_propeller = true;
        this.sticky_guns = 0;
        this.repeating = false;
        this.final_weapon = {
            name: "", abrv: "", era: "", size: 0, stats: new Stats(),
            damage: 0, hits: 0, ammo: 0,
            ap: 0, jam: "", reload: 0,
            rapid: false, synched: false, shells: false,
            can_action: false, can_projectile: false, deflection: 0,
        };
        this.MakeFinalWeapon();
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
            action: this.action_sel,
            projectile: this.projectile_sel,
            repeating: this.repeating,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.weapon_type = js["weapon_type"];
        this.fixed = js["fixed"];
        this.directions = js["directions"];
        this.weapons = [];
        this.ammo = js["ammo"];
        if (this.ammo == null)
            this.ammo = 1;
        if (json_version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = ProjectileType.BULLETS;
        }
        else {
            this.action_sel = js["action"];
            this.projectile_sel = js["projectile"];
        }
        this.MakeFinalWeapon();
        for (let elem of js["weapons"]) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem, json_version);
            this.weapons.push(w);
        }

        //Repeating has been moved from Weapon to WeaponSystem
        if (json_version < 10.95) {
            this.repeating = false;
            for (let w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        } else {
            this.repeating = js["repeating"];
        }

        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.weapon_type);
        s.PushBool(this.fixed);
        s.PushBoolArr(this.directions);
        s.PushNum(this.ammo);
        s.PushNum(this.weapons.length);
        for (let w of this.weapons) {
            w.serialize(s);
        }
        s.PushNum(this.action_sel);
        s.PushNum(this.projectile_sel);
        s.PushBool(this.repeating);
    }

    public deserialize(d: Deserialize) {
        this.weapon_type = d.GetNum();
        this.fixed = d.GetBool();
        this.directions = d.GetBoolArr();
        this.ammo = d.GetNum();
        var wlen = d.GetNum();
        this.weapons = [];
        this.MakeFinalWeapon();
        for (let i = 0; i < wlen; i++) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.deserialize(d);
            this.weapons.push(w);
        }
        if (d.version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = ProjectileType.BULLETS;
        }
        else {
            this.action_sel = d.GetNum();
            this.projectile_sel = d.GetNum();
        }

        //Repeating has been moved from Weapon to WeaponSystem
        if (d.version < 10.95) {
            this.repeating = false;
            for (let w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        } else {
            this.repeating = d.GetBool();
        }

        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }

    public GetWeaponSelected() {
        return this.weapon_type;
    }

    private MakeFinalWeapon() {
        var num = this.weapon_type;
        this.final_weapon.can_action = this.weapon_list[num].can_action;
        this.final_weapon.can_projectile = this.weapon_list[num].can_projectile;
        this.final_weapon.ammo = this.weapon_list[num].ammo;
        this.final_weapon.ap = this.weapon_list[num].ap;
        this.final_weapon.damage = this.weapon_list[num].damage;
        this.final_weapon.era = this.weapon_list[num].era;
        this.final_weapon.name = this.weapon_list[num].name;
        this.final_weapon.abrv = this.weapon_list[num].abrv;
        this.final_weapon.reload = this.weapon_list[num].reload;
        this.final_weapon.shells = this.weapon_list[num].shells;
        this.final_weapon.size = this.weapon_list[num].size;
        this.final_weapon.stats = this.weapon_list[num].stats.Clone();
        this.final_weapon.deflection = this.weapon_list[num].deflection;
        if (this.action_sel == ActionType.STANDARD) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.jam = this.weapon_list[num].jam;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.synched = this.weapon_list[num].synched;
        } else if (this.action_sel == ActionType.MECHANICAL) {
            this.final_weapon.hits = 1 + this.weapon_list[num].hits;
            this.final_weapon.jam = "0/0";
            this.final_weapon.rapid = true;
            this.final_weapon.stats.cost += Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost);
            this.final_weapon.synched = true;
        } else if (this.action_sel == ActionType.GAST) {
            this.final_weapon.hits = 2 * this.weapon_list[num].hits;
            this.final_weapon.ammo = this.weapon_list[num].ammo / 2;
            this.final_weapon.jam = this.weapon_list[num].jam;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = false;
        }

        if (this.repeating) {
            this.final_weapon.reload = 0;
            //Update Jam values, stupid string parsing.
            if (this.final_weapon.rapid) {
                var jams = this.final_weapon.jam.split('/');
                var out = [parseInt(jams[0]), parseInt(jams[1])];
                if (this.repeating) {
                    out[0]++;
                    out[1]++;
                }
                this.final_weapon.jam = out[0].toString() + "/" + out[1].toString();
            }
            else {
                var ret = parseInt(this.final_weapon.jam)
                if (this.repeating) {
                    ret += 1;
                }
                this.final_weapon.jam = ret.toString();
            }
            this.final_weapon.stats.cost += Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost);
        }

        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.MECHANICAL) && this.projectile_sel == ProjectileType.HEATRAY) {
            this.projectile_sel = ProjectileType.BULLETS;
        }

        if (this.projectile_sel == ProjectileType.HEATRAY) {
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.shells = false;
            this.final_weapon.ammo = 0;
            this.final_weapon.deflection = 0;
            this.final_weapon.stats.warnings.push({ source: "Heat Ray", warning: "Roll Crits +Damage done. On Crit, choose one: start a fire, destroy a radiator/oil component and push Cool Down, or injure crew. Take -2 forward to Eyeball after firing." })
        } else if (this.projectile_sel == ProjectileType.GYROJETS) {
            this.final_weapon.stats.cost += Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost);
            this.final_weapon.shells = false;
            this.final_weapon.damage -= 1;
            this.final_weapon.stats.warnings.push({ source: "Gyrojets", warning: "+1 Damage and +1 AP for each Range Band (actual, not adjusted by attacks) past Knife." });
        } else if (this.projectile_sel == ProjectileType.PNEUMATIC) {
            this.final_weapon.ammo *= 2;
            this.final_weapon.shells = false;
            if (this.final_weapon.rapid) {
                this.final_weapon.jam = this.final_weapon.jam.substr(0, 2) + "9999";
                this.final_weapon.stats.warnings.push({ source: "Pneumatic", warning: "Weapon 'jams' after rapid fire as the compressor refills." });
            }
            this.final_weapon.stats.warnings.push({ source: "Pneumatic", warning: "Locked to 'Edged' Ammo: On Ammo Crit, attack deals double damage. All-metal planes cannot suffer Ammo Crits." });
        }

        console.log(this.final_weapon.name + " " + this.final_weapon.synched);
        if (this.final_weapon.deflection != 0) {
            this.final_weapon.stats.warnings.push({ source: this.final_weapon.name, warning: "Take " + this.final_weapon.deflection + " to attack on a deflection shot." });
        }
    }

    public SetWeaponSelected(num: number) {
        this.weapon_type = num;
        if (this.weapon_list[num].size == 16) {
            while (this.weapons.length > 1) {
                this.weapons.pop();
            }
        }
        if (!this.weapon_list[num].can_action) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.weapon_list[num].can_projectile) {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        this.MakeFinalWeapon();

        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }

        //Special Case for Lightning Arc
        if (this.weapon_list[num].ammo == 0) {
            this.SetFixed(true);
        }

        this.CalculateStats();
    }

    public CanRepeating() {
        return (!this.weapon_list[this.weapon_type].rapid || this.weapon_list[this.weapon_type].reload > 0) && this.weapon_list[this.weapon_type].ammo > 0;
    }

    public GetRepeating() {
        return this.repeating;
    }

    public SetRepeating(use: boolean) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else
            this.repeating = false;
        this.MakeFinalWeapon();
        for (let w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        this.CalculateStats();
    }

    public GetFixed() {
        return this.fixed;
    }

    public SetFixed(use: boolean) {

        //Special Case for Lightning Arc
        if (this.weapon_list[this.weapon_type].ammo == 0) {
            use = true;
        }

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
        if (this.weapons[0].GetArty() && this.fixed && !this.weapons[0].GetWing()) {
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
            if (this.weapons[0].GetArty() && !this.weapons[0].GetWing()) {
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
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapons.length) {
            var w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }

    public SetWeaponCount(num: number) {
        if (this.final_weapon.size == 16 || this.final_weapon.name == "Precision Rifle")
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

    public SetTractorPusher(hasT: boolean, can_spinnerT: boolean, can_arty_spinnerT: boolean,
        hasP: boolean, can_spinnerP: boolean, can_arty_spinnerP: boolean) {
        this.tractor = hasT;
        this.pusher = hasP;
        this.spinner_t = can_arty_spinnerT;
        this.spinner_p = can_arty_spinnerP;

        if (this.directions[0] && hasT) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                } else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        } else if (this.directions[1] && hasP) {
            for (let w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                } else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        } else {
            for (let w of this.weapons) {
                w.can_synchronize = false;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
    }

    public GetHits() {
        var hits = this.final_weapon.hits;
        var centerline = 0;
        var wings = 0;
        for (let w of this.weapons) {
            if (w.GetWing() && w.GetFixed()) {
                wings += w.GetCount() * hits;
            } else {
                centerline += w.GetCount() * hits;
            }
        }
        return [
            centerline + wings,
            Math.floor(1.0e-6 + centerline * 0.75) + Math.floor(1.0e-6 + wings * 0.75),
            Math.floor(1.0e-6 + centerline * 0.5) + Math.floor(1.0e-6 + wings * 0.25),
            Math.floor(1.0e-6 + centerline * 0.25) + Math.floor(1.0e-6 + wings * 0.1)
        ];
    }

    public GetDamage() {
        return this.final_weapon.damage;
    }

    public GetAmmo() {
        return this.ammo;
    }

    public GetJam() {
        if (this.final_weapon.rapid) {
            var jams = [0, 0];
            for (let w of this.weapons) {
                var t = w.GetJam();
                jams[0] = Math.max(jams[0], t[0] + this.sticky_guns);
                jams[1] = Math.max(jams[1], t[1] + this.sticky_guns);
            }
            return jams[0].toString() + "/" + jams[1].toString();
        }
        else {
            var jam = 0;
            for (let w of this.weapons) {
                jam = Math.max(jam, (w.GetJam() as number) + this.sticky_guns);
            }
            return jam.toString();
        }
    }

    public IsPlural() {
        return this.weapons.length > 1 || this.weapons[0].GetCount() > 1;
    }

    public SetAmmo(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        this.ammo = num;
        this.CalculateStats();
    }

    public SetHavePropeller(have: boolean) {
        if (this.has_propeller && !have) {
            this.has_propeller = have;
            this.SetAction(ActionType.STANDARD);
        }
        this.has_propeller = have;
    }

    public GetAction() {
        return this.action_sel;
    }

    public GetCanAction() {
        return [true, this.has_propeller && this.final_weapon.can_action, this.final_weapon.can_action];
    }

    public SetAction(num: number) {
        if (this.final_weapon.can_action) {
            this.action_sel = num;

            this.MakeFinalWeapon()
            for (let w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }

        } else {
            this.action_sel = ActionType.STANDARD;
        }
        this.CalculateStats();
    }

    public GetCanProjectile() {
        return this.final_weapon.can_projectile;
    }

    public GetProjectile() {
        return this.projectile_sel;
    }

    public SetProjectile(num: number) {
        if (this.final_weapon.can_projectile) {
            this.projectile_sel = num;

            this.MakeFinalWeapon()
            for (let w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }
        } else {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        this.CalculateStats();
    }

    public GetFinalWeapon() {
        return this.final_weapon;
    }

    public SetStickyGuns(num: number) {
        this.sticky_guns = num;
    }

    public GetHRCharges() {
        var count = 0;
        for (let w of this.weapons) {
            count += w.GetCount();
        }
        //Calc charges / shot.
        var ammo = Math.floor(this.final_weapon.damage * this.final_weapon.hits / 4);
        if (this.action_sel == ActionType.GAST) {
            ammo *= 2;
        }
        if (this.final_weapon.rapid)
            return [count * ammo, Math.floor(1.0e-6 + 1.5 * count * ammo)];
        else
            return [count * ammo];
    }

    public GetShots() {
        return Math.floor(1.0e-6 + this.final_weapon.ammo * this.ammo);
    }

    public GetReload() {
        return this.final_weapon.reload;
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

        var count = 0;
        for (let w of this.weapons) {
            w.has_cantilever = this.has_cantilever;
            stats = stats.Add(w.PartStats());

            count += w.GetCount();
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

        if (this.projectile_sel == ProjectileType.HEATRAY) {
            //Cant have extra ammo for heatray.
            this.ammo = 1;
        }

        //Ammunition Cost
        stats.mass += (this.ammo - 1) * count;

        return stats;
    }
}