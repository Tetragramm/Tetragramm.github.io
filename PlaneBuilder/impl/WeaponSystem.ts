/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class WeaponSystem extends Part {
    private weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];

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
        console.log("Start new Weapon System");
        this.weapon_list = weapon_list;
        this.directions = [...Array(6).fill(false)];
        this.weapon_type = 0;
        this.weapons = [];
        this.SetWeaponCount(1);
        console.log("End new Weapon System");
    }

    public toJSON() {
        return {
        }
    }

    public fromJSON(js: JSON) {
    }

    public GetWeaponSelected() {
        return this.weapon_type;
    }

    public SetWeaponSelected(num: number) {
        this.weapon_type = num;
        for (let w of this.weapons) {
            w.SetWeaponType(this.weapon_list[num]);
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
        }
    }

    public GetDirection() {
        return this.directions;
    }

    public SetDirection(num: number, use: boolean) {
        if (this.fixed && this.directions[num] && !use)
            use = true;
        if (this.fixed) {
            this.directions = [...Array(6).fill(false)];
        }
        this.directions[num] = use;
        this.CalculateStats();
    }

    public GetWeaponCount() {
        return this.weapons.length;
    }

    public SetWeaponCount(num: number) {
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

    public GetWeapons() {
        return this.weapons;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (let w of this.weapons) {
            w.SetCalculateStats(callback);
        }
    }

    public PartStats() {
        var stats = new Stats();

        for (let w of this.weapons)
            stats = stats.Add(w.PartStats());

        return stats;
    }
}