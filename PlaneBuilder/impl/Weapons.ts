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
    private synchronization_list: string[] = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate"];

    public cockpit_count: number;
    public has_tractor: boolean;
    public tractor_spinner_count: number;
    public has_pusher: boolean;
    public pusher_spinner_count: number;
    public cant_type: number;

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
            state: "BETA3",
            weapon_systems: lst,
        }
    }

    public fromJSON(js: JSON) {
        console.log(js);
        if (js && js["state"] == "BETA3") {
            console.log("weapon_systems");
            var lst = js["weapon_systems"];
            for (let wsj of lst) {
                console.log("Each weapon");
                var ws = new WeaponSystem(this.weapon_list);
                ws.SetCalculateStats(this.CalculateStats);
                ws.fromJSON(wsj);
                this.weapon_sets.push(ws);
            }
        } else {
            this.SetWeaponSetCount(0);
        }
        console.log("Done Weapons");
    }

    public GetWeaponList() {
        return this.weapon_list;
    }

    public GetDirectionList() {
        return this.direction_list;
    }

    public GetSynchronizationList() {
        return this.synchronization_list;
    }

    public SetWeaponSetCount(num: number) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(num);
        while (num > this.weapon_sets.length) {
            var w = new WeaponSystem(this.weapon_list);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        this.CalculateStats();
    }

    public GetWeaponSets() {
        return this.weapon_sets;
    }

    private CountFreelyAccessible() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            var wlist = ws.GetWeapons();
            for (let w of wlist) {
                if (w.GetFreeAccessible())
                    count++;
            }
        }
        return count;
    }

    private CountTractorSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private CountPusherSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private RemoveOneFreelyAccessible() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            var wlist = this.weapon_sets[i].GetWeapons();
            for (let j = wlist.length - 1; j >= 0; j--) {
                if (wlist[j].GetFreeAccessible()) {
                    wlist[j].SetFreeAccessible(false);
                    return;
                }
            }
        }
    }

    private RemoveOneTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }

    private RemoveOnePusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }

    public CanTractorSpinner() {
        return this.CountTractorSpinner() < this.tractor_spinner_count;
    }

    public CanPusherSpinner() {
        return this.CountPusherSpinner() < this.pusher_spinner_count;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (let set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }

    public PartStats() {
        var stats = new Stats();

        //Update Freely Accessible state.
        while (this.CountFreelyAccessible() > this.cockpit_count) {
            this.RemoveOneFreelyAccessible();
        }
        while (this.CountTractorSpinner() > this.tractor_spinner_count) {
            this.RemoveOneTractorSpinner();
        }
        while (this.CountPusherSpinner() > this.pusher_spinner_count) {
            this.RemoveOnePusherSpinner();
        }

        //Wing reinforcement. Do this so it gets included in parts display.
        var wing_size = 0;
        if (this.cant_type == 0)
            wing_size = 4;
        else if (this.cant_type == 1)
            wing_size = 8;
        else
            wing_size = 16;

        //Create list of every weapon size and a ref to the weapon
        var slist = [];
        for (let ws of this.weapon_sets) {
            for (let w of ws.GetWeapons()) {
                var s = { s: 0, w: w };
                if (w.GetWing()) {
                    if (w.GetPair())
                        s.s = (2 * this.weapon_list[ws.GetWeaponSelected()].size);
                    else
                        s.s = (this.weapon_list[ws.GetWeaponSelected()].size);

                    slist.push(s);
                }
            }
        }
        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.s - b.s; });
        for (let s of slist) {
            wing_size -= s.s;
            if (wing_size < 0)
                s.w.wing_reinforcement = true;
        }


        for (let ws of this.weapon_sets) {
            ws.SetCanFreelyAccessible(this.CountFreelyAccessible() < this.cockpit_count);
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.has_pusher, this.CanPusherSpinner());
            stats = stats.Add(ws.PartStats());
        }
        return stats;
    }
}