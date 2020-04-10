/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class Weapons extends Part {
    private weapon_mass: number;
    private weapon_drag: number;
    private weapon_cost: number;

    constructor(js: JSON) {
        super();
        this.weapon_mass = 0;
        this.weapon_drag = 0;
        this.weapon_cost = 0;
    }

    public toJSON() {
        return {
            state: "BETA",
            weapon_mass: this.weapon_mass,
            weapon_drag: this.weapon_drag,
            weapon_cost: this.weapon_cost,
        }
    }

    public fromJSON(js: JSON) {
        if (js && js["state"] == "BETA") {
            this.weapon_cost = js["weapon_cost"];
            this.weapon_drag = js["weapon_drag"];
            this.weapon_mass = js["weapon_mass"];
        }
    }

    public GetMass() {
        return this.weapon_mass;
    }

    public SetMass(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_mass = num;
        this.CalculateStats();
    }

    public GetDrag() {
        return this.weapon_drag;
    }

    public SetDrag(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_drag = num;
        this.CalculateStats();
    }

    public GetCost() {
        return this.weapon_cost;
    }

    public SetCost(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.weapon_cost = num;
        this.CalculateStats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        stats.mass = this.weapon_mass;
        stats.drag = this.weapon_drag;
        stats.cost = this.weapon_cost;

        return stats;
    }
}