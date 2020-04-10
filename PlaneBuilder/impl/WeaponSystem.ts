/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class WeaponSystem extends Part {
    private weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];

    private direction_list: string[] = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
    private weapon_list: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }[];

    constructor(js: JSON) {
        super();

        for (let e of this.direction_list) {
            this.directions.push(false);
        }
    }

    public toJSON() {
        return {
        }
    }

    public fromJSON(js: JSON) {
    }

    public GetWeaponList() {
        return this.weapon_list;
    }

    public GetWeaponSelected() {
        return this.weapon_type;
    }

    public GetDirectionList() {
        return this.direction_list;
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
            this.directions = [...Array(this.direction_list.length).fill(false)];
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
        while (num < this.weapons.length) {
            var w = new Weapon(this.weapon_list[this.weapon_type], this.fixed);
            this.weapons.push(w);
        }
        while (num > this.weapons.length) {
            this.weapons.pop();
        }
    }



    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        return stats;
    }
}