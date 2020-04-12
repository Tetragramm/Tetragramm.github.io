/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class Weapons extends Part {
    private weapon_sets: WeaponSystem[];
    private weapon_list: {
        name: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: number, reload: number,
        rapid: boolean, synched: boolean, shells: boolean
    }[];
    private direction_list: string[] = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];

    constructor(js: JSON) {
        super();

        this.weapon_list = [];
        for (let elem of js["weapons"]) {
            var weap = {
                name: elem["name"],
                era: elem["era"],
                size: elem["size"],
                stats: new Stats(elem),
                damage: elem["damage"],
                hits: elem["hits"],
                ammo: elem["ammo"],
                ap: elem["ap"],
                jam: elem["jam"],
                reload: elem["reload"],
                rapid: elem["rapid"],
                synched: elem["synched"],
                shells: elem["shells"],
            };
            if (weap.size < 16)
                this.weapon_list.push(weap);
        }

        this.weapon_sets = [];
    }

    public toJSON() {
        var lst = [];
        for (let ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            state: "BETA2",
            weapon_systems: lst,
        }
    }

    public fromJSON(js: JSON) {
        if (js && js["state"] == "BETA2") {
            var lst = js["weapon_systems"];
            for (let wsj of lst) {
                var ws = new WeaponSystem(this.weapon_list);
                ws.SetCalculateStats(this.CalculateStats);
                ws.fromJSON(wsj);
                this.weapon_sets.push(ws);
            }
        }
    }

    public GetWeaponList() {
        return this.weapon_list;
    }

    public GetDirectionList() {
        return this.direction_list;
    }

    public SetWeaponSetCount(num: number) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(num);
        console.log("Set to " + num.toString());
        while (num > this.weapon_sets.length) {
            var w = new WeaponSystem(this.weapon_list);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        console.log("Set Count");
        this.CalculateStats();
        console.log("Past CalcStats");
    }

    public GetWeaponSets() {
        return this.weapon_sets;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (let set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }

    public PartStats() {
        var stats = new Stats();

        for (let ws of this.weapon_sets) {
            stats = stats.Add(ws.PartStats());
        }

        return stats;
    }
}