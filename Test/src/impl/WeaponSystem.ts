
import { Part } from "./Part";
import { Stats, WARNING_COLOR } from "./Stats";
import { lu } from "./Localization";
import { Weapon } from "./Weapon";
import { ActionType, SynchronizationType, ProjectileType } from "./Weapon";
import { BoolArr, Serialize, Deserialize } from "./Serialize";

export class WeaponSystem extends Part {
    private final_weapon: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number,
    };
    private weapon_type: number;
    private raw_weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];
    private ammo: number;
    private action_sel: number;
    private projectile_sel: number;

    private tractor: boolean;
    private pusher: boolean;
    private heli: boolean;
    private spinner_t: boolean;
    private spinner_p: boolean;
    public has_cantilever: boolean;
    private has_propeller: boolean;
    private sticky_guns: number;
    private repeating: boolean;

    private seat: number;

    private weapon_list: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number,
    }[];
    private wl_permute: number[];

    constructor(weapon_list: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean, deflection: number,
    }[], wl_permute: number[]) {
        super();
        this.weapon_list = weapon_list;
        this.wl_permute = wl_permute;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.raw_weapon_type = 0;
        this.weapons = [];
        this.action_sel = ActionType.STANDARD;
        this.projectile_sel = ProjectileType.BULLETS;
        this.has_propeller = true;
        this.sticky_guns = 0;
        this.repeating = false;
        this.seat = 0;
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
        const wlist = [];
        for (const w of this.weapons) {
            wlist.push(w.toJSON());
        }
        return {
            weapon_type: this.raw_weapon_type,
            fixed: this.fixed,
            directions: this.directions,
            weapons: wlist,
            ammo: this.ammo,
            action: this.action_sel,
            projectile: this.projectile_sel,
            repeating: this.repeating,
            seat: this.seat,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.raw_weapon_type = js["weapon_type"];
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = js["fixed"];
        this.directions = BoolArr(js["directions"], this.directions.length);
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
        if (json_version < 11.75) {
            if (this.projectile_sel == ProjectileType.PNEUMATIC) {
                this.projectile_sel = ProjectileType.BULLETS;
            } else if (this.projectile_sel == ProjectileType.ENUM_MAX) {
                this.projectile_sel = ProjectileType.PNEUMATIC;
            }
        }
        this.MakeFinalWeapon();
        for (const elem of js["weapons"]) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem, json_version);
            this.weapons.push(w);
        }

        //Repeating has been moved from Weapon to WeaponSystem
        if (json_version < 10.95) {
            this.repeating = false;
            for (const w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        } else {
            this.repeating = js["repeating"];
        }

        if (json_version > 11.65) {
            this.seat = js["seat"];
        } else {
            this.seat = 0;
        }

        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.raw_weapon_type);
        s.PushBool(this.fixed);
        s.PushBoolArr(this.directions);
        s.PushNum(this.ammo);
        s.PushNum(this.weapons.length);
        for (const w of this.weapons) {
            w.serialize(s);
        }
        s.PushNum(this.action_sel);
        s.PushNum(this.projectile_sel);
        s.PushBool(this.repeating);
        s.PushNum(this.seat);
    }

    public deserialize(d: Deserialize) {
        this.raw_weapon_type = d.GetNum();
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = d.GetBool();
        this.directions = d.GetBoolArr(this.directions.length);
        this.ammo = d.GetNum();
        const wlen = d.GetNum();
        this.weapons = [];
        this.MakeFinalWeapon();
        for (let i = 0; i < wlen; i++) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
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
        if (d.version < 11.75) {
            if (this.projectile_sel == ProjectileType.PNEUMATIC) {
                this.projectile_sel = ProjectileType.BULLETS;
            } else if (this.projectile_sel == ProjectileType.ENUM_MAX) {
                this.projectile_sel = ProjectileType.PNEUMATIC;
            }
        }

        //Repeating has been moved from Weapon to WeaponSystem
        if (d.version < 10.95) {
            this.repeating = false;
            for (const w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        } else {
            this.repeating = d.GetBool();
        }

        if (d.version > 11.65) {
            this.seat = d.GetNum();
        } else {
            this.seat = 0;
        }

        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }

    public GetWeaponSelected() {
        return this.weapon_type;
    }

    private MakeFinalWeapon() {
        const num = this.weapon_type;
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
        this.final_weapon.jam = this.weapon_list[num].jam;
        this.final_weapon.stats.era = [];
        this.final_weapon.stats.era.push({ name: this.weapon_list[num].name, era: this.weapon_list[num].era });

        if (this.weapon_list[num].hits == 0) {
            if (this.action_sel == ActionType.MECHANICAL) {
                this.action_sel = ActionType.STANDARD;
            }
            if (this.projectile_sel == ProjectileType.GYROJETS || this.projectile_sel == ProjectileType.HEATRAY) {
                this.projectile_sel = ProjectileType.BULLETS;
            }
        }

        if (this.action_sel == ActionType.STANDARD) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.synched = this.weapon_list[num].synched;
        } else if (this.action_sel == ActionType.MECHANICAL) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.stats.warnings.push({
                source: lu("Mechanical Action"),
                warning: lu("Mechanical Action Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.jam = "0/0";
            this.final_weapon.rapid = true;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = true;
            this.final_weapon.stats.era.push({ name: lu("Mechanical Action"), era: lu("WWI") });
        } else if (this.action_sel == ActionType.GAST) {
            this.final_weapon.hits = 2 * this.weapon_list[num].hits;
            this.final_weapon.ammo = this.weapon_list[num].ammo / 2;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = false;
            this.final_weapon.stats.era.push({ name: lu("Gast Principle"), era: lu("WWI") });
        } else if (this.action_sel == ActionType.ROTARY) {
            //rotary conversion
            //3x hits, awkward + 1(don't know if that's easy to do? Otherwise I may reconsider), can only rapid fire, weapon becomes open bolt but can fire down the spinner, +1 jam, +100 % mass, +100 % cost
            this.final_weapon.stats.mass += this.weapon_list[num].stats.mass;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.size += this.weapon_list[num].size;
            this.final_weapon.size = Math.min(16, this.final_weapon.size);
            this.final_weapon.hits = 3 * this.weapon_list[num].hits;
            this.final_weapon.deflection -= 1;
            this.final_weapon.synched = false;

            const jams = this.final_weapon.jam.split('/');
            jams[0] = "9999";
            jams[1] = (parseInt(jams[1]) + 1).toString();
            this.final_weapon.jam = jams.join('/');
            this.final_weapon.stats.era.push({ name: lu("Rotary_Gun"), era: lu("WWI") });
        }

        if (this.repeating && this.final_weapon.reload != 0) {
            this.final_weapon.reload = 0;
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
        }

        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.MECHANICAL)
            && this.projectile_sel == ProjectileType.HEATRAY) {
            this.projectile_sel = ProjectileType.BULLETS;
        }

        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.ROTARY)
            && this.projectile_sel == ProjectileType.PNEUMATIC) {
            this.projectile_sel = ProjectileType.BULLETS;
        }

        if (this.projectile_sel == ProjectileType.HEATRAY) {
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.shells = false;
            this.final_weapon.ammo = 0;
            this.final_weapon.deflection = 0;
            this.final_weapon.ap = Math.max(0, this.final_weapon.ap - 1);
            this.final_weapon.stats.warnings.push({
                source: lu("Heat Ray"),
                warning: lu("Heat Ray Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.stats.era.push({ name: lu("Heat Ray"), era: lu("Himmilgard") });
        } else if (this.projectile_sel == ProjectileType.GYROJETS) {
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
            this.final_weapon.shells = false;
            this.final_weapon.damage -= 1;
            this.final_weapon.stats.warnings.push({
                source: lu("Gyrojets"),
                warning: lu("Gyrojets Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.stats.era.push({ name: lu("Gyrojets"), era: lu("Roaring 20s") });
        } else if (this.projectile_sel == ProjectileType.PNEUMATIC) {
            this.final_weapon.ammo *= 2;
            this.final_weapon.shells = false;
            if (this.final_weapon.rapid) {
                const jams = this.final_weapon.jam.split('/');
                jams[1] = "9999";
                this.final_weapon.jam = jams.join('/');
                this.final_weapon.stats.warnings.push({
                    source: lu("Pneumatic"),
                    warning: lu("Pneumatic Warning 1"),
                    color: WARNING_COLOR.WHITE,
                });
                this.final_weapon.stats.era.push({ name: lu("Pneumatic"), era: lu("Pioneer") });
            }
            if (this.final_weapon.hits > 0) {
                this.final_weapon.stats.warnings.push({
                    source: lu("Pneumatic"),
                    warning: lu("Pneumatic Warning 2"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }

        if (this.final_weapon.deflection != 0) {
            this.final_weapon.stats.warnings.push({
                source: lu(this.final_weapon.name),
                warning: lu("Deflection Warning", this.final_weapon.deflection),
                color: WARNING_COLOR.WHITE,
            });
        }
    }

    public SetWeaponSelected(num: number) {
        const wasLA = this.IsLightningArc();
        this.weapon_type = num;
        this.raw_weapon_type = this.wl_permute.findIndex((value) => { return value == num; });
        if (this.weapon_list[num].size == 16) {
            while (this.weapons.length > 1) {
                this.weapons.pop();
            }
        }
        if (!this.weapon_list[num].can_action || !this.GetCanAction()[this.action_sel]) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.weapon_list[num].can_projectile || !this.GetCanProjectile()[this.projectile_sel]) {
            this.projectile_sel = ProjectileType.BULLETS;
        }
        if (this.weapon_list[num].rapid) {
            this.repeating = false;
        } else if (!this.repeating && this.action_sel == ActionType.GAST) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.CanRepeating()) {
            this.repeating = false;
        }
        this.MakeFinalWeapon();

        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }

        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            this.SetFixed(true);
            this.directions[0] = true;
            for (let i = 1; i < this.directions.length; i++) {
                this.directions[i] = false;
            }
        }
        if (wasLA && !this.IsLightningArc()) {
            this.weapons[0].SetSynchronization(SynchronizationType.NONE);
        }

        this.CalculateStats();
    }

    public CanRepeating() {
        return (!this.weapon_list[this.weapon_type].rapid || this.weapon_list[this.weapon_type].reload > 0)
            && this.weapon_list[this.weapon_type].ammo > 0
            && this.weapon_list[this.weapon_type].name != "Precision Rifle";
    }

    public GetRepeating() {
        return this.repeating;
    }

    public SetRepeating(use: boolean) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else {
            this.repeating = false;
            if (!this.weapon_list[this.weapon_type].rapid && this.action_sel == ActionType.GAST)
                this.action_sel = ActionType.STANDARD;
        }
        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        this.CalculateStats();
    }

    public GetFixed() {
        return this.fixed;
    }

    public SetFixed(use: boolean) {
        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            use = true;
        }

        if (this.fixed != use) {
            this.fixed = use;
            for (const w of this.weapons) {
                w.SetFixed(this.fixed);
            }
            if (use) {
                let good = false;
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

        if (this.IsLightningArc()) {
            return [...Array(this.directions.length).fill(false)];
        }

        const directions = [...Array(this.directions.length).fill(true)];
        if (this.weapons[0].GetArty() && this.fixed && !this.weapons[0].GetWing()) {
            if (this.heli)
                directions[2] = false;
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
                if (num == 2 && this.heli)
                    num = 3;
            }
        }
        this.directions[num] = use;
        this.CalculateStats();
    }

    public GetMountingCount() {
        return this.weapons.length;
    }

    public GetWeaponCount() {
        let count = 0;
        for (const w of this.weapons) {
            count += w.GetCount();
        }
        return count;
    }

    private SWC(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapons.length) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }

    public SetMountingCount(num: number) {
        if (this.final_weapon.size == 16 || this.final_weapon.name == "Precision Rifle")
            num = 1;
        this.SWC(num);
        this.CalculateStats();
    }

    public GetWeapons() {
        return this.weapons;
    }

    public SetCanFreelyAccessible(use: boolean) {
        for (const w of this.weapons) {
            if (!w.GetWing())
                w.can_free_accessible = use;
            else
                w.can_free_accessible = false;
        }
    }

    public SetTractorPusher(hasT: boolean, can_spinnerT: boolean, can_arty_spinnerT: boolean,
        hasP: boolean, can_spinnerP: boolean, can_arty_spinnerP: boolean, hasR: boolean) {
        this.tractor = hasT;
        this.pusher = hasP;
        this.heli = hasR;
        this.spinner_t = can_arty_spinnerT;
        this.spinner_p = can_arty_spinnerP;

        if (this.directions[0] && hasT) {
            for (const w of this.weapons) {
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
            for (const w of this.weapons) {
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
        } else if (this.directions[2] && this.heli) {
            for (const w of this.weapons) {
                w.can_synchronize = true;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        } else {
            for (const w of this.weapons) {
                w.can_synchronize = false;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
    }

    public GetHits() {
        const hits = this.final_weapon.hits;
        if (hits != 0) {
            let centerline = 0;
            let wings = 0;
            for (const w of this.weapons) {
                if (w.GetWing() && (w.GetFixed() || this.GetDirectionCount() <= 2)) {
                    wings += w.GetCount() * hits;
                } else {
                    centerline += w.GetCount() * hits;
                }
            }
            return [
                centerline + wings,
                Math.floor(1.0e-6 + centerline * 0.75) + Math.floor(1.0e-6 + wings * 0.9),
                Math.floor(1.0e-6 + centerline * 0.5) + Math.floor(1.0e-6 + wings * 0.2),
                Math.floor(1.0e-6 + centerline * 0.25) + Math.floor(1.0e-6 + wings * 0.1)
            ];
        } else {
            if (this.IsLightningArc()) {
                return [0, 0, 0, 0];
            } else if (this.final_weapon.ammo == 0) { //Fliergerflammenwerfer
                let count = 0;
                for (const w of this.weapons) {
                    count += w.GetCount();
                }
                return [3 * count, 0, 0, 0];
            } else { //Scatterguns
                let count = 0;
                for (const w of this.weapons) {
                    count += w.GetCount();
                }
                if (this.action_sel == ActionType.GAST) {
                    count *= 2;
                }
                return [3 * count, 2 * count, 1 * count, 0];
            }
        }
    }

    public GetDamage() {
        return this.final_weapon.damage;
    }

    public GetAmmo() {
        return this.ammo;
    }

    public GetJam() {
        if (this.final_weapon.rapid) {
            let jams = [0, 0];
            for (const w of this.weapons) {
                const t = w.GetJam();
                jams[0] = Math.max(jams[0], t[0] + this.sticky_guns);
                jams[1] = Math.max(jams[1], t[1] + this.sticky_guns);
            }
            return jams[0].toString() + "/" + jams[1].toString();
        }
        else {
            let jam = 0;
            for (const w of this.weapons) {
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
        if (this.has_propeller && !have && this.action_sel == ActionType.MECHANICAL) {
            this.has_propeller = have;
            this.SetAction(ActionType.STANDARD);
        }
        this.has_propeller = have;
    }

    public SetCanWing(can: boolean) {
        for (const w of this.weapons) {
            w.SetCanWing(can);
        }
    }

    public GetAction() {
        return this.action_sel;
    }

    public GetCanAction() {
        return [true,
            this.has_propeller && this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].hits > 0 && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].rapid,
        ];
    }

    public SetAction(num: number) {
        if (this.final_weapon.can_action) {
            this.action_sel = num;

            this.MakeFinalWeapon()
            for (const w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }

        } else {
            this.action_sel = ActionType.STANDARD;
        }
        this.CalculateStats();
    }

    public GetCanProjectile() {
        return [true,
            this.final_weapon.can_projectile && this.action_sel != ActionType.MECHANICAL && this.action_sel != ActionType.GAST && this.weapon_list[this.weapon_type].hits > 0,
            // this.final_weapon.can_projectile && this.weapon_list[this.weapon_type].hits > 0,
            this.final_weapon.can_projectile && this.action_sel != ActionType.ROTARY && this.action_sel != ActionType.GAST];
    }

    public GetProjectile() {
        return this.projectile_sel;
    }

    public SetProjectile(num: number) {
        if (this.final_weapon.can_projectile) {
            this.projectile_sel = num;

            this.MakeFinalWeapon()
            for (const w of this.weapons) {
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
        if (this.IsLightningArc()) { //Special Case for Lightning Gun
            return [3];
        }
        let count = 0;
        for (const w of this.weapons) {
            count += w.GetCount();
        }
        if (this.final_weapon.hits > 0) {
            //Calc charges / shot.
            let ammo = this.weapon_list[this.weapon_type].stats.cost;
            if (this.action_sel == ActionType.ROTARY)
                ammo *= 2;

            if (this.final_weapon.rapid)
                return [count * ammo, Math.max(count * ammo + 1, Math.floor(1.0e-6 + 1.5 * count * ammo))];
            else
                return [count * ammo];
        } else {
            if (this.final_weapon.name == "Scattergun") {
                //4 shot dice, d5, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 5 * 0.5 / 4)];
            } else if (this.final_weapon.name == "Punt Gun") {
                //4 shot dice, d10, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 10 * 0.5 / 4)];
            }
        }
    }

    public GetShots() {
        return Math.max(1, Math.floor(1.0e-6 + this.final_weapon.ammo * this.ammo));
    }

    public IsLightningArc() {
        return this.final_weapon.name == "Lightning Arc";
    }

    public GetReload() {
        return this.final_weapon.reload;
    }

    public GetWingWeight() {
        let sum = 0;
        for (const w of this.weapons) {
            if (w.GetWing()) {
                sum += w.PartStats().mass;
            }
        }
        return sum;
    }

    public GetDirectionCount() {
        let count = 0;
        for (const d of this.directions) {
            if (d)
                count++;
        }
        return count;
    }

    public SetSeat(num: number) {
        this.seat = num;
        this.CalculateStats();
    }

    public GetSeat() {
        return this.seat;
    }

    public GetIsFullyAccessible() {
        for (const w of this.weapons) {
            if (!w.GetAccessible())
                return false;
        }
        return true;
    }

    public GetIsPartlyAccessible() {
        for (const w of this.weapons) {
            if (w.GetAccessible())
                return true;
        }
        return false;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (const w of this.weapons) {
            w.SetCalculateStats(callback);
        }
    }

    public PartStats() {
        var stats = new Stats();
        let dircount = this.GetDirectionCount();

        let count = 0;
        for (const w of this.weapons) {
            w.has_cantilever = this.has_cantilever;
            w.SetTurret(dircount > 2);
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

        if (this.projectile_sel == ProjectileType.HEATRAY || this.IsLightningArc()) {
            //Cant have extra ammo for heatray.
            this.ammo = 1;
        }

        //Ammunition Cost
        stats.mass += (this.ammo - 1) * count;

        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
