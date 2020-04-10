/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class WeaponSystem extends Part {
    private weapon_size: number;
    private weapon_type: number;
    private fixed: boolean;
    private directions: boolean[];
    private weapons: Weapon[];

    private weapon_list: {}[];

    constructor(js: JSON) {
        super();
    }

    public toJSON() {
        return {
        }
    }

    public fromJSON(js: JSON) {
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        return stats;
    }
}